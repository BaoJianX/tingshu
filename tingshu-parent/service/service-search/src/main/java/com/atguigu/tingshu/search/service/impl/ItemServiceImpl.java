package com.atguigu.tingshu.search.service.impl;

import com.atguigu.tingshu.album.AlbumFeignClient;
import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.common.execption.GuiguException;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.model.album.AlbumInfo;
import com.atguigu.tingshu.model.album.BaseCategoryView;
import com.atguigu.tingshu.search.service.ItemService;
import com.atguigu.tingshu.user.client.UserFeignClient;
import com.atguigu.tingshu.vo.album.AlbumStatVo;
import com.atguigu.tingshu.vo.user.UserInfoVo;
import com.baomidou.mybatisplus.core.toolkit.Assert;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBloomFilter;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executor;

@Slf4j
@Service
@SuppressWarnings({"all"})
public class ItemServiceImpl implements ItemService {

    @Autowired
    private AlbumFeignClient albumFeignClient;

    @Autowired
    private UserFeignClient userFeignClient;

    @Autowired
    private Executor threadPoolTaskExecutor;

    @Autowired
    private RedissonClient redissonClient;
    /**
     * 根据专辑ID查询专辑详情
     *
     * @param albumId
     * @return
     */
    @Override
    public Map<String, Object> item(Long albumId) {
        //0. 基于布隆过滤器判断专辑是否存在，不存在则返回异常
        RBloomFilter<Long> bloomFilter = redissonClient.getBloomFilter(RedisConstant.ALBUM_BLOOM_FILTER);
        if(!bloomFilter.contains(albumId)){
            throw new GuiguException(404,"专辑不存在");
        }

        //1.初始化Map集合
        Map<String, Object> map = new ConcurrentHashMap<>();
        //2. 远程调用专辑服务获取专辑信息
        CompletableFuture<AlbumInfo> albumInfoCompletableFuture = CompletableFuture.supplyAsync(() -> {
            AlbumInfo albumInfo = albumFeignClient.getAlbumInfoById(albumId).getData();
            Assert.notNull(albumInfo, "专辑{}不存在", albumId);
            map.put("albumInfo", albumInfo);
            return albumInfo;
        }, threadPoolTaskExecutor);

        //3. 远程调用专辑服务获取统计信息
        CompletableFuture<Void> statCompletableFuture = CompletableFuture.runAsync(() -> {
            AlbumStatVo albumStatVo = albumFeignClient.getAlbumStatVo(albumId).getData();
            Assert.notNull(albumStatVo, "专辑{}统计信息不存在", albumId);
            map.put("albumStatVo", albumStatVo);
        }, threadPoolTaskExecutor);

        //4. 远程调用专辑服务获取分类信息
        CompletableFuture<Void> categoryCompletableFuture = albumInfoCompletableFuture.thenAcceptAsync(albumInfo -> {
            Result<BaseCategoryView> categoryView = albumFeignClient.getCategoryView(albumInfo.getCategory3Id());
            Assert.notNull(categoryView, "专辑{}分类信息不存在", albumId);
            map.put("baseCategoryView", categoryView.getData());
        }, threadPoolTaskExecutor);

        //5. 元成调用用户服务获取主播信息
        CompletableFuture<Void> userCompletableFuture = albumInfoCompletableFuture.thenAcceptAsync(albumInfo -> {
            UserInfoVo userInfoVo = userFeignClient.getUserInfoVo(albumInfo.getUserId()).getData();
            Assert.notNull(userInfoVo, "主播{}不存在", albumInfo.getUserId());
            map.put("announcer", userInfoVo);
        }, threadPoolTaskExecutor);

        //6. 组合所有异步任务，都必须执行完成
        CompletableFuture.allOf(
                albumInfoCompletableFuture,
                statCompletableFuture,
                categoryCompletableFuture,
                userCompletableFuture
        ).join();

        //x.返回结果
        return map;
    }
}

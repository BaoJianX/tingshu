package com.atguigu.tingshu.album.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import com.atguigu.tingshu.album.mapper.AlbumAttributeValueMapper;
import com.atguigu.tingshu.album.mapper.AlbumInfoMapper;
import com.atguigu.tingshu.album.mapper.AlbumStatMapper;
import com.atguigu.tingshu.album.mapper.TrackInfoMapper;
import com.atguigu.tingshu.album.service.AlbumInfoService;

import static com.atguigu.tingshu.common.constant.SystemConstant.*;

import com.atguigu.tingshu.album.service.AuditSetvice;
import com.atguigu.tingshu.common.cache.GuiGuCache;
import com.atguigu.tingshu.common.config.redis.RedissonConfig;
import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.common.execption.GuiguException;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.model.album.AlbumAttributeValue;
import com.atguigu.tingshu.model.album.AlbumInfo;
import com.atguigu.tingshu.model.album.AlbumStat;
import com.atguigu.tingshu.model.album.TrackInfo;
import com.atguigu.tingshu.query.album.AlbumInfoQuery;
import com.atguigu.tingshu.common.rabbit.constant.MqConst;
import com.atguigu.tingshu.common.rabbit.service.RabbitService;
import com.atguigu.tingshu.vo.album.AlbumAttributeValueVo;
import com.atguigu.tingshu.vo.album.AlbumInfoVo;
import com.atguigu.tingshu.vo.album.AlbumListVo;
import com.atguigu.tingshu.vo.album.AlbumStatVo;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.injector.methods.DeleteById;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBloomFilter;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.sql.Wrapper;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@SuppressWarnings({"all"})
public class AlbumInfoServiceImpl extends ServiceImpl<AlbumInfoMapper, AlbumInfo> implements AlbumInfoService {

    @Autowired
    private AlbumInfoMapper albumInfoMapper;

    @Autowired
    private AlbumAttributeValueServiceImpl albumAttributeValueServiceImpl;

    @Autowired
    private AlbumStatMapper albumStatMapper;

    @Autowired
    private TrackInfoMapper trackInfoMapper;

    @Autowired
    private AlbumAttributeValueMapper albumAttributeValueMapper;

    @Autowired
    private AuditSetvice auditSetvice;

    @Autowired
    private RabbitService rabbitService;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedissonClient redissonClient;


    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveAlbumInfo(AlbumInfoVo albumInfoVo, Long userId) {
        //保存专辑信息
        //将vo转为po
        AlbumInfo albumInfo = BeanUtil.copyProperties(albumInfoVo, AlbumInfo.class);
        //保存专辑
        albumInfo.setUserId(userId);
        albumInfo.setTracksForFree(5);
        albumInfo.setStatus(ALBUM_STATUS_NO_PASS);
        albumInfoMapper.insert(albumInfo);
        //获取专辑id
        Long albumId = albumInfo.getId();

        //保存专辑标签关系
        List<AlbumAttributeValueVo> albumAttributeValueVoList = albumInfoVo.getAlbumAttributeValueVoList();
        if (CollUtil.isNotEmpty(albumAttributeValueVoList)) {

            List<AlbumAttributeValue> albumAttributeValueList = albumAttributeValueVoList.stream().map(vo -> {
                AlbumAttributeValue albumAttributeValue = BeanUtil.copyProperties(vo, AlbumAttributeValue.class);
                albumAttributeValue.setAlbumId(albumId);
                return albumAttributeValue;
            }).collect(Collectors.toList());
            albumAttributeValueServiceImpl.saveBatch(albumAttributeValueList);
        }

        //新增专辑统计数值
        saveAlbumInfoStat(albumId, ALBUM_STAT_PLAY, 0);
        saveAlbumInfoStat(albumId, ALBUM_STAT_SUBSCRIBE, 0);
        saveAlbumInfoStat(albumId, ALBUM_STAT_BUY, 0);
        saveAlbumInfoStat(albumId, ALBUM_STAT_COMMENT, 0);

        //审核
        String text = albumInfo.getAlbumTitle()+albumInfoVo.getAlbumIntro();
        String suggestion = auditSetvice.audit_text(text);
        if(StrUtil.isNotBlank(suggestion)){
            if("block".equals(suggestion)){
                albumInfo.setStatus(ALBUM_STATUS_NO_PASS);
            }
            else if("review".equals(suggestion)){
                albumInfo.setStatus(ALBUM_STATUS_MANUAL);
            }
            else if("pass".equals(suggestion)){
                albumInfo.setStatus(ALBUM_STATUS_PASS);
                //事务提交后再同步ES，否则search服务查不到未提交的数据
                final Long finalAlbumId = albumInfo.getId();
                TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        rabbitService.sendMessage(MqConst.EXCHANGE_ALBUM, MqConst.ROUTING_ALBUM_UPPER, finalAlbumId);
                    }
                });
            }
        }
        albumInfoMapper.updateById(albumInfo);

    }

    @Override
    public void saveAlbumInfoStat(Long albumId, String statType, int statNum) {
        AlbumStat albumStat = new AlbumStat();
        albumStat.setAlbumId(albumId);
        albumStat.setStatType(statType);
        albumStat.setStatNum(statNum);
        albumStatMapper.insert(albumStat);
    }

    /**
     * 分页查询
     * @param pageInfo
     * @param query
     * @return
     */
    @Override
    public IPage<AlbumListVo> findUserAlbumPage(IPage<AlbumListVo> pageInfo, AlbumInfoQuery query) {
        return albumInfoMapper.findUserAlbumPage(pageInfo, query);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void removeAlbumInfoById(Long id) {
        //判断是否有声音，有的话返回删除失败
//		List<TrackInfo> list = trackInfoMapper.findAlbumById(id);
        Long count = trackInfoMapper.selectCount(
                new LambdaQueryWrapper<TrackInfo>().eq(TrackInfo::getAlbumId, id)
        );
        if (count > 0) throw new GuiguException(500, "该专辑下关联声音");
        //逻辑删除专辑
        albumInfoMapper.deleteById(id);
        //逻辑删除专辑里的统计数据
        albumStatMapper.delete(
                new LambdaQueryWrapper<AlbumStat>()
                        .eq(AlbumStat::getAlbumId, id)
        );
        //逻辑删除专辑的属性字段——属性，属性值
        albumAttributeValueServiceImpl.remove(
                new LambdaQueryWrapper<AlbumAttributeValue>()
                        .eq(AlbumAttributeValue::getAlbumId, id)
        );
        //事务提交后删除ES文档
        final Long finalAlbumId = id;
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                rabbitService.sendMessage(MqConst.EXCHANGE_ALBUM, MqConst.ROUTING_ALBUM_LOWER, finalAlbumId);
            }
        });
    }

    @Override
    @GuiGuCache(prefix = RedisConstant.ALBUM_INFO_PREFIX,ttl = RedisConstant.ALBUM_TIMEOUT,timeUnit = TimeUnit.SECONDS)
    public AlbumInfo getAlbumInfoByIdFromDB(Long id) {
        AlbumInfo albumInfo = getById(id);
        if (albumInfo != null) {
            List<AlbumAttributeValue> albumAttributeValueList = albumAttributeValueMapper.selectList(
                    new LambdaQueryWrapper<AlbumAttributeValue>()
                            .eq(AlbumAttributeValue::getAlbumId, id)
            );
            albumInfo.setAlbumAttributeValueVoList(albumAttributeValueList);
        }
        return albumInfo;
    }

    /**
     * 根据id修改专辑
     *
     * @param id
     * @param albumInfoVo
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateAlbumInfoById(Long id, AlbumInfoVo albumInfoVo) {
        //修改专辑
        AlbumInfo albumInfo = BeanUtil.copyProperties(albumInfoVo, AlbumInfo.class);
        albumInfo.setId(id);
        albumInfo.setStatus(ALBUM_STATUS_NO_PASS);
        updateById(albumInfo);
        //修改专辑的属性
        //删除属性
        albumAttributeValueServiceImpl.remove(
                new LambdaQueryWrapper<AlbumAttributeValue>()
                        .eq(AlbumAttributeValue::getAlbumId, id)
        );
        //再添加属性
        List<AlbumAttributeValueVo> albumAttributeValueVoList = albumInfoVo.getAlbumAttributeValueVoList();
        if(CollUtil.isNotEmpty(albumAttributeValueVoList)){
            List<AlbumAttributeValue> albumAttributeValueList = albumAttributeValueVoList.stream().map(vo -> {
                        AlbumAttributeValue albumAttributeValue = BeanUtil.copyProperties(vo, AlbumAttributeValue.class);
                        albumAttributeValue.setAlbumId(id);
                        return albumAttributeValue;
                    }
            ).collect(Collectors.toList());
            albumAttributeValueServiceImpl.saveBatch(albumAttributeValueList);
        }

        //TODO 再次对内容机构性审核
        //审核
        String text = albumInfo.getAlbumTitle()+albumInfoVo.getAlbumIntro();
        String suggestion = auditSetvice.audit_text(text);
        if(StrUtil.isNotBlank(suggestion)){
            if("block".equals(suggestion)){
                albumInfo.setStatus(ALBUM_STATUS_NO_PASS);
            }
            else if("review".equals(suggestion)){
                albumInfo.setStatus(ALBUM_STATUS_MANUAL);
            }
            else if("pass".equals(suggestion)){
                albumInfo.setStatus(ALBUM_STATUS_PASS);
                //事务提交后再同步ES，否则search服务查不到未提交的数据
                final Long finalAlbumId = albumInfo.getId();
                TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        rabbitService.sendMessage(MqConst.EXCHANGE_ALBUM, MqConst.ROUTING_ALBUM_UPPER, finalAlbumId);
                    }
                });
            }
        }
        albumInfoMapper.updateById(albumInfo);



    }

    /**
     * 查询用户的专辑列表
     * @param userId
     * @return
     */
    @Override
    public List<AlbumInfo> findUserAllAlbumList(Long userId) {
        //构建查询条件
        LambdaQueryWrapper<AlbumInfo> queryWrapper = new LambdaQueryWrapper<>();
        //查询条件，用户id
        queryWrapper.eq(AlbumInfo::getUserId,userId);
        //指定查询字段
        queryWrapper.select(AlbumInfo::getId,AlbumInfo::getAlbumTitle);
        //指定排序字段
        queryWrapper.orderByDesc(AlbumInfo::getCreateTime);
        //限制返回数量
        queryWrapper.last("limit 100");

        return albumInfoMapper.selectList(queryWrapper);
    }




    @Override
    @GuiGuCache(prefix = RedisConstant.ALBUM_STAT_PREFIX)
    public AlbumStatVo getAlbumStatVo(Long albumId) {
        return albumInfoMapper.getAlbumStatVo(albumId);
    }


    /**
     * 重建布隆过滤器
     */
    @Override
    public void rebuildBloomFilter() {

        //1.获取旧的布隆过滤器
        RBloomFilter<String> oldBloomFilter = redissonClient.getBloomFilter(RedisConstant.ALBUM_BLOOM_FILTER);
        long expectedInsertions = oldBloomFilter.getExpectedInsertions();
        double falseProbability = oldBloomFilter.getFalseProbability();
        long count = oldBloomFilter.count();
        //2.如果现有元素大于期望值，则重建
        if(count >= expectedInsertions){
            //2.1创建新布隆过滤器
            RBloomFilter<Long> newBloomFilter = redissonClient.getBloomFilter(RedisConstant.ALBUM_BLOOM_FILTER + ":new");
            newBloomFilter.tryInit(expectedInsertions*2, falseProbability);
            //2.2 存入新的布隆过滤器
            List<AlbumInfo> albumInfoList = albumInfoMapper.selectList(
                    new LambdaQueryWrapper<AlbumInfo>()
                            .eq(AlbumInfo::getStatus, ALBUM_STATUS_PASS)
                            .select(AlbumInfo::getId)
            );
            for (AlbumInfo albumInfo : albumInfoList) {
                newBloomFilter.add(albumInfo.getId());
            }
            //2.3 删除旧的
            oldBloomFilter.delete();
            //2.4 给新的重命名
            newBloomFilter.rename(RedisConstant.ALBUM_BLOOM_FILTER);
        }else{
            //3.不大于，保持原来的大小即可，但是过滤器里的内容还是要更新一下
            //2.1创建新布隆过滤器
            RBloomFilter<Long> newBloomFilter = redissonClient.getBloomFilter(RedisConstant.ALBUM_BLOOM_FILTER + ":new");
            newBloomFilter.tryInit(expectedInsertions, falseProbability);
            //2.2 存入新的布隆过滤器
            List<AlbumInfo> albumInfoList = albumInfoMapper.selectList(
                    new LambdaQueryWrapper<AlbumInfo>()
                            .eq(AlbumInfo::getStatus, ALBUM_STATUS_PASS)
                            .select(AlbumInfo::getId)
            );
            for (AlbumInfo albumInfo : albumInfoList) {
                newBloomFilter.add(albumInfo.getId());
            }
            //2.3 删除旧的
            oldBloomFilter.delete();
            //2.4 给新的重命名
            newBloomFilter.rename(RedisConstant.ALBUM_BLOOM_FILTER);
        }


    }


    /**
     * 获取数据，先从redis里面获取
     * @param id
     * @return
     */
    @Override
    public AlbumInfo getAlbumInfoById(Long id) {
        try {
            //1.优先从分布式缓存Redis获取业务数据，命中缓存则返回
            //1.1 构建业务数据key 形式 = 前缀 + 业务标识
            String redisKey  = RedisConstant.ALBUM_INFO_PREFIX + id;
            //1.2查询redis
            AlbumInfo albumInfo = (AlbumInfo) redisTemplate.opsForValue().get(redisKey);
            //1.3 命中缓存返回业务数据
            if (albumInfo != null) {
                return albumInfo;
            }
            //2.缓存没有命中，尝试获取分布式锁，基于锁机制避免缓存击穿
            //2.1 构建redis锁
            String lockKey = redisKey + RedisConstant.CACHE_LOCK_SUFFIX;
            //2.2创建锁对象
            RLock lock = redissonClient.getLock(lockKey);
            //2.3 尝试获取分布式锁
            boolean flag = lock.tryLock();
            //3.获取分布式锁执行查询DB，将业务数据放入Redis缓存，响应结果，释放锁
            if(flag){
                try {
                    //3.1查询db（必须接收返回值，否则下面存进Redis的是上面的null）
                    albumInfo = this.getAlbumInfoByIdFromDB(id);
                    //3.2 存入redis
                    long ttl = RedisConstant.ALBUM_TIMEOUT + RandomUtil.randomInt(60, 600);
                    redisTemplate.opsForValue().set(redisKey,albumInfo,ttl, TimeUnit.SECONDS);
                    //3.3响应结果
                    return albumInfo;
                } finally {
                    lock.unlock();
                }
            }else{
                try {
                    //4.获取到锁实现则自旋
                    Thread.sleep(50);
                    return getAlbumInfoById(id);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        } catch (RuntimeException e) {
            log.error("Redis服务暂不可用，执行兜底处理方案：直接查库");
            return this.getAlbumInfoByIdFromDB(id);
        }


    }
}

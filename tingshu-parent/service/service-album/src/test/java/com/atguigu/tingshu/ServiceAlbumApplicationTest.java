package com.atguigu.tingshu;

import com.atguigu.tingshu.album.mapper.AlbumInfoMapper;
import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.common.rabbit.constant.MqConst;
import com.atguigu.tingshu.common.rabbit.service.RabbitService;
import com.atguigu.tingshu.model.album.AlbumInfo;
import org.junit.jupiter.api.Test;
import org.redisson.api.RBloomFilter;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class ServiceAlbumApplicationTest {

    @Autowired
    private AlbumInfoMapper albumInfoMapper;

    @Autowired
    private RabbitService rabbitService;

    @Autowired
    private RedissonClient redissonClient;

    /**
     * 读取数据库所有专辑，批量发送上架消息，同步"标题自动补全"索引（suggestinfo）
     */
    @Test
    public void syncTitleSuggestToEs() {
        // 1. 读数据库所有专辑（逻辑删除的会自动排除，审核状态不限制）
        List<AlbumInfo> albumList = albumInfoMapper.selectList(null);

        int success = 0;
        for (AlbumInfo album : albumList) {
            try {
                // 发送上架消息，search 服务消费后同步标题自动补全索引（suggestinfo）
                boolean result = rabbitService.sendMessage(MqConst.EXCHANGE_ALBUM, MqConst.ROUTING_ALBUM_UPPER, album.getId());
                if (result) {
                    success++;
                    System.out.println("已发送消息：albumId=" + album.getId() + ", 标题=" + album.getAlbumTitle());
                } else {
                    System.out.println("发送失败：albumId=" + album.getId());
                }
            } catch (Exception e) {
                System.out.println("异常：albumId=" + album.getId() + ", " + e.getMessage());
            }
        }
        System.out.println("批量发送完成：成功=" + success + " / 总=" + albumList.size());
    }

    /**
     * 把数据库里【所有】专辑ID初始化到布隆过滤器（审核状态不限制）
     * <p>
     * 为什么需要手动跑：ItemServiceImpl.item() 第一行就是 bloomFilter.contains(albumId) 判空，
     * 不为 true 直接抛 GuiguException(404,"专辑不存在")。而 Redisson 的 tryInit 只写
     * {name}:config，位图 key 是 add() 时才 SETBIT 创建出来的 —— 只要从没 add 过，
     * contains() 就恒为 false，专辑详情接口全废。
     * <p>
     * 跑之前确认：Nacos、Redis 起着（不需要 service-album 启动）。
     * service-album 的 pom 里 skipTests=true，mvn test 会跳过，请在 IDE 里单独跑本方法。
     */
    @Test
    public void initAlbumBloomFilter() {
        // 1. 获取布隆过滤器对象（数据规模、误判率与生产 ServiceAlbumApplication 保持一致）
        RBloomFilter<Long> bloomFilter = redissonClient.getBloomFilter(RedisConstant.ALBUM_BLOOM_FILTER);
        if (!bloomFilter.isExists()) {
            bloomFilter.tryInit(10000L, 0.03);
            System.out.println("布隆过滤器不存在，已初始化：expectedInsertions=10000, falseProbability=0.03");
        } else {
            System.out.println("布隆过滤器已存在，直接灌数据：expectedInsertions=" + bloomFilter.getExpectedInsertions()
                    + ", falseProbability=" + bloomFilter.getFalseProbability()
                    + ", 当前元素数=" + bloomFilter.count());
        }

        // 2. 读数据库所有专辑（逻辑删除的会自动排除，审核状态不限制）
        List<AlbumInfo> albumList = albumInfoMapper.selectList(null);
        System.out.println("数据库专辑总数=" + albumList.size());

        // 3. 全部灌入布隆过滤器（add 幂等，对已置 1 的位再置 1 无副作用，可反复执行）
        int success = 0;
        for (AlbumInfo album : albumList) {
            try {
                bloomFilter.add(album.getId());
                success++;
            } catch (Exception e) {
                System.out.println("添加失败：albumId=" + album.getId() + ", " + e.getMessage());
            }
        }
        System.out.println("布隆过滤器初始化完成：成功=" + success + " / 总=" + albumList.size()
                + "，过滤器元素数=" + bloomFilter.count());

        // 4. 数据量超过 tryInit 设定的规模时误判率会升高，提示重建
        if (albumList.size() > 10000L) {
            System.out.println("【警告】专辑数已超过 expectedInsertions=10000，误判率会升高，"
                    + "建议调大 tryInit 参数或调用 AlbumInfoService.rebuildBloomFilter() 重建");
        }
    }

}

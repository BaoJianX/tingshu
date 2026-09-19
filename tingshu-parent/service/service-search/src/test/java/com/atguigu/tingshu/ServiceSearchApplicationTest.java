package com.atguigu.tingshu;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.search.service.SearchService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.List;
import java.util.Set;

/**
 * 排行榜（小时榜）调试用：把 ES 里的榜单数据同步进 Redis，并逐层验证
 * <p>
 * 跑之前确认：Nacos、ES、Redis、service-album 都起着
 * （updateLatelyAlbumRanking 会 Feign 调专辑服务拿一级分类列表）。
 * <p>
 * 注意 service-search 的 pom 里 skipTests=true，mvn test 会跳过，请在 IDE 里单独跑方法。
 */
@Slf4j
@SpringBootTest
class ServiceSearchApplicationTest {

    /** ES 专辑索引名，和 SearchServiceImpl.INDEX_NAME 保持一致 */
    private static final String INDEX_NAME = "albuminfo";

    /** 榜单 Hash 的 key 前缀，最终 key 形如 ranking:{一级分类ID} */
    private static final String RANKING_KEY_PREFIX = RedisConstant.RANKING_KEY_PREFIX;

    /** 每个维度取前多少名 */
    private static final Integer TOP_N = 50;

    @Autowired
    private SearchService searchService;

    @Autowired
    private ElasticsearchClient elasticsearchClient;

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 第 1 步：诊断 ES —— 排行榜是按 category1Id 做 term 查询的，
     * 如果索引里的文档没有这个字段，刷新时必然匹配 0 条、写不进 Redis。
     */
    @Test
    void step1_checkEsCategory1Id() throws Exception {
        long total = elasticsearchClient.count(c -> c.index(INDEX_NAME)).count();
        long withCategory1Id = elasticsearchClient.count(c -> c.index(INDEX_NAME)
                .query(q -> q.exists(e -> e.field("category1Id")))).count();

        log.info("【ES诊断】{} 总文档数 = {}, 带 category1Id 的文档数 = {}", INDEX_NAME, total, withCategory1Id);

        if (total == 0) {
            log.error("【ES诊断】索引是空的！先同步专辑：调 /api/search/albumInfo/upperAlbum/{albumId} 或跑批量同步");
        } else if (withCategory1Id == 0) {
            log.error("【ES诊断】所有文档都缺 category1Id！排行榜的 term 查询会匹配 0 条 —— 重新同步专辑把该字段补上");
        } else {
            log.info("【ES诊断】category1Id 正常，可以继续跑 step2_syncRankingToRedis");
        }
    }

    /**
     * 第 2 步：把 ES 里的榜单数据写进 Redis（走的是生产代码 updateLatelyAlbumRanking）
     */
    @Test
    void step2_syncRankingToRedis() {
        searchService.updateLatelyAlbumRanking(TOP_N);
        log.info("【榜单同步】updateLatelyAlbumRanking 执行完成, topN = {}", TOP_N);
        this.printRankingInRedis();
    }

    /**
     * 第 3 步：只验证 Redis 里到底有没有榜单（不用重启就能反复跑）
     */
    @Test
    void step3_printRankingInRedis() {
        this.printRankingInRedis();
    }

    /**
     * 打印 Redis 里所有 ranking:* 的 key / field / 榜单条数
     */
    private void printRankingInRedis() {
        Set<String> keys = redisTemplate.keys(RANKING_KEY_PREFIX + "*");
        if (keys == null || keys.isEmpty()) {
            log.error("【Redis诊断】没有 {} 开头的 key —— 榜单没写进去，回 step1 看 ES 诊断", RANKING_KEY_PREFIX);
            return;
        }

        log.info("【Redis诊断】共 {} 个榜单 key：{}", keys.size(), keys);
        for (String key : keys) {
            Set<Object> fields = redisTemplate.opsForHash().keys(key);
            log.info("【Redis诊断】key = {}, 维度数 = {}, 维度 = {}", key, fields.size(), fields);
            for (Object field : fields) {
                Object value = redisTemplate.opsForHash().get(key, field);
                String size = value instanceof List ? String.valueOf(((List<?>) value).size()) : "非List";
                log.info("    {} -> 榜单条数 = {}", field, size);
            }
        }
    }
}

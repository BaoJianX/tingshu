package com.atguigu.tingshu.search.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.extra.pinyin.PinyinUtil;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregate;
import co.elastic.clients.elasticsearch._types.aggregations.LongTermsBucket;
import co.elastic.clients.elasticsearch._types.aggregations.TopHitsAggregate;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.CompletionSuggestOption;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.core.search.Suggestion;
import com.alibaba.fastjson.JSON;
import com.atguigu.tingshu.album.AlbumFeignClient;
import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.model.album.AlbumInfo;
import com.atguigu.tingshu.model.album.BaseCategory1;
import com.atguigu.tingshu.model.album.BaseCategory3;
import com.atguigu.tingshu.model.album.BaseCategoryView;
import com.atguigu.tingshu.model.search.AlbumInfoIndex;
import com.atguigu.tingshu.model.search.SuggestIndex;
import com.atguigu.tingshu.query.search.AlbumIndexQuery;
import com.atguigu.tingshu.repository.AlbumInfoIndexRepository;
import com.atguigu.tingshu.repository.SuggestInfoRepository;
import com.atguigu.tingshu.search.service.SearchService;
import com.atguigu.tingshu.user.client.UserFeignClient;
import com.atguigu.tingshu.vo.album.AlbumStatMqVo;
import com.atguigu.tingshu.vo.album.AlbumStatVo;
import com.atguigu.tingshu.vo.search.AlbumInfoIndexVo;
import com.atguigu.tingshu.vo.search.AlbumSearchResponseVo;
import com.atguigu.tingshu.vo.user.UserInfoVo;
import com.baomidou.mybatisplus.core.toolkit.Assert;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBloomFilter;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.suggest.Completion;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;

import static com.atguigu.tingshu.common.constant.SystemConstant.ALBUM_STAT_BUY;
import static com.atguigu.tingshu.common.constant.SystemConstant.ALBUM_STAT_COMMENT;
import static com.atguigu.tingshu.common.constant.SystemConstant.ALBUM_STAT_PLAY;
import static com.atguigu.tingshu.common.constant.SystemConstant.ALBUM_STAT_SUBSCRIBE;


@Slf4j
@Service
@SuppressWarnings({"all"})
public class SearchServiceImpl implements SearchService {

    @Autowired
    private AlbumInfoIndexRepository albumInfoIndexRepository;

    @Autowired
    private AlbumFeignClient albumFeignClient;

    @Autowired
    private UserFeignClient userFeignClient;

    @Autowired
    private Executor threadPoolTaskExecutor;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    public boolean upperAlbum(Long albumId) {
        //1. 第一段并行：专辑基本信息 + 统计信息（二者互不依赖）
        CompletableFuture<AlbumInfo> albumFuture = CompletableFuture.supplyAsync(() -> {
            AlbumInfo albumInfo = albumFeignClient.getAlbumInfoById(albumId).getData();
            if (albumInfo == null) {
                throw new RuntimeException("专辑不存在, albumId=" + albumId);
            }
            return albumInfo;
        }, threadPoolTaskExecutor);

        CompletableFuture<AlbumStatVo> statFuture = CompletableFuture.supplyAsync(() -> {
            AlbumStatVo albumStatVo = albumFeignClient.getAlbumStatVo(albumId).getData();
            if (albumStatVo == null) {
                throw new RuntimeException("专辑统计信息不存在, albumId=" + albumId);
            }
            return albumStatVo;
        }, threadPoolTaskExecutor);

        //2. 第二段并行：分类 + 主播（都依赖专辑信息，二者互相独立，用 thenApplyAsync 链式编排）
        CompletableFuture<BaseCategoryView> categoryFuture = albumFuture.thenApplyAsync(albumInfo -> {
            BaseCategoryView categoryView = albumFeignClient.getCategoryView(albumInfo.getCategory3Id()).getData();
            if (categoryView == null) {
                throw new RuntimeException("专辑分类信息不存在, albumId=" + albumId);
            }
            return categoryView;
        }, threadPoolTaskExecutor);

        CompletableFuture<UserInfoVo> userFuture = albumFuture.thenApplyAsync(albumInfo -> {
            UserInfoVo userInfoVo = userFeignClient.getUserInfoVo(albumInfo.getUserId()).getData();
            if (userInfoVo == null) {
                throw new RuntimeException("主播信息不存在, albumId=" + albumId);
            }
            return userInfoVo;
        }, threadPoolTaskExecutor);

        //3. 等待所有异步任务完成（任一失败会抛出异常，由 MQ 消费端 basicNack 重投）
        CompletableFuture.allOf(albumFuture, statFuture, categoryFuture, userFuture).join();

        //4. 取各异步结果
        AlbumInfo albumInfo = albumFuture.join();
        AlbumStatVo albumStatVo = statFuture.join();
        BaseCategoryView categoryView = categoryFuture.join();
        UserInfoVo userInfoVo = userFuture.join();

        //5. 组装 ES 实体
        AlbumInfoIndex index = new AlbumInfoIndex();
        index.setId(albumInfo.getId());
        index.setAlbumTitle(albumInfo.getAlbumTitle());
        index.setAlbumIntro(albumInfo.getAlbumIntro());
        index.setCoverUrl(albumInfo.getCoverUrl());
        index.setCategory1Id(categoryView.getCategory1Id());
        index.setCategory2Id(categoryView.getCategory2Id());
        index.setCategory3Id(categoryView.getCategory3Id());
        index.setPayType(albumInfo.getPayType());
        index.setIsFinished(albumInfo.getIsFinished());
        index.setIncludeTrackCount(albumInfo.getIncludeTrackCount());
        index.setCreateTime(albumInfo.getCreateTime());
        index.setAnnouncerName(userInfoVo.getNickname());

        //6. 真实统计数据（替换原来的随机数）
        index.setPlayStatNum(albumStatVo.getPlayStatNum());
        index.setSubscribeStatNum(albumStatVo.getSubscribeStatNum());
        index.setBuyStatNum(albumStatVo.getBuyStatNum());
        index.setCommentStatNum(albumStatVo.getCommentStatNum());

        //7. 计算热度（综合排序 order=1 用，加权：播放*1 + 订阅*2 + 购买*5 + 评论*3）
        double hotScore = index.getPlayStatNum() * 1.0
                + index.getSubscribeStatNum() * 2.0
                + index.getBuyStatNum() * 5.0
                + index.getCommentStatNum() * 3.0;
        index.setHotScore(hotScore);

        //8. 存 ES
        albumInfoIndexRepository.save(index);
        log.info("专辑上架同步ES成功：albumId={}, 热度={}", albumId, hotScore);

        //9. 专辑标题保存到 suggestinfo 索引
        this.saveSuggestInfoIndex(index);

        //10. 将专辑ID存入布隆过滤器
        RBloomFilter<Long> bloomFilter = redissonClient.getBloomFilter(RedisConstant.ALBUM_BLOOM_FILTER);
        bloomFilter.add(albumId);

        return true;
    }

    @Autowired
    private RedissonClient redissonClient;

    @Override
    public boolean lowerAlbum(Long albumId) {
        //删除文档（幂等，删不存在的id也不报错）
        albumInfoIndexRepository.deleteById(albumId);
        log.info("专辑下架删除ES文档成功：albumId={}", albumId);
        suggestInfoRepository.deleteById(albumId.toString());
        log.info("专辑下架删除ES提示词文档成功：albumId={}", albumId);
        return true;
    }

    @Autowired
    private ElasticsearchClient elasticsearchClient;

    /**
     * 高级检索采用ES原生方式完成
     * <p>
     * #检索条件：1.关键字、2.分类ID（1,2,3级）、3.标签（标签ID跟标签值）
     * #排序方式：1.热度 2.播放量  3.发布时间
     * #检索结果：1.分页  2.关键字高亮 3.返回满足渲染页面字段列表
     *
     * @param albumIndexQuery
     * @return
     */
    @Override
    public AlbumSearchResponseVo search(AlbumIndexQuery albumIndexQuery) {
        try {
            //1.构建检索请求对象
            SearchRequest searchRequest = this.buildDSL(albumIndexQuery);
            System.err.println("本次检索DSL");
            System.out.println(searchRequest);
            //2.调用ES检索接口
            SearchResponse<AlbumInfoIndex> searchResponse = elasticsearchClient.search(searchRequest, AlbumInfoIndex.class);
            //3.解析ES检索结果
            return this.parseResult(searchResponse, albumIndexQuery);
        } catch (IOException e) {
            log.error("站内检索异常", e);
            throw new RuntimeException(e);
        }
    }

    private static final String INDEX_NAME = "albuminfo";

    /**
     * 构建DSL
     *
     * @param albumIndexQuery
     * @return
     */
    @Override
    public SearchRequest buildDSL(AlbumIndexQuery albumIndexQuery) {
        //1.创建检索请求构建起对象，封装检索URL中索引库名称以及请求体参数
        SearchRequest.Builder builder = new SearchRequest.Builder();
        builder.index(INDEX_NAME);
        //2.逐一设置每一项检索请求体参数
        //2.1 创建用于封装三大过滤条件的bool查询对象    关键字，分类，标签
        BoolQuery.Builder allConditionBoolQueryBuilder = new BoolQuery.Builder();
        //2.2 设置关键字查询条件
        String keyword = albumIndexQuery.getKeyword();
        if (StrUtil.isNotBlank(keyword)) {
            allConditionBoolQueryBuilder.must(m -> m.match(m1 -> m1.field("albumTitle").query(keyword)));
        }
        //2.3 设置分类过滤条件 适合放入缓存，采用filter合适
        Long category1Id = albumIndexQuery.getCategory1Id();
        if (category1Id != null) {
            allConditionBoolQueryBuilder.filter(f -> f.term(t -> t.field("category1Id").value(category1Id)));
        }
        Long category2Id = albumIndexQuery.getCategory2Id();
        if (category2Id != null) {
            allConditionBoolQueryBuilder.filter(f -> f.term(t -> t.field("category2Id").value(category2Id)));
        }
        Long category3Id = albumIndexQuery.getCategory3Id();
        if (category3Id != null) {
            allConditionBoolQueryBuilder.filter(f -> f.term(t -> t.field("category3Id").value(category3Id)));
        }
        //2.4 设置标签过滤条件 适合放缓存中 采用filter合适
        List<String> attributeList = albumIndexQuery.getAttributeList();
        if (CollUtil.isNotEmpty(attributeList)) {
            for (String s : attributeList) {
                //2.4.2对标签进行分割
                String[] split = s.split(":");
                if (split != null && split.length == 2) {
                    allConditionBoolQueryBuilder.filter(
                            f -> f.nested(n -> n.path("attributeValueIndexList").query(
                                    q -> q.bool(b -> b.must(
                                                    m -> m.term(t -> t.field("attributeValueIndexList.attributeId").value(split[0]))
                                            ).must(m -> m.term(t -> t.field("attributeValueIndexList.attributeValueId").value(split[1])))
                                    ))
                            )
                    );
                }
            }
        }
        //2.5 封装query
        builder.query(allConditionBoolQueryBuilder.build()._toQuery());
        //2.1设置过滤条件
        //2.2设置分页
        Integer pageNo = albumIndexQuery.getPageNo();
        Integer pageSize = albumIndexQuery.getPageSize();
        int from = (pageNo - 1) * pageSize;
        builder.from(from).size(pageSize);
        //2.3设置排序
        //2.3.1获取排序参数  非空校验
        String order = albumIndexQuery.getOrder();
        if (StrUtil.isNotBlank(order)) {
            String[] split = order.split(":");
            if (split != null && split.length == 2) {
                String orderField = "";
                switch (split[0]) {
                    case "1":
                        orderField = "hotScore";
                    case "2":
                        orderField = "playStatNum";
                    case "3":
                        orderField = "createTime";
                }
                //2.3.2 获取排序字段名称 以及 排序 方式
                String finalOrderField = orderField;
                builder.sort(s -> s.field(f -> f.field(finalOrderField).order("asc".equals(split[1]) ? SortOrder.Asc : SortOrder.Desc)));
            }

        }
        //2.4设置高亮
        if (StrUtil.isNotBlank(keyword)) {
            builder.highlight(h -> h.fields("albumTitle", hf -> hf.preTags("<font style='color:red'>").postTags("</font>")));
        }
        //2.5设置响应业务字段列表
        builder.source(s -> s.filter(f -> f.excludes(Arrays.asList("subscribeStatNum", "buyStatNum", "commentStatNum", "attributeValueIndexList", "announcerName", "category1Id", "category2Id", "category3Id"))));

        //3.基于构建器对象返回检索请求对象
        return builder.build();
    }

    /**
     * 解析ES检索结果
     *
     * @param searchResponse
     * @param albumIndexQuery
     * @return
     */
    @Override
    public AlbumSearchResponseVo parseResult(SearchResponse<AlbumInfoIndex> searchResponse, AlbumIndexQuery albumIndexQuery) {
        //1.创建响应VO对象
        AlbumSearchResponseVo vo = new AlbumSearchResponseVo();
        //2.解析ES结果封装到VO列表
        List<AlbumInfoIndexVo> albumInfoIndexVoList = searchResponse.hits().hits()
                .stream()
                .map(hit -> {
                    //2.1将文档中source转为专辑vo对象
                    AlbumInfoIndexVo albumInfoIndexVo = BeanUtil.copyProperties(hit.source(), AlbumInfoIndexVo.class);
                    //2.2处理可能的高亮片断
                    Map<String, List<String>> highlightMap = hit.highlight();
                    if (CollUtil.isNotEmpty(highlightMap)) {
                        String highlightAlbumTitle = highlightMap.get("albumTitle").get(0);
                        albumInfoIndexVo.setAlbumTitle(highlightAlbumTitle);
                    }
                    return albumInfoIndexVo;
                }).collect(Collectors.toList());
        vo.setList(albumInfoIndexVoList);
        //3.封装分页相关属性
        Integer pageNo = albumIndexQuery.getPageNo();
        Integer pageSize = albumIndexQuery.getPageSize();
        long total = searchResponse.hits().total().value();
        long totalPages = total % pageSize == 0 ? total / pageSize : total / pageSize + 1;
        vo.setPageNo(pageNo);
        vo.setPageSize(pageSize);
        vo.setTotal(total);
        vo.setTotalPages(totalPages);

        //4.响应vo
        return vo;
    }


    @Override
    public List<Map<String, Object>> channel(Long category1Id) {
        try {
            //1.远程调用专辑服务获取置顶7个三级分类列表得到三级分类id
            List<BaseCategory3> baseCategory3List = albumFeignClient.findTopBaseCategory3(category1Id).getData();
            if (CollUtil.isNotEmpty(baseCategory3List)) {
                //1.1 解析集合，获取id列表
                List<FieldValue> fieldValueList = baseCategory3List.stream()
                        .map(c3 -> FieldValue.of(c3.getId())).collect(Collectors.toList());
                //1.2 构建maplist集合
                Map<Long, BaseCategory3> category3Map = baseCategory3List.stream()
                        .collect(Collectors.toMap(BaseCategory3::getId, c3 -> c3));

                //2.采用多关键字 + 聚合查询置顶分类热门专辑
                SearchResponse<AlbumInfoIndex> searchResponse = elasticsearchClient.search(s -> s.index(INDEX_NAME)
                                .query(q -> q.terms(t -> t.field("category3Id").terms(tq -> tq.value(fieldValueList))))
                                .aggregations("c3_agg", a -> a.terms(t -> t.field("category3Id").size(10))
                                        .aggregations("top6_agg", a1 -> a1.topHits(top -> top.size(6).sort(s1 -> s1.field(f -> f.field("hotScore")))))
                                )
                                .size(10)
                        , AlbumInfoIndex.class);
                // 3.解析聚合结果
                // 3.1 获取三级分类聚合结果
                Map<String, Aggregate> aggregations = searchResponse.aggregations();
                Aggregate c3Agg = aggregations.get("c3_agg");
                // 3.2 获取聚合到桶列表
                List<LongTermsBucket> bucketList = c3Agg.lterms().buckets().array();
                // 3.3 遍历7个桶列表 每遍历一个创建置顶分类热门专辑Map
                List<Map<String, Object>> list = bucketList.stream().map(bucket -> {
                    //3.3.1 创建置顶分类热门专辑
                    Map<String, Object> map = new HashMap<>();
                    //3.3.2 获取三级分类ID ， 封装Map中分类对象
                    map.put("baseCategory3", category3Map.get(bucket.key()));
                    //3.3.3 通过子聚合获取TOP6专辑
                    TopHitsAggregate top6Agg = bucket.aggregations().get("top6_agg").topHits();
                    List<AlbumInfoIndex> albumInfoIndexList = top6Agg.hits().hits().stream().map(hit -> {
                        String jsonDataStr = hit.source().toString();
                        return JSON.parseObject(jsonDataStr, AlbumInfoIndex.class);
                    }).collect(Collectors.toList());
                    //3.4 封装Map中人们专辑
                    map.put("list", albumInfoIndexList);
                    //3.5 返回“置顶分类”
                    return map;
                }).collect(Collectors.toList());
                return list;
            }
        } catch (IOException e) {
            log.error("查询一级分类下的热门专辑失败", e);
            throw new RuntimeException(e);
        }
        return List.of();
    }


    @Autowired
    private SuggestInfoRepository suggestInfoRepository;

    @Override
    public void saveSuggestInfoIndex(AlbumInfoIndex index) {

        SuggestIndex suggestIndex = new SuggestIndex();
        suggestIndex.setId(index.getId().toString());

        String albumTitle = index.getAlbumTitle();
        suggestIndex.setTitle(albumTitle);
        suggestIndex.setKeyword(new Completion(new String[]{albumTitle}));

        String pinyin = PinyinUtil.getPinyin(albumTitle, "");
        suggestIndex.setKeywordPinyin(new Completion(new String[]{pinyin}));

        String firstLetter = PinyinUtil.getFirstLetter(albumTitle, "");
        suggestIndex.setKeywordSequence(new Completion(new String[]{firstLetter}));

        suggestInfoRepository.save(suggestIndex);
    }

    private static final String SUGGEST_INDEX_NAME = "suggestinfo";

    /**
     * 根据关键字完成提示
     *
     * @param keyword
     * @return
     */
    @Override
    public List<String> completeSuggest(String keyword) {
        try {
            //发起请求
            SearchResponse<SuggestIndex> searchResponse = elasticsearchClient.search(s -> s.index(SUGGEST_INDEX_NAME)
                            .suggest(
                                    s1 -> s1.suggesters("keyword-suggest", s2 -> s2.prefix(keyword).completion(c -> c.field("keyword").skipDuplicates(true)))
                                            .suggesters("pinyin-suggest", s3 -> s3.prefix(keyword).completion(c -> c.field("keywordPinyin").skipDuplicates(true).fuzzy(f -> f.fuzziness("AUTO"))))
                                            .suggesters("letter-suggest", s3 -> s3.prefix(keyword).completion(c -> c.field("keywordSequence").skipDuplicates(true)))
                            )
                    , SuggestIndex.class);
            //2.解析结果，如果自动补全结果数量不足10个采用全文检索专辑索引库尝试补全到10个
            //2.1 声明set集合，用于去重
            HashSet<String> set = new HashSet<>();
            //2.2 解析建议词响应结果
            set.addAll(parseSuggestResponse("keyword-suggest", searchResponse));
            set.addAll(parseSuggestResponse("pinyin-suggest", searchResponse));
            set.addAll(parseSuggestResponse("letter-suggest", searchResponse));
            //2.3 判断数量如果小于10个采用全文检索专辑索引库补全
            if (set.size() < 10) {
                SearchResponse<AlbumInfoIndex> response = elasticsearchClient.search(s -> s.index(INDEX_NAME)
                                .query(q -> q.match(m -> m.field("albumTitle").query(keyword)))
                                .size(10)
                                .source(s1 -> s1.filter(f -> f.includes("albumTitle")))
                        , AlbumInfoIndex.class);
                List<Hit<AlbumInfoIndex>> hits = response.hits().hits();
                if (CollUtil.isNotEmpty(hits)) {
                    for (Hit<AlbumInfoIndex> hit : hits) {
                        String albumTitle = hit.source().getAlbumTitle();
                        set.add(albumTitle);
                        if (set.size() >= 10) {
                            break;
                        }
                    }
                }
            }
            //2.4 响应自动补全结果
            if (set.size() > 10) {
                return new ArrayList<>(set).subList(0, 10);
            }
            return new ArrayList<>(set);
        } catch (IOException e) {
            log.error("根据关键字完成提示失败", e);
            throw new RuntimeException(e);
        }

    }

    /**
     * 根据建议词名称解析建议词响应结果
     *
     * @param suggest_name   // 建议词名称
     * @param searchResponse
     * @return
     */
    private Collection<String> parseSuggestResponse(String suggest_name, SearchResponse<SuggestIndex> searchResponse) {
        ArrayList<String> list = new ArrayList<>();
        //1. 获取建议补全结果对象
        Map<String, List<Suggestion<SuggestIndex>>> suggest = searchResponse.suggest();
        //2. 根据自定义建议器名称获取建议补全结果
        List<Suggestion<SuggestIndex>> suggestions = suggest.get(suggest_name);
        //3. 遍历将符合要求标题添加到 set 集合中
        for (Suggestion<SuggestIndex> suggestion : suggestions) {
            for (CompletionSuggestOption<SuggestIndex> option : suggestion.completion().options()) {
                String title = option.source().getTitle();
                list.add(title);
            }
        }
        return list;

    }

    /**
     * 增量更新专辑统计信息到 ES
     * <p>
     * 用 Painless 脚本做原子增量，只改目标统计字段并重算热度，不覆盖整个文档；
     * 目标文档不存在（专辑未上架或尚未同步）时跳过，不当作失败重投。
     *
     * @param albumStatMqVo 专辑统计增量消息
     */
    @Override
    public void updateAlbumStat(AlbumStatMqVo albumStatMqVo) {
        //1. 专辑统计类型 → ES 字段名
        String field = switch (albumStatMqVo.getStatType()) {
            case ALBUM_STAT_PLAY -> "playStatNum";
            case ALBUM_STAT_SUBSCRIBE -> "subscribeStatNum";
            case ALBUM_STAT_BUY -> "buyStatNum";
            case ALBUM_STAT_COMMENT -> "commentStatNum";
            default -> null;
        };
        if (field == null) {
            log.warn("未知专辑统计类型，忽略：{}", albumStatMqVo.getStatType());
            return;
        }

        //2. 脚本：目标字段增量累加 + 重算热度
        //   count 来自我们自己发出的 MQ 消息（Integer），直接内联无注入风险；
        //   `?:` 用于兜底字段缺失，避免老文档没有该字段时脚本报错
        int count = albumStatMqVo.getCount() == null ? 0 : albumStatMqVo.getCount();
        String script = "ctx._source." + field + " = (ctx._source." + field + " ?: 0) + " + count + "; "
                + "def p = ctx._source.playStatNum ?: 0; "
                + "def s = ctx._source.subscribeStatNum ?: 0; "
                + "def b = ctx._source.buyStatNum ?: 0; "
                + "def c = ctx._source.commentStatNum ?: 0; "
                + "ctx._source.hotScore = p * 1.0 + s * 2.0 + b * 5.0 + c * 3.0;";
        try {
            elasticsearchClient.update(u -> u
                            .index(INDEX_NAME)
                            .id(String.valueOf(albumStatMqVo.getAlbumId()))
                            .script(sc -> sc.inline(i -> i.source(script)))
                    , AlbumInfoIndex.class);
            log.info("专辑统计增量更新ES成功：albumId={}, {} += {}",
                    albumStatMqVo.getAlbumId(), field, albumStatMqVo.getCount());
        } catch (Exception e) {
            String message = e.getMessage();
            //文档不存在（专辑未上架/尚未同步到ES）不算失败，跳过即可；其余抛出交给消费端 nack 重投
            if (message != null && message.contains("document_missing_exception")) {
                log.warn("ES中不存在该专辑文档，跳过统计更新：albumId={}", albumStatMqVo.getAlbumId());
                return;
            }
            throw new RuntimeException("专辑统计增量更新ES失败, albumId=" + albumStatMqVo.getAlbumId(), e);
        }
    }

    /**
     * 更新最近热门专辑排行榜
     * 从es查询获取，存入redis hash结构
     *
     * @param topN
     */
    @Override
    public void updateLatelyAlbumRanking(Integer topN) {
        try {
            //1、根据1级分类ID + 排序从ES获取TOPN专辑列表
            //1.1 远程调用“专辑服务”获取所有1级分类列表，得到1级分类ID列表
            List<BaseCategory1> baseCategory1List = albumFeignClient.findAllCategory1().getData();
            Assert.notNull(baseCategory1List, "暂无分类");
            List<Long> category1IdList =
                    baseCategory1List.stream().map(BaseCategory1::getId).collect(Collectors.toList());
            //1.2 遍历1级分类ID列表，遍历5种排序维度，检索ES
            for (Long category1Id : category1IdList) {
                //声明小时榜Hash结构Key 形式 = 前缀 + 1级分类ID
                String key = RedisConstant.RANKING_KEY_PREFIX + category1Id;
                // 创建hash操作对象
                BoundHashOperations<String,String,List<AlbumInfoIndex>> hashOps = redisTemplate.boundHashOps(key);
                //1.3遍历5种不同排序字段
                String[] rankingDimensionArray
                        = new String[]{"hotScore", "playStatNum", "subscribeStatNum", "buyStatNum", "commentStatNum"};
                for (String dimesion : rankingDimensionArray) {
                    //1.4 检索ES
                    SearchResponse<AlbumInfoIndex> searchResponse = elasticsearchClient.search(s -> s.index(INDEX_NAME)
                                    .query(q -> q.term(t -> t.field("category1Id").value(category1Id)))
                                    .sort(s1 -> s1.field(f -> f.field(dimesion).order(SortOrder.Desc)))
                                    .size(topN)
                                    .source(s1 -> s1.filter(f -> f.includes("id", "albumTitle", "albumIntro", "coverUrl", "payType", "includeTrackCount", "playStatNum")))
                            , AlbumInfoIndex.class);
                    //1.5解析检索结果
                    List<Hit<AlbumInfoIndex>> hits = searchResponse.hits().hits();
                    if (CollUtil.isNotEmpty(hits)) {
                        List<AlbumInfoIndex> topNList = hits.stream().map(Hit::source).collect(Collectors.toList());
                        //2、将分类下不同排序维度TOPN存入Redis中
                        String field = dimesion;
//                        redisTemplate.opsForHash().put(key, field, topNList);
                        hashOps.put(field,topNList);
                    }
                }
            }
        } catch (IOException e) {
            log.error("更新Redis小时榜TOPN记录失败", e);
            throw new RuntimeException(e);
        }
    }

    /**
     * 根据1级分类ID + 排序维度获取排行榜列表
     *
     * @param category1Id
     * @param dimension
     * @return
     */
    @Override
    public List<AlbumInfoIndex> findRankingList(Long category1Id, String dimension) {
        //声明key
        String key = RedisConstant.RANKING_KEY_PREFIX + category1Id;
        //创建hash操作对象
        BoundHashOperations<String,String,List<AlbumInfoIndex>> hashOps = redisTemplate.boundHashOps(key);
        //判断field是否存在
//        if (redisTemplate.opsForHash().hasKey(key, dimension)) {
//            List<AlbumInfoIndex> list = (List<AlbumInfoIndex>) redisTemplate.opsForHash().get(key, dimension);
//            return list;
//        }
        if(hashOps.hasKey(dimension)){
            return hashOps.get(dimension);
        }
        return null;
    }


}

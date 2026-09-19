package com.atguigu.tingshu.search.service;

import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.atguigu.tingshu.model.search.AlbumInfoIndex;
import com.atguigu.tingshu.query.search.AlbumIndexQuery;
import com.atguigu.tingshu.vo.album.AlbumStatMqVo;
import com.atguigu.tingshu.vo.search.AlbumSearchResponseVo;

import java.util.List;
import java.util.Map;

public interface SearchService {

    /**
     * 专辑上架同步到 ES
     *
     * @param albumId 专辑id
     * @return 是否成功
     */
    boolean upperAlbum(Long albumId);

    /**
     * 专辑下架从 ES 删除
     *
     * @param albumId 专辑id
     * @return 是否成功
     */
    boolean lowerAlbum(Long albumId);

    AlbumSearchResponseVo search(AlbumIndexQuery albumIndexQuery);

    /**
     * 构建站内检索请求
     * @param albumIndexQuery
     * @return
     */
    SearchRequest buildDSL(AlbumIndexQuery albumIndexQuery);

    /**
     * 解析ES检索响应结果，封装结果VO
     * @param searchResponse
     * @return
     */
    AlbumSearchResponseVo parseResult(SearchResponse<AlbumInfoIndex> searchResponse, AlbumIndexQuery albumIndexQuery);

    List<Map<String, Object>> channel(Long category1Id);

    void saveSuggestInfoIndex(AlbumInfoIndex index);

    List<String> completeSuggest(String keyword);

    /**
     * 增量更新专辑统计信息到 ES
     * <p>
     * 使用 ES 脚本（Painless）做原子增量更新，避免覆盖整个文档导致字段丢失；
     * 更新统计字段后同步重算热度 hotScore（播放*1 + 订阅*2 + 购买*5 + 评论*3）。
     *
     * @param albumStatMqVo 专辑统计增量消息
     */
    void updateAlbumStat(AlbumStatMqVo albumStatMqVo);

    void updateLatelyAlbumRanking(Integer topN);

    /**
     * 根据分类1和维度查询排行榜
     * @param category1Id
     * @param dimension
     * @return
     */
    List<AlbumInfoIndex> findRankingList(Long category1Id, String dimension);
}

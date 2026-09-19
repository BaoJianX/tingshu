package com.atguigu.tingshu.search.api;

import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.model.search.AlbumInfoIndex;
import com.atguigu.tingshu.query.search.AlbumIndexQuery;
import com.atguigu.tingshu.search.service.SearchService;
import com.atguigu.tingshu.vo.search.AlbumSearchResponseVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "搜索专辑管理")
@RestController
@RequestMapping("api/search")
@SuppressWarnings({"all"})
public class SearchApiController {

    @Autowired
    private SearchService searchService;

    @Operation(summary = "专辑上架同步到ES")
    @GetMapping("albumInfo/upperAlbum/{albumId}")
    public Result<Boolean> upperAlbum(@PathVariable Long albumId) {
        return Result.ok(searchService.upperAlbum(albumId));
    }

    @Operation(summary = "专辑下架从ES删除")
    @DeleteMapping("albumInfo/lowerAlbum/{albumId}")
    public Result<Boolean> lowerAlbum(@PathVariable Long albumId) {
        return Result.ok(searchService.lowerAlbum(albumId));
    }

    @Operation(summary = "搜索专辑")
    @PostMapping("/albumInfo")
    public Result<AlbumSearchResponseVo>search(@RequestBody AlbumIndexQuery albumIndexQuery){
        AlbumSearchResponseVo vo = searchService.search(albumIndexQuery);
        return Result.ok(vo);
    }

    @Operation(summary = "根据分类1查询专辑")
    @GetMapping("albumInfo/channel/{category1Id}")
    public Result<List<Map<String,Object>>> channel(@PathVariable Long category1Id) {
        List<Map<String,Object>> list = searchService.channel(category1Id);
        return Result.ok(list);
    }

    @Operation(summary = "自动补全")
    @GetMapping("albumInfo/completeSuggest/{keyword}")
    public Result<List<String>> completeSuggest(@PathVariable String keyword) {
        List<String> list = searchService.completeSuggest(keyword);
        return Result.ok(list);
    }

    @Operation(summary = "更新Redis小时榜的Top N 的数据")
    @GetMapping("albumInfo/updateLatelyAlbumRanking/{topN}")
    public Result updateLatelyAlbumRanking(@PathVariable Integer topN) {
        searchService.updateLatelyAlbumRanking(topN);
        return Result.ok();
    }

    /**
     * 查询小时榜TOPN记录
     * @param category1Id
     * @param dimension
     * @return
     */
    @Operation(summary = "根据分类1和维度查询排行榜")
    @GetMapping("albumInfo/findRankingList/{category1Id}/{dimension}")
    public Result<List<AlbumInfoIndex>> findRankingList(
            @PathVariable Long category1Id,
            @PathVariable String dimension) {
        List<AlbumInfoIndex> list = searchService.findRankingList(category1Id, dimension);
        return Result.ok(list);
    }



}

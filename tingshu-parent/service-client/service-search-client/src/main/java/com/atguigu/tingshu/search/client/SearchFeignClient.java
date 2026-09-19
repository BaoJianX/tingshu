package com.atguigu.tingshu.search.client;

import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.search.client.impl.SearchDegradeFeignClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * <p>
 * 搜索模块远程调用API接口
 * </p>
 *
 * @author atguigu
 */
@FeignClient(value = "service-search", path = "api/search/", fallback = SearchDegradeFeignClient.class)
public interface SearchFeignClient {

    /**
     * 专辑上架同步到 ES（审核通过后调用）
     *
     * @param albumId 专辑id
     * @return 是否成功
     */
    @GetMapping("albumInfo/upperAlbum/{albumId}")
    Result<Boolean> upperAlbum(@PathVariable Long albumId);

    /**
     * 专辑下架从 ES 删除（删除专辑时调用）
     *
     * @param albumId 专辑id
     * @return 是否成功
     */
    @DeleteMapping("albumInfo/lowerAlbum/{albumId}")
    Result<Boolean> lowerAlbum(@PathVariable Long albumId);

}

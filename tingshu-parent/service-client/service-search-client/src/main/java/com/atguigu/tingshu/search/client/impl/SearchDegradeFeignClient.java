package com.atguigu.tingshu.search.client.impl;

import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.search.client.SearchFeignClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * @author: atguigu
 * @create: 2023-12-05 22:23
 */

@Slf4j
@Component
public class SearchDegradeFeignClient implements SearchFeignClient {

    @Override
    public Result<Boolean> upperAlbum(Long albumId) {
        log.error("search服务不可用, upperAlbum执行服务降级, albumId={}", albumId);
        return Result.fail();
    }

    @Override
    public Result<Boolean> lowerAlbum(Long albumId) {
        log.error("search服务不可用, lowerAlbum执行服务降级, albumId={}", albumId);
        return Result.fail();
    }
}

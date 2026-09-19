package com.atguigu.tingshu.album.impl;


import com.atguigu.tingshu.album.AlbumFeignClient;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.model.album.AlbumInfo;
import com.atguigu.tingshu.model.album.BaseCategory1;
import com.atguigu.tingshu.model.album.BaseCategory3;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class AlbumDegradeFeignClient implements AlbumFeignClient {


    @Override
    public Result<AlbumInfo> getAlbumInfoById(Long id) {
        log.error("[专辑服务]提供远程调用接口getAlbumInfoById执行服务降级");
        return null;
    }

    @Override
    public Result getCategoryView(Long category3Id) {
        log.error("[分类服务]提供远程调用接口getCategoryView执行服务降级");
        return null;
    }

    @Override
    public Result<List<BaseCategory3>> findTopBaseCategory3(Long category1Id) {
        log.error("[分类服务]提供远程调用接口findTopBaseCategory3执行服务降级");
        return null;
    }

    @Override
    public Result getAlbumStatVo(Long albumId) {
        log.error("[专辑服务]提供远程调用接口getAlbumStatVo执行服务降级");
        return null;
    }

    @Override
    public Result<List<BaseCategory1>> findAllCategory1() {
        log.error("[分类服务]提供远程调用接口findAllCategory1执行服务降级");
        return null;
    }
}

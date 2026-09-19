package com.atguigu.tingshu.album.service;

import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.model.album.AlbumInfo;
import com.atguigu.tingshu.query.album.AlbumInfoQuery;
import com.atguigu.tingshu.vo.album.AlbumInfoVo;
import com.atguigu.tingshu.vo.album.AlbumListVo;
import com.atguigu.tingshu.vo.album.AlbumStatVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface AlbumInfoService extends IService<AlbumInfo> {

    void saveAlbumInfo(AlbumInfoVo albumInfoVo, Long userId);

    void saveAlbumInfoStat(Long albumId,String statType,int statNum);

    IPage<AlbumListVo> findUserAlbumPage(IPage<AlbumListVo> pageInfo, AlbumInfoQuery query);

    void removeAlbumInfoById(Long id);

    AlbumInfo getAlbumInfoById(Long id);

    AlbumInfo getAlbumInfoByIdFromDB(Long id);

    void updateAlbumInfoById(Long id, AlbumInfoVo albumInfoVo);

    List<AlbumInfo> findUserAllAlbumList(Long userId);

    AlbumStatVo getAlbumStatVo(Long albumId);

    void rebuildBloomFilter();
}

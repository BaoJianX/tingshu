package com.atguigu.tingshu.album.service;

import com.atguigu.tingshu.vo.album.TrackMediaInfoVo;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface VodService {

    Map<String, String> uploadTrack(MultipartFile file);

    TrackMediaInfoVo getMediaInfo(String mediaFileId);

    void deleteMedia(String mediaFileId);
}

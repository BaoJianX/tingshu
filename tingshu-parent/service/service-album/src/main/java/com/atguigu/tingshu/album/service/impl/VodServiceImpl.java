package com.atguigu.tingshu.album.service.impl;

import com.atguigu.tingshu.album.config.VodConstantProperties;
import com.atguigu.tingshu.album.service.VodService;
import com.atguigu.tingshu.common.util.UploadFileUtil;
import com.atguigu.tingshu.vo.album.TrackMediaInfoVo;
import com.qcloud.vod.VodUploadClient;
import com.qcloud.vod.model.VodUploadRequest;
import com.qcloud.vod.model.VodUploadResponse;
import com.tencentcloudapi.common.AbstractModel;
import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.HttpProfile;
import com.tencentcloudapi.vod.v20180717.VodClient;
import com.tencentcloudapi.vod.v20180717.models.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@Service
public class VodServiceImpl implements VodService {

    @Autowired
    private VodConstantProperties vodConstantProperties;

    @Autowired
    private VodUploadClient vodUploadClient;

    @Autowired
    private VodClient vodClient;

    /**
     * 将音视频上传到点播平台
     *
     * @param
     * @return mediaFileId:""   mediaUrl:""
     */
    @Override
    public Map<String, String> uploadTrack(MultipartFile file) {
        try {
            //文件放在临时目录下
            String tempPath = UploadFileUtil.uploadTempPath(vodConstantProperties.getTempPath(), file);
            //设置上传的地区和临时目录地址
            VodUploadRequest request = new VodUploadRequest();
            request.setMediaFilePath(tempPath);
            //进行上传
            VodUploadResponse response = vodUploadClient.upload("ap-chongqing", request);
            if (response != null) {
                return Map.of("mediaFileId", response.getFileId(), "mediaUrl", response.getMediaUrl());
            }
        } catch (Exception e) {
            log.error("上传文件失败", e);
            throw new RuntimeException(e);
        }
        return null;
    }

    @Override
    public TrackMediaInfoVo getMediaInfo(String mediaFileId) {
        try {
            // 实例化一个请求对象,每个接口都会对应一个request对象
            DescribeMediaInfosRequest req = new DescribeMediaInfosRequest();
            String[] fileIds1 = {mediaFileId};
            req.setFileIds(fileIds1);
            // 返回的resp是一个DescribeMediaInfosResponse的实例，与请求对象对应
            DescribeMediaInfosResponse resp = vodClient.DescribeMediaInfos(req);

            //封装
            if(resp!=null){
                MediaInfo[] mediaInfoSet = resp.getMediaInfoSet();
                if(mediaInfoSet !=null && mediaInfoSet.length > 0){
                    MediaInfo mediaInfo = mediaInfoSet[0];
                    //获取基本信息
                    String type = mediaInfo.getBasicInfo().getType();
                    //获取元信息  小时，大小
                    MediaMetaData metaData = mediaInfo.getMetaData();
                    Float audioDuration = metaData.getAudioDuration();
                    Long size = metaData.getSize();
                    //封装结果
                    TrackMediaInfoVo trackMediaInfoVo = new TrackMediaInfoVo();
                    trackMediaInfoVo.setType(type);
                    trackMediaInfoVo.setDuration(audioDuration);
                    trackMediaInfoVo.setSize(size);
                    return trackMediaInfoVo;
                }
            }
        } catch (TencentCloudSDKException e) {
            log.error("获得失败");
            System.out.println(e.toString());
        }

        return null;
    }

    /**
     * 删除原来的音频文件
     * @param mediaFileId
     */
    @Override
    public void deleteMedia(String mediaFileId) {


        try {
            // 实例化一个请求对象,每个接口都会对应一个request对象
            DeleteMediaRequest req = new DeleteMediaRequest();
            req.setFileId(mediaFileId);
            // 返回的resp是一个DeleteMediaResponse的实例，与请求对象对应
            DeleteMediaResponse resp = vodClient.DeleteMedia(req);
        } catch (TencentCloudSDKException e) {
            log.info("删除媒体失败",e);
        }
    }
}

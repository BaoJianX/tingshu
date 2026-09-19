package com.atguigu.tingshu.album.service.impl;

import cn.hutool.core.codec.Base64;
import com.atguigu.tingshu.album.service.AuditSetvice;


import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.ims.v20201229.ImsClient;

import com.tencentcloudapi.ims.v20201229.models.ImageModerationRequest;
import com.tencentcloudapi.ims.v20201229.models.ImageModerationResponse;
import com.tencentcloudapi.tms.v20201229.TmsClient;
import com.tencentcloudapi.tms.v20201229.models.TextModerationRequest;
import com.tencentcloudapi.tms.v20201229.models.TextModerationResponse;
import com.tencentcloudapi.vod.v20180717.VodClient;
import com.tencentcloudapi.vod.v20180717.models.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
public class AuditSetviceImpl implements AuditSetvice {

    @Autowired
    private TmsClient tmsClient;

    @Autowired
    private ImsClient imsClient;

    @Autowired
    private VodClient vodClient;

    @Override
    public String audit_text(String content) {

        try {
            // 实例化一个请求对象,每个接口都会对应一个request对象
            TextModerationRequest req = new TextModerationRequest();
            req.setContent(Base64.encode(content));
            // 返回的resp是一个TextModerationResponse的实例，与请求对象对应
            TextModerationResponse resp = tmsClient.TextModeration(req);
            if(resp!=null){
                String suggestion =resp.getSuggestion();
                log.info("文本：{}，处置意见：{}",content,suggestion);
                return suggestion.toLowerCase();
            }
        } catch (TencentCloudSDKException e) {
            log.error("文本内容审核异常",e);
            throw new RuntimeException(e);
        }

        return null;
    }

    @Override
    public String audit_image(MultipartFile imageFile) {
        try {
            // 实例化一个请求对象,每个接口都会对应一个request对象
            ImageModerationRequest req = new ImageModerationRequest();
            req.setFileContent(Base64.encode(imageFile.getInputStream()));
            // 返回的resp是一个ImageModerationResponse的实例，与请求对象对应
            ImageModerationResponse resp = imsClient.ImageModeration(req);
            if(resp != null){
                String suggestion = resp.getSuggestion();
                log.info("对图片{}，审核结果：{}",imageFile.getOriginalFilename(),suggestion);
                return suggestion.toLowerCase();
            }
        } catch (IOException e) {
            log.error("图片审核异常：",e);
            throw new RuntimeException(e);
        } catch (TencentCloudSDKException e) {
            log.error("图片审核异常：",e);
            throw new RuntimeException(e);
        }
        return null;
    }

    /**
     * 启动音视频审核任务
     * @param mediaFieId
     * @return  任务ID
     */
    @Override
    public String startReviewTask(String mediaFieId) {

        try {
            // 1.实例化一个请求对象,每个接口都会对应一个request对象
            ReviewAudioVideoRequest req = new ReviewAudioVideoRequest();
            req.setFileId(mediaFieId);
            // 2.返回的resp是一个ReviewAudioVideoResponse的实例，与请求对象对应
            ReviewAudioVideoResponse resp = vodClient.ReviewAudioVideo(req);
            //3.对结果进行解析
            if(resp != null){
                //3.1获取请求id
                return resp.getTaskId();
            }
        } catch (TencentCloudSDKException e) {
            log.error("发起音视频审核失败",e);
            throw new RuntimeException(e);
        }
        return null;
    }

    /**
     * 根据审核任务的ID查询审核的处理意见
     * @param taskId
     * @return suggestion
     */
    @Override
    public String getReviewTaskResult(String taskId) {

        try {
            // 1.实例化一个请求对象,每个接口都会对应一个request对象
            DescribeTaskDetailRequest req = new DescribeTaskDetailRequest();
            req.setTaskId(taskId);
            // 2.返回的resp是一个DescribeTaskDetailResponse的实例，与请求对象对应
            DescribeTaskDetailResponse resp = vodClient.DescribeTaskDetail(req);
            //3.对结果进行解析
            if(resp != null){
                if("FINISH".equals(resp.getStatus()) && "ReviewAudioVideo".equals(resp.getTaskType())){
                    //3.1获取音视频审核的信息
                    ReviewAudioVideoTask reviewAudioVideoTask = resp.getReviewAudioVideoTask();
                    //3.2任务状态
                    if("FINISH".equals(reviewAudioVideoTask.getStatus())){
                        //审核输出
                        ReviewAudioVideoTaskOutput output = reviewAudioVideoTask.getOutput();
                        //获取建议
                        String suggestion = output.getSuggestion();
                        log.info("音视频任务id：{}，审核建议：{}",taskId,suggestion);
                        return suggestion;
                    }

                }
            }
        } catch (TencentCloudSDKException e) {
            log.error("根据审核任务的ID查询审核的处理意见",e);
            throw new RuntimeException(e);
        }

        return null;

    }
}

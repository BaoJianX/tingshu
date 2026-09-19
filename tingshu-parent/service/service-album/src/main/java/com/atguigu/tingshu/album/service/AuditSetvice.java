package com.atguigu.tingshu.album.service;

import org.springframework.web.multipart.MultipartFile;

public interface AuditSetvice {


    String audit_text(String content);

    String audit_image(MultipartFile imageFile);

    /**
     * 启动音视频审核任务
     * @param mediaFieId
     * @return  任务ID
     */
    String startReviewTask(String mediaFieId);

    /**
     * 根据审核任务的ID查询审核的处理意见
     * @param taskId
     * @return suggestion
     */
    String getReviewTaskResult(String taskId);

}

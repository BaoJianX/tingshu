package com.atguigu.tingshu.task;


import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.atguigu.tingshu.album.mapper.TrackInfoMapper;
import com.atguigu.tingshu.album.mapper.TrackStatMapper;
import com.atguigu.tingshu.album.service.AuditSetvice;
import com.atguigu.tingshu.common.constant.SystemConstant;
import com.atguigu.tingshu.model.album.TrackInfo;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class ReviewResultTask {

    @Autowired
    private TrackInfoMapper trackInfoMapper;

    @Autowired
    private AuditSetvice auditSetvice;

    @Scheduled(cron = "0/5 * * * * ?")
    public void handleReviewResult() {
        List<TrackInfo> trackInfoList = trackInfoMapper.selectList(
                new LambdaQueryWrapper<TrackInfo>()
                        .eq(TrackInfo::getStatus, SystemConstant.TRACK_STATUS_REVIEWING)
                        .select(TrackInfo::getId, TrackInfo::getReviewTaskId)
        );
        if (CollUtil.isNotEmpty(trackInfoList)) {
            for (TrackInfo trackInfo : trackInfoList) {
                String suggestion = auditSetvice.getReviewTaskResult(trackInfo.getReviewTaskId());
                if (StrUtil.isNotBlank(suggestion)) {
                    if ("block".equals(suggestion)) {
                        trackInfo.setStatus(SystemConstant.ALBUM_STATUS_NO_PASS);
                    } else if ("review".equals(suggestion)) {
                        trackInfo.setStatus(SystemConstant.ALBUM_STATUS_MANUAL);
                    } else if ("pass".equals(suggestion)) {
                        trackInfo.setStatus(SystemConstant.ALBUM_STATUS_PASS);
                    }
                    trackInfoMapper.updateById(trackInfo);
                }

            }
        }
    }


}

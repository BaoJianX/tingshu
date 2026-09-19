package com.atguigu.tingshu.user.service;

import com.atguigu.tingshu.model.user.UserListenProcess;
import com.atguigu.tingshu.vo.user.UserListenProcessVo;

import java.math.BigDecimal;

public interface UserListenProcessService {

    BigDecimal getTrackBreakSecond(Long userId, Long trackId);

    void updateListenProcess(Long userId, UserListenProcessVo userListenProcessVo);

    /**
     * 获取用户最近一次播放记录
     *
     * @param userId 用户id
     * @return 最近一条播放记录；集合不存在或无记录时返回空对象（不返回 null）
     */
    UserListenProcess getLatelyTrack(Long userId);
}

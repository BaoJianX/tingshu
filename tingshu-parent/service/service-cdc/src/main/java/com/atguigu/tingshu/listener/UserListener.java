package com.atguigu.tingshu.listener;

import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.model.user.UserInfo;
import io.xzxj.canal.core.annotation.CanalListener;
import io.xzxj.canal.core.listener.EntryListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Set;

@Slf4j
@CanalListener(destination = "tingshuTopic", schemaName = "tingshu_user", tableName = "user_info")
public class UserListener implements EntryListener<UserInfo> {

    @Autowired
    private RedisTemplate redisTemplate;


    public void update(UserInfo before, UserInfo after, Set<String> fields) {

        // 空值保护：正常情况下 update 事件的 after 不会为空，这里做防御，避免 NPE
        if (after == null) {
            log.warn("[cdc]update 事件 after 为空，跳过");
            return;
        }
        log.info("[cdc]监听到变更数据");
        String redisKey = RedisConstant.USER_INFO_PREFIX + after.getId();
        redisTemplate.delete(redisKey);

    }

}

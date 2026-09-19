package com.atguigu.tingshu.listener;

import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.model.album.AlbumInfo;
import io.xzxj.canal.core.annotation.CanalListener;
import io.xzxj.canal.core.listener.EntryListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Set;


@Slf4j
@CanalListener(destination = "tingshuTopic", schemaName = "tingshu_album", tableName = "album_info")
public class AlbumListener implements EntryListener<AlbumInfo> {

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 修改专辑：删除专辑详情缓存，下次查询由 @GuiGuCache 自动回填
     */
    public void update(AlbumInfo before, AlbumInfo after, Set<String> fields) {

        // 空值保护：正常情况下 update 事件的 after 不会为空，这里做防御，避免 NPE
        if (after == null) {
            log.warn("[cdc]album update 事件 after 为空，跳过");
            return;
        }
        log.info("[cdc]监听到专辑变更数据: albumId={}", after.getId());
        String redisKey = RedisConstant.ALBUM_INFO_PREFIX + after.getId();
        redisTemplate.delete(redisKey);
    }

}

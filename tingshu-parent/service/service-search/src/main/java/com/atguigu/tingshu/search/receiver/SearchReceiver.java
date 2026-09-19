package com.atguigu.tingshu.search.receiver;

import com.atguigu.tingshu.common.rabbit.constant.MqConst;
import com.atguigu.tingshu.search.service.SearchService;
import com.atguigu.tingshu.vo.album.AlbumStatMqVo;
import com.rabbitmq.client.Channel;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 搜索服务：监听专辑上架/下架、专辑统计增量消息，完成 ES 索引同步
 */
@Slf4j
@Component
public class SearchReceiver {

    @Autowired
    private SearchService searchService;

    /**
     * 监听专辑上架队列，同步到 ES
     */
    @SneakyThrows
    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = MqConst.EXCHANGE_ALBUM, durable = "true"),
            value = @Queue(value = MqConst.QUEUE_ALBUM_UPPER, durable = "true"),
            key = MqConst.ROUTING_ALBUM_UPPER
    ))
    public void albumUpper(Long albumId, Message message, Channel channel) {
        try {
            if (albumId != null) {
                log.info("[搜索服务]监听到专辑上架消息：{}", albumId);
                searchService.upperAlbum(albumId);
            }
            // 成功确认
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        } catch (Exception e) {
            log.error("专辑上架同步ES失败, albumId={}", albumId, e);
            // 失败不确认，消息重投
            channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
        }
    }

    /**
     * 监听专辑下架队列，删除 ES 文档
     */
    @SneakyThrows
    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = MqConst.EXCHANGE_ALBUM, durable = "true"),
            value = @Queue(value = MqConst.QUEUE_ALBUM_LOWER, durable = "true"),
            key = MqConst.ROUTING_ALBUM_LOWER
    ))
    public void albumLower(Long albumId, Message message, Channel channel) {
        try {
            if (albumId != null) {
                log.info("[搜索服务]监听到专辑下架消息：{}", albumId);
                searchService.lowerAlbum(albumId);
            }
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        } catch (Exception e) {
            log.error("专辑下架删除ES失败, albumId={}", albumId, e);
            channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
        }
    }

    /**
     * 监听专辑统计增量更新队列，增量更新 ES 里的统计字段与热度
     */
    @SneakyThrows
    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = MqConst.EXCHANGE_ALBUM, durable = "true"),
            value = @Queue(value = MqConst.QUEUE_ALBUM_ES_STAT_UPDATE, durable = "true"),
            key = MqConst.ROUTING_ALBUM_ES_STAT_UPDATE
    ))
    public void albumEsStatUpdate(AlbumStatMqVo albumStatMqVo, Message message, Channel channel) {
        try {
            if (albumStatMqVo != null) {
                log.info("[搜索服务]监听到专辑统计增量更新消息：{}", albumStatMqVo);
                searchService.updateAlbumStat(albumStatMqVo);
            }
            // 成功确认
            channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
        } catch (Exception e) {
            log.error("增量更新专辑统计到ES失败：{}", albumStatMqVo, e);
            // 失败不确认，消息重投
            channel.basicNack(message.getMessageProperties().getDeliveryTag(), false, true);
        }
    }
}

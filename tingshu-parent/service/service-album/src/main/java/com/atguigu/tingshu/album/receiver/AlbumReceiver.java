package com.atguigu.tingshu.album.receiver;

import com.atguigu.tingshu.album.service.TrackInfoService;
import com.atguigu.tingshu.common.rabbit.constant.MqConst;
import com.atguigu.tingshu.vo.album.TrackStatMqVo;
import com.rabbitmq.client.Channel;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;


@Slf4j
@Component
public class AlbumReceiver {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private TrackInfoService trackInfoService;

    @SneakyThrows
    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = MqConst.EXCHANGE_TRACK, durable = "true"),
            value = @Queue(value = MqConst.QUEUE_TRACK_STAT_UPDATE, durable = "true"),
            key = MqConst.ROUTING_TRACK_STAT_UPDATE
    ))
    public void updateTrackStat(TrackStatMqVo trackStatMqVo, Channel channel, Message message) {

        if (trackStatMqVo != null) {
            log.info("【专辑服务】增量更新声音统计数值：{}", trackStatMqVo);
            //消费者幂等性处理，防止重复投递，重复消费从而对统计信息造成误解
            String redisKey = "stat:db" + trackStatMqVo.getBusinessNo();
            Boolean flag = redisTemplate.opsForValue().setIfAbsent(redisKey, null, 1, TimeUnit.MINUTES);
            if (flag) {
                try {
                    trackInfoService.updateTrackStat(trackStatMqVo);
                } catch (Exception e) {
                    redisTemplate.delete(redisKey);
                    throw new RuntimeException(e);

                }
            }
        }
        channel.basicAck(message.getMessageProperties().getDeliveryTag(), false);
    }


}

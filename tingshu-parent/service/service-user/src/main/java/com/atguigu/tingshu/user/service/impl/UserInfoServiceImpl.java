package com.atguigu.tingshu.user.service.impl;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.UUID;
import cn.hutool.core.util.IdUtil;
import com.atguigu.tingshu.common.cache.GuiGuCache;
import com.atguigu.tingshu.common.constant.RedisConstant;
import com.atguigu.tingshu.common.rabbit.constant.MqConst;
import com.atguigu.tingshu.common.rabbit.service.RabbitService;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.model.user.UserInfo;
import com.atguigu.tingshu.model.user.UserPaidAlbum;
import com.atguigu.tingshu.model.user.UserPaidTrack;
import com.atguigu.tingshu.user.mapper.UserInfoMapper;
import com.atguigu.tingshu.user.mapper.UserPaidAlbumMapper;
import com.atguigu.tingshu.user.mapper.UserPaidTrackMapper;
import com.atguigu.tingshu.user.service.UserInfoService;
import com.atguigu.tingshu.vo.user.UserInfoVo;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Assert;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@SuppressWarnings({"all"})
public class UserInfoServiceImpl extends ServiceImpl<UserInfoMapper, UserInfo> implements UserInfoService {

	@Autowired
	private UserInfoMapper userInfoMapper;

	@Autowired
	private WxMaService wxMaService;

	@Autowired
	private RedisTemplate redisTemplate;

    @Autowired
    private RabbitService rabbitService;

    @Autowired
    private UserPaidAlbumMapper userPaidAlbumMapper;

    @Autowired
    private UserPaidTrackMapper userPaidTrackMapper;

	@Override
	public Map<String, String> wxLogin(String code) {

        try {
            //1.对接微信获取微信账户唯一id
            WxMaJscode2SessionResult sessionInfo = wxMaService.getUserService().getSessionInfo(code);
            Assert.notNull(sessionInfo,"登录，code:{}失败",code);
            String wxOpenid = sessionInfo.getOpenid();

            //2.根据唯一标识查询本地用户信息
            UserInfo userInfo = userInfoMapper.selectOne(
                    new LambdaQueryWrapper<UserInfo>()
                            .eq(UserInfo::getWxOpenId, wxOpenid)
            );

            //3.如果本地信息为空，创建本地信息
            if(userInfo == null){
                userInfo = new UserInfo();
                userInfo.setNickname("听友"+ IdUtil.nanoId(10));
                userInfo.setAvatarUrl("https://1478286660.vod-qcloud.com/daf831d2vodcq1478286660/720b9e9d5001834818840018535/YAcOoojOFRUA.png");
                userInfo.setWxOpenId(wxOpenid);
                userInfoMapper.insert(userInfo);

                // 基于RabbitMQ 隐式初始化账户的余额信息
                HashMap<String, Object> map = new HashMap<>();
                map.put("userId", userInfo.getId());
                map.put("amount", new BigDecimal("1000.00"));
                map.put("orderNo","ZS"+IdUtil.getSnowflakeNextIdStr());
                map.put("title","新用户注册赠送");
                //3.2 调用RabbitMQ生产者工具类发送消息 对象必须序列化
                rabbitService.sendMessage(MqConst.EXCHANGE_USER, MqConst.ROUTING_USER_REGISTER, map);
            }

            //4.基于用户信息生成令牌，存redis
            //4.1构建key
            String token = IdUtil.fastUUID();
            String loginKey = RedisConstant.USER_LOGIN_KEY_PREFIX + token;
            //4.2转userInfoVo
            UserInfoVo userInfoVo = BeanUtil.copyProperties(userInfo, UserInfoVo.class);
            //4.3 存redis
            redisTemplate.opsForValue().set(loginKey,userInfoVo,RedisConstant.USER_LOGIN_KEY_TIMEOUT, TimeUnit.SECONDS);
            //5.返回登录令牌
            return Map.of("token",token);
        } catch (WxErrorException e) {
			log.error("微信登录失败", e);
            throw new RuntimeException(e);
        }

    }

    /**
     * 根据用户id获取用户信息
     * @param userId
     * @return
     */
    /**
     * 根据用户信息更新用户信息
     * @param userInfoVo
     */
    @Override
    @GuiGuCache(prefix = RedisConstant.USER_INFO_PREFIX)
    public UserInfoVo getUserInfoVo(Long userId) {
        UserInfo userInfo = userInfoMapper.selectById(userId);
        return BeanUtil.copyProperties(userInfo, UserInfoVo.class);
    }

    /**
     * 根据用户信息更新用户信息
     * @param userInfoVo
     */
    @Override
    @Transactional
    public void updateUser(Long userId, UserInfoVo userInfoVo) {
        UserInfo userInfo = new UserInfo();
        userInfo.setId(userId);
        userInfo.setAvatarUrl(userInfoVo.getAvatarUrl());
        userInfo.setNickname(userInfoVo.getNickname());
        userInfoMapper.updateById(userInfo);
    }

    @Override
    public Map<Long, Integer> userIsPaidTrack(Long userId, Long albumId, List<Long> needCheckPayStatusTrackIdList) {
        //1.获取根据用户ID + 专辑ID 查询已购专辑表
        Long count = userPaidAlbumMapper.selectCount(
                new LambdaQueryWrapper<UserPaidAlbum>()
                        .eq(UserPaidAlbum::getUserId, userId)
                        .eq(UserPaidAlbum::getAlbumId, albumId)
        );
        //如果购买专辑，则将其下面的所要查询的声音全部设为1
        HashMap<Long, Integer> map = new HashMap<>();
        if(count > 0){
            for (Long trackId : needCheckPayStatusTrackIdList) {
                map.put(trackId, 1);
            }
            return map;
        }
        //2. 根据用户ID + 专辑ID 查询已购声音表，如果不存在声音购买记录，则将所有声音购买状态设置为0，
        List<UserPaidTrack> userPaidTrackList = userPaidTrackMapper.selectList(
                new LambdaQueryWrapper<UserPaidTrack>()
                        .eq(UserPaidTrack::getUserId, userId)
                        .eq(UserPaidTrack::getAlbumId, albumId)
                        .select(UserPaidTrack::getTrackId)
        );
        if(CollUtil.isEmpty(userPaidTrackList)){
            for (Long trackId : needCheckPayStatusTrackIdList) {
                map.put(trackId, 0);
            }
            return map;
        }
        // 反之找出已购买以及未购买设置相应购买记录
        List<Long> userPaidTrackIdList = userPaidTrackList.stream()
                .map(UserPaidTrack::getTrackId).collect(Collectors.toList());
        for (Long trackId : needCheckPayStatusTrackIdList) {
            if(userPaidTrackIdList.contains(trackId)){
                map.put(trackId, 1);
            }else{
                map.put(trackId, 0);
            }
        }
        return map;
    }
}

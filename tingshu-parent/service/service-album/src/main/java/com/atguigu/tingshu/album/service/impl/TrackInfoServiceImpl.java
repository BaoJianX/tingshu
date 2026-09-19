package com.atguigu.tingshu.album.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.atguigu.tingshu.album.config.VodConstantProperties;
import com.atguigu.tingshu.album.mapper.AlbumStatMapper;
import com.atguigu.tingshu.album.mapper.TrackInfoMapper;
import com.atguigu.tingshu.album.mapper.TrackStatMapper;
import com.atguigu.tingshu.album.service.AuditSetvice;
import com.atguigu.tingshu.album.service.TrackInfoService;
import com.atguigu.tingshu.album.service.VodService;

import com.atguigu.tingshu.common.execption.GuiguException;
import com.atguigu.tingshu.common.rabbit.constant.MqConst;
import com.atguigu.tingshu.common.rabbit.service.RabbitService;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.common.util.UploadFileUtil;
import com.atguigu.tingshu.model.album.AlbumInfo;
import com.atguigu.tingshu.model.album.AlbumStat;
import com.atguigu.tingshu.model.album.TrackInfo;
import com.atguigu.tingshu.model.album.TrackStat;
import com.atguigu.tingshu.query.album.TrackInfoQuery;
import com.atguigu.tingshu.user.client.UserFeignClient;
import com.atguigu.tingshu.vo.album.*;
import com.atguigu.tingshu.vo.user.UserInfoVo;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Assert;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.qcloud.vod.VodUploadClient;
import com.qcloud.vod.model.VodUploadRequest;
import com.qcloud.vod.model.VodUploadResponse;
import com.tencentcloudapi.vod.v20180717.models.MediaInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.atguigu.tingshu.common.constant.SystemConstant.*;

@Slf4j
@Service
@SuppressWarnings({"all"})
public class TrackInfoServiceImpl extends ServiceImpl<TrackInfoMapper, TrackInfo> implements TrackInfoService {

	@Autowired
	private TrackInfoMapper trackInfoMapper;

	@Autowired
	private AlbumInfoServiceImpl albumInfoService;

	@Autowired
	private TrackStatMapper trackStatMapper;

	@Autowired
	private VodService vodService;

	@Autowired
	private AuditSetvice auditSetvice;

	@Autowired
	private UserFeignClient userFeignClient;

	@Autowired
	private AlbumStatMapper albumStatMapper;

	@Autowired
	private RabbitService rabbitService;

	/**
	 * 保存声音信息
	 * @param trackInfoVo
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveTrackInfo(TrackInfoVo trackInfoVo,Long userId) {
		//获取专辑信息
		Long albumId = trackInfoVo.getAlbumId();
		AlbumInfo albumInfo = albumInfoService.getById(albumId);
		Integer includeTrackCount = albumInfo.getIncludeTrackCount();
		//2新增声音
		//将vo转为po
		TrackInfo trackInfo = BeanUtil.copyProperties(trackInfoVo, TrackInfo.class);
		//2.1封装声音  用户id  声音序号  状态   封面
		trackInfo.setUserId(userId);
		trackInfo.setOrderNum(includeTrackCount+1);
		trackInfo.setStatus(TRACK_STATUS_NO_PASS);
		if(StrUtil.isBlank(trackInfo.getCoverUrl())){
			trackInfo.setCoverUrl(albumInfo.getCoverUrl());
		}
		//2.2获取音频的详细信息，时长，大小，类型
		TrackMediaInfoVo trackMediaInfoVo = vodService.getMediaInfo(trackInfo.getMediaFileId());
		if(trackMediaInfoVo!=null){
			trackInfo.setMediaDuration( BigDecimal.valueOf(trackMediaInfoVo.getDuration()));
			trackInfo.setMediaSize(trackMediaInfoVo.getSize());
			trackInfo.setMediaType(trackMediaInfoVo.getType());
		}
		//对声音新增
		trackInfoMapper.insert(trackInfo);
		Long trackId = trackInfo.getId();
		//更新专辑信息，声音数量
		albumInfo.setIncludeTrackCount(includeTrackCount+1);
		albumInfoService.updateById(albumInfo);

		//新增声音统计记录
		saveTrackStat(trackId, TRACK_STAT_PLAY,0);
		saveTrackStat(trackId, TRACK_STAT_COLLECT,0);
		saveTrackStat(trackId, TRACK_STAT_PRAISE,0);
		saveTrackStat(trackId, TRACK_STAT_COMMENT,0);

		//TODO 对内容进行审核
		String text = trackInfo.getTrackTitle() + trackInfo.getTrackIntro();
		String suggestion = auditSetvice.audit_text(text);
		if(StrUtil.isNotBlank(suggestion)){
			if("block".equals(suggestion)){
				trackInfo.setStatus(TRACK_STATUS_NO_PASS);
			}else if("review".equals(suggestion)){
				trackInfo.setStatus(TRACK_STATUS_MANUAL);
			}else if("pass".equals(suggestion)){
				//TODO 内容通过审核可以对音频审核   先发起一个审核任务
				String taskId = auditSetvice.startReviewTask(trackInfo.getMediaFileId());
				trackInfo.setStatus(TRACK_STATUS_REVIEWING);
				//将任务ID关联到声音表
				trackInfo.setReviewTaskId(taskId);
			}
		}
		trackInfoMapper.updateById(trackInfo);
	}

	@Override
	public void saveTrackStat(Long trackId, String statType, Integer statNum) {
		TrackStat trackStat = new TrackStat();
		trackStat.setTrackId(trackId);
		trackStat.setStatType(statType);
		trackStat.setStatNum(statNum);
		trackStatMapper.insert(trackStat);
	}

	/**
	 * 对声音分页查询
	 * @param pageInfo
	 * @param query
	 * @return
	 */
	@Override
	public IPage<TrackListVo> findUserTrackPage(IPage<TrackListVo> pageInfo, TrackInfoQuery query) {
		//1.轻量count：不JOIN统计表、不GROUP BY，只查track_info，走索引
		long total = this.count(new LambdaQueryWrapper<TrackInfo>()
				.eq(TrackInfo::getUserId, query.getUserId())
				.eq(StrUtil.isNotBlank(query.getStatus()), TrackInfo::getStatus, query.getStatus())
				.like(StrUtil.isNotBlank(query.getTrackTitle()), TrackInfo::getTrackTitle, query.getTrackTitle())
		);
		pageInfo.setTotal(total);

		//2.关闭MyBatis-Plus自动count（慢的根源）。IPage接口没有setSearchCount，需强转为Page
		((Page<TrackListVo>) pageInfo).setSearchCount(false);

		//3.只查当前页数据（searchCount=false后不会再跑那个慢COUNT）
		return trackInfoMapper.findUserTrackPage(pageInfo, query);
	}

	/**
	 * 修改声音信息
	 * @param id
	 * @param trackInfoVo
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateTrackInfo(Long id, TrackInfoVo trackInfoVo) {
		//1.根据id查询声音对象
		TrackInfo trackInfo = trackInfoMapper.selectById(id);
		String oldMediaFileId = trackInfo.getMediaFileId();

		BeanUtil.copyProperties(trackInfoVo,trackInfo);
		//2.判断声音信息有没有改动
		if(!oldMediaFileId.equals(trackInfoVo.getMediaFileId())){
			//2.1声音有改动,文件更新
			TrackMediaInfoVo mediaInfo = vodService.getMediaInfo(trackInfoVo.getMediaFileId());
			if(mediaInfo!=null){
				trackInfo.setMediaFileId(trackInfoVo.getMediaFileId());
				trackInfo.setMediaUrl(trackInfoVo.getMediaUrl());
				trackInfo.setMediaSize(mediaInfo.getSize());
				trackInfo.setMediaType(mediaInfo.getType());
				trackInfo.setMediaDuration(BigDecimal.valueOf(mediaInfo.getDuration()));

				//TODO 内容通过审核可以对音频审核   先发起一个审核任务
				String taskId = auditSetvice.startReviewTask(trackInfo.getMediaFileId());
				trackInfo.setStatus(TRACK_STATUS_REVIEWING);
				//将任务ID关联到声音表
				trackInfo.setReviewTaskId(taskId);
			}
			//2.2删除老音频文件
			vodService.deleteMedia(oldMediaFileId);

			//TODO 如果音频文件更新了，需要对音频审核

		}
		updateById(trackInfo);

		//TODO 审核
		//TODO 对内容进行审核
		String text = trackInfo.getTrackTitle() + trackInfo.getTrackIntro();
		String suggestion = auditSetvice.audit_text(text);
		if(StrUtil.isNotBlank(suggestion)){
			if("bloack".equals(suggestion)){
				trackInfo.setStatus(TRACK_STATUS_NO_PASS);
			}else if("review".equals(suggestion)){
				trackInfo.setStatus(TRACK_STATUS_MANUAL);
			}else if("pass".equals(suggestion)){
				trackInfo.setStatus(TRACK_STATUS_PASS);
			}
		}
		trackInfoMapper.updateById(trackInfo);
	}


	/**
	 * 删除
	 * @param id
	 */
	@Override
	public void removeTrackInfo(Long id) {
		//1.获取被删声音的记录 得到：音频唯一标识、声音序号、
		TrackInfo trackInfo = trackInfoMapper.selectById(id);
		Integer orderNum = trackInfo.getOrderNum();
		String mediaFileId = trackInfo.getMediaFileId();
		Long albumId = trackInfo.getAlbumId();
		//2.删除声音记录，专辑声音数减一
		trackInfoMapper.deleteById(id);
		albumInfoService.update(
				new LambdaUpdateWrapper<AlbumInfo>()
						.eq(AlbumInfo::getId,albumId)
						.setSql("include_track_count = include_track_count - 1")
		);
		//3.更新其他声音序号，确保声音序号连续
		update(
				new LambdaUpdateWrapper<TrackInfo>()
						.eq(TrackInfo::getAlbumId,albumId)
						.gt(TrackInfo::getOrderNum,orderNum)
						.setSql("order_num = order_num - 1")
		);
		//4.删除声音统计信息
		trackStatMapper.delete(
				new LambdaQueryWrapper<TrackStat>()
						.eq(TrackStat::getTrackId,id)
		);
		//5.删除云点播平台信息
		vodService.deleteMedia(mediaFileId);
	}

	/**
	 * 根据专辑ID和用户ID分页查询声音列表
	 * @param pageInfo
	 * @param albumId
	 * @param userId
	 * @return
	 */
	@Override
	public IPage<AlbumTrackListVo> findAlbumTrackPage(IPage<AlbumTrackListVo> pageInfo, Long albumId, Long userId) {

		//1.调用持久层执行动态SQL查询声音列表-付费标识都为：false
		pageInfo = trackInfoMapper.findAlbumTrackPage(pageInfo,albumId);
		//2. 根据专辑ID查询付费类型
		AlbumInfo albumInfo = albumInfoService.getById(albumId);
		//付费类型 0101-免费 、0102-vip免费 、 0103-付费
		String payType = albumInfo.getPayType();
		//免费试听集数
		Integer tracksForFree = albumInfo.getTracksForFree();
		//TODO 基于登录状态、用户身份、用户购买情况动态修改付费标识
		//3.处理未登录  如果当前用户未登录，付费类型vip免费，除了试听外，其他都将付费标识改为true
		if(userId == null){
			//3.1 付费类型是VIP 免费或付费
			if(ALBUM_PAY_TYPE_VIPFREE.equals(payType) | ALBUM_PAY_TYPE_REQUIRE.equals(payType)){
				//3.2 除了 试听外 其他声音都应将付费标识改为true
				pageInfo.getRecords().stream()
						.filter(track->track.getOrderNum() > tracksForFree )
						.forEach(track->track.setIsShowPaidMark(true));
			}
		}else{
			//4.TODO 处理已登录情景
			//4.1 远程调用“用户服务”获取用户基本信息，得到身份信息
			Boolean isVIP = false;
			UserInfoVo userInfoVo = userFeignClient.getUserInfoVo(userId).getData();
			Assert.notNull(userInfoVo, "用户{}不存在",userId);
			if(userInfoVo.getIsVip().intValue() == 1 && userInfoVo.getVipExpireTime().after(new Date())){
				isVIP = true;
			}

			//4.2是否需要进一步检查声音购买状态
			Boolean isNeedCheckPayStatus = false;

			//4.2.1 如果是 普通用户 查询付费类型为：VIP免费专辑，默认无权限播放
			if(!isVIP && ALBUM_PAY_TYPE_VIPFREE.equals(payType)){
				isNeedCheckPayStatus = true;
			}
			//4.2.2
			if(ALBUM_PAY_TYPE_REQUIRE.equals(payType)){
				isNeedCheckPayStatus=true;
			}

			//4.3 如果需要检查购买状态，则远程调用“用户服务”获取声音购买状态得到Map<Long,Integer>
			if(isNeedCheckPayStatus){
				List<Long> needCheckStatusTrackIdList = pageInfo.getRecords().stream()
						.filter(track -> track.getOrderNum() > tracksForFree)
						.map(AlbumTrackListVo::getTrackId)
						.collect(Collectors.toList());

				//4.3.2 远程调用“用户服务”获取声音购买状态
				Map<Long, Integer> payStatusMap = userFeignClient.userIsPaidTrack(userId, albumId, needCheckStatusTrackIdList).getData();
				//4.4 处理当前页中声音购买状态标识，如果未购买将购买标识设置为True，反之采用默认值false
				pageInfo.getRecords().stream()
						.filter(track->track.getOrderNum() > tracksForFree)
						.forEach(track->track.setIsShowPaidMark(payStatusMap.get(track.getTrackId()).intValue() == 0));
			}


		}



		return pageInfo;
	}



	/**
	 * 更新专辑信息和声音信息统计表
	 * @param trackStatMqVo
	 */
	@Transactional(rollbackFor = Exception.class)
	@Override
	public void updateTrackStat(TrackStatMqVo trackStatMqVo) {
		//1.更新声音统计表
		trackStatMapper.update(
				null,
				new LambdaUpdateWrapper<TrackStat>()
						.eq(TrackStat::getTrackId,trackStatMqVo.getTrackId())
						.eq(TrackStat::getStatType,trackStatMqVo.getStatType())
						.setSql("stat_num = stat_num + "+trackStatMqVo.getCount())
		);
		//2.如果统计类型是：播放量、评论、所属专辑统计信息需要更新
		if(TRACK_STAT_PLAY.equals(trackStatMqVo.getStatType())){
			//2.1 更新专辑播放量
			albumStatMapper.update(
					null,
					new LambdaUpdateWrapper<AlbumStat>()
							.eq(AlbumStat::getAlbumId,trackStatMqVo.getAlbumId())
							.eq(AlbumStat::getStatType,ALBUM_STAT_PLAY)
							.setSql("stat_num = stat_num + "+trackStatMqVo.getCount())
			);
		}
		if(TRACK_STAT_COMMENT.equals(trackStatMqVo.getStatType())){
			//2.2 更新专辑评论量
			albumStatMapper.update(
					null,
					new LambdaUpdateWrapper<AlbumStat>()
							.eq(AlbumStat::getAlbumId,trackStatMqVo.getAlbumId())
							.eq(AlbumStat::getStatType,ALBUM_STAT_COMMENT)
							.setSql("stat_num = stat_num + "+trackStatMqVo.getCount())
			);
		}

		//3. 组装“增量更新ES统计”消息：声音统计类型(0701/0704) → 专辑统计类型(0401/0404)
		String albumStatType = this.toAlbumStatType(trackStatMqVo.getStatType());
		if (albumStatType != null) {
			AlbumStatMqVo albumStatMqVo = new AlbumStatMqVo();
			albumStatMqVo.setBusinessNo(trackStatMqVo.getBusinessNo());
			albumStatMqVo.setAlbumId(trackStatMqVo.getAlbumId());
			albumStatMqVo.setStatType(albumStatType);
			albumStatMqVo.setCount(trackStatMqVo.getCount());

			//4. 事务提交后再发MQ，避免DB回滚但ES已被更新
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					rabbitService.sendMessage(MqConst.EXCHANGE_ALBUM, MqConst.ROUTING_ALBUM_ES_STAT_UPDATE, albumStatMqVo);
				}
			});
		}
	}

	/**
	 * 声音统计类型 → 专辑统计类型
	 * 0701 声音播放量 → 0401 专辑播放量；0704 声音评论数 → 0404 专辑评论数
	 * 收藏/点赞没有专辑级对应统计，返回 null 表示无需更新专辑维度
	 *
	 * @param trackStatType 声音统计类型
	 * @return 专辑统计类型，无对应时返回 null
	 */
	private String toAlbumStatType(String trackStatType) {
		if (TRACK_STAT_PLAY.equals(trackStatType)) {
			return ALBUM_STAT_PLAY;
		}
		if (TRACK_STAT_COMMENT.equals(trackStatType)) {
			return ALBUM_STAT_COMMENT;
		}
		return null;
	}
}

package com.atguigu.tingshu.album.api;

import cn.hutool.core.util.StrUtil;
import com.atguigu.tingshu.album.mapper.TrackStatMapper;
import com.atguigu.tingshu.album.service.TrackInfoService;
import com.atguigu.tingshu.album.service.VodService;
import com.atguigu.tingshu.common.login.GuiGuLogin;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.common.util.AuthContextHolder;
import com.atguigu.tingshu.model.album.TrackInfo;
import com.atguigu.tingshu.model.album.TrackStat;
import com.atguigu.tingshu.query.album.TrackInfoQuery;
import com.atguigu.tingshu.vo.album.AlbumTrackListVo;
import com.atguigu.tingshu.vo.album.TrackInfoVo;
import com.atguigu.tingshu.vo.album.TrackListVo;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.prometheus.client.Summary;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.management.Query;
import javax.sound.midi.Track;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Tag(name = "声音管理")
@RestController
@RequestMapping("api/album")
@SuppressWarnings({"all"})
public class TrackInfoApiController {

	@Autowired
	private VodService vodService;

	@Autowired
	private TrackInfoService trackInfoService;

	/**
	 *
	 * 将音视频上传到点播平台
	 * @param multipartFile
	 * @return mediaFileId:""   mediaUrl:""
	 */
	@Operation(summary = "上传音频")
	@PostMapping("trackInfo/uploadTrack")
	public Result<Map<String,String>>uploadTrack(@RequestParam("file")MultipartFile file){
		Map<String,String> map = vodService.uploadTrack(file);
		return Result.ok(map);

	}

	/**
	 *
	 * 保存声音
	 * @param trackInfoVo
	 * @return
	 */
	@Operation(summary = "保存声音")
	@PostMapping("trackInfo/saveTrackInfo")
	@GuiGuLogin
	public Result saveTrackInfo(@RequestBody TrackInfoVo trackInfoVo){
		Long userId = AuthContextHolder.getUserId();
		trackInfoService.saveTrackInfo(trackInfoVo,userId);
		return Result.ok();
	}

	/**
	 *
	 */
	@Operation(summary = "获得该用户的声音列表")
	@PostMapping("trackInfo/findUserTrackPage/{page}/{limit}")
	@GuiGuLogin
	public Result<IPage<TrackListVo>>findUserTrackPage(
			@PathVariable Long page,
			@PathVariable Long limit,
	        @RequestBody TrackInfoQuery query){
		Long userId = AuthContextHolder.getUserId();
		query.setUserId(userId);
		IPage<TrackListVo> pageInfo = new Page<>(page,limit);
		pageInfo = trackInfoService.findUserTrackPage(pageInfo,query);
		return Result.ok(pageInfo);
	}

	/**
	 *
	 */
	@Operation(summary = "根据id查询声音信息")
	@GetMapping("trackInfo/getTrackInfo/{id}")
	public Result<TrackInfo>getTrackInfo(@PathVariable Long id){
		TrackInfo trackInfo = trackInfoService.getById(id);
		return Result.ok(trackInfo);
	}

	/**
	 *
	 */
	@Operation(summary = "修改声音信息")
	@PutMapping("trackInfo/updateTrackInfo/{id}")
	public Result updateTrackInfo(@PathVariable Long id,@RequestBody TrackInfoVo trackInfoVo){
		trackInfoService.updateTrackInfo(id,trackInfoVo);
		return Result.ok();
	}

	/**
	 *
	 * 根据id删除声音
	 * @param id
	 * @return
	 */
	@Operation(summary = "根据id删除声音")
	@DeleteMapping("trackInfo/removeTrackInfo/{id}")
	public Result removeTrackInfo(@PathVariable Long id){
		trackInfoService.removeTrackInfo(id);
		return Result.ok();
	}

	/**
	 * 根据专辑id分页查询声音列表
	 * @param albumId
	 * @param page
	 * @param limit
	 * @return
	 */
	@GuiGuLogin(required = false)
	@Operation(summary = "根据专辑id分页查询声音列表")
	@GetMapping("trackInfo/findAlbumTrackPage/{albumId}/{page}/{limit}")
	public Result<IPage<AlbumTrackListVo>>findAlbumTrackPage(
			@PathVariable Long albumId,
			@PathVariable Long page,
			@PathVariable Long limit){
		//1.获取当前用户ID(可能为空)
		Long userId = AuthContextHolder.getUserId();
		//2. 创建分页对象 封装页码、页大小
		IPage<AlbumTrackListVo> pageInfo = new Page<>(page,limit);
		//3. 调用业务逻辑
		pageInfo = trackInfoService.findAlbumTrackPage(pageInfo,albumId,userId);
		return Result.ok(pageInfo);
	}



}


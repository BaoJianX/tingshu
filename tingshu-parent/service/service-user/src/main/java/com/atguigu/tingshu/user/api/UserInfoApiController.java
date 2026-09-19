package com.atguigu.tingshu.user.api;

import cn.binarywang.wx.miniapp.api.WxMaService;
import com.atguigu.tingshu.common.login.GuiGuLogin;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.common.util.AuthContextHolder;
import com.atguigu.tingshu.user.service.UserInfoService;
import com.atguigu.tingshu.vo.user.UserInfoVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "用户管理接口")
@RestController
@RequestMapping("api/user")
@SuppressWarnings({"all"})
public class UserInfoApiController {

	@Autowired
	private UserInfoService userInfoService;

	@Autowired
	private WxMaService wxMaService;


	@Operation(summary = "微信小程序一键进行登录")
	@GetMapping("wxLogin/{code}")
	public Result<Map<String,String>> wxLogin(@PathVariable String code) {
		Map<String,String> map = userInfoService.wxLogin(code);
		return Result.ok(map);
	}

	@Operation(summary = "获取用户信息")
	@GetMapping("wxLogin/getUserInfo")
	@GuiGuLogin
	public Result<UserInfoVo> getUserInfoVo() {
		Long userId = AuthContextHolder.getUserId();
		UserInfoVo userInfoVo = userInfoService.getUserInfoVo(userId);
		return Result.ok(userInfoVo);
	}


	@Operation(summary = "更新用户信息")
	@PutMapping("wxLogin/updateUser")
	@GuiGuLogin
	public Result updateUser(@RequestBody UserInfoVo userInfoVo) {
		Long userId = AuthContextHolder.getUserId();
		userInfoService.updateUser(userId,userInfoVo);
		return Result.ok();
	}

	@Operation(summary = "根据用户id获取用户信息")
	@GetMapping("userInfo/getUserInfoVo/{userId}")
	public Result<UserInfoVo> getUserInfoVo(@PathVariable Long userId) {
		UserInfoVo userInfoVo = userInfoService.getUserInfoVo(userId);
		return Result.ok(userInfoVo);
	}

	/**
	 * 用户是否购买过该专辑或者该专辑下的声音
	 */
	@Operation(summary = "用户是否购买过该专辑或者该专辑下的声音")
	@PostMapping("userInfo/userIsPaidTrack/{userId}/{albumId}")
	public Result<Map<Long,Integer>>userIsPaidTrack(
			@PathVariable Long userId,
			@PathVariable Long albumId,
			@RequestBody List<Long>needCheckPayStatusTrackIdList
	){
		Map<Long,Integer> map = userInfoService.userIsPaidTrack(userId,albumId,needCheckPayStatusTrackIdList);
		return Result.ok(map);
	}



}


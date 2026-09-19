package com.atguigu.tingshu.album.api;

import com.atguigu.tingshu.album.service.AlbumInfoService;
import com.atguigu.tingshu.album.service.BaseCategoryService;
import com.atguigu.tingshu.common.login.GuiGuLogin;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.common.util.AuthContextHolder;
import com.atguigu.tingshu.model.album.AlbumInfo;
import com.atguigu.tingshu.model.album.BaseAttribute;
import com.atguigu.tingshu.model.album.BaseCategory1;
import com.atguigu.tingshu.query.album.AlbumInfoQuery;
import com.atguigu.tingshu.vo.album.AlbumInfoVo;
import com.atguigu.tingshu.vo.album.AlbumListVo;
import com.atguigu.tingshu.vo.album.AlbumStatVo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.management.Query;
import java.util.List;

@Tag(name = "专辑管理")
@RestController
@RequestMapping("api/album")
@SuppressWarnings({"all"})
public class AlbumInfoApiController {

	@Autowired
	private AlbumInfoService albumInfoService;

	@Autowired
	private BaseCategoryService baseCategoryService;


	/**
	 * 查询便签列表
	 * @param category1Id
	 * @return
	 */
	@Operation(summary = "根据1级分类id查询标签列表（包含标签取值）")
	@GetMapping("category/findAttribute/{category1Id}")
	public Result<List<BaseAttribute>> findAttributeByCategory1Id(@PathVariable Long category1Id){
		List<BaseAttribute> list = baseCategoryService.findAttributeByCategory1Id(category1Id);
		return Result.ok(list);
	}


	/**
	 *
	 * 保存专辑信息
	 * @param albumInfo
	 * @return
	 */
	@Operation(summary = "保存专辑信息")
	@PostMapping("albumInfo/saveAlbumInfo")
	@GuiGuLogin(required = true)
	public Result saveAlbumInfo(@RequestBody AlbumInfoVo albumInfoVo){
		//获取用户id
		Long userId = AuthContextHolder.getUserId();
		//调用业务逻辑
		albumInfoService.saveAlbumInfo(albumInfoVo,userId);
		//返回信息
		return Result.ok();
	}

	/**
	 * 查看用户专辑分页列表
	 * @param page
	 * @param limit
	 * @param query
	 * @return
	 */
	@Operation(summary = "查看当前用户专辑分页列表（包含统计信息）")
	@PostMapping("albumInfo/findUserAlbumPage/{page}/{limit}")
	@GuiGuLogin(required = true)
	public Result<IPage<AlbumListVo>>findUserAlbumPage(
			@PathVariable Long page,
			@PathVariable Long limit,
			@RequestBody AlbumInfoQuery query){
		//获取用户id
		Long userId = AuthContextHolder.getUserId();
		//创建分页大小
		IPage<AlbumListVo>pageInfo = new Page<>(page,limit);
		//调用业务逻辑，最终执行持久层查询
		query.setUserId(userId);
		pageInfo = albumInfoService.findUserAlbumPage(pageInfo,query);
		//返回结果
		return Result.ok(pageInfo);

	}

	/**
	 *
	 * 删除专辑
	 * @param id
	 * @return
	 */
	@Operation(summary = "根据ID删除专辑")
	@DeleteMapping("albumInfo/removeAlbumInfo/{id}")
	public Result removeAlbumInfoById(@PathVariable Long id){
		albumInfoService.removeAlbumInfoById(id);
		return Result.ok();
	}

	/**
	 *
	 * 专辑查询回显
	 * @param id
	 * @return
	 */
	@Operation(summary = "单个专辑查询回显")
	@GetMapping("albumInfo/getAlbumInfo/{id}")
	public Result<AlbumInfo> getAlbumInfoById(@PathVariable Long id){
		AlbumInfo list = albumInfoService.getAlbumInfoByIdFromDB(id);
		return Result.ok(list);
	}

	/**
	 *
	 * 更新专辑
	 * @param id
	 * @param albumInfoVo
	 * @return
	 */
	@Operation(summary = "更新专辑")
	@PutMapping("albumInfo/updateAlbumInfo/{id}")
	public Result updateAlbumInfoById(@PathVariable Long id,@RequestBody AlbumInfoVo albumInfoVo){
		albumInfoService.updateAlbumInfoById(id,albumInfoVo);
		return Result.ok();
	}

	/**
	 *
	 * 查询用户的专辑列表
	 * @return
	 */
	@Operation(summary = "查询该用户下的所有专辑列表")
	@GetMapping("albumInfo/findUserAllAlbumList")
	@GuiGuLogin(required = true)
	public Result<List<AlbumInfo>>findUserAllAlbumList(){
		Long userId = AuthContextHolder.getUserId();
		List<AlbumInfo> albumInfoList = albumInfoService.findUserAllAlbumList(userId);
		return Result.ok(albumInfoList);
	}


	/**
	 * 根据专辑id获取专辑统计信息
	 * @param albumId
	 * @return
	 */
	@Operation(summary = "根据专辑id获取专辑统计信息")
	@GetMapping("albumInfo/getAlbumStatVo/{albumId}")
	public Result<AlbumStatVo> getAlbumStatVo(@PathVariable Long albumId){
		AlbumStatVo albumStatVo = albumInfoService.getAlbumStatVo(albumId);
		return Result.ok(albumStatVo);
	}


	@Operation(summary = "查询所有1级分类列表")
	@GetMapping("category/findAllCategory1")
	public Result<List<BaseCategory1>> findAllCategory1(){
		List<BaseCategory1> list = baseCategoryService.findAllCategory1();
		return Result.ok(list);
	}



}


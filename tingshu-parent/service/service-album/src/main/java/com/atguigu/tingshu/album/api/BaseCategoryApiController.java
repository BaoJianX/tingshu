package com.atguigu.tingshu.album.api;

import cn.hutool.json.JSONObject;
import com.atguigu.tingshu.album.service.BaseCategoryService;
import com.atguigu.tingshu.common.result.Result;
import com.atguigu.tingshu.model.album.BaseCategory3;
import com.atguigu.tingshu.model.album.BaseCategoryView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@Tag(name = "分类管理")
@RestController
@RequestMapping(value="/api/album")
@SuppressWarnings({"all"})
public class BaseCategoryApiController {

	@Autowired
	private BaseCategoryService baseCategoryService;

	@Operation(summary = "查询所有1级分类（包含2级分类以及3级分类列表）")
	@GetMapping("/category/getBaseCategoryList")
	public Result<List<JSONObject>> getBaseCategoryList(){
		List<JSONObject>list = baseCategoryService.getBaseCategoryList();
		return Result.ok(list);
	}

	@Operation(summary = "根据三级分类id查询分类视图")
	@GetMapping("category/getCategoryView/{category3Id}")
	public Result<BaseCategoryView> getCategoryView(@PathVariable Long category3Id){
		BaseCategoryView baseCategoryView = baseCategoryService.getCategoryView(category3Id);
		return Result.ok(baseCategoryView);
	}

	@Operation(summary = "根据一级分类id查询三级分类列表")
	@GetMapping("category/findTopBaseCategory3/{category1Id}")
	public Result<List<BaseCategory3>> findTopBaseCategory3(@PathVariable Long category1Id){
		List<BaseCategory3	> list = baseCategoryService.findTopBaseCategory3(category1Id);
		return Result.ok(list);
	}

	@Operation(summary = "根据一级分类id查询全部分类列表")
	@GetMapping("category/getBaseCategoryList/{category1Id}")
	public Result<JSONObject> getBaseCategoryByCategory1Id(@PathVariable Long category1Id){
		JSONObject jsonObject = baseCategoryService.getBaseCategoryByCategory1Id(category1Id);
		return Result.ok(jsonObject);
	}

}


package com.atguigu.tingshu.album.service.impl;

import cn.hutool.json.JSON;
import cn.hutool.json.JSONObject;
import com.atguigu.tingshu.album.mapper.*;
import com.atguigu.tingshu.album.service.BaseCategoryService;
import com.atguigu.tingshu.common.cache.GuiGuCache;
import com.atguigu.tingshu.model.album.*;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.classify.ClassifierAdapter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@SuppressWarnings({"all"})
public class BaseCategoryServiceImpl extends ServiceImpl<BaseCategory1Mapper, BaseCategory1> implements BaseCategoryService {

    @Autowired
    private BaseCategory1Mapper baseCategory1Mapper;

    @Autowired
    private BaseCategory2Mapper baseCategory2Mapper;

    @Autowired
    private BaseCategory3Mapper baseCategory3Mapper;

    @Autowired
    private BaseCategoryViewMapper baseCategoryViewMapper;

    @Autowired
    private BaseAttributeMapper baseAttributeMapper;

    @Override
    public List<JSONObject> getBaseCategoryList() {
        //创建json处理所有一级分类
        List<JSONObject> list = new ArrayList<>();
        //1级分类id
        List<BaseCategoryView> baseCategoryViewList = baseCategoryViewMapper.selectList(null);
        //一级分类id作分组，Map<一级分类id，里面二级分类列表>
        Map<Long, List<BaseCategoryView>> map1 = baseCategoryViewList.stream()
                .collect(Collectors.groupingBy(BaseCategoryView::getCategory1Id));
        //遍历map,封装一级对象
        for (Map.Entry<Long, List<BaseCategoryView>> entry1 : map1.entrySet()) {
            //创建1级分类JSON对象
            JSONObject jsonObject1 = new JSONObject();
            //封装分类id，名称
            jsonObject1.put("categoryId", entry1.getKey());
            jsonObject1.put("categoryName", entry1.getValue().get(0).getCategory1Name());
            //二级分类
            ArrayList<JSONObject> jsonObject2List = new ArrayList<>();
            Map<Long, List<BaseCategoryView>> map2 = entry1.getValue()
                    .stream()
                    .collect(Collectors.groupingBy(BaseCategoryView::getCategory2Id));
            for (Map.Entry<Long, List<BaseCategoryView>> entry2 : map2.entrySet()) {
                JSONObject jsonObject2 = new JSONObject();
                //封装分类id，名称
                jsonObject2.put("categoryId", entry2.getKey());
                jsonObject2.put("categoryName", entry2.getValue().get(0).getCategory2Name());
                jsonObject2List.add(jsonObject2);
                //3级分类
                ArrayList<JSONObject> jsonObject3List = new ArrayList<>();
                for (BaseCategoryView baseCategoryView : entry2.getValue()) {
                    JSONObject jsonObject3 = new JSONObject();
                    //封装分类id，名称
                    jsonObject3.put("categoryId", baseCategoryView.getCategory3Id());
                    jsonObject3.put("categoryName", baseCategoryView.getCategory3Name());
                    jsonObject3List.add(jsonObject3);
                }
                //将三级对象放入二级级分类对象中
                jsonObject2.put("categoryChild", jsonObject3List);
            }
            //将二级对象放入一级分类对象中
            jsonObject1.put("categoryChild", jsonObject2List);

            list.add(jsonObject1);
        }

        return list;
    }

    @Override
    @GuiGuCache(prefix = "category:attribute:")
    public List<BaseAttribute> findAttributeByCategory1Id(Long category1Id) {
        return baseAttributeMapper.findAttributeByCategory1Id(category1Id);
    }


    @Override
    @GuiGuCache(prefix = "category:category_view:")
    public BaseCategoryView getCategoryView(Long category3Id) {
        BaseCategoryView baseCategoryView = baseCategoryViewMapper.selectById(category3Id);
        return baseCategoryView;
    }

    @Override
    @GuiGuCache(prefix = "category:category_top7:")
    public List<BaseCategory3> findTopBaseCategory3(Long category1Id) {
        //1.根据一级分类id查询二级分类
        List<BaseCategory2> baseCategory2List = baseCategory2Mapper.selectList(
                new LambdaQueryWrapper<BaseCategory2>()
                        .eq(BaseCategory2::getCategory1Id, category1Id)
        );
        //2.根据二级分类id查询三级分类
        List<Long> baseCategory2IdList = baseCategory2List.stream().map(BaseCategory2::getId).collect(Collectors.toList());
        List<BaseCategory3> baseCategory3List = baseCategory3Mapper.selectList(
                new LambdaQueryWrapper<BaseCategory3>()
                        .eq(BaseCategory3::getIsTop,1)
                        .in(BaseCategory3::getCategory2Id, baseCategory2IdList)
                        .orderByAsc(BaseCategory3::getOrderNum)
                        .select(BaseCategory3::getId, BaseCategory3::getName,BaseCategory3::getCategory2Id)
                        .last("limit 7")
        );
        return baseCategory3List;
    }


    @Override
    @GuiGuCache(prefix = "category:category_list_category1id:")
    public JSONObject getBaseCategoryByCategory1Id(Long category1Id) {
        //1.根据1级分类id查询分类视图得到“1级”分类列表
        List<BaseCategoryView> baseCategory1List = baseCategoryViewMapper.selectList(
                new LambdaQueryWrapper<BaseCategoryView>()
                        .eq(BaseCategoryView::getCategory1Id, category1Id)
        );
        //2.创建1级分类JSON对象，封装1级分裂对象中分类ID、分类名称
        JSONObject jsonObject1 = new JSONObject();
        jsonObject1.put("categoryId", baseCategory1List.get(0).getCategory1Id());
        jsonObject1.put("categoryName", baseCategory1List.get(0).getCategory1Name());
        //3.处理2级分类
        //3.1 根据2级分类ID进行分组，得到2级分类Map
        Map<Long, List<BaseCategoryView>> map2 = baseCategory1List.stream()
                .collect(Collectors.groupingBy(BaseCategoryView::getCategory2Id));
        //3.2遍历2级分类Map，封装2级分类JSON对象
        ArrayList<JSONObject> jsonObject2List = new ArrayList<>();
        for (Map.Entry<Long, List<BaseCategoryView>> entry2 : map2.entrySet()) {
            JSONObject jsonObject2 = new JSONObject();
            jsonObject2.put("categoryId", entry2.getKey());
            jsonObject2.put("categoryName", entry2.getValue().get(0).getCategory2Name());
            //3.3将二级分类对象存入2级分类集合
            jsonObject2List.add(jsonObject2);

            //4 处理三级分类
            ArrayList<JSONObject> jsonObject3List = new ArrayList<>();
            for (BaseCategoryView baseCategoryView : entry2.getValue()) {
                JSONObject jsonObject3 = new JSONObject();
                jsonObject3.put("categoryId", baseCategoryView.getCategory3Id());
                jsonObject3.put("categoryName", baseCategoryView.getCategory3Name());
                jsonObject3List.add(jsonObject3);
            }
            jsonObject2.put("categoryChild", jsonObject3List);
        }
        jsonObject1.put("categoryChild", jsonObject2List);
        return jsonObject1;
    }

    @Override
    public List<BaseCategory1> findAllCategory1() {
        List<BaseCategory1> category1List = baseCategory1Mapper.selectList(null);
        return category1List;
    }
}

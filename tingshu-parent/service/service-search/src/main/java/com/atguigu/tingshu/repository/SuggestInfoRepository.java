package com.atguigu.tingshu.repository;

import com.atguigu.tingshu.model.search.SuggestIndex;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface SuggestInfoRepository extends ElasticsearchRepository<SuggestIndex,String> {
}

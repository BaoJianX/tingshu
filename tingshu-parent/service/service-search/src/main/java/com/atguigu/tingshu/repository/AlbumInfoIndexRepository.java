package com.atguigu.tingshu.repository;

import com.atguigu.tingshu.model.search.AlbumInfoIndex;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface AlbumInfoIndexRepository extends ElasticsearchRepository<AlbumInfoIndex,Long> {
}

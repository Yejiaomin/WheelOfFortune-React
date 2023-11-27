package com.example.demo;
import java.util.List;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface GameRepository extends PagingAndSortingRepository<Game, Long >, DatastoreRepository<Game, Long > {
    List<Game> findByUserId(String userId);
}
package com.example.demo;
import java.util.List;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
public interface GameRepository extends DatastoreRepository<Game, Long >{
    List<Game> findByUserId(String userId);
}

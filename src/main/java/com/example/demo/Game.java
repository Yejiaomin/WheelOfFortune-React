package com.example.demo;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import org.springframework.data.annotation.Id;

@Entity(name = "games")
public class Game {
    @Id
    Long id;
    String userId;
    int score;

    public Game(String userId, int score) {
        this.userId = userId;
        this.score = score;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "GameRecord{" +
                "id=" + id +
                ", userId='" + userId + '\'' +
                ", score=" + score +
                '}';
    }
}

package com.example.demo;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;

@Entity(name = "games")
public class Game {
    @Id
    Long id;
    String userId;
    String gameId;
    int score;
    LocalDate date;

    public Game(String userId, String gameId, int score, LocalDate date) {
        this.userId = userId;
        this.gameId = gameId;
        this.score = score;
        this.date = date;
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

    public LocalDate getDate() {
        return date;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public void setDate(LocalDate date) {
        this.date = date;
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
        return "Game{" +
                "id=" + id +
                ", userId='" + userId + '\'' +
                ", gameId='" + gameId + '\'' +
                ", score=" + score +
                ", date=" + date +
                '}';
    }
}

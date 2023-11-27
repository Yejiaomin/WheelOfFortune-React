package com.example.demo;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@RestController

public class GameController {
    private final GameRepository gameRepository;

    public GameController(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }
    @PostMapping("/saveGame")
    @CrossOrigin(origins = "*")
    public String saveGame(@RequestBody Game game) {
        if (game == null) {
            return "The game is invalid";
        }
        this.gameRepository.save(game);
        return "success";
    }



    @GetMapping("/findAllGames")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public List<Game> findAllGames() {
        Iterable<Game> games = this.gameRepository.findAll();
        List<Game> gameList = new ArrayList<>();
//    books.forEach(bookList::add);
        for (Game game: games) {
            gameList.add(game);
        }
        gameList.sort(Comparator.comparingInt(Game::getScore).reversed());
        return gameList.subList(0,Math.min(10,gameList.size()));
    }
    @GetMapping("/findGameByUserId")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public List<Game> findByUserId(@RequestParam String userId){
        Iterable<Game> games = this.gameRepository.findByUserId(userId);
        List<Game> gameList = new ArrayList<>();
        games.forEach(gameList::add);
        gameList.sort(Comparator.comparingInt(Game::getScore).reversed());
        return gameList.subList(0,Math.min(10,gameList.size()));
    }

}

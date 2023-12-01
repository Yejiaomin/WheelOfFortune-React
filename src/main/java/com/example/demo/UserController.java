package com.example.demo;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/saveUser")
    @CrossOrigin(origins = "*")
    public String saveUser(@RequestBody User user) {
        if (user == null) {
            return "The user is invalid";
        }
        this.userRepository.save(user);
        return "success";
    }

    @GetMapping("/findGameIdByUserId")
    @ResponseBody
    @CrossOrigin(origins = "*")
    public String findGameIdByUserId(@RequestParam String userId){
        Optional<User> user = this.userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get().getGameId();
        }
        return "";
    }

}

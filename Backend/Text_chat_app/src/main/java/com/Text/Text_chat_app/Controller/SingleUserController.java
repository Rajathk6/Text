package com.Text.Text_chat_app.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Repository.UserRepo;
import com.Text.Text_chat_app.Service.SingleUserService;

@RestController
@RequestMapping("/api/dashboard")
public class SingleUserController {
    private SingleUserService userService;
    private UserRepo userRepo;

    public SingleUserController(SingleUserService userService, UserRepo userRepo) {
        this.userService = userService;
        this.userRepo = userRepo;
    }

    @PostMapping("/friends")
    public ResponseEntity<List<String>> GetFriendsByUsername(Authentication authentication) {
        // receive the name from authorized jwt token
        String loggedUser = authentication.getName();
        List<String> userFriends = userService.retrivefriends(loggedUser);
        System.out.println(userFriends);
        return ResponseEntity.ok(userFriends);
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("q") String query, Authentication authentication) {
        if (authentication.isAuthenticated()) {
            List<User> globalSearchResult = userRepo.findByUsernameContainingIgnoreCase(query);
            return ResponseEntity.ok(globalSearchResult);
        }
        return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
    }

}

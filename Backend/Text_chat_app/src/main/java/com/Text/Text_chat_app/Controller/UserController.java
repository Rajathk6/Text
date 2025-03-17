package com.Text.Text_chat_app.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Service.UserService;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // @GetMapping("/login")
    // public ResponseEntity<?> userLogin(@RequestBody User User) {
    //     return userService.registerUser(User);
    // }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        return userService.authenticateUser(user);
    }
}

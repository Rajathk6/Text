package com.Text.Text_chat_app.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Text.Text_chat_app.Service.SingleUserService;

@RestController
@RequestMapping("/api/dashboard")
public class SingleUserController {
    private SingleUserService userService;

    public SingleUserController(SingleUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/friends")
    public ResponseEntity<List<String>> GetFriendsByUsername(Authentication authentication) {
        // receive the name from authorized jwt token
        String loggedUser = authentication.getName();
        List<String> userFriends = userService.retrivefriends(loggedUser);
        System.out.println(userFriends);
        return ResponseEntity.ok(userFriends);
    }
}

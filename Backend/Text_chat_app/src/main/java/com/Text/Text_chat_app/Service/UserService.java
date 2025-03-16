package com.Text.Text_chat_app.Service;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Repository.UserRepo;

@Service
public class UserService {
    UserRepo userRepo;
    PasswordEncoder passwordEncoder;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public ResponseEntity<?> registerUser(User newUser) {
        if (newUser != userRepo.findByUsername(newUser.getUsername())) {
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            userRepo.save(newUser);

        }
        return ResponseEntity.ok("User details added to database");
    }

}

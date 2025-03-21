package com.Text.Text_chat_app.Service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Repository.UserRepo;

@Service
public class UserService {
    private AuthenticationManager authManager;
    private UserRepo userRepo;
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepo userRepo, AuthenticationManager authManager, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.authManager = authManager;
        this.passwordEncoder = passwordEncoder;
    }

    public User authenticateUser(User loginRequest) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );  
        return userRepo.findByUsername(loginRequest.getUsername()); 
    }

    public ResponseEntity<?> registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("New user registered");
    }
}

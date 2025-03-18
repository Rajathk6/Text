package com.Text.Text_chat_app.Service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Repository.UserRepo;

@Service
public class UserService {
    UserRepo userRepo;
    PasswordEncoder passwordEncoder;

    public UserService(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?> authenticateUser(User loginRequest) {
        User user = userRepo.findByUsername(loginRequest.getUsername());
        if (user == null ) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("user not found");
        }
        // if password incorrect
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
        // existing users (IMPLEMENT JWT)
        return ResponseEntity.ok("Login successful");       
    }

    public ResponseEntity<?> registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("New user registered");
    }
}

package com.Text.Text_chat_app.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Text.Text_chat_app.Model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long>{

    User findByUsername(String username);

    User findByPassword(String password);

    List<User> findByUsernameContainingIgnoreCase(String query);

}

package com.Text.Text_chat_app.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Model.message;

@Repository
public interface MessageRepo extends JpaRepository<message, Long>{

     @Query(value = "SELECT DISTINCT u.* " +
                   "FROM users u " +
                   "WHERE u.id IN (SELECT m.receiver_id FROM message m WHERE m.sender_id = :userId) " +
                   "UNION " +
                   "SELECT DISTINCT u.* " +
                   "FROM users u " +
                   "WHERE u.id IN (SELECT m.sender_id FROM message m WHERE m.receiver_id = :userId)",
           nativeQuery = true)
    List<User> findFriendsByUserId(Long userId);

}

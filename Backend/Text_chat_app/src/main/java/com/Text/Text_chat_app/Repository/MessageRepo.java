package com.Text.Text_chat_app.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Model.Message;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long>{

    @Query("SELECT DISTINCT u FROM User u WHERE u.username IN (SELECT m.receiver FROM Message m WHERE m.sender = :username) UNION SELECT DISTINCT u FROM User u WHERE u.username IN (SELECT m.sender FROM Message m WHERE m.receiver = :username)")
    List<User> findFriendsByUsername(@Param("username") String username);

    Message findByReceiver(String receiver);

    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.timestamp ASC")
    List<Message> findConversationBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);


}

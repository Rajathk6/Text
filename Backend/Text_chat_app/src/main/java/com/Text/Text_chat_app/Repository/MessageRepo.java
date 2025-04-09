package com.Text.Text_chat_app.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Model.message;

import jakarta.persistence.QueryHint;

@Repository
public interface MessageRepo extends JpaRepository<message, Long>{
    @QueryHints(value = @QueryHint(name = "javax.persistence.query.timeout", value = "5000"))
    @Query(value = "SELECT DISTINCT u.* " +
               "FROM users u " +
               "WHERE u.username IN (SELECT m.receiver FROM message m WHERE m.sender = :username) " +
               "UNION " +
               "SELECT DISTINCT u.* " +
               "FROM users u " +
               "WHERE u.username IN (SELECT m.sender FROM message m WHERE m.receiver = :username)",
       nativeQuery = true)
    List<User> findFriendsByUsername(String username);

    message findByReceiver(String receiver);

    @Query("SELECT m FROM message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.timestamp ASC")
    List<message> findConversationBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);


}

package com.Text.Text_chat_app.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Text.Text_chat_app.Model.message;

@Repository
public interface MessageRepo extends JpaRepository<message, Long>{

}

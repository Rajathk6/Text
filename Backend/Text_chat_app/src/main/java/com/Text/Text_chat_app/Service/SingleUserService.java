package com.Text.Text_chat_app.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Repository.MessageRepo;
import com.Text.Text_chat_app.Repository.UserRepo;

@Service
public class SingleUserService {

    private UserRepo userrepo;
    private MessageRepo messageDetails;

    public SingleUserService(UserRepo userrepo, MessageRepo messageDetails) {
        this.messageDetails = messageDetails;
        this.userrepo = userrepo;
    }

    @Transactional(readOnly = true)
    public List<String> retrivefriends(String loggedUser) {
        User usercred = userrepo.findByUsername(loggedUser);
        if (usercred == null) {
            throw new RuntimeException("user not found" + loggedUser);
        }
        List<User> friends =  messageDetails.findFriendsByUsername(loggedUser);
        System.out.println(friends);
        List<String> userfriends =  friends.stream().map(User::getUsername).toList();
        System.out.println(userfriends);
        return userfriends;
    }

}

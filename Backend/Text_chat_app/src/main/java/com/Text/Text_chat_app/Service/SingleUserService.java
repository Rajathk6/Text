package com.Text.Text_chat_app.Service;

import java.util.List;

import org.springframework.stereotype.Service;

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

    public List<String> retrivefriends(String loggedUser) {
        User usercred = userrepo.findByUsername(loggedUser);
        if (usercred == null) {
            throw new RuntimeException("user not found" + loggedUser);
        }
        System.out.println(usercred);
        Long userId = usercred.getId();
        List<User> friends =  messageDetails.findFriendsByUserId(userId);
        System.out.println(userId);
        System.out.println(friends);
        List<String> userfriends =  friends.stream().map(User::getUsername).toList();
        System.out.println(userfriends);
        return userfriends;
    }

}

package com.Text.Text_chat_app.Service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Text.Text_chat_app.Model.PrincipleUser;
import com.Text.Text_chat_app.Model.User;
import com.Text.Text_chat_app.Repository.UserRepo;

@Service
public class loginUserDetailService implements UserDetailsService {
    UserRepo singleUseRepo;
    public loginUserDetailService(UserRepo singleUseRepo) {
        this.singleUseRepo = singleUseRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = singleUseRepo.findByUsername(username);
        if (user == null ) {
            throw new UsernameNotFoundException("Enter a valid user name");
        }
        return new PrincipleUser(user);
    }

}

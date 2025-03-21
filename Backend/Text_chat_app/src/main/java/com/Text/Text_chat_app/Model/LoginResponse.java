package com.Text.Text_chat_app.Model;

public class LoginResponse {
    private String token;
    private long ExpiresIn;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiresIn() {
        return ExpiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        ExpiresIn = expiresIn;
    }
}

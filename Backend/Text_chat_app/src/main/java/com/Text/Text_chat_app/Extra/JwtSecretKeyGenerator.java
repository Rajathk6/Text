package com.Text.Text_chat_app.Extra;

import io.jsonwebtoken.security.Keys;
import java.util.Base64;
import java.security.Key;

public class JwtSecretKeyGenerator {
    public static void main(String[] args) {
        Key key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
        String base64Key = Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println("Generated Base64 Key: " + base64Key);
    }
}

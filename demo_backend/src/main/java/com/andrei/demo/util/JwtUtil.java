package com.andrei.demo.util;

import com.andrei.demo.model.Person;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import io.jsonwebtoken.security.SignatureAlgorithm;


@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String createToken(Person person, String role) {
        return Jwts
                .builder()
                .subject(person.getEmail())
                .issuer("demo-spring-boot-backend")
                .issuedAt(new Date(System.currentTimeMillis()))
                .claims(Map.of(
                        "userId", person.getId(),
                        "role", role
                ))
                // the token will be expired in 10 hours
                .expiration(new Date(System.currentTimeMillis() + 1000* 60 * 60 *10))
                .signWith(getSignInKey(), Jwts.SIG.HS256)
                .compact();
    }



}

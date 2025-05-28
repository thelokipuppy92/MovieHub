package com.andrei.demo.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Date;

@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secretKey;

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    private boolean checkClaims(String token) {
        Claims claims = getAllClaimsFromToken(token);

        // check issuer
        if (!"demo-spring-boot-backend".equals(claims.getIssuer())) {
            log.error("Invalid token issuer");
            return false;
        }

        // check expiration
        if (claims.getExpiration().before(new Date())) {
            log.error("Token has expired");
            return false;
        }

        // check iat
        if (claims.getIssuedAt() == null || claims.getIssuedAt().after(new Date())) {
            log.error("Token issued at date is invalid");
            return false;
        }

        // check claims
        if (claims.get("userId") == null || claims.get("role") == null) {
            log.error("Token claims are invalid: does not contain userId and role");
            return false;
        }

        log.info("Token is valid. User ID: {}, Role: {}", claims.get("userId"), claims.get("role"));
        return true;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();  // Get the full URI
        String method = request.getMethod();    // Get the HTTP method

        log.info("Request Path: {}, Method: {}", path, method);

        // Skip JWT validation for public endpoints and OPTIONS preflight requests
        if (path.equals("/login") || path.equals("/register") || path.equals("/forgot-password") ||
                path.startsWith("/forgotPassword/verifyMail") ||
                path.startsWith("/forgotPassword/verifyOtp") ||
                path.startsWith("/forgotPassword/changePassword") ||
                "OPTIONS".equalsIgnoreCase(method)) {
            log.info("Skipping JWT filter for path: {} and method: {}", path, method);
            filterChain.doFilter(request, response);
            return;
        }

        // Now check the Authorization header only if not skipping
        String authHeader = request.getHeader("Authorization");
        log.info("Authorization header: {}", authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.error("Authorization header is missing or does not start with 'Bearer '");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7);  // Remove "Bearer " prefix

        try {
            Claims claims = getAllClaimsFromToken(token);
            if (!checkClaims(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            String role = (String) claims.get("role");

            if ("user".equalsIgnoreCase(role)) {
                boolean isAllowedPath = false;

                if ("GET".equalsIgnoreCase(method)) {
                    isAllowedPath = path.equals("/movie") ||
                            path.equals("/movie/available-genres") ||
                            path.equals("/movie/fil") ||
                            path.startsWith("/movie/") ||
                            path.equals("/actors") ||
                            path.startsWith("/actors/email/") ||
                            path.equals("/directors") ||
                            path.startsWith("/directors/email/") ||
                            path.startsWith("/directors/name/") ||
                            path.matches("/review/[a-fA-F0-9\\-]+") ||
                            path.equals("/account-details") ||
                            path.matches("/person/[a-fA-F0-9\\-]+") ||
                            path.startsWith("/api/watchlist");
                }

                if ("POST".equalsIgnoreCase(method)) {
                    isAllowedPath = path.startsWith("/review") || path.startsWith("/api/watchlist");
                }

                if ("PUT".equalsIgnoreCase(method) || "DELETE".equalsIgnoreCase(method)) {
                    isAllowedPath = path.matches("/review/[a-fA-F0-9\\-]+") ||
                            path.matches("/person/[a-fA-F0-9\\-]+");
                }

                if (!isAllowedPath) {
                    log.warn("Access denied for user role to path: {} and method: {}", path, method);
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    return;
                }
            }

            // If everything is OK, continue the filter chain
            filterChain.doFilter(request, response);

        } catch (JwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}

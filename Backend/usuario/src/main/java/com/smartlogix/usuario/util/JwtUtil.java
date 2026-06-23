package com.smartlogix.usuario.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Utilidad para generar y validar JSON Web Tokens (JWT)
 *
 * El JWT contiene información del usuario encriptada con una clave secreta
 * Estructura: Header.Payload.Signature
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret:SmartLogix-JWT-Secret-Key-2026-DuocUC-FullStack-Development-Project-Secure}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // 24 horas en milisegundos
    private long jwtExpirationMs;

    /**
     * Genera un JWT con la información del usuario
     *
     * @param userId ID del usuario
     * @param username Nombre de usuario
     * @return Token JWT firmado
     */
    public String generateToken(Long userId, String username) {
        return createToken(userId, username);
    }

    /**
     * Valida si un JWT es válido y no ha expirado
     *
     * @param token Token JWT a validar
     * @return true si el token es válido, false si es inválido o expirado
     */
    public boolean isValidToken(String token) {
        try {
            // Intenta parsear y validar el token
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.err.println("Token JWT expirado: " + e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            System.err.println("Token JWT no soportado: " + e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            System.err.println("Token JWT inválido: " + e.getMessage());
            return false;
        } catch (SignatureException e) {
            System.err.println("Firma JWT inválida: " + e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            System.err.println("Token JWT vacío: " + e.getMessage());
            return false;
        }
    }

    /**
     * Extrae el ID del usuario del token JWT
     *
     * @param token Token JWT
     * @return ID del usuario
     */
    public Long getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.get("userId", Long.class);
        } catch (JwtException e) {
            System.err.println("Error al extraer userId del token: " + e.getMessage());
            return null;
        }
    }

    /**
     * Extrae el username del token JWT
     *
     * @param token Token JWT
     * @return Username del usuario
     */
    public String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.getSubject(); // El subject es el username
        } catch (JwtException e) {
            System.err.println("Error al extraer username del token: " + e.getMessage());
            return null;
        }
    }

    /**
     * Extrae el ID de la compañía del token JWT
     *
     * @param token Token JWT
     * @return ID de la compañía
     */
    public Long getCompanyIdFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return claims.get("companyId", Long.class);
        } catch (JwtException e) {
            System.err.println("Error al extraer companyId del token: " + e.getMessage());
            return null;
        }
    }

    /**
     * Método privado para crear el token JWT
     */
    private String createToken(Long userId, String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Método privado para obtener la clave de firma
     */
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Obtiene el tiempo de expiración configurado en milisegundos
     */
    public long getJwtExpirationMs() {
        return jwtExpirationMs;
    }
}

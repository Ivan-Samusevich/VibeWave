package VibeWave.config;

import VibeWave.dto.UserDto;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Date;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String SecretKey;

    @Value("${jwt.expiration}")
    private Long ExpiRationTime;


    public String generateToken(UserDto userDto){
        return Jwts.builder()
                .setSubject(userDto.getUserName())
                .claim("userId", userDto.getUserId())
                .claim("userName", userDto.getUserName())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ExpiRationTime))
                .signWith(SignatureAlgorithm.HS256, SecretKey)
                .compact();
    }


    public Claims validateToken(String token){
        try {
            return Jwts.parser()
                    .setSigningKey(SecretKey)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e){
            throw new RuntimeException("Токен истёк", e);
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("Неподдерживаемый токен", e);
        } catch (MalformedJwtException e) {
            throw new RuntimeException("Некорректный токен", e);
        } catch (SignatureException e) {
            throw new RuntimeException("Неверная подпись токена", e);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Пустой или некорректный токен", e);
        }
    }

    public Long getUserIdFromToken(String token){
        Claims claims = validateToken(token);
        return claims.get("UserId", Long.class);
    }

    public String getUserNameFromToken(String token){
        Claims claims = validateToken(token);
        return claims.get("userName", String.class);
    }
}

package VibeWave.config;

import VibeWave.dto.UserDto;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String SecretKey;

    @Value("${jwt.accessExpirationTime}")
    private Long AccessExpirationTime;

    @Value("${jwt.refreshExpirationTime}")
    private Long RefreshExpirationTime;

    public String generateAccessToken(UserDto userDto){
        return Jwts.builder()
                .setSubject(userDto.getUserName())
                .claim("userId", userDto.getUserId())
                .claim("userName", userDto.getUserName())
                .claim("type", "access")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + AccessExpirationTime))
                .signWith(SignatureAlgorithm.HS256, SecretKey)
                .compact();
    }

    public String generateRefreshToken(UserDto userDto){
        return Jwts.builder()
                .setSubject(userDto.getUserName())
                .claim("userId", userDto.getUserId())
                .claim("userName", userDto.getUserName())
                .claim("type", "refresh")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + RefreshExpirationTime))
                .signWith(SignatureAlgorithm.HS256, SecretKey)
                .compact();
    }


    public Claims validateToken(String token){
        try {
            return Jwts.parser()
                    .setSigningKey(SecretKey)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e){                //Обьеденить 4 catch в ИнстенсОфф
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
        return claims.get("userId", Long.class);
    }

    public String getUserNameFromToken(String token){
        Claims claims = validateToken(token);
        return claims.get("userName", String.class);

    }

    public boolean isRefreshToken(String refreshToken){
        Claims claims = validateToken(refreshToken);

        return "refresh".equals(claims.get("type", String.class));
    }

    public String generateAccessTokenFromRefreshToken(String refreshToken){
        Long userId = getUserIdFromToken(refreshToken);
        String userName = getUserNameFromToken(refreshToken);
        UserDto userDto = new UserDto(userId, userName);
        String accessToken = generateAccessToken(userDto);
        return accessToken;
    }
}

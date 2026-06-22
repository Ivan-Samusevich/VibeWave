package VibeWave.controller;

import VibeWave.config.JwtTokenUtil;
import VibeWave.dto.AuthResponse;
import VibeWave.dto.SignResult;
import VibeWave.dto.UserDto;
import VibeWave.dto.user.UserRequest;
import VibeWave.entity.User;
import VibeWave.service.SignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;


@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "https://innovative-determination-production-d7c1.up.railway.app",
        allowCredentials = "true"
)
public class SignController {
    private final SignService signService;

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@RequestBody UserRequest request){
        SignResult result = signService.signIn(request);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", result.getRefreshToken())
                .httpOnly(true)
                .secure(false) //  потом поменять на true
                .path("/")
                .maxAge(Duration.ofDays(7))
                .build();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .body(result.getAuthResponse());
    }

    @PostMapping("/signup")
    public String signUp(@RequestBody User user){return signService.signUp(user);}

    @PostMapping("/refresh")
    public AuthResponse refresh(@CookieValue("refreshToken") String refreshToken){
        return signService.refresh(refreshToken);
    }
}

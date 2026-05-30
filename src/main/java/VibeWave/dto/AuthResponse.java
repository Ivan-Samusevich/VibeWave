package VibeWave.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class AuthResponse {

    private Long userId;
    private String userName;
    private String accessToken;
}

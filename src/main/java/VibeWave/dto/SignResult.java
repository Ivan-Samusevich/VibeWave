package VibeWave.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class SignResult {
    private AuthResponse authResponse;
    private String refreshToken;
}

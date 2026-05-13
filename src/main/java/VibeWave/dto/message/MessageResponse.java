package VibeWave.dto.message;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
public class MessageResponse {
    private Long messageId;
    private String userName;
    private String text;
    private LocalDateTime createdAt;
}

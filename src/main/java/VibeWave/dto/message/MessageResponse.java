package VibeWave.dto.message;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {
    private Long messageId;
    private String userName;
    private Long chatId;
    private String text;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

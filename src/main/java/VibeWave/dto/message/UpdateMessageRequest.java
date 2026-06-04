package VibeWave.dto.message;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UpdateMessageRequest {
    private Long messageId;
    private String newText;
}

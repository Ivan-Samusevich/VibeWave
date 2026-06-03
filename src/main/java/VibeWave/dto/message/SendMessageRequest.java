package VibeWave.dto.message;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class SendMessageRequest {

    private String receiverUserName;
    private Long chatId;
    private String text;
}

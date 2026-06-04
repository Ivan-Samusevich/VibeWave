package VibeWave.controller;

import VibeWave.dto.message.MessageResponse;
import VibeWave.dto.message.SendMessageRequest;
import VibeWave.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(SendMessageRequest request){
        MessageResponse response = messageService.sendMessage(request);
        messagingTemplate.convertAndSend("/topic/chat/" + response.getChatId(), response);
    }
}

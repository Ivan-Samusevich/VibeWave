package VibeWave.controller;

import VibeWave.dto.UserDto;
import VibeWave.dto.message.MessageResponse;
import VibeWave.dto.message.SendMessageRequest;
import VibeWave.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("chat.send")
    //@SendTo("/topic/messages")
    public void sendMessage(SendMessageRequest request,
                                       @AuthenticationPrincipal UserDto currentUser){
        MessageResponse response = messageService.sendMessage(request, currentUser.getUserId());
        messagingTemplate.convertAndSend("/topic/chat/" + response.getChatId(), response);
    }
}

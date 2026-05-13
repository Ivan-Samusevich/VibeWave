package VibeWave.controller;

import VibeWave.dto.UserDto;
import VibeWave.dto.message.SendMessageRequest;
import VibeWave.dto.message.MessageResponse;
import VibeWave.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/getMessages/{chatId}")
    public List<MessageResponse> getMessages(@PathVariable Long chatId){
        return messageService.getMessages(chatId);
    }

    @PostMapping("/sendMessage")
    public void sendMessage(@RequestBody SendMessageRequest request,
                            @AuthenticationPrincipal UserDto currentUser){
        messageService.sendMessage(request, currentUser.getUserId());
    }
}

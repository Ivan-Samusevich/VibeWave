package VibeWave.controller;

import VibeWave.dto.MessageDto;
import VibeWave.entity.Message;
import VibeWave.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{userId}")
    public List<Message> getMessage(@RequestHeader(name = "Current-Id") Long currentId,
                                    @PathVariable Long userId){
        return chatService.getMessages(currentId, userId);
    }

    @PostMapping("/send/{receiverId}")
    public Message sendMessage(@PathVariable Long receiverId, @RequestBody MessageDto messageDto){
        return chatService.sendMessage(1L, receiverId, messageDto.getText());
    }
}

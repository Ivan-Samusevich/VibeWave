package VibeWave.controller;

import VibeWave.dto.MessageDto;
import VibeWave.dto.UserDto;
import VibeWave.entity.Message;
import VibeWave.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{userId}")
    public List<Message> getMessage(@AuthenticationPrincipal UserDto currentUser,
                                    @PathVariable Long userId){
        return chatService.getMessages(currentUser.getUserId(), userId);
    }

    @PostMapping("/send/{receiverId}")
    public Message sendMessage(@AuthenticationPrincipal UserDto currentUser,
                               @PathVariable Long receiverId,
                               @RequestBody MessageDto messageDto){
        return chatService.sendMessage(currentUser.getUserId(), receiverId, messageDto.getText());
    }
}

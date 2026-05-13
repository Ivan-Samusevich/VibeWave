package VibeWave.controller;

import VibeWave.dto.MessageDto;
import VibeWave.dto.UserDto;
import VibeWave.dto.chat.ChatResponse;
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
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/showChats")
    public List<ChatResponse> getAllMyChats(@AuthenticationPrincipal UserDto currentUser){
        return chatService.getAllMyChats(currentUser.getUserId());
    }

    //todo добавить контроллер для openChat
    @GetMapping("/openWith/{userName}")
    public ChatResponse openChat(@PathVariable String userName,
                                 @AuthenticationPrincipal UserDto currentUser){
        return chatService.openChat(currentUser.getUserId(), userName);
    }

}

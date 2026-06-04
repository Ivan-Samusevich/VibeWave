package VibeWave.controller;

import VibeWave.dto.message.MessageResponse;
import VibeWave.dto.message.UpdateMessageRequest;
import VibeWave.service.MessageService;
import lombok.RequiredArgsConstructor;
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

    @PutMapping("/updateMessage")
    public void updateMessage(@RequestBody UpdateMessageRequest request){
        messageService.updateMessage(request);
    }

    @DeleteMapping("/deleteMessage/{messageId}")
    public void deleteMessage(@PathVariable Long messageId){
        messageService.deleteMessage(messageId);
    }
}

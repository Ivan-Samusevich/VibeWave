package VibeWave.service;

import VibeWave.dto.message.SendMessageRequest;
import VibeWave.dto.message.MessageResponse;
import VibeWave.entity.Chat;
import VibeWave.entity.Message;
import VibeWave.repository.MessageRepository;
import VibeWave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatService chatService;

    public List<MessageResponse> getMessages(Long chatId){
        List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
        List<MessageResponse> responses = new ArrayList<>();
        for(Message message: messages){
            MessageResponse response = new MessageResponse();
            response.setMessageId(message.getMessageId());
            response.setUserName(userRepository.getUsernameById(message.getSenderId()));
            response.setText(message.getText());
            response.setCreatedAt(message.getCreatedAt());
            responses.add(response);
        }
        return responses;
    }

    public void sendMessage(SendMessageRequest request, Long myId){
        Long secondUserId = userRepository.getIdByUsername(request.getReceiverUserName());

        Long firstId = Math.min(myId, secondUserId);
        Long secondId = Math.max(myId, secondUserId);

        Chat chat = chatService.getOrCreateChat(firstId, secondId);

        Message message = new Message();
        message.setChatId(chat.getChatId());
        message.setSenderId(myId);
        message.setText(request.getText());
        messageRepository.save(message);
    }
}

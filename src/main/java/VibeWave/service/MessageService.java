package VibeWave.service;

import VibeWave.dto.message.SendMessageRequest;
import VibeWave.dto.message.MessageResponse;
import VibeWave.entity.Chat;
import VibeWave.entity.Message;
import VibeWave.repository.MessageRepository;
import VibeWave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request, Long myId){
        Long secondUserId = userRepository.getIdByUsername(request.getReceiverUserName());

        Long firstId = Math.min(1L, 2L);
        Long secondId = Math.max(1L, 2L);

        Chat chat = chatService.getOrCreateChat(firstId, secondId);

        Message message = new Message();
        message.setChatId(chat.getChatId());
        message.setSenderId(2L);
        message.setText(request.getText());
        messageRepository.save(message);

        return MessageResponse.builder()
                .messageId(message.getMessageId())
                .chatId(message.getChatId())
                .userName(userRepository.getUsernameById(message.getSenderId()))
                .text(message.getText())
                .createdAt(message.getCreatedAt())
                .build();
    }
}

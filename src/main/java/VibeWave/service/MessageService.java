package VibeWave.service;

import VibeWave.dto.message.SendMessageRequest;
import VibeWave.dto.message.MessageResponse;
import VibeWave.dto.message.UpdateMessageRequest;
import VibeWave.entity.Chat;
import VibeWave.entity.Message;
import VibeWave.entity.User;
import VibeWave.repository.ChatRepository;
import VibeWave.repository.MessageRepository;
import VibeWave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<MessageResponse> getMessages(Long chatId){
        List<Message> messages = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
        List<MessageResponse> responses = new ArrayList<>();
        for(Message message: messages){
            MessageResponse response = new MessageResponse();
            response.setMessageId(message.getMessageId());
            response.setUserName(userRepository.getUsernameById(message.getSenderId()));
            response.setChatId(message.getChatId());
            response.setText(message.getText());
            response.setCreatedAt(message.getCreatedAt().plusHours(3));
            response.setUpdatedAt(message.getUpdatedAt().plusHours(3));
            responses.add(response);
        }
        return responses;
    }

    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request){

        Message message = new Message();
        message.setChatId(request.getChatId());
        message.setSenderId(request.getSenderId());
        message.setText(request.getText());
        messageRepository.save(message);

        return MessageResponse.builder()
                .messageId(message.getMessageId())
                .chatId(message.getChatId())
                .userName(userRepository.getUsernameById(message.getSenderId()))
                .text(message.getText())
                .createdAt(message.getCreatedAt().plusHours(3))
                .build();
    }

    @Transactional
    public void updateMessage(UpdateMessageRequest request){
        String newText = request.getNewText();
        Message message = messageRepository.findById(request.getMessageId())
                .orElseThrow(() -> new RuntimeException("Сообщение не найдено"));
        message.setText(newText);
        messageRepository.save(message);
    }

    @Transactional
    public void deleteMessage(Long messageId){
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Сообщение не найдено"));
        messageRepository.delete(message);
    }
}

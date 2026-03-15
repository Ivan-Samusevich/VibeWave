package VibeWave.service;

import VibeWave.entity.Message;
import VibeWave.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;

    public List<Message> getMessages(Long myId, Long receiverId){
        return messageRepository.findChatMessages(myId, receiverId);
    }

    // todo позже жлбавить обработчик фото и видео
    @Transactional
    public Message sendMessage(Long myId, Long receiverId, String text){

        Message message = new Message();
        message.setReceiverId(receiverId);
        message.setSenderId(myId);
        message.setText(text);
        messageRepository.save(message);

        return message;
    }
}

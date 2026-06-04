package VibeWave.service;

import VibeWave.dto.chat.ChatResponse;
import VibeWave.entity.Chat;
import VibeWave.repository.ChatRepository;
import VibeWave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final UserRepository userRepository;
    private final ChatRepository chatRepository;

//    todo в перспективе сделать PageAble(это для того, чтобы из бд брать условно по 10 сообщений, остальные по мере необходимости будут подгружаться)

    public Chat getOrCreateChat(Long myId, Long secondUserId){

        Long firstId = Math.min(myId, secondUserId);
        Long secondId = Math.max(myId, secondUserId);

        Optional<Chat> optionalChat = chatRepository.findByFirstUserIdAndSecondUserId(firstId, secondId);

        if(optionalChat.isPresent()){
            return optionalChat.get();
        }

        Chat chat = new Chat();
        chat.setFirstUserId(firstId);
        chat.setSecondUserId(secondId);
        return chatRepository.save(chat);
    }

    public ChatResponse openChat(Long myId, String userName){
        Long secondUserId = userRepository.getIdByUsername(userName);
        Long firstId = Math.min(myId, secondUserId);
        Long secondId = Math.max(myId, secondUserId);


        Chat chat = getOrCreateChat(firstId, secondId);
        return new ChatResponse(chat.getChatId(), userName);
    }

    public List<ChatResponse> getAllMyChats(Long myId){

        List<Chat> chats = chatRepository.findByFirstUserIdOrSecondUserId(myId, myId);
        List<ChatResponse> responses = new ArrayList<>();
        String userName;
        for(Chat chat: chats){
            if(chat.getFirstUserId().equals(myId)){
                userName = userRepository.getUsernameById(chat.getSecondUserId());
            } else {
                userName = userRepository.getUsernameById(chat.getFirstUserId());
            }
            ChatResponse response = new ChatResponse();
            response.setChatId(chat.getChatId());
            response.setUserName(userName);
            responses.add(response);
        }
        return responses;
    }
}

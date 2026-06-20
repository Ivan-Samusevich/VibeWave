package VibeWave.service;

import VibeWave.dto.chat.ChatResponse;
import VibeWave.entity.Chat;
import VibeWave.entity.User;
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
    private final MinioService minioService;

//    todo в перспективе сделать PageAble(это для того, чтобы из бд брать условно по 10 сообщений, остальные по мере необходимости будут подгружаться)

    public Chat getOrCreateChat(Long firstUserId, Long secondUserId){

        Long firstId = Math.min(firstUserId, secondUserId);
        Long secondId = Math.max(firstUserId, secondUserId);

        Optional<Chat> optionalChat = chatRepository.findByFirstUserUserIdAndSecondUserUserId(firstId, secondId);

        if(optionalChat.isPresent()){
            return optionalChat.get();
        }

        Chat chat = new Chat();
        chat.setFirstUser(userRepository.findByUserId(firstId));
        chat.setSecondUser(userRepository.findByUserId(secondId));
        return chatRepository.save(chat);
    }

    public ChatResponse openChat(Long myId, String userName){
        User currentUser = userRepository.findByUserId(myId);
        User secondUser = userRepository.findByUserName(userName);

        Long firstId = Math.min(currentUser.getUserId(), secondUser.getUserId());
        Long secondId = Math.max(currentUser.getUserId(), secondUser.getUserId());


        Chat chat = getOrCreateChat(firstId, secondId);

        String secondUserName;
        if(secondUser.isDeleted()) {
            secondUserName = "User is Deleted";
        } else {
            secondUserName = secondUser.getUserName();
        }

        return new ChatResponse(chat.getChatId(), secondUserName, secondUser.getUserProfile().getAvatarFileName());
    }

    public List<ChatResponse> getAllMyChats(Long myId){

        List<Chat> chats = chatRepository.findByFirstUserUserIdOrSecondUserUserId(myId, myId);
        List<ChatResponse> responses = new ArrayList<>();
        User secondUser;
        for(Chat chat: chats){
            if(chat.getFirstUser().getUserId().equals(myId)){
                secondUser = userRepository.findByUserId(chat.getSecondUser().getUserId());
            } else {
                secondUser = userRepository.findByUserId(chat.getFirstUser().getUserId());
            }
            String secondUserName;
            if(secondUser.isDeleted()) {
                secondUserName = "User is Deleted";
            } else {
                secondUserName = secondUser.getUserName();
            }
            ChatResponse response = new ChatResponse();
            response.setChatId(chat.getChatId());
            if(secondUser.getUserProfile().getAvatarFileName() != null) {
                response.setFileName(minioService.getFileURL(secondUser.getUserProfile().getAvatarFileName()));
            }
            response.setUserName(secondUserName);
            responses.add(response);
        }
        return responses;
    }
}

package VibeWave.service;

import VibeWave.dto.UserProfile.UserProfileResponce;
import VibeWave.dto.post.PostResponse;
import VibeWave.entity.Post;
import VibeWave.entity.UserProfile;
import VibeWave.repository.PostRepository;
import VibeWave.repository.UserProfileRepository;
import VibeWave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final MinioService minioService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;


    //todo Надо будет объеденить 2 метода на изменение профиля
    public void changeUserAvatarImage(Long userId, MultipartFile file){
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        String fileName = minioService.uploadFileFromUserProfile(file, userId);
        userProfile.setAvatarFileName(fileName);
        userProfileRepository.save(userProfile);
    }

    public void changeUserDescription(String text, Long userId){
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        userProfile.setDescription(text);
        userProfileRepository.save(userProfile);
    }

    public UserProfileResponce showUserProfile(Long userId){
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        UserProfileResponce userProfileResponce = new UserProfileResponce();
        userProfileResponce.setUserName(userRepository.getUsernameById(userId));
        userProfileResponce.setPostCount(userProfile.getPostCount());
        userProfileResponce.setFollowerCount(userProfile.getFollowerCount());
        userProfileResponce.setFollowingCount(userProfile.getFollowingCount());

        return userProfileResponce;
    }

    public List<PostResponse> showUserPosts(String userName){
        Long userId = userRepository.getIdByUsername(userName);
        List<Post> posts = postRepository.findAllByUserId(userId);
        List<PostResponse> postResponses = new ArrayList<>();
        for(Post post : posts){
            PostResponse postResponse = new PostResponse();
            postResponse.setId(post.getPostId());
            postResponse.setUserName(userRepository.getUsernameById(post.getUserId()));
            postResponse.setText(post.getText());
            postResponse.setLikesCount(post.getLikesCount());
            postResponse.setImageURL(minioService.getFileURL(post.getFileName()));
            postResponse.setFileType(fileTypeDetect(post.getFileName()));
            postResponses.add(postResponse);
        }
        return postResponses;
    }

    public void followOnUser(String userName){

    }


    private String fileTypeDetect(String fileName){
        if(fileName.endsWith(".mp4")){
            return "video";
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".png")){
            return "image";
        }
        else {
            return "Тип файла не определён";
        }
    }
}

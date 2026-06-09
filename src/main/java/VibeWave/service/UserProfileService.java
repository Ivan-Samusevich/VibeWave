package VibeWave.service;

import VibeWave.dto.UserProfile.UserProfileResponce;
import VibeWave.dto.follow.FollowResponse;
import VibeWave.dto.post.PostResponse;

import VibeWave.entity.*;
import VibeWave.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private final FollowRepository followRepository;
    private final SavedPostRepository savedPostRepository;


    //todo Надо будет объеденить 2 метода на изменение профиля
    public void changeUserAvatarImage(Long userId, MultipartFile file){
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        if(userProfile.getAvatarFileName() != null){
            minioService.deleteFileFromMinio(userProfile.getAvatarFileName());
        }
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

    public UserProfileResponce showUserProfile(String userName){
        User user = userRepository.findByUserName(userName);
        UserProfile userProfile = user.getUserProfile();
        UserProfileResponce userProfileResponce = new UserProfileResponce();
        userProfileResponce.setUserName(userName);
        if(userProfile.getAvatarFileName() != null){
            userProfileResponce.setFileURL(minioService.getFileURL(userProfile.getAvatarFileName()));
        }
        userProfileResponce.setDescription(userProfile.getDescription());
        userProfileResponce.setPostCount(userProfile.getPostCount());
        userProfileResponce.setFollowerCount(userProfile.getFollowerCount());
        userProfileResponce.setFollowingCount(userProfile.getFollowingCount());
        userProfileResponce.setCreatedAt(user.getCreatedAt());
        return userProfileResponce;
    }

    public List<PostResponse> showUserPosts(String userName){
        User user = userRepository.findByUserName(userName);
        List<Post> posts = postRepository.findAllByUser(user);
        List<PostResponse> postResponses = new ArrayList<>();
        for(Post post : posts){
            PostResponse postResponse = new PostResponse();
            postResponse.setId(post.getPostId());
            postResponse.setUserName(userName);
            postResponse.setText(post.getText());
            postResponse.setLikesCount(post.getLikesCount());
            postResponse.setImageURL(minioService.getFileURL(post.getFileName()));
            postResponse.setFileType(fileTypeDetect(post.getFileName()));
            postResponses.add(postResponse);
        }
        return postResponses;
    }

    public List<PostResponse> showSavedPosts(String userName){
        User user = userRepository.findByUserName(userName);
        List<SavedPost> savedPosts = savedPostRepository.findAllSavedPostsByUser(user); //todo Будет ли показывать чужие сохранения
        List<PostResponse> postResponses = new ArrayList<>();
        for(SavedPost savedPost: savedPosts){
            PostResponse postResponse = new PostResponse();
            postResponse.setId(savedPost.getPost().getPostId());
            Post post = postRepository.findById(savedPost.getPost().getPostId())
                    .orElseThrow(() -> new RuntimeException("Пост не найден"));
            postResponse.setUserName(userRepository.getUsernameById(savedPost.getUser().getUserId()));
            postResponse.setAvatarURL(userProfileRepository.findAvatarFileNameByUserProfileId(post.getUser().getUserId()));
            postResponse.setText(post.getText());
            postResponse.setLikesCount(post.getLikesCount());
            postResponse.setImageURL(minioService.getFileURL(post.getFileName()));
            postResponse.setFileType(fileTypeDetect(post.getFileName()));
            postResponses.add(postResponse);
        }
        return postResponses;
    }

    @Transactional
    public void followOnUser(String userName, Long userId){
        User follower = userRepository.findByUserId(userId);
        User following = userRepository.findByUserName(userName);
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);
        followRepository.save(follow);
        userProfileRepository.incrementFollowingCount(userId);
        userProfileRepository.incrementFollowerCount(following.getUserId());
    }

    public List<FollowResponse> getFollower(String userName){
        User user = userRepository.findByUserName(userName);
        List<Follow> follows = followRepository.findAllByFollowing(user);
        List<FollowResponse> followers = new ArrayList<>();
        for(Follow follow : follows){
            FollowResponse response = new FollowResponse();
            response.setUserName(follow.getFollower().getUserName());
            String avatarFileName = follow.getFollower().getUserProfile().getAvatarFileName();
            if(avatarFileName != null) {
                response.setFileURL(minioService.getFileURL(avatarFileName));
            }
            followers.add(response);
        }
        return followers;
    }

    public List<FollowResponse> getFollowing(String userName){
        User user = userRepository.findByUserName(userName);
        List<Follow> follows = followRepository.findAllByFollower(user);
        List<FollowResponse> followings = new ArrayList<>();
        for(Follow follow : follows){
            FollowResponse response = new FollowResponse();
            response.setUserName(follow.getFollowing().getUserName());
            String avatarFileName = follow.getFollowing().getUserProfile().getAvatarFileName();
            if(avatarFileName != null) {
                response.setFileURL(minioService.getFileURL(avatarFileName));
            }
            followings.add(response);
        }
        return followings;
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

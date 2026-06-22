package VibeWave.service;

import VibeWave.dto.UserProfile.UserProfileResponse;
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

    public UserProfileResponse showUserProfile(String userName, Long myId){
        User user = userRepository.findByUserName(userName);
        boolean isFollow = followRepository.existsByFollowerUserIdAndFollowingUserId(myId, user.getUserId());
        UserProfile userProfile = user.getUserProfile();
        UserProfileResponse userProfileResponse = new UserProfileResponse();
        userProfileResponse.setUserName(userName);
        if(userProfile.getAvatarFileName() != null){
            userProfileResponse.setFileURL(minioService.getFileURL(userProfile.getAvatarFileName()));
        }
        userProfileResponse.setDescription(userProfile.getDescription());
        userProfileResponse.setPostCount(userProfile.getPostCount());
        userProfileResponse.setFollowerCount(userProfile.getFollowerCount());
        userProfileResponse.setFollowingCount(userProfile.getFollowingCount());
        userProfileResponse.setFollow(isFollow);
        userProfileResponse.setCreatedAt(user.getCreatedAt());
        return userProfileResponse;
    }

    public List<UserProfileResponse> searchUser(String searchText){
        List<User> searchUsers = userRepository.findByUserNameContainingIgnoreCase(searchText);
        List<UserProfileResponse> responses = new ArrayList<>();
        for(User searchUser: searchUsers){
            UserProfileResponse response = new UserProfileResponse();
            response.setUserName(searchUser.getUserName());
            if(searchUser.getUserProfile().getAvatarFileName() != null) {
                response.setFileURL(minioService.getFileURL(searchUser.getUserProfile().getAvatarFileName()));
            }
            responses.add(response);
        }
        return responses;
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
        List<SavedPost> savedPosts = savedPostRepository.findAllSavedPostsByUser(user);
        List<PostResponse> postResponses = new ArrayList<>();
        for(SavedPost savedPost: savedPosts){
            PostResponse postResponse = new PostResponse();
            postResponse.setId(savedPost.getPost().getPostId());
            Post post = postRepository.findById(savedPost.getPost().getPostId())
                    .orElseThrow(() -> new RuntimeException("Пост не найден"));
            if(savedPost.getPost().getUser().isDeleted()){
                postResponse.setUserName("User is Deleted");
            } else {
                postResponse.setUserName(savedPost.getUser().getUserName());
            }
            postResponse.setAvatarURL(savedPost.getUser().getUserProfile().getAvatarFileName());
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
        boolean isFollow = followRepository.existsByFollowerUserIdAndFollowingUserId(
                follower.getUserId(), following.getUserId());
        if(!isFollow) {
            Follow follow = new Follow();
            follow.setFollower(follower);
            follow.setFollowing(following);
            followRepository.save(follow);
            userProfileRepository.incrementFollowingCount(userId);
            userProfileRepository.incrementFollowerCount(following.getUserId());
        } else {
            userProfileRepository.decrementFollowingCount(userId);
            userProfileRepository.decrementFollowerCount(following.getUserId());
            Follow follow = followRepository.findByFollowerAndFollowing(follower, following);
            followRepository.delete(follow);
        }

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

package VibeWave.controller;


import VibeWave.dto.UserDto;
import VibeWave.dto.UserProfile.UpdateUserProfileRequest;
import VibeWave.dto.UserProfile.UserProfileResponce;
import VibeWave.dto.post.PostResponse;
import VibeWave.dto.user.UserResponse;
import VibeWave.entity.User;
import VibeWave.entity.UserProfile;
import VibeWave.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/userProfile")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;


    @GetMapping("/showUserProfile")
    public UserProfileResponce showUserProfile(@AuthenticationPrincipal UserDto currentUser,
                                               @RequestParam String userName){ // todo переделать под ник, который отправляет фронт
        System.out.println(userName);
        return userProfileService.showUserProfile(userName);
    }

    //todo переделывать
    @GetMapping("/showUserPosts")
    public List<PostResponse> showUserPosts(@RequestParam String userName){
        return userProfileService.showUserPosts(userName);
    }

    @PutMapping("/changeUserProfile")
    public void changeUserProfile(@RequestParam String description,
                                  @RequestParam MultipartFile file,
                                  @AuthenticationPrincipal UserDto currentUser){
        userProfileService.changeUserAvatarImage(currentUser.getUserId(), file);
        userProfileService.changeUserDescription(description, currentUser.getUserId());
    }

    @PostMapping("/follow/{userName}")                       //todo потом переделать так, чтобы можно было с другой страницы смотреть его подписки.
    public void followOnUSer(@PathVariable String userName,
                             @AuthenticationPrincipal UserDto currentUser){
        userProfileService.followOnUser(userName, currentUser.getUserId());
    }

    @GetMapping("/showFollowers")
    public List<UserResponse> showfollowers(@AuthenticationPrincipal UserDto currentUser){
        return userProfileService.getFollower(currentUser.getUserId());
    }

    @GetMapping("/showFollowing")
    public List<UserResponse> showfollowing(@AuthenticationPrincipal UserDto currentUser){
        return userProfileService.getFollowing(currentUser.getUserId());
    }
}

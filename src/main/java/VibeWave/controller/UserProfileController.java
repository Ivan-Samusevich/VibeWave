package VibeWave.controller;


import VibeWave.dto.UserDto;
import VibeWave.dto.UserProfile.UpdateUserProfileRequest;
import VibeWave.dto.UserProfile.UserProfileResponce;
import VibeWave.dto.post.PostResponse;
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
    public UserProfileResponce showUserProfile(@AuthenticationPrincipal UserDto currentUser){
        return userProfileService.showUserProfile(currentUser.getUserId());
    }

    //todo переделывать
    @GetMapping("/showUserPosts")
    public List<PostResponse> showUserPosts(@RequestParam String userName){
        return userProfileService.showUserPosts(userName);
    }

    @PutMapping("/changeUserProfile")
    public void changeUserProfile(@RequestParam MultipartFile file,
                                  @RequestBody UpdateUserProfileRequest updateUserProfileRequest,
                                  @AuthenticationPrincipal UserDto currentUser){
        userProfileService.changeUserAvatarImage(currentUser.getUserId(), file);
        userProfileService.changeUserDescription(updateUserProfileRequest.getDescription(), currentUser.getUserId());
    }

    @PutMapping("/follow/{userName}")
    public void followOnUSer(@PathVariable String userName){

    }
}

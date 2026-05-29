package VibeWave.controller;


import VibeWave.dto.UserDto;
import VibeWave.dto.UserProfile.UserProfileResponce;
import VibeWave.dto.follow.FollowResponse;
import VibeWave.dto.post.PostResponse;
import VibeWave.dto.user.UserResponse;
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
    public UserProfileResponce showUserProfile(@RequestParam String userName){ //todo переделать под pathVariable
        return userProfileService.showUserProfile(userName);
    }

    //todo переделывать
    @GetMapping("/showUserPosts")
    public List<PostResponse> showUserPosts(@RequestParam String userName){
        return userProfileService.showUserPosts(userName);
    }

    @GetMapping("/showSavedPosts")
    public List<PostResponse> showSavedPosts(@RequestParam String userName){
        return userProfileService.showSavedPosts(userName);
    }

    @PutMapping("/changeUserProfile")
    public void changeUserProfile(@RequestParam String description,
                                  @RequestParam MultipartFile file,
                                  @AuthenticationPrincipal UserDto currentUser){
        userProfileService.changeUserAvatarImage(currentUser.getUserId(), file);
        userProfileService.changeUserDescription(description, currentUser.getUserId());
    }

    @PostMapping("/follow/{userName}")
    public void followOnUSer(@PathVariable String userName,
                             @AuthenticationPrincipal UserDto currentUser){
        userProfileService.followOnUser(userName, currentUser.getUserId());
    }

    @GetMapping("/showFollowers/{userName}")
    public List<FollowResponse> showFollowers(@PathVariable String userName){
        return userProfileService.getFollower(userName);
    }

    @GetMapping("/showFollowing/{userName}")
    public List<FollowResponse> showFollowing(@PathVariable String userName){
        return userProfileService.getFollowing(userName);
    }
}

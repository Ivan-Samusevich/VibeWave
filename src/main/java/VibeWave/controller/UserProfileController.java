package VibeWave.controller;


import VibeWave.dto.UserDto;
import VibeWave.dto.UserProfile.UserProfileResponse;
import VibeWave.dto.follow.FollowResponse;
import VibeWave.dto.post.PostResponse;
import VibeWave.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/userProfile")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "https://innovative-determination-production-d7c1.up.railway.app",
        allowCredentials = "true"
)
public class UserProfileController {

    private final UserProfileService userProfileService;


    @GetMapping("/showUserProfile")
    public UserProfileResponse showUserProfile(@RequestParam String userName){ //todo переделать под pathVariable и для id
        return userProfileService.showUserProfile(userName);
    }

    //todo переделывать
    @GetMapping("/showUserPosts")
    public List<PostResponse> showUserPosts(@RequestParam String userName){ //todo переделать под pathVariable и для id
        return userProfileService.showUserPosts(userName);
    }

    @GetMapping("/searchUser/{searchText}")
    public List<UserProfileResponse> searchUser(@PathVariable String searchText){
        return userProfileService.searchUser(searchText);
    }

    @GetMapping("/showSavedPosts")
    public List<PostResponse> showSavedPosts(@RequestParam String userName){ //todo переделать под pathVariable и для id
        return userProfileService.showSavedPosts(userName);
    }

    @PutMapping("/changeUserProfile")
    public void changeUserProfile(@RequestParam String description,
                                  @RequestParam MultipartFile file,
                                  @AuthenticationPrincipal UserDto currentUser){
        userProfileService.changeUserAvatarImage(currentUser.getUserId(), file);
        userProfileService.changeUserDescription(description, currentUser.getUserId());
    }

    @PutMapping("/deleteUser")
    public void deleteUser(@AuthenticationPrincipal UserDto currentUser){
        userProfileService.deleteUser(currentUser.getUserId());
    }

    @PostMapping("/follow/{userName}") //todo переделать для id
    public void followOnUSer(@PathVariable String userName,
                             @AuthenticationPrincipal UserDto currentUser){
        userProfileService.followOnUser(userName, currentUser.getUserId());
    }

    @GetMapping("/showFollowers/{userName}") //todo переделать для id
    public List<FollowResponse> showFollowers(@PathVariable String userName){
        return userProfileService.getFollower(userName);
    }

    @GetMapping("/showFollowing/{userName}") //todo переделать для id
    public List<FollowResponse> showFollowing(@PathVariable String userName){
        return userProfileService.getFollowing(userName);
    }
}

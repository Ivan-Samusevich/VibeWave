package VibeWave.controller;

import VibeWave.dto.CreateCommentDto;
import VibeWave.dto.PostDto;
import VibeWave.dto.UserDto;
import VibeWave.dto.post.PostResponse;
import VibeWave.entity.Post;
import VibeWave.service.HomePageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homePage")
@RequiredArgsConstructor
public class HomePageController {

    private final HomePageService homePageService;

    @PostMapping("/createPost")
    public String createPost(@AuthenticationPrincipal UserDto currentUser,
                             @RequestBody PostDto postDto){
        return homePageService.createPost(currentUser, postDto);
    }

    @GetMapping("/getPosts")
    public List<PostResponse> getPosts(@AuthenticationPrincipal UserDto currentUser){
        return homePageService.getPosts(currentUser);
    }

    @PostMapping("/putLike/{postId}")
    public void putLike(@PathVariable Long postId,
                        @AuthenticationPrincipal UserDto currentUser){
        homePageService.putLike(currentUser, postId);
        homePageService.updatePostLikesCount(postId);
    }

//    @PostMapping("/createComment/{postId}")  //todo получше подумать над путём
//    public String createComment(@AuthenticationPrincipal UserDto currentUser,
//                                @PathVariable Long postId,
//                                @RequestBody CreateCommentDto commentDto){
//        homePageService.createcomment(postId, currentUser.getUserName(), commentDto.getText());
//        return "Comment is create"; //todo потом переделать
//    }
}

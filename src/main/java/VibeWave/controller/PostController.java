package VibeWave.controller;

import VibeWave.dto.UserDto;
import VibeWave.dto.post.PostResponse;
import VibeWave.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/posts")
@RequiredArgsConstructor
public class PostController {
    
    private final PostService postService;

    @PostMapping("/createPost")
    public String createPost(@AuthenticationPrincipal UserDto currentUser,
                             @RequestParam String text,
                             @RequestParam MultipartFile file
    ){
        return postService.createPost(currentUser, text, file);
    }

    @GetMapping("/getPosts")
    public List<PostResponse> getPosts(@AuthenticationPrincipal UserDto currentUser){
        return postService.getPosts(currentUser);
    }

    @DeleteMapping("/deletePost/{postId}")
    public void deletePost(@PathVariable Long postId,
                           @AuthenticationPrincipal UserDto currentUser){
        postService.deletePost(postId, currentUser.getUserId());
    }

    @PostMapping("/toggleLike/{postId}/{likeStatus}")
    public void putLike(@PathVariable Long postId,
                        @PathVariable boolean likeStatus,
                        @AuthenticationPrincipal UserDto currentUser){

        postService.toggleLike(currentUser, postId);
        postService.updatePostLikesCount(postId, likeStatus, currentUser.getUserId());
    }

    @PostMapping("/toggleSavedPost/{postId}/{isSaved}")
    public void putSavePost(@PathVariable Long postId,
                            @PathVariable boolean isSaved,
                            @AuthenticationPrincipal UserDto currentUser){
        postService.toggleSavedPost(currentUser.getUserId(), postId, isSaved);
    }
}

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
@CrossOrigin(
        origins = "https://innovative-determination-production-d7c1.up.railway.app",
        allowCredentials = "true"
)
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

    @PutMapping("/deletePost/{postId}")
    public void deletePost(@PathVariable Long postId,
                           @AuthenticationPrincipal UserDto currentUser){
        postService.deletePost(postId, currentUser.getUserId());
    }

    @PostMapping("/toggleLike/{postId}/{likeStatus}")//todo убрать получение статуса, когда сообщу Вале
    public void putLike(@PathVariable Long postId,
                        @AuthenticationPrincipal UserDto currentUser){

        postService.toggleLike(currentUser.getUserId(), postId);
    }

    @PostMapping("/toggleSavedPost/{postId}/{isSaved}") //todo убрать получение статуса, когда сообщу Вале
    public void putSavePost(@PathVariable Long postId,
                            @AuthenticationPrincipal UserDto currentUser){
        postService.toggleSavedPost(currentUser.getUserId(), postId);
    }
}

package VibeWave.controller;

import VibeWave.dto.CreateCommentDto;
import VibeWave.dto.PostDto;
import VibeWave.dto.UserDto;
import VibeWave.dto.comment.CommentResponse;
import VibeWave.dto.comment.CreateCommentRequest;
import VibeWave.dto.comment.UpdateCommentRequest;
import VibeWave.dto.post.PostResponse;
import VibeWave.entity.Post;
import VibeWave.service.HomePageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/homePage")
@RequiredArgsConstructor
public class HomePageController {

    private final HomePageService homePageService;

    @PostMapping("/createPost")
    public String createPost(@AuthenticationPrincipal UserDto currentUser, //todo добавить сюда файл
                             @RequestParam String text,
                             @RequestParam MultipartFile file
                             ){
        return homePageService.createPost(currentUser, text, file);
    }

    @GetMapping("/getPosts")
    public List<PostResponse> getPosts(@AuthenticationPrincipal UserDto currentUser){
        return homePageService.getPosts(currentUser);
    }

    @DeleteMapping("/deletePost/{postId}")
    public void deletePost(@PathVariable Long postId,
                           @AuthenticationPrincipal UserDto currentUser){
        homePageService.deletePost(postId, currentUser.getUserId());
    }

    @PostMapping("/toggleLike/{postId}/{likeStatus}")
    public void putLike(@PathVariable Long postId,
                        @PathVariable boolean likeStatus,
                        @AuthenticationPrincipal UserDto currentUser){
        System.out.println("Запросик");

        homePageService.toggleLike(currentUser, postId);
        homePageService.updatePostLikesCount(postId, likeStatus, currentUser.getUserId());
    }

    @PostMapping("/toggleSavedPost/{postId}/{isSaved}")
    public void putSavePost(@PathVariable Long postId,
                            @PathVariable boolean isSaved,
                            @AuthenticationPrincipal UserDto currentUser){
        homePageService.toggleSavedPost(currentUser.getUserId(), postId, isSaved);
    }

    @PostMapping("/createComment/{postId}")  //todo получше подумать над путём
    public String createComment(@AuthenticationPrincipal UserDto currentUser,
                                @PathVariable Long postId,
                                @RequestBody CreateCommentRequest commentRequest){
        homePageService.createcomment(postId, currentUser.getUserId(), commentRequest.getText());
        return "Comment is create"; //todo потом переделать
    }

    @GetMapping("/getComments/{postId}")
    public List<CommentResponse> getComments(@PathVariable Long postId){
        return homePageService.getComments(postId);
    }

    @PutMapping("/updateComment/{commentId}")
    public void updateComment(@PathVariable Long commentId,
                              @RequestBody UpdateCommentRequest updateCommentRequest){
        homePageService.updateComment(commentId, updateCommentRequest);
    }

    @DeleteMapping("/deleteComment/{commentId}")
    public void deleteComment(@PathVariable Long commentId){
        homePageService.deleteComment(commentId);
    }
}

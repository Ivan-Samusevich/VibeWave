package VibeWave.controller;

import VibeWave.dto.UserDto;
import VibeWave.dto.comment.CommentResponse;
import VibeWave.dto.comment.CreateCommentRequest;
import VibeWave.dto.comment.UpdateCommentRequest;
import VibeWave.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/comments")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "https://innovative-determination-production-d7c1.up.railway.app",
        allowCredentials = "true"
)
public class CommentController {

    private final CommentService commentService;
    
    @PostMapping("/createComment/{postId}")
    public String createComment(@AuthenticationPrincipal UserDto currentUser,
                                @PathVariable Long postId,
                                @RequestBody CreateCommentRequest commentRequest){
        commentService.createComment(postId, currentUser.getUserId(), commentRequest.getText());
        return "Comment is create"; //todo потом переделать
    }

    @GetMapping("/getComments/{postId}")
    public List<CommentResponse> getComments(@PathVariable Long postId){
        return commentService.getComments(postId);
    }

    @PutMapping("/updateComment/{commentId}")
    public void updateComment(@PathVariable Long commentId,
                              @RequestBody UpdateCommentRequest updateCommentRequest){ // todo переделать id в request не получать из PathVariable
        commentService.updateComment(commentId, updateCommentRequest);
    }

    @DeleteMapping("/deleteComment/{commentId}")
    public void deleteComment(@PathVariable Long commentId){
        commentService.deleteComment(commentId);
    }
}

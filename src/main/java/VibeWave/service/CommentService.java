package VibeWave.service;

import VibeWave.dto.comment.CommentResponse;
import VibeWave.dto.comment.UpdateCommentRequest;
import VibeWave.entity.Comment;
import VibeWave.entity.Post;
import VibeWave.entity.User;
import VibeWave.repository.CommentRepository;
import VibeWave.repository.PostRepository;
import VibeWave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final MinioService minioService;

    @Transactional
    public void createComment(Long postId, Long userId, String text){
        User user = userRepository.findByUserId(userId);
        Post post = postRepository.findByPostId(postId);
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setText(text);
        commentRepository.save(comment);
        postRepository.incrementCommentsCount(postId);
    }

    @Transactional
    public void updateComment(Long commentId, UpdateCommentRequest updateCommentRequest){ //todo перекинуть id в request
        String text = updateCommentRequest.getText();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Комментарий не найден"));
        comment.setText(text);
        commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Комментарий не найден"));
        postRepository.decrementCommentsCount(comment.getPost().getPostId());
        commentRepository.delete(comment);
    }

    public List<CommentResponse> getComments(Long postId){
        Post post = postRepository.findByPostId(postId);
        List<Comment> comments = commentRepository.findAllByPost(post);
        List<CommentResponse> commentResponses = new ArrayList<>();
        for (Comment comment: comments){
            CommentResponse commentResponse = new CommentResponse();
            commentResponse.setCommentId(comment.getCommentId());
            commentResponse.setText(comment.getText());
            commentResponse.setUserName(comment.getUser().getUserName());
            String avatarFileName = comment.getUser().getUserProfile().getAvatarFileName();
            if(avatarFileName != null) {
                commentResponse.setAvatarURL(minioService.getFileURL(avatarFileName));
            }
            commentResponse.setCreatedAt(comment.getCreatedAt());
            commentResponses.add(commentResponse);
        }

        return commentResponses;
    }
}

package VibeWave.service;

import VibeWave.dto.comment.CommentResponse;
import VibeWave.dto.comment.UpdateCommentRequest;
import VibeWave.entity.Comment;
import VibeWave.repository.CommentRepository;
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

    @Transactional
    public void createcomment(Long postId, Long userId, String text){
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setText(text);
        commentRepository.save(comment);
    }

    //todo сделать функцию для получения всех комментиариев. Особенность в том, что мой коммент должен быть всегда вверху.
    //todo Надо сделать количество комментариев к посту(Пока что под вопросом).

    @Transactional
    public void updateComment(Long commentId, UpdateCommentRequest updateCommentRequest){
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
        commentRepository.delete(comment);
    }

    public List<CommentResponse> getComments(Long postId){ //todo Добавить передачу аватарок на фронт
        List<Comment> comments = commentRepository.findAllByPostId(postId);
        List<CommentResponse> commentResponses = new ArrayList<>();
        for (Comment comment: comments){
            CommentResponse commentResponse = new CommentResponse();
            commentResponse.setCommentId(comment.getCommentId());
            commentResponse.setText(comment.getText());
            commentResponse.setUserName(userRepository.getUsernameById(comment.getUserId()));
            commentResponses.add(commentResponse);
        }

        return commentResponses;
    }
}

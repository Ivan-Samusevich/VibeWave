package VibeWave.service;

import VibeWave.dto.PostDto;
import VibeWave.dto.UserDto;
import VibeWave.dto.comment.CommentResponse;
import VibeWave.dto.comment.UpdateCommentRequest;
import VibeWave.dto.post.PostResponse;
import VibeWave.entity.*;
import VibeWave.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HomePageService {

    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final MinioService minioService;
    private final UserProfileRepository userProfileRepository;
    private final SavedPostRepository savedPostRepository;

    @Transactional
    public String createPost(UserDto currentUser, String text, MultipartFile file){
        String answer = "Проверьте введённые данные";
        if(checkPostData(text));
        {
            Post post = new Post();
            post.setUserId(currentUser.getUserId());
            post.setText(text);
            post.setLikesCount(0L);
            postRepository.save(post);
            answer = "Пост создан";
            String fileName = minioService.uploadFileFromPost(file, post.getPostId());
            post.setFileName(fileName);
            postRepository.save(post);
        }
        userProfileRepository.incrementPostCount(currentUser.getUserId());
        return answer;

    }

    private boolean checkPostData(String text) {
        boolean answer = true;
        if(text.isEmpty()){
            answer = false;
        }
        return answer;
    }

    public List<PostResponse> getPosts(UserDto currentUser){ //todo посмотреть тут списки.
        List<Post> posts = postRepository.findAll();
        List<PostResponse> postResponses = new java.util.ArrayList<>(List.of());
        for(Post post : posts){
            PostResponse postResponse = new PostResponse();
            postResponse.setId(post.getPostId());
            postResponse.setUserName(userRepository.getUsernameById(post.getUserId()));
            postResponse.setAvatarURL(userProfileRepository.findAvatarFileNameByUserProfileId(post.getUserId()));
            postResponse.setText(post.getText());
            postResponse.setLikesCount(post.getLikesCount());

            boolean likeStatus = likeRepository.existsByUserIdAndPostId(currentUser.getUserId(), post.getPostId());
            postResponse.setLikeStatus(likeStatus);

            boolean isSaved = savedPostRepository.existsByUserIdAndPostId(currentUser.getUserId(), post.getPostId());
            postResponse.setSaved(isSaved);
            postResponse.setImageURL(minioService.getFileURL(post.getFileName()));
            postResponse.setFileType(fileTypeDetect(post.getFileName()));
            //System.out.println(postResponse.getFileType());
            postResponses.add(postResponse);
        }
        return postResponses;
    }//todo здесь переделать id на имя

    @Transactional
    public void deletePost(Long postId, Long userId){ //todo добавить удаление файла из хранилища
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));
        minioService.deleteFileFromMinio(post.getFileName());
        postRepository.delete(post);
        userProfileRepository.decrementPostCount(userId);
    }

    @Transactional
    public void toggleSavedPost(Long userId, Long postId, boolean isSaved){
        if(!isSaved){
            SavedPost savedPost = new SavedPost();
            savedPost.setUserId(userId);
            savedPost.setPostId(postId);
            savedPostRepository.save(savedPost);
        } else {
          savedPostRepository.deleteByUserIdAndPostId(userId, postId);
        }
    }

    private String fileTypeDetect(String fileName){
        if(fileName.endsWith(".mp4")){
            return "video";
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".png")){
            return "image";
        }
        else {
            return "Тип файла не определён";
        }
    }

    @Transactional
    public void toggleLike(UserDto currentUser, Long postId){
        //todo разобраться с тем, как сделать так, чтобы отображался статус лайка(Есть он или нет)
        Like like = new Like();
        like.setUserId(currentUser.getUserId());

        like.setPostId(postId);

        likeRepository.save(like);

        System.out.println("Лайк поставлен");
    }

    @Transactional
    public void updatePostLikesCount(Long postId, boolean likeStatus, Long userId){
        // Одна операция в БД, без загрузки поста в память
        if(likeStatus) {
            postRepository.incrementLikesCount(postId);
            System.out.println("Счётчик увеличен");
        }
        else{
            postRepository.decrementLikesCount(postId);
            likeRepository.deleteByUserIdAndPostId(userId, postId);
            System.out.println("Счётчик уменьшен");
        }
    }

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

    public List<CommentResponse> getComments(Long postId){
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

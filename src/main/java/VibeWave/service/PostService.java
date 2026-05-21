package VibeWave.service;

import VibeWave.dto.UserDto;
import VibeWave.dto.post.PostResponse;
import VibeWave.entity.Like;
import VibeWave.entity.Post;
import VibeWave.entity.SavedPost;
import VibeWave.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final MinioService minioService;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
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
            String avatarName = userProfileRepository.findAvatarFileNameByUserProfileId(post.getUserId());
            postResponse.setAvatarURL(minioService.getFileURL(avatarName));
            postResponse.setText(post.getText());
            postResponse.setLikesCount(post.getLikesCount());

            boolean likeStatus = likeRepository.existsByUserIdAndPostId(currentUser.getUserId(), post.getPostId());
            postResponse.setLikeStatus(likeStatus);

            boolean isSaved = savedPostRepository.existsByUserIdAndPostId(currentUser.getUserId(), post.getPostId());
            postResponse.setSaved(isSaved);
            postResponse.setImageURL(minioService.getFileURL(post.getFileName()));
            postResponse.setFileType(fileTypeDetect(post.getFileName()));
            postResponses.add(postResponse);
        }
        return postResponses;
    }//todo здесь переделать id на имя

    @Transactional
    public void deletePost(Long postId, Long userId){
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Пост не найден"));
        minioService.deleteFileFromMinio(post.getFileName());
        postRepository.delete(post);
        userProfileRepository.decrementPostCount(userId);
    }

    @Transactional
    public void toggleSavedPost(Long userId, Long postId, boolean isSaved){
        if(isSaved){
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
    }

    @Transactional
    public void updatePostLikesCount(Long postId, boolean likeStatus, Long userId){
        // Одна операция в БД, без загрузки поста в память
        if(likeStatus) {
            postRepository.incrementLikesCount(postId);
        }
        else{
            postRepository.decrementLikesCount(postId);
            likeRepository.deleteByUserIdAndPostId(userId, postId);
        }
    }
}

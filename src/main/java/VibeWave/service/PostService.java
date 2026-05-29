package VibeWave.service;

import VibeWave.dto.UserDto;
import VibeWave.dto.post.PostResponse;
import VibeWave.entity.Like;
import VibeWave.entity.Post;
import VibeWave.entity.SavedPost;
import VibeWave.entity.User;
import VibeWave.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

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
        User user = userRepository.findByUserId(currentUser.getUserId());
        if(checkPostData(text))
        {
            Post post = new Post();
            post.setUser(user);
            post.setText(text);
            post.setLikesCount(0L);
            post.setCommentsCount(0L);
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

    public List<PostResponse> getPosts(UserDto currentUser){
        List<Post> posts = postRepository.findAllPosts();
        List<PostResponse> postResponses = new ArrayList<>();
        Set<Long> likedPosts = likeRepository.findLikedPostIds(currentUser.getUserId());
        Set<Long> savedPosts = savedPostRepository.findSavedPostIds(currentUser.getUserId());
        for(Post post : posts){
            PostResponse postResponse = new PostResponse();
            postResponse.setId(post.getPostId());
            postResponse.setUserName(post.getUser().getUserName());
            String avatarFileName = post.getUser().getUserProfile().getAvatarFileName();
            if(avatarFileName != null) {
                postResponse.setAvatarURL(minioService.getFileURL(avatarFileName));
            }
            postResponse.setText(post.getText());
            postResponse.setLikesCount(post.getLikesCount());
            postResponse.setCommentsCount(post.getCommentsCount());

            postResponse.setLiked(likedPosts.contains(post.getPostId()));//todo напомнить Вале про то, что надо в его коде поменять на Liked


            postResponse.setSaved(savedPosts.contains(post.getPostId()));
            postResponse.setImageURL(minioService.getFileURL(post.getFileName()));
            postResponse.setFileType(fileTypeDetect(post.getFileName()));
            postResponse.setScore(post.getLikesCount() * 2 + post.getCommentsCount() * 5); // Лайк - 2 очка, комментарий - 4 очка
            postResponses.add(postResponse);
        }
        postResponses.sort(Comparator.comparing(PostResponse::getScore).reversed());
        return postResponses;
    }

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
            //todo разобраться с тем, как сделать так, чтобы отображался статус сохранения(Есть он или нет)

            User user = userRepository.findByUserId(userId);
            savedPost.setUser(user);

            Post post = postRepository.findByPostId(postId);
            savedPost.setPost(post);
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

        User user = userRepository.findByUserId(currentUser.getUserId());
        like.setUser(user);

        Post post = postRepository.findByPostId(postId);
        like.setPost(post);

        likeRepository.save(like);
    }

    @Transactional
    public void updatePostLikesCount(Long postId, boolean likeStatus, Long userId){
        // todo потом переделать так, чтобы бэк сам проверял наличие лайка
        if(likeStatus) {
            postRepository.incrementLikesCount(postId);
        }
        else{
            postRepository.decrementLikesCount(postId);
            likeRepository.deleteByUserIdAndPostId(userId, postId);
        }
    }
}

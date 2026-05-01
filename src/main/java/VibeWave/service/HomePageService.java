package VibeWave.service;

import VibeWave.dto.PostDto;
import VibeWave.dto.UserDto;
import VibeWave.dto.post.PostResponse;
import VibeWave.entity.Comment;
import VibeWave.entity.Like;
import VibeWave.entity.Post;
import VibeWave.repository.CommentRepository;
import VibeWave.repository.LikeRepository;
import VibeWave.repository.PostRepository;
import VibeWave.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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

    @Transactional
    public String createPost(UserDto currentUser, PostDto postDto){
        String answer = "Проверьте введённые данные";
        if(checkPostData(postDto));
        {
            Post post = new Post();
            //String fileName = minioService.uploadFileFromPost(file, post.getPostId());
            post.setUserId(currentUser.getUserId());
            post.setFileName("Кратос.png"); //todo временная мера
            //System.out.println("Тут ошибка");
            post.setText(postDto.getText());
            post.setLikesCount(0L);
            postRepository.save(post);
            answer = "Пост создан";
        }
        return answer;

    }

    private boolean checkPostData(PostDto postDto) {
        boolean answer = true;
        if(postDto.getText().isEmpty()){
            answer = false;
        }
        return answer;
    }

    public List<PostResponse> getPosts(UserDto currentUser){ //todo посмотреть тут списки.
        List<Post> posts = postRepository.findAll();
        List<PostResponse> postResponses = new java.util.ArrayList<>(List.of());
        for(Post post : posts){
            PostResponse postResponse = new PostResponse();
            //todo создать репозиторий для поиска имени по id
            postResponse.setId(post.getPostId());
            postResponse.setUserName(userRepository.getUsernameById(post.getUserId()));
            postResponse.setText(post.getText());
            postResponse.setLikesCount(post.getLikesCount());

            boolean likeStatus = likeRepository.existsByUserIdAndPostId(currentUser.getUserId(), post.getPostId());
            postResponse.setLikeStatus(likeStatus);
            postResponses.add(postResponse);
            System.out.println(likeStatus);
            System.out.println(userRepository.getUsernameById(post.getUserId()));
            //postResponse.setImageURL(minioService.getFileURL(post.getFileName()));
            System.out.println(post.getFileName());
            System.out.println(minioService.getFileURL(post.getFileName()));
        }
        return postResponses;
    }//todo здесь переделать id на имя

    @Transactional
    public void toggleLike(UserDto currentUser, Long postId){
        //todo разобраться с тем, как сделать так, чтобы отображался статус лайка(Есть он или нет)
        Like like = new Like();
        System.out.println("Запрос прилетел 1");
        like.setUserId(currentUser.getUserId());
        System.out.println("Запрос прилетел 2");

        like.setPostId(postId);
        System.out.println("Запрос прилетел 3");

        likeRepository.save(like);
        System.out.println("Запрос прилетел 4");

        System.out.println("Лайк поставлен");
    }

    @Transactional
    public void updatePostLikesCount(Long postId, boolean likeStatus){
        // Одна операция в БД, без загрузки поста в память
        if(likeStatus) {
            postRepository.incrementLikesCount(postId);
            System.out.println("Счётчик увеличен");
        }
        else{
            postRepository.decrementLikesCount(postId);
            System.out.println("Счётчик уменьшен");
        }
    }

    @Transactional
    public void createcomment(Long postId, String userName, String text){
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserName(userName);
        comment.setText(text);
        commentRepository.save(comment);
    }

    //todo сделать функцию для получения всех комментиариев. Особенность в том, что мой коммент должен быть всегда вверху.
    //todo Надо сделать количество комментариев к посту(Пока что под вопросом).
}

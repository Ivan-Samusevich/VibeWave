package VibeWave.service;

import VibeWave.dto.PostDto;
import VibeWave.dto.UserDto;
import VibeWave.entity.Like;
import VibeWave.entity.Post;
import VibeWave.repository.LikeRepository;
import VibeWave.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HomePageService {

    private final PostRepository postRepository;
    private final LikeRepository likeRepository;

    @Transactional
    public String createPost(UserDto currentUser, PostDto postDto){
        String answer = "Проверьте введённые данные";
        if(checkPostData(postDto));
        {
            Post post = new Post();
            post.setUserId(currentUser.getUserId());
            post.setText(postDto.getText());
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

    public List<Post> getPosts(){
        return postRepository.findAll();
    }

    @Transactional
    public void putLike(UserDto currentUser, Long postId){
        //todo разобраться с тем, как сделать так, чтобы отображался статус лайка(Есть он или нет)
        Like like = new Like();
        like.setUserId(currentUser.getUserId());
        like.setPostId(postId);
        likeRepository.save(like);
    }

    @Transactional
    public void updatePostLikesCount(Long postId){
        // Одна операция в БД, без загрузки поста в память
        postRepository.incrementLikesCount(postId);
    }
}

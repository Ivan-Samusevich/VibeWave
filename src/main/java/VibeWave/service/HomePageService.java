package VibeWave.service;

import VibeWave.dto.PostDto;
import VibeWave.dto.UserDto;
import VibeWave.entity.Post;
import VibeWave.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomePageService {

    private final PostRepository postRepository;

    @Transactional
    public String createPost(UserDto currentUser, PostDto postDto){
        String answer = "Проверьте введённые данные";
        if(checkPostData(postDto));
        {
            Post post = new Post(currentUser.getUserId(), postDto.getText(), postDto.getLocation());
            postRepository.save(post);
            answer = "Пост создан";
        }
        return answer;

    }

    private boolean checkPostData(PostDto postDto) {
        boolean answer = true;
        if(postDto.getText().isEmpty() || postDto.getLocation().isEmpty()){
            answer = false;
        }
        return answer;
    }

    public List<Post> getPosts(){
        return postRepository.findAll();
    }

    public void putLike(){

    }
}

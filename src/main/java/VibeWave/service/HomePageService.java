package VibeWave.service;

import VibeWave.entity.Post;
import VibeWave.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomePageService {

    private final PostRepository postRepository;
//    //todo Id пользователя брать из jwt?
//    public String createPost(Post post){
//        checkPostData(post);
//    }

//    private boolean checkPostData(Post post) {
//        boolean answer = true;
//
//
//    }
}

package VibeWave.controller;

import VibeWave.dto.PostDto;
import VibeWave.dto.UserDto;
import VibeWave.entity.Post;
import VibeWave.service.HomePageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homePage")
@RequiredArgsConstructor
public class HomePageController {

    private final HomePageService homePageService;

    @PostMapping("/createPost")
    public String createPost(@AuthenticationPrincipal UserDto currentUser,
                             @RequestBody PostDto postDto){
        return homePageService.createPost(currentUser, postDto);
    }

    @GetMapping("/getPosts")
    public List<Post> getPosts(){
        return homePageService.getPosts();
    }
}

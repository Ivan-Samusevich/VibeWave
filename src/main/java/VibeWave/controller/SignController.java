package VibeWave.controller;

import VibeWave.entity.User;
import VibeWave.service.SignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/users")
public class SignController {
    private final SignService signService;

    @Autowired
    public SignController(SignService signService){this.signService = signService;}

    @PostMapping("/signin")
    public String signIn(@RequestBody User user){return signService.signIn(user);}

    @PostMapping("/signup")
    public String signUp(@RequestBody User user){return signService.signUp(user);}
}

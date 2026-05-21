package VibeWave.controller;

import VibeWave.entity.User;
import VibeWave.service.SignService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/users")
public class SignController {
    private final SignService signService;

    public SignController(SignService signService){this.signService = signService;}

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody User user){return signService.signIn(user);}

    @PostMapping("/signup")
    public String signUp(@RequestBody User user){return signService.signUp(user);}
}

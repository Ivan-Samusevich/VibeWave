package VibeWave.service.Impl;

import VibeWave.entity.User;
import org.springframework.http.ResponseEntity;

public interface SignImpl {

    public String signUp(User user);

    public ResponseEntity<?> signIn(User user);
}

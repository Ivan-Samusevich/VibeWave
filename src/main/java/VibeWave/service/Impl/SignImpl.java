package VibeWave.service.Impl;

import VibeWave.dto.SignResult;
import VibeWave.entity.User;

public interface SignImpl {

    public String signUp(User user);

    public SignResult signIn(User user);
}

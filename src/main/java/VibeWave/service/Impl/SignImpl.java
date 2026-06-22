package VibeWave.service.Impl;

import VibeWave.dto.SignResult;
import VibeWave.dto.user.UserRequest;
import VibeWave.entity.User;

public interface SignImpl {

    public String signUp(User user);

    public SignResult signIn(UserRequest request);
}

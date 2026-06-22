package VibeWave.service;

import VibeWave.config.JwtTokenUtil;
import VibeWave.dto.AuthResponse;
import VibeWave.dto.SignResult;
import VibeWave.dto.UserDto;
import VibeWave.dto.user.UserRequest;
import VibeWave.entity.User;
import VibeWave.entity.UserProfile;
import VibeWave.exception.DublicateException;
import VibeWave.exception.ValidationException;
import VibeWave.repository.UserProfileRepository;
import VibeWave.repository.UserRepository;
import VibeWave.service.Impl.SignImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SignService implements SignImpl {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder encoder;
    private final JwtTokenUtil jwtTokenUtil;

    public SignResult signIn(UserRequest request){
        checkSignIn(request);

        User user = userRepository.findByEmail(request.getEmail());
        UserDto userDto = new UserDto(user.getUserId(), user.getUserName());

        String accessToken = jwtTokenUtil.generateAccessToken(userDto);
        String refreshToken = jwtTokenUtil.generateRefreshToken(userDto);
        AuthResponse authResponse = new AuthResponse();
        authResponse.setUserId(userDto.getUserId());
        authResponse.setUserName(user.getUserName());
        authResponse.setAccessToken(accessToken);
        SignResult result = new SignResult();
        result.setAuthResponse(authResponse);
        result.setRefreshToken(refreshToken);
        return result;
    }

    private void checkSignIn(UserRequest request) {
        if(request.getEmail() == null || request.getPassword() == null) {
            throw new ValidationException("Вы не ввели почту или пароль", "Password_OR_Email_Empty");
        }
        if(!userRepository.existsByEmail(request.getEmail())){
            throw new ValidationException("Пользователя с такой почтой не существует", "Uncorrect_Email");
        }
        if(!isPasswordCorrect(request)){
            throw new ValidationException("Неверный пароль", "Uncorrect_Password");
        }
    }

    private boolean isPasswordCorrect(UserRequest request){
        User userInTable = userRepository.findByEmail(request.getEmail());
        return encoder.matches(request.getPassword(), userInTable.getPassword());
    }

    @Override
    public String signUp(User user){
        checkSignUp(user);
        createUser(user);
        return "Регистрация прошла успешно";
    }

    private void checkSignUp(User user){
        if(user.getUserName() == null){
            throw new ValidationException("Введите имя пользователя", "Name_Is_Empty");
        }

        if(user.getEmail() == null){
            throw new ValidationException("Введите почту", "Email_Is_Empty");
        }

        if(userRepository.existsByEmail(user.getEmail())){
            throw new DublicateException("Пользователь с такой почтой уже существует", "Email_Is_Not_Free");
        }

        if(user.getPassword() == null){
            throw new ValidationException("Введите пароль", "Password_Is_Empty");
        }

        if(user.getPassword().length() < 8){
            throw new ValidationException("Длина пароля не менее 8 символов", "Short_Password")  ;
        }
    }


    private void createUser(User user){
        user.setPassword(hashPassword(user.getPassword()));
        userRepository.save(user);
        createUserProfile(user.getUserId());
    }

    private String hashPassword(String password){
        return encoder.encode(password);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    private void createUserProfile(Long id){
        UserProfile userProfile = new UserProfile();
        userProfile.setUserProfileId(id);
        userProfileRepository.save(userProfile);
    }

    public AuthResponse refresh(String refreshToken){
        if(!jwtTokenUtil.isRefreshToken(refreshToken)){
            throw new RuntimeException("Это не refreshToken");
        }
        AuthResponse authResponse = new AuthResponse();
        Long userId = jwtTokenUtil.getUserIdFromToken(refreshToken);
        String userName = jwtTokenUtil.getUserNameFromToken(refreshToken);
        String accessToken = jwtTokenUtil.generateAccessTokenFromRefreshToken(refreshToken);
        authResponse.setUserId(userId);
        authResponse.setUserName(userName);
        authResponse.setAccessToken(accessToken);
        return authResponse;
    }
}

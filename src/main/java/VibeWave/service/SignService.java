package VibeWave.service;

import VibeWave.config.JwtTokenUtil;
import VibeWave.dto.UserDto;
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
    //todo добавить access и refresh jwt
    //todo передлать аннотации транзакций
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder encoder;
    private final JwtTokenUtil jwtTokenUtil;

    public ResponseEntity<?> signIn(User user){
        checkSignIn(user);

        user = userRepository.findByEmail(user.getEmail());
        UserDto userDto = new UserDto(user.getUserId(), user.getUserName());

        String jwt = jwtTokenUtil.generateAccessToken(userDto);

        Map<String, String> response = new HashMap<>(); //todo Надо создать UserResponce, в котором будут храниться 2 токена. Этот объект потом передать на фронт
        response.put("accessToken", jwt);
        response.put("tokenType", "Bearer ");
        return ResponseEntity.ok(response); //todo На фронте пока получает строку
    }

    private void checkSignIn(User user) {
        if(user.getEmail() == null || user.getPassword() == null) {
            throw new ValidationException("Вы не ввели почту или пароль", "Password_OR_Email_Empty");
        }
        if(!userRepository.existsByEmail(user.getEmail())){
            throw new ValidationException("Пользователя с такой почтой не существует", "Uncorrect_Email");
        }
        if(!isPasswordCorrect(user)){
            throw new ValidationException("Неверный пароль", "Uncorrect_Password");
        }
    }

    private boolean isPasswordCorrect(User user){
        User userInTable = userRepository.findByEmail(user.getEmail());
        return encoder.matches(user.getPassword(), userInTable.getPassword());
    }

    @Override
    public String signUp(User user){
        checkSignUp(user);
        createUser(user);
        //todo добавить генерацию jwt
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


}

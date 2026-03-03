package VibeWave.service;

import VibeWave.entity.User;
import VibeWave.entity.UserProfile;
import VibeWave.exception.DublicateException;
import VibeWave.exception.ValidationException;
import VibeWave.repository.UserProfileRepository;
import VibeWave.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class SignService {
    //todo добавить jwt
    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository; //todo Может можно не создавать с сасого начала, а только при исползовании
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    //todo узнать, как вернуть exception пользователя, а не в консоль

    public SignService(UserRepository userRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public String signIn(User user){
        checkSignIn(user);
        return "Авторизация прошла успешно";
    }

    private void checkSignIn(User user) {
        if(user.getEmail() == null || user.getPassword() == null) {
            throw new ValidationException("Вы не ввели почту или пароль");
        }
        if(!userRepository.existsByEmail(user.getEmail())){
            throw new ValidationException("Пользователя с такой почтой не существует");
        }
        if(!isPasswordCorrect(user)){
            throw new ValidationException("Неверный пароль");
        }
    }

    private boolean isPasswordCorrect(User user){
        User userInTable = userRepository.findByEmail(user.getEmail());
        return encoder.matches(user.getPassword(), userInTable.getPassword());
    }

    public String signUp(User user){
        checkSignUp(user);
        createUser(user);
        return "Регистрация прошла успешно";
    }

    private void checkSignUp(User user){
        if(user.getUserName() == null){
            throw new ValidationException("Введите имя пользователя");
        }

        if(user.getEmail() == null){
            throw new ValidationException("Введите почту");
        }

        if(userRepository.existsByEmail(user.getEmail())){
            throw new DublicateException("Пользователь с такой почтой уже существует");
        }

        if(user.getPassword() == null){
            throw new ValidationException("Введите пароль");
        }

        if(user.getPassword().length() < 8){
            throw new ValidationException("Длина пароля не менее 8 символов")  ;
        }
    }

    @Transactional
    private void createUser(User user){
        user.setPassword(hashPassword(user.getPassword()));
        userRepository.save(user);
        createUserProfile(user.getUserId());
    }

    private String hashPassword(String password){
        return encoder.encode(password);
    }

    @Transactional
    private void createUserProfile(int id){

        UserProfile userProfile = new UserProfile();
        userProfile.setUserProfileId(id);
        userProfileRepository.save(userProfile);
    }
}

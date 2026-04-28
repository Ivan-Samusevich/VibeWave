package VibeWave.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
// todo Это будет вместо аннотации сверху @AllArgsConstructor
public class UserDto {
    private Long userId;
    private String userName;

    public UserDto(Long userId, String userName) {
        this.userId = userId;
        this.userName = userName;
    }
}

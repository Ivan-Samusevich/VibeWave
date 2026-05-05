package VibeWave.dto.UserProfile;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UserProfileResponce {

    private String userName;
    private Long postCount;
    private Long followerCount;
    private Long followingCount;
}

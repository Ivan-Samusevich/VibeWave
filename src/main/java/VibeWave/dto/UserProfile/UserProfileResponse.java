package VibeWave.dto.UserProfile;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
public class UserProfileResponse {

    private String userName;
    private String fileURL;
    private String description;
    private Long postCount;
    private Long followerCount;
    private Long followingCount;
    private LocalDateTime createdAt;
}

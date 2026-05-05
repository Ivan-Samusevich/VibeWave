package VibeWave.dto.UserProfile;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UpdateUserProfileRequest {

    private String description;
}

package VibeWave.dto.follow;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class FollowResponse {
    private String userName;
    private String fileURL;
}

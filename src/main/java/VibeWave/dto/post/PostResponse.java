package VibeWave.dto.post;

import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@RequiredArgsConstructor
public class PostResponse {
    private Long id;
    private String userName;
    private String text;
    private Long likesCount;
    private boolean likeStatus;
}

package VibeWave.dto.post;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@RequiredArgsConstructor
public class PostResponse {
    private Long id;
    private String userName;
    private String text;
    private Long likesCount;
    private boolean likeStatus;
    private String imageURL;
    private String fileType;
}

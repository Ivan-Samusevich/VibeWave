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
    private String avatarURL;
    private String text;
    private Long likesCount;
    private Long commentsCount;
    private boolean isLiked;
    private boolean isSaved;
    private Long score;
    private String imageURL;
    private String fileType;
}

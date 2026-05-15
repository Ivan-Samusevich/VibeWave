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
    private boolean likeStatus; // todo потом переделать проект под isLiked
    private boolean isSaved;
    private String imageURL;
    private String fileType;
}

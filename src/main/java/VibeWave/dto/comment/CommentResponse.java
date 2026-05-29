package VibeWave.dto.comment;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class CommentResponse {

    private Long commentId;
    private String userName;
    private String avatarURL;
    private String text;
}

package VibeWave.dto.comment;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class UpdateCommentRequest {
    private String text;
}

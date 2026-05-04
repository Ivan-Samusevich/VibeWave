package VibeWave.dto.comment;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class CreateCommentRequest {

    private String text;
}

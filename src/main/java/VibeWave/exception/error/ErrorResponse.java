package VibeWave.exception.error;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponse {

    private String message;
    private String code;

    public ErrorResponse(String message, String errorCode) {
        this.message = message;
        this.code = errorCode;
    }
}

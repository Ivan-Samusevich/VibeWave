package VibeWave.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ValidationException extends ApplicationException {

    private final String errorCode;

    public ValidationException(String message, String errorCode){
        super(message, "Validation Error", HttpStatus.BAD_REQUEST);
        this.errorCode = errorCode;
    }


}

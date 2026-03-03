package VibeWave.exception;

import org.springframework.http.HttpStatus;

public class ValidationException extends ApplicationException {
    public ValidationException(String message){
        super(message, "Validation Error", HttpStatus.BAD_REQUEST);
    }


}

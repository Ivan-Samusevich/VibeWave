package VibeWave.exception.handler;

import VibeWave.exception.DublicateException;
import VibeWave.exception.ValidationException;
import VibeWave.exception.error.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler extends RuntimeException {

    @ExceptionHandler(ValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex){
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                ex.getErrorCode()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DublicateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ResponseEntity<ErrorResponse> handleDublicateException(DublicateException ex){
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                ex.getErrorCode()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

}

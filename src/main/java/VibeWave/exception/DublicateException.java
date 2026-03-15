package VibeWave.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;


@Getter
public class DublicateException extends ApplicationException {

    private final String errorCode;

    public DublicateException(String message, String errorCode) {
      super(message, "Dublicate Error", HttpStatus.CONFLICT);
      this.errorCode = errorCode;
  }
}

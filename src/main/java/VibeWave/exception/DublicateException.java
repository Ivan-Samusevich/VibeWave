package VibeWave.exception;

import org.springframework.http.HttpStatus;

public class DublicateException extends ApplicationException {
    public DublicateException(String message) {
      super(message, "Dublicate Error", HttpStatus.CONFLICT);
  }
}

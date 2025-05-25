package com.thiagoamorimm.takeatask.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("Conflito ao processar %s. Já existe um recurso com %s : '%s'", resourceName, fieldName,
                fieldValue));
    }
}

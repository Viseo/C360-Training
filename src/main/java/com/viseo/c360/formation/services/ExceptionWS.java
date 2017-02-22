package com.viseo.c360.formation.services;


import com.viseo.c360.formation.exceptions.C360Exception;
import com.viseo.c360.formation.exceptions.dao.TrainingSessionException;
import com.viseo.c360.formation.exceptions.dao.UniqueFieldException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.servlet.http.HttpServletRequest;


@ControllerAdvice
public class ExceptionWS {

    @ExceptionHandler({TrainingSessionException.class, UniqueFieldException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorResponse handleMessagingException(HttpServletRequest req, C360Exception ex) {
        ErrorResponse error = new ErrorResponse();
        error.message = ex.getMessage();
        return error;
    }

    class ErrorResponse {
        public String message;
    }
}


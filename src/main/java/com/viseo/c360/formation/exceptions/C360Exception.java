package com.viseo.c360.formation.exceptions;

public class C360Exception extends RuntimeException{

    public C360Exception() {
    }

    public C360Exception(String message) {
        super(message);
    }

    public C360Exception(String message, Throwable cause) {
        super(message, cause);
    }

    public C360Exception(Throwable cause) {
        super(cause);
    }

}

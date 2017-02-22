package com.viseo.c360.formation.exceptions.dao;

import com.viseo.c360.formation.exceptions.C360Exception;

public class UniqueFieldException extends C360Exception{

    public UniqueFieldException() {
    }

    public UniqueFieldException(String field) {
        super(field);
    }
}

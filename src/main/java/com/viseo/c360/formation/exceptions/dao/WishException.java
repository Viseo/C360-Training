package com.viseo.c360.formation.exceptions.dao;

import com.viseo.c360.formation.exceptions.C360Exception;

public class WishException  extends C360Exception{
    public WishException(){

    }

    public WishException(String message) {
        super(message);
    }
}

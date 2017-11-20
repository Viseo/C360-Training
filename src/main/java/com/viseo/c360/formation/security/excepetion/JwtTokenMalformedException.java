package com.viseo.c360.formation.security.excepetion;


import org.springframework.security.core.AuthenticationException;

/**
 * Created by YGU3747 on 10/11/2017
 */

public class JwtTokenMalformedException extends AuthenticationException {

    public JwtTokenMalformedException(String msg){
        super(msg);
    }
}

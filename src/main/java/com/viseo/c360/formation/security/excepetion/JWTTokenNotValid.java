package com.viseo.c360.formation.security.excepetion;

import org.springframework.security.core.AuthenticationException;

/**
 * Created by YGU3747 on 19/12/2017
 */

public class JWTTokenNotValid extends AuthenticationException {
    public JWTTokenNotValid(String msg) {
        super(msg);
    }
}

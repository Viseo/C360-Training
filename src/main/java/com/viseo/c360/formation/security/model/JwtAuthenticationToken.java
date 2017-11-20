package com.viseo.c360.formation.security.model;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

/**
 * Holder for JWT token from the request.
 * <p/>
 * Other fields aren't used but necessary to comply to the contracts of AbstractUserDetailsAuthenticationProvider
 *
 * Created by YGU3747 on 10/11/2017
 */

public class JwtAuthenticationToken extends UsernamePasswordAuthenticationToken{

    private String token;

    public JwtAuthenticationToken(String token) {
        super(null, null);
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    @Override
    public Object getCredentials(){
        return null;
    }

    @Override
    public Object getPrincipal(){
        return null;
    }
}

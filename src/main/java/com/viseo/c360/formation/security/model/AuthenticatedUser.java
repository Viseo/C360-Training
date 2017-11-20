package com.viseo.c360.formation.security.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 * Holds the info for a authenticated user (Principal)
 * Created by YGU3747 on 10/11/2017
 */

public class AuthenticatedUser implements UserDetails{

    private final Long id;
    private final String email;
    private final String token;
    private final Collection<? extends GrantedAuthority> authorities;

    public AuthenticatedUser(Long id, String email, String token, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.token = token;
        this.authorities = authorities;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getToken() {
        return token;
    }

    @JsonIgnore
    public Long getId() {
        return this.id;
    }
}

package com.viseo.c360.formation.security;

import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.security.excepetion.JwtTokenMalformedException;
import com.viseo.c360.formation.security.model.AuthenticatedUser;
import com.viseo.c360.formation.security.model.JwtAuthenticationToken;
import com.viseo.c360.formation.security.util.JwtTokenValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Used for checking the token from the request and supply the UserDetails if the token is valid
 *
 * Created by YGU3747 on 10/11/2017
 */

@Component
public class JwtAuthenticationProvider extends AbstractUserDetailsAuthenticationProvider {

    @Autowired
    private JwtTokenValidator jwtTokenValidator;

    @Override
    public boolean supports(Class<?> authentication) {
        return (JwtAuthenticationToken.class.isAssignableFrom(authentication));
    }

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {

    }

    @Override
    protected UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
        String token = jwtAuthenticationToken.getToken();

        CollaboratorDescription parsedCollaborator = jwtTokenValidator.parseToken(token);

        if(parsedCollaborator == null){
            throw new JwtTokenMalformedException("JWT token is not valid");
        }

        List<GrantedAuthority> authorityList = AuthorityUtils.commaSeparatedStringToAuthorityList(parsedCollaborator.getIsAdmin().toString());

        return new AuthenticatedUser(parsedCollaborator.getId(), parsedCollaborator.getEmail(), token, authorityList);
    }
}

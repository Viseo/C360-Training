package com.viseo.c360.formation.security.util;

import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Class validates a given token by using the secret configured in the application
 *
 * Created by YGU3747 on 10/11/2017
 */

@Component
public class JwtTokenValidator {



    @Value("${jwt.secret}")
    private String secret;


    /**
     * Tries to parse specified String as a JWT token. If successful, returns User object with username, id and role prefilled (extracted from token).
     * If unsuccessful (token is invalid or not containing all required user properties), simply returns null.
     *
     * @param token the JWT token to parse
     * @return the User object extracted from specified token or null if a token is invalid.
     */
    public CollaboratorDescription parseToken(String token) {
        CollaboratorDescription collaboratorDTO = null;

        try {
            Claims body = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();

            collaboratorDTO = new CollaboratorDescription();
            collaboratorDTO.setEmail(body.getSubject())
                    .setIsAdmin((Boolean) body.get("roles"))
                    .setDefaultPicture((Boolean) body.get("defaultPicture"))
                    .setId(Long.parseLong(body.get("id").toString()));
        } catch (JwtException e) {
            // Simply print the exception and null will be returned for the userDto
            e.printStackTrace();
        }
        return collaboratorDTO;
    }
}

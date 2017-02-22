package com.viseo.c360.formation.exceptions.dao.util;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.stereotype.Service;

import javax.persistence.PersistenceException;

@Service
public class ExceptionUtil {

    public String getUniqueField(ConstraintViolationException pe){
        String message = pe.getMessage().substring(pe.getMessage().indexOf("La clé ") + 10);
        return message.substring(0,message.indexOf(")"));
    }

    public UniqueFieldErrors getUniqueFieldError(PersistenceException pe) {
        if (pe.getCause() instanceof ConstraintViolationException) {
            String field = this.getUniqueField((ConstraintViolationException) pe.getCause());
            for (UniqueFieldErrors uniqueFieldErrors : UniqueFieldErrors.values()) {
                if (uniqueFieldErrors.matches(field)) {
                    return uniqueFieldErrors;
                }
            }
        }
        return null;
    }
}

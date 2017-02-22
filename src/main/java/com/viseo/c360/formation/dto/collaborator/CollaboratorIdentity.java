package com.viseo.c360.formation.dto.collaborator;

import com.viseo.c360.formation.dto.BaseDTO;

public class CollaboratorIdentity extends BaseDTO {
    String lastName;
    String firstName;

    public CollaboratorIdentity() {
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
}

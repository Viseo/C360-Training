package com.viseo.c360.formation.dto.collaborator;

import com.viseo.c360.formation.dto.BaseDTO;

public class CollaboratorIdentity extends BaseDTO {
    String lastName;
    String firstName;
    String email;
    String password;

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

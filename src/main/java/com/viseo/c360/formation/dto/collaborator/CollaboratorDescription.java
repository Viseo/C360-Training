package com.viseo.c360.formation.dto.collaborator;

import com.viseo.c360.formation.dto.BaseDTO;

public class CollaboratorDescription extends BaseDTO {

    public static class Regex{
        public static final String PERSONNAL_ID_NUMBER = "[A-Z]{3}[0-9]{4}";
        public static final String LAST_NAME = "[a-zA-Z-'. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæ\u0153ÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝ\u0178Æ\u0152]";
        public static final String FIRST_NAME = "[a-zA-Z-'. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæ\u0153ÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝ\u0178Æ\u0152]";
        public static final String EMAIL = "[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})";
    }

    String personnalIdNumber;
    String lastName;
    String firstName;
    String email;
    String password;
    Boolean isAdmin;

    public CollaboratorDescription() {
        this.isAdmin = false;
    }

    public String getPersonnalIdNumber() {
        return personnalIdNumber;
    }

    public void setPersonnalIdNumber(String personnalIdNumber) {
        this.personnalIdNumber = personnalIdNumber;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() { return firstName; }

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

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean admin) {
        this.isAdmin = admin;
    }
}

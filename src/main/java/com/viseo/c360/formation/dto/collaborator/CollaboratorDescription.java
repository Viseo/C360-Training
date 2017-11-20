package com.viseo.c360.formation.dto.collaborator;

import com.viseo.c360.formation.dto.BaseDTO;

import java.util.Date;

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
    String function;
    String businessUnit;
    Boolean defaultPicture;
    Date lastUpdateDate;

    public CollaboratorDescription() {
        this.isAdmin = false;
    }

    public String getPersonnalIdNumber() {
        return personnalIdNumber;
    }

    public CollaboratorDescription setPersonnalIdNumber(String personnalIdNumber) {
        this.personnalIdNumber = personnalIdNumber;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public CollaboratorDescription setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public String getFirstName() { return firstName; }

    public CollaboratorDescription setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public String getEmail() {
        return email;
    }

    public CollaboratorDescription setEmail(String email) {
        this.email = email;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public CollaboratorDescription setPassword(String password) {
        this.password = password;
        return this;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public CollaboratorDescription setIsAdmin(Boolean admin) {
        this.isAdmin = admin;
        return this;
    }

    public Boolean getAdmin() {
        return isAdmin;
    }

    public String getFunction() {
        return function;
    }

    public CollaboratorDescription setFunction(String function) {
        this.function = function;
        return this;
    }

    public String getBusinessUnit() {
        return businessUnit;
    }

    public CollaboratorDescription setBusinessUnit(String businessUnit) {
        this.businessUnit = businessUnit;
        return this;
    }

    public Boolean getDefaultPicture() {
        return defaultPicture;
    }

    public CollaboratorDescription setDefaultPicture(Boolean defaultPicture) {
        this.defaultPicture = defaultPicture;
        return this;
    }

    public Date getLastUpdateDate() {
        return lastUpdateDate;
    }

    public CollaboratorDescription setLastUpdateDate(Date lastUpdateDate) {
        this.lastUpdateDate = lastUpdateDate;
        return this;
    }
}

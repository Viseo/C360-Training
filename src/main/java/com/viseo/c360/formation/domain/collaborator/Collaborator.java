package com.viseo.c360.formation.domain.collaborator;

import com.viseo.c360.formation.domain.BaseEntity;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import org.hibernate.validator.constraints.Email;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Date;

@Entity
public class Collaborator extends BaseEntity {

	@NotNull
	@Size(min=3, max=20)
	@Pattern(regexp=CollaboratorDescription.Regex.PERSONNAL_ID_NUMBER)
	@Column(unique=true, nullable=false)
	String personnalIdNumber;
	
	@NotNull
	@Size(min=2, max=125)
	@Pattern(regexp=CollaboratorDescription.Regex.LAST_NAME+"*")
	String lastName;
	
	@NotNull
	@Size(min=2, max=125)
	@Pattern(regexp=CollaboratorDescription.Regex.FIRST_NAME+"*")
	String firstName;

	@NotNull
	@Email
	@Column(unique=true, nullable=false)
	String email;

	@NotNull
	String password;

	@NotNull
	Boolean admin;

	String function;

	String businessUnit;

	@NotNull
	Boolean defaultPicture;

	@NotNull
	Date lastUpdateDate;

	public Collaborator() {
		super();
		this.lastUpdateDate = new Date();
	}

	public String getPersonnalIdNumber() {
		return personnalIdNumber;
	}
	public void setPersonnalIdNumber(String personnalIdNumber) {
		this.personnalIdNumber = personnalIdNumber.trim();
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName.replaceAll("( )+", " ").trim();
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName.replaceAll("( )+", " ").trim();
	}
	public String getEmail() {return email;}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {		return password;	}
	public void setPassword(String password) {
		this.password = password;
	}

	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

	public Boolean getAdmin() {
		return admin;
	}

	public void setAdmin(Boolean admin) {
		this.admin = admin;
	}

	public String getFunction() {
		return function;
	}

	public void setFunction(String function) {
		this.function = function;
	}

	public String getBusinessUnit() {
		return businessUnit;
	}

	public void setBusinessUnit(String businessUnit) {
		this.businessUnit = businessUnit;
	}

	public Boolean getDefaultPicture() {
		return defaultPicture;
	}

	public void setDefaultPicture(Boolean defaultPicture) {
		this.defaultPicture = defaultPicture;
	}
}
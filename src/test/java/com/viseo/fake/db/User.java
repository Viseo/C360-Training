package com.viseo.fake.db;

import java.io.Serializable;

public class User implements Serializable {
	private static final long serialVersionUID = 1L;
	
	long id;
	long version;
	String firstName;
	String lastName;
	boolean blocked;
	boolean admin;
	Address address;
	
	public User(String firstName, String lastName, boolean blocked,
			boolean admin) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.blocked = blocked;
		this.admin = admin;
	}
	
	public User() {
		super();
	}
	
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public boolean isBlocked() {
		return blocked;
	}
	public void setBlocked(boolean blocked) {
		this.blocked = blocked;
	}
	public boolean isAdmin() {
		return admin;
	}
	public void setAdmin(boolean admin) {
		this.admin = admin;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}
	
	
}

package com.viseo.fake.db;

import java.io.Serializable;

public class Address implements Serializable {
	private static final long serialVersionUID = 1L;

	public Address() {
		super();
	}
	
	long id;
	long version;
	String street;
	String zip;
	String city;

	public long getId() {
		return id;
	}

	public long getVersion() {
		return version;
	}

	public void setVersion(long version) {
		this.version = version;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getZip() {
		return zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}
	
}

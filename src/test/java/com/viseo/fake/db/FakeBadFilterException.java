package com.viseo.fake.db;

@SuppressWarnings("serial")
public class FakeBadFilterException extends RuntimeException {

	public FakeBadFilterException(String request) {
		super("No filter registered for : "+request);
	}

}

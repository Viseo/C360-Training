package com.viseo.fake.db;

@SuppressWarnings("serial")
public class FakeUnexpectedException extends RuntimeException {

	public FakeUnexpectedException(String message) {
		super(message);
	}

}

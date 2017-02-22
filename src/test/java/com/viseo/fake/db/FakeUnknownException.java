package com.viseo.fake.db;

public class FakeUnknownException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	Class<? extends Object> entityClass;

	public FakeUnknownException(Class<? extends Object> entityClass) {
		this.entityClass = entityClass;
	}

}

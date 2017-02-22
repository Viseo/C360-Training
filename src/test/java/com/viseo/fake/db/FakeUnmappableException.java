package com.viseo.fake.db;

class FakeUnmappableException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	Class<?> clazz;
	
	public FakeUnmappableException(Class<?> clazz) {
		this.clazz = clazz;
	}
	
	public String toString() {
		return "unmappable exception : "+this.clazz;
	}

}

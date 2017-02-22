package com.viseo.fake.db;

import java.util.Map;

public interface FakeFilter {
	boolean accept(FakeDAOFacade facade, Object entity, Map<String, Object> paramRegistry);
}

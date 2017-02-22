package com.viseo.fake.db;

import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class UserApplicationTests {

	FakeDAOFacade fakeDaoFacade = null;
	@Before
	public void setUp() {
		fakeDaoFacade = new FakeDAOFacade();
		fakeDaoFacade.declareEntityClasses(User.class);
		fakeDaoFacade.declareEntityClasses(Address.class);
		fakeDaoFacade.registerFilter("from User", (facade, entity, paramRegistry) -> {
			return entity instanceof User;
		});		
	}
	
	@Test
	public void add() {
		User user = new User();
		user.setFirstName("Henri");
		user.setLastName("Darmet");
		user.setBlocked(true);
		user.setAdmin(false);
		fakeDaoFacade.persist(user);
		User henri = fakeDaoFacade.find(User.class, 1L);
		Assert.assertNotNull(henri);
	}
	
	@Test
	public void remove() {
		User herve = new User();
		fakeDaoFacade.persist(herve);
		herve = fakeDaoFacade.find(User.class, 1L);
		Assert.assertNotNull(herve);
		fakeDaoFacade.remove(herve);
		herve = fakeDaoFacade.find(User.class, 1L);
		Assert.assertNull(herve);
	}
	
	@Test
	public void testMerge() {
		User herve = new User();
		User mHerve = fakeDaoFacade.merge(herve);
		Assert.assertNotEquals(herve, mHerve);
		Address hAddress = new Address();
		hAddress = fakeDaoFacade.merge(hAddress);
		Assert.assertEquals(hAddress, fakeDaoFacade.merge(hAddress));
		fakeDaoFacade.clear();
		mHerve.setAddress(hAddress);
		User m2Herve = fakeDaoFacade.merge(mHerve);
		Address mAddress = m2Herve.getAddress();
		Address m2Address = fakeDaoFacade.find(Address.class, mAddress.getId());
		Assert.assertNotEquals(mHerve, m2Herve);
		Assert.assertNotEquals(mAddress, hAddress);
		Assert.assertEquals(mAddress, m2Address);
	}
	
	@Test
	public void testAllUsers() {
		User herve = new User();
		User mohamed = new User();
		fakeDaoFacade.persist(herve);
		fakeDaoFacade.persist(mohamed);

		List<User> listUsers = fakeDaoFacade.getList("from User");
		Assert.assertEquals(2, listUsers.size());
		Assert.assertTrue(listUsers.contains(herve));
		Assert.assertTrue(listUsers.contains(mohamed));
	}

}

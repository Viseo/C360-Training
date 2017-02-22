package com.viseo.c360.formation.dao.db;

import org.springframework.stereotype.Repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

@Repository
public class JPAFacade implements DAOFacade {

	@PersistenceContext
	EntityManager entityManager;
	
	public void setEntityManager(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
	
	@Override
	public <T, K> T find(Class<T> clazz, K key) {
		return entityManager.find(clazz, key);
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T> List<T> getList(String request, Parameter... params) {
		entityManager.setFlushMode(FlushModeType.COMMIT);
		Query query = entityManager.createQuery(request);
		for(Parameter param : params){
			query.setParameter(param.getName(), param.getValue());
		}
		return query.getResultList();
	}

	@Override
	public <T> T getSingle(String request, Parameter... params) {
		entityManager.setFlushMode(FlushModeType.COMMIT);
		Query query = entityManager.createQuery(request);
		for(Parameter param : params){
			query.setParameter(param.getName(), param.getValue());
		}
		return (T) query.getSingleResult();
	}

	@Override
	public <T> T merge(T entity) {
		return entityManager.merge(entity);
	}

	@Override
	public <T> void remove(T entity) {
		entityManager.remove(entity);		
	}

	@Override
	public <T> void persist(T entity) {
		entityManager.persist(entity);
	}
	
	@Override
	public void clear() {
		entityManager.clear();
	}

	@Override
	public void flush() {entityManager.flush();}

	@Override
	public void setFlushMode(FlushModeType flushModeType) {
		entityManager.setFlushMode(flushModeType);
	}

}

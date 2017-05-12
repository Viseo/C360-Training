package com.viseo.fake.db;

import com.viseo.c360.formation.dao.db.DAOFacade;

import javax.persistence.FlushModeType;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.lang.reflect.Proxy;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import java.util.logging.Logger;

public class FakeDAOFacade implements DAOFacade {

	static final Set<Class<?>> PRIMARY_TYPES = new HashSet<Class<?>>(
			Arrays.asList(Long.class, Long.TYPE, Integer.class, Integer.TYPE,
					Double.class, Double.TYPE, Float.class, Float.TYPE,
					Character.class, Character.TYPE, Boolean.class,
					Boolean.TYPE, Byte.class, Byte.TYPE, String.class,
					Date.class));

	static final Set<Class<?>> COLLECTION_TYPES = new HashSet<Class<?>>(
			Arrays.asList(List.class, Set.class));

	Logger log = Logger.getLogger(FakeDAOFacade.class.getSimpleName());

	Map<Class<?>, Map<?, ?>> database = new HashMap<>();

	Map<String, FakeFilter> filters = new HashMap<>();

	long staticGenerator = 0;

	@SuppressWarnings("unchecked")
	<T> void scanDatabase(FakeFilter filter, Consumer<T> consumer, Map<String, Object> paramRegistry) {
		database.forEach((clazz, table) -> {
			table.forEach((id, entity) -> {
				if (filter.accept(this, entity, paramRegistry)) {
					consumer.accept((T) entity);
				}
			});
		});
	}

	synchronized public void registerFilter(String request, FakeFilter filter) {
		filters.put(request, filter);
	}

	public void declareEntityClasses(Class<?>... classes) {
		for (Class<?> clazz : classes) {
			Map<Long, ?> table = new HashMap<>();
			database.put(clazz, table);
		}
	}

	Field getField(Class clazz, String fieldName){
		try {
			return clazz.getDeclaredField(fieldName);
		} catch (NoSuchFieldException e) {
			return getField(clazz.getSuperclass(), fieldName);
		}
	}

	<T> long getId(T entity) {
		try {
			Field fid = getField(entity.getClass(),"id");
			fid.setAccessible(true);
			return (long) fid.get(entity);
		} catch ( SecurityException | IllegalAccessException | IllegalArgumentException e) {
			throw new FakeUnexpectedException(e.getMessage());
		}
	}

	<T> void setId(T entity, long id) {
		try {
			Field fid = getField(entity.getClass(),"id");
			fid.setAccessible(true);
			fid.set(entity, id);
		} catch ( SecurityException | IllegalAccessException | IllegalArgumentException e) {
			throw new FakeUnexpectedException(e.getMessage());
		}
	}

	<T> void add(Collection<T> collection, Object item) {
		try {
			Method addMethod = collection.getClass().getDeclaredMethod("add");
			addMethod.invoke(collection, item);
		} catch (SecurityException | IllegalAccessException
				| IllegalArgumentException | NoSuchMethodException
				| InvocationTargetException e) {
			throw new FakeUnexpectedException(e.getMessage());
		}
	}

	<T> Map<Long, T> getTable(Class<T> clazz) {
		@SuppressWarnings("unchecked")
		Map<Long, T> table = (Map<Long, T>) database.get(clazz);
		if (table == null) {
			throw new FakeUnknownException(clazz);
		}
		return table;
	}

	<T> void copy(T entity, T entityInDB) {
		List<Field> fields = retrieveFields(entity);
		for (Field field : fields) {
			try {
				Class<?> fieldClass = (Class<?>) field.getType();
				@SuppressWarnings("unchecked")
				Map<Long, ?> table = (Map<Long, ?>) database.get(fieldClass);
				if (table != null) {
					Object linked = field.get(entity);
					field.set(entityInDB, table.get(getId(linked)));
				} else if (PRIMARY_TYPES.contains(fieldClass)) {
					field.set(entityInDB, field.get(entity));
				} else if (COLLECTION_TYPES.contains(fieldClass)) {
					Collection<?> collection = (Collection<?>) field
							.get(entity);
					Collection<?> collInDB = (Collection<?>) fieldClass
							.newInstance();
					for (Object linked : collection) {
						@SuppressWarnings("unchecked")
						Map<Long, ?> linkedTable = (Map<Long, ?>) database
								.get(linked.getClass());
						if (linkedTable != null) {
							add(collInDB, linkedTable.get(getId(linked)));
						} else if (PRIMARY_TYPES.contains(fieldClass)) {
							add(collInDB, field.get(linked));
						}
					}
				} else {
					throw new FakeUnmappableException(fieldClass);
				}
			} catch (IllegalArgumentException | IllegalAccessException
					| InstantiationException e) {
				throw new FakeUnexpectedException(e.getMessage());
			}
		}
	}

	private <T> List<Field> retrieveFields(T entity) {
		List<Field> fields = new ArrayList<Field>();
		Class<?> clazz = (Class<?>) entity.getClass();
		while (clazz != Object.class) {
			for (Field field : clazz.getDeclaredFields()) {
				if (!Modifier.isStatic(field.getModifiers())) {
					fields.add(field);
				}
			}
			clazz = clazz.getSuperclass();
		}
		return fields;
	}

	<T> T duplicate(T toBeCloned) {
		try {
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ObjectOutputStream oos = new ObjectOutputStream(baos);
			oos.writeObject(toBeCloned);
			oos.close();
			ByteArrayInputStream bais = new ByteArrayInputStream(
					baos.toByteArray());
			ObjectInputStream ois = new ObjectInputStream(bais);
			@SuppressWarnings("unchecked")
			T clone = (T) ois.readObject();
			ois.close();
			return clone;
		} catch (IOException | ClassNotFoundException e) {
			throw new FakeUnexpectedException(e.getMessage());
		}
	}

	// ==============================================================

	@Override
	synchronized public <T, K> T find(Class<T> clazz, K key) {
		log.info("getting : " + clazz + " : " + key);
		@SuppressWarnings("unchecked")
		Map<K, T> table = (Map<K, T>) database.get(clazz);
		if (table == null) {
			throw new FakeUnknownException(clazz);
		} else {
			return table.get(key);
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	synchronized public <T> List<T> getList(String request, Parameter... params) {
		FakeFilter filter = filters.get(request);
		if (filter == null) {
			throw new FakeBadFilterException(request);
		}
		Map<String, Object> paramRegistry = new HashMap<>();
		for(Parameter param : params){
			paramRegistry.put(param.getName(), param.getValue());
		}
		List<T> result = new ArrayList<T>();
		scanDatabase(filter, (entity) -> {
			result.add((T) entity);
		}, paramRegistry);
		return result;
	}

	@SuppressWarnings("unchecked")
	@Override
	public <T> T merge(T entity) {
		long value = getId(entity);
		if (value == 0) {
			entity = duplicate(entity);
			value = ++staticGenerator;
			setId(entity, value);
			getTable((Class<T>) entity.getClass()).put(value, entity);
		} else {
			Map<Long, T> table = (Map<Long, T>) database.get(entity.getClass());
			T entityInDB = table.get(value);
			if (entityInDB != entity) {
				copy(entity, entityInDB);
				entity = entityInDB;
			}
		}
		log.info("Merging : " + entity.getClass() + " : " + value);
		return entity;
	}

	@Override
	public <T> void remove(T entity) {
		long value = getId(entity);
		if (value == 0) {
			throw new RuntimeException("Cannot remove transient entity");
		}
		getTable(entity.getClass()).remove(value);
		log.info("Removing : " + entity.getClass() + " : " + value);
	}

	@Override
	public <T> void executeRequest(String request, Parameter... params) {

	}

    @Override
    public <T> void executeSQLRequest(String request, Parameter... params) {

    }


    @SuppressWarnings("unchecked")
	@Override
	public <T> void persist(T entity) {
		long value = getId(entity);
		if (value == 0) {
			value = ++staticGenerator;
			setId(entity, value);
		} else {
			throw new RuntimeException("Entity already Exist");
		}
		getTable((Class<T>) entity.getClass()).put(value, entity);
		log.info("Persisting : " + entity.getClass() + " : " + value);
	}

	@Override
	public void clear() {
		@SuppressWarnings("rawtypes")
		Collection lazy = (Collection) Proxy.newProxyInstance(
				List.class.getClassLoader(), new Class[] { List.class,
						Set.class }, new InvocationHandler() {
					@Override
					public Object invoke(Object entity, Method method,
							Object[] params) throws Throwable {
						throw new DAOLazyLoadingException();
					}
				});
		Map<Class<?>, Map<?, ?>> oldDatabase = database;
		database = duplicate(database);
		oldDatabase.forEach((clazz, table) -> {
			table.forEach((id, entity) -> {
				lazify(entity, lazy);
			});
		});
	}

	void lazify(Object entity, @SuppressWarnings("rawtypes") Collection lazy) {
		List<Field> fields = retrieveFields(entity);
		for (Field field : fields) {
			try {
				Class<?> fieldClass = (Class<?>) field.getType();
				if (COLLECTION_TYPES.contains(fieldClass)) {
					field.set(entity, lazy);
				}
			} catch (IllegalArgumentException | IllegalAccessException e) {
				throw new FakeUnexpectedException(e.getMessage());
			}
		}
	}


// =================================================== //
//						Ajouté 						   //

	@Override
	synchronized public <T> T getSingle(String request, Parameter... params) {
		FakeFilter filter = filters.get(request);
		if (filter == null) {
			throw new FakeBadFilterException(request);
		}
		Map<String, Object> paramRegistry = new HashMap<>();
		for(Parameter param : params){
			paramRegistry.put(param.getName(), param.getValue());
		}
		List<T> result = new ArrayList<T>();
		scanDatabase(filter, (entity) -> {
			result.add((T) entity);
		}, paramRegistry);
		return result.get(0);
	}

	@Override
	synchronized public void updateSingle(String request, Parameter... params) {
		// TODO: Implement this method
	}

	@Override
	public void flush() {

	}

	@Override
	public void setFlushMode(FlushModeType flushModeType) {

	}
}


package com.viseo.c360.formation.dto;


import java.lang.reflect.Field;
import java.util.Objects;

public abstract class BaseDTO {

    long id;

    long version;

    public BaseDTO() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getVersion() {
        return version;
    }

    public void setVersion(long version) {
        this.version = version;
    }

    @Override
    public boolean equals(Object obj1) {
        if (this == obj1) return true;
        if (obj1 == null || getClass() != obj1.getClass()) return false;
        BaseDTO that = this.getClass().cast(obj1);
        for (Field field : this.getClass().getDeclaredFields()){
            try {
                if(!field.isAccessible()) {
                    field.setAccessible(true);
                    if (!(field.get(that).equals(field.get(this)))) {
                        field.setAccessible(false);
                        return false;
                    }
                }
                else{
                    if (!(field.get(that).equals(field.get(this)))) {
                        return false;
                    }
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return true;
    }
}
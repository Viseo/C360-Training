package com.viseo.c360.formation.domain.training;


import com.viseo.c360.formation.domain.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

@Entity
public class Topic extends BaseEntity {

    @NotNull
    @Column(unique=true, nullable=false)
    String name;

    public Topic() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
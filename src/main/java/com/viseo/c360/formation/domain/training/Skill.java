package com.viseo.c360.formation.domain.training;

import com.viseo.c360.formation.domain.BaseEntity;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by YGU3747 on 09/10/2017
 */

@Entity
public class Skill extends BaseEntity {
    @NotNull
    @Size(max = 20)
    String label;

    public Skill() {super();}

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }
}

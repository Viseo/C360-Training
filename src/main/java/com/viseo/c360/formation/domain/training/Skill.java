package com.viseo.c360.formation.domain.training;

import com.viseo.c360.formation.domain.BaseEntity;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by YGU3747 on 09/10/2017
 */

@Entity
public class Skill extends BaseEntity {
    @NotNull
    @Size(max = 20)
    String label;

    @Valid
    @LazyCollection(LazyCollectionOption.FALSE)
    @ManyToMany
    List<Training> trainings;

    @NotNull
    Date date;

    public Skill() {
        super();
        this.trainings = new ArrayList<>();
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void addTraining(Training t){
        this.trainings.add(t);
    }

    public void removeTraining(Training t){
        this.trainings.remove(t);
    }

    public void removeAllTraining(){
        this.trainings.clear();
    }

    public List<Training> getTrainings(){return this.trainings;}

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}

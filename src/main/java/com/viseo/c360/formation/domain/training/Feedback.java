package com.viseo.c360.formation.domain.training;


import com.viseo.c360.formation.domain.BaseEntity;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.Entity;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import javax.validation.Valid;
import java.util.Date;
import java.util.List;


@Entity
public class Feedback extends BaseEntity{

    @NotNull
    Date date;

    @NotNull
    int score;

    String comment;

    @Valid
    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(name="feedback_like")
    List<Collaborator> likers;

    @NotNull
    @Valid
    @ManyToOne
    Collaborator collaborator;

    @NotNull
    @ManyToOne
    @Valid
    Training training;


    public Feedback() {
        super();
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<Collaborator> getLikers() {
        return likers;
    }

    public void setLikers(List<Collaborator> likers) {
        this.likers = likers;
    }

    public void addLikers(Collaborator collaborator) {
        System.out.println(collaborator);
        this.likers.add(collaborator);
    }
    public void removeLiker(Collaborator collaborator) {
        this.likers.remove(collaborator);
    }
    public void removeLikers(){
        this.likers.clear();
    }

    public Collaborator getCollaborator() {
        return collaborator;
    }

    public void setCollaborator(Collaborator collaborator) {
        this.collaborator = collaborator;
    }

    public Training getTraining() {
        return training;
    }

    public void setTraining(Training training) {
        this.training = training;
    }
}
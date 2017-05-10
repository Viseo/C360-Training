package com.viseo.c360.formation.domain.collaborator;

import com.viseo.c360.formation.domain.BaseEntity;
import com.viseo.c360.formation.domain.training.TrainingSession;
import com.viseo.c360.formation.dto.collaborator.WishDescription;
import com.viseo.c360.formation.dto.training.TrainingDescription;
import org.hibernate.FetchMode;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
public class Wish extends BaseEntity{

    @NotNull
    @Size(min = 3,max = 50)
    @Pattern(regexp = WishDescription.Regex.LABEL+"*")
    @Column(unique = true,nullable = false)
    String label;

    @NotNull
    @Valid
    @ManyToOne
    Collaborator collaborator;

    @Valid
    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(name="wish_vote_ok")
    List<Collaborator> vote_ok;

    @Valid
    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(name="wish_vote_ko")
    List<Collaborator> vote_ko;

    @NotNull
    Boolean isChecked;

    public Wish() {
        super();
        this.vote_ok = new ArrayList<Collaborator>();
        this.vote_ko = new ArrayList<Collaborator>();
    }


    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Collaborator getCollaborator() {
        return collaborator;
    }

    public void setCollaborator(Collaborator collaborator) {
        this.collaborator = collaborator;
    }

    public List<Collaborator> getVote_ok() {
        return Collections.unmodifiableList(vote_ok);
    }
    public void addVote_ok(Collaborator collaborator) {
        System.out.println(this.vote_ok);
        this.vote_ok.add(collaborator);
    }
    public void removeVote_ok(Collaborator collaborator) {
        this.vote_ok.remove(collaborator);
    }
    public void removeVote_oks(){
        this.vote_ok.clear();
    }

    public List<Collaborator> getVote_ko() {
        return Collections.unmodifiableList(vote_ko);
    }
    public void addVote_ko(Collaborator collaborator) {
        this.vote_ko.add(collaborator);
    }
    public void removeVote_ko(Collaborator collaborator) {
        this.vote_ko.remove(collaborator);
    }
    public void removeVote_kos(){
        this.vote_ko.clear();
    }

    public Boolean getChecked() {
        return isChecked;
    }

    public void setChecked(Boolean checked) {
        isChecked = checked;
    }
}

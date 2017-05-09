package com.viseo.c360.formation.domain.collaborator;

import com.viseo.c360.formation.domain.BaseEntity;
import com.viseo.c360.formation.domain.training.TrainingSession;
import com.viseo.c360.formation.dto.collaborator.WishDescription;
import com.viseo.c360.formation.dto.training.TrainingDescription;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
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

    @NotNull
    @Valid
    @ManyToMany
    List<Collaborator> vote_ok;

    @NotNull
    @Valid
    @ManyToMany
    List<Collaborator> vote_ko;

    public Wish() {
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
}

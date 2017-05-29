package com.viseo.c360.formation.dto.training;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.dto.BaseDTO;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;

import java.util.Date;
import java.util.List;

public class FeedbackDescription extends BaseDTO {
    public static class Regex {
        public static final String DATE = "(((0[1-9]|[12]\\d|3[01])\\/(0[13578]|1[02])\\/((1[6-9]|[2-9]\\d)\\d{2}))|((0[1-9]|[12]\\d|30)\\/(0[13456789]|1[012])\\/((1[6-9]|[2-9]\\d)\\d{2}))|((0[1-9]|1\\d|2[0-8])\\/02\\/((1[6-9]|[2-9]\\d)\\d{2}))|(29\\/02\\/((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))";
    }

    Date date;

    int score;

    String comment;

    List<Collaborator> likers;

    CollaboratorDescription collaborator;

    Training training;

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


    public CollaboratorDescription getCollaborator() {
        return collaborator;
    }

    public void setCollaborator(CollaboratorDescription collaborator) {
        this.collaborator = collaborator;
    }

    public List<Collaborator> getLikers() {
        return likers;
    }

    public void setLikers(List<Collaborator> likers) {
        this.likers = likers;
    }

    public Training getTraining() {
        return training;
    }

    public void setTraining(Training training) {
        this.training = training;
    }
}

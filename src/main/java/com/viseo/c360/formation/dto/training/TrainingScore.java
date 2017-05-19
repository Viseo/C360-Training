package com.viseo.c360.formation.dto.training;

import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.dto.BaseDTO;

public class TrainingScore extends BaseDTO {
    double score;

    Training training;

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }


    public Training getTraining() {
        return training;
    }

    public void setTraining(Training training) {
        this.training = training;
    }
}

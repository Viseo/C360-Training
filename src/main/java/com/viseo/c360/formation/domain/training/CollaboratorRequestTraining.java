package com.viseo.c360.formation.domain.training;

import com.viseo.c360.formation.domain.collaborator.RequestTraining;

import java.util.List;

public class CollaboratorRequestTraining {

    private List<RequestTraining> requestTrainingList;
    private List<TrainingSession> trainingSessions;

    public CollaboratorRequestTraining() {
    }

    public CollaboratorRequestTraining(List<RequestTraining> requestTrainingList, List<TrainingSession> trainingSessions) {
        this.requestTrainingList = requestTrainingList;
        this.trainingSessions = trainingSessions;
    }

    public List<RequestTraining> getRequestTrainingList() {
        return requestTrainingList;
    }

    public void setRequestTrainingList(List<RequestTraining> requestTrainingList) {
        this.requestTrainingList = requestTrainingList;
    }

    public List<TrainingSession> getTrainingSessions() {
        return trainingSessions;
    }

    public void setTrainingSessions(List<TrainingSession> trainingSessions) {
        this.trainingSessions = trainingSessions;
    }
}

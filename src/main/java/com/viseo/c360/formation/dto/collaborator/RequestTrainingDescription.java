package com.viseo.c360.formation.dto.collaborator;

import java.util.List;

import com.viseo.c360.formation.dto.BaseDTO;
import com.viseo.c360.formation.dto.training.TrainingDescription;
import com.viseo.c360.formation.dto.training.TrainingSessionDescription;


public class RequestTrainingDescription extends BaseDTO {


    TrainingDescription trainingDescription;

    List<TrainingSessionDescription> trainingSessionsDescriptions;

    CollaboratorIdentity collaboratorIdentity;

    boolean doesNotMatter;

    public RequestTrainingDescription() {
        super();
    }

    public TrainingDescription getTrainingDescription() {
        return trainingDescription;
    }

    public void setTrainingDescription(TrainingDescription trainingDescription) {
        this.trainingDescription = trainingDescription;
    }

    public List<TrainingSessionDescription> getTrainingSessionsDescriptions() {
        return trainingSessionsDescriptions;
    }

    public void setTrainingSessionsDescriptions(List<TrainingSessionDescription> trainingSessionsDescriptions) {
        this.trainingSessionsDescriptions = trainingSessionsDescriptions;
    }

    public CollaboratorIdentity getCollaboratorIdentity() {
        return collaboratorIdentity;
    }

    public void setCollaboratorIdentity(CollaboratorIdentity collaboratorIdentity) {
        this.collaboratorIdentity = collaboratorIdentity;
    }

    public boolean isDoesNotMatter() {
        return doesNotMatter;
    }

    public void setDoesNotMatter(boolean doesNotMatter) {
        this.doesNotMatter = doesNotMatter;
    }
}

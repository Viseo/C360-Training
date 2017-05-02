package com.viseo.c360.formation.converters.requestTraining;

import com.viseo.c360.formation.converters.collaborator.CollaboratorToIdentity;
import com.viseo.c360.formation.converters.training.TrainingToDescription;
import com.viseo.c360.formation.converters.trainingsession.TrainingSessionToDescription;
import com.viseo.c360.formation.domain.collaborator.RequestTraining;
import com.viseo.c360.formation.dto.collaborator.CollaboratorIdentity;
import com.viseo.c360.formation.dto.collaborator.RequestTrainingDescription;

import java.util.ArrayList;
import java.util.List;

public class RequestTrainingToDescription {

    public RequestTrainingDescription convert(RequestTraining source){
        RequestTrainingDescription dto = new RequestTrainingDescription();
        dto.setId(source.getId());
        dto.setVersion(source.getVersion());
        dto.setCollaboratorIdentity(new CollaboratorToIdentity().convert(source.getCollaborator()));
        dto.setTrainingDescription(new TrainingToDescription().convert(source.getTraining()));
        dto.setTrainingSessionsDescriptions(new TrainingSessionToDescription().convert(source.getSessions()));
        return dto;
    }

    public List<RequestTrainingDescription> convert(List<RequestTraining> sourceList) {
        List<RequestTrainingDescription> listDescription = new ArrayList<>();
        for(RequestTraining requestTraining : sourceList){
            listDescription.add(convert(requestTraining));
        }
        return listDescription;
    }
}

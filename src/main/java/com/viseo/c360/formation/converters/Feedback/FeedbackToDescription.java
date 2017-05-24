package com.viseo.c360.formation.converters.Feedback;

import com.viseo.c360.formation.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.formation.converters.training.TrainingToDescription;
import com.viseo.c360.formation.domain.training.Feedback;
import com.viseo.c360.formation.dto.training.FeedbackDescription;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class FeedbackToDescription {
    public FeedbackToDescription() {
    }

    public FeedbackDescription convert(Feedback source) {
        FeedbackDescription dto = new FeedbackDescription();
        dto.setId(source.getId());
        dto.setVersion(source.getVersion());
        dto.setDate(source.getDate());
        dto.setScore(source.getScore());
        dto.setComment(source.getComment());
        dto.setCollaborator(new CollaboratorToDescription().convert(source.getCollaborator()));
        dto.setTraining(source.getTraining());
        return dto;
    }

    public List<FeedbackDescription> convert(List<Feedback> sourceList) {
        List<FeedbackDescription> listDescription = new ArrayList<>();
        for(Feedback feedback : sourceList){
            listDescription.add(convert(feedback));
        }
        return listDescription;
    }
}

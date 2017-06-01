package com.viseo.c360.formation.converters.Feedback;

import com.viseo.c360.formation.converters.collaborator.DescriptionToCollaborator;
import com.viseo.c360.formation.converters.training.DescriptionToTraining;
import com.viseo.c360.formation.domain.collaborator.Wish;
import com.viseo.c360.formation.domain.training.Feedback;
import com.viseo.c360.formation.domain.training.TrainingSession;
import com.viseo.c360.formation.dto.collaborator.WishDescription;
import com.viseo.c360.formation.dto.training.FeedbackDescription;
import com.viseo.c360.formation.dto.training.TrainingSessionDescription;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.TypeDescriptor;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class DescriptionToFeedback {
    public Feedback convert(FeedbackDescription dto) {
            Feedback domain = new Feedback();
            domain.setId(dto.getId());
            domain.setVersion(dto.getVersion());
            domain.setDate(dto.getDate());
            domain.setScore(dto.getScore());
            domain.setComment(dto.getComment());
            domain.setLikers(dto.getLikers());
            domain.setCollaborator(new DescriptionToCollaborator().convert(dto.getCollaborator()));
            domain.setTraining(dto.getTraining());
            return domain;
    }

    public List<Feedback> convert(List<FeedbackDescription> listDto) {
        List<Feedback> listFeedback = new ArrayList<Feedback>();
        for (FeedbackDescription myFeedbackDescription : listDto) {
            listFeedback.add(
                    convert(myFeedbackDescription)
            );
        }
        return listFeedback;
    }
}

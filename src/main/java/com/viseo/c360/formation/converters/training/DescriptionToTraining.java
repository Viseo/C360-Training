package com.viseo.c360.formation.converters.training;

import com.viseo.c360.formation.domain.training.Topic;
import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.dto.training.TrainingDescription;

public class DescriptionToTraining {

    public DescriptionToTraining() {
    }

    public Training convert(TrainingDescription dto, Topic topic) {
        Training domain = new Training();
        domain.setId(dto.getId());
        domain.setVersion(dto.getVersion());
        domain.setTrainingTitle(dto.getTrainingTitle());
        domain.setNumberHalfDays(dto.getNumberHalfDays());
        domain.setTopic(topic);
        return domain;
    }
}

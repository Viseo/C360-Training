package com.viseo.c360.formation.converters.topic;

import com.viseo.c360.formation.domain.training.Topic;
import com.viseo.c360.formation.dto.training.TopicDescription;

public class DescriptionToTopic {

    public DescriptionToTopic() {
    }

    public Topic convert(TopicDescription dto){
        Topic domain = new Topic();
        domain.setId(dto.getId());
        domain.setVersion(dto.getVersion());
        domain.setName(dto.getName());
        return domain;
    }
}

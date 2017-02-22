package com.viseo.c360.formation.converters.topic;

import com.viseo.c360.formation.domain.training.Topic;
import com.viseo.c360.formation.dto.training.TopicDescription;

import java.util.ArrayList;
import java.util.List;


public class TopicToDescription {

    public TopicToDescription() {
    }

    public TopicDescription convert (Topic source){
        TopicDescription dto = new TopicDescription();
        dto.setId(source.getId());
        dto.setVersion(source.getVersion());
        dto.setName(source.getName());
        return dto;
    }

    public List<TopicDescription> convert(List<Topic> sourceList) {
        List<TopicDescription> listDto = new ArrayList<>();
        for (Topic topic : sourceList) {
            listDto.add(convert(topic));
        }
        return listDto;
    }

}

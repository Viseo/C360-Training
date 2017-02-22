package com.viseo.c360.formation.dto.training;


import com.viseo.c360.formation.dto.BaseDTO;

public class TopicDescription extends BaseDTO {

    String name;

    public TopicDescription() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
package com.viseo.c360.formation.dto.training;

import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.dto.BaseDTO;

import java.util.Date;
import java.util.List;

/**
 * Created by YGU3747 on 10/10/2017
 */

public class SkillDescription extends BaseDTO {

    String label;

    List<Training> connectedTrainings;

    Date date;

    public SkillDescription() {
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public List<Training> getConnectedTrainings() {
        return connectedTrainings;
    }

    public void setConnectedTrainings(List<Training> connectedTrainings) {
        this.connectedTrainings = connectedTrainings;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}

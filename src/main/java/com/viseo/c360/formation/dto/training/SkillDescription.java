package com.viseo.c360.formation.dto.training;

import com.viseo.c360.formation.dto.BaseDTO;

/**
 * Created by YGU3747 on 10/10/2017
 */

public class SkillDescription extends BaseDTO {

    String label;

    public SkillDescription() {
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

}

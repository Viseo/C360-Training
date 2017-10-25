package com.viseo.c360.formation.converters.skill;

import com.viseo.c360.formation.domain.training.Skill;
import com.viseo.c360.formation.dto.training.SkillDescription;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by YGU3747 on 11/10/2017
 */

public class DescriptionToSkill {
    public DescriptionToSkill() {
    }

    public Skill convert(SkillDescription dto) {
        Skill domain = new Skill();
        domain.setId(dto.getId());
        domain.setVersion(dto.getVersion());
        domain.setLabel(dto.getLabel());
        domain.setDate(dto.getDate());
        return domain;
    }

    public List<Skill> convert(List<SkillDescription> sourceList) {
        List<Skill> listCollaborator = new ArrayList<>();
        for (SkillDescription skillDescription : sourceList) {
            listCollaborator.add(convert(skillDescription));
        }
        return listCollaborator;
    }
}

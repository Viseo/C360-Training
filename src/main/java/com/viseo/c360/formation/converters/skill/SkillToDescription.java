package com.viseo.c360.formation.converters.skill;

import com.viseo.c360.formation.domain.training.Skill;
import com.viseo.c360.formation.dto.training.SkillDescription;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by YGU3747 on 11/10/2017
 */

public class SkillToDescription {
    public SkillToDescription() {
    }

    public SkillDescription convert(Skill source) {
        SkillDescription dto = new SkillDescription();
        dto.setId(source.getId());
        dto.setVersion(source.getVersion());
        dto.setLabel(source.getLabel());
        return dto;
    }

    public List<SkillDescription> convert(List<Skill> sourceList) {
        List<SkillDescription> listDto = new ArrayList<>();
        for (Skill skill : sourceList) {
            listDto.add(convert(skill));
        }
        return listDto;
    }
}

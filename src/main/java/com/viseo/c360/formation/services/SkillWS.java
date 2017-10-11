package com.viseo.c360.formation.services;

import com.viseo.c360.formation.converters.skill.DescriptionToSkill;
import com.viseo.c360.formation.converters.skill.SkillToDescription;
import com.viseo.c360.formation.dao.TrainingDAO;
import com.viseo.c360.formation.dto.training.SkillDescription;
import com.viseo.c360.formation.exceptions.C360Exception;
import com.viseo.c360.formation.exceptions.dao.UniqueFieldException;
import com.viseo.c360.formation.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.formation.exceptions.dao.util.UniqueFieldErrors;
import org.springframework.core.convert.ConversionException;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.util.List;

/**
 * Created by YGU3747 on 11/10/2017
 */

@RestController
public class SkillWS {
    @Inject
    TrainingDAO skillDAO;

    @Inject
    ExceptionUtil exceptionUtil;

    @CrossOrigin
    @RequestMapping(value = "${endpoint.addskill}", method = RequestMethod.POST)
    @ResponseBody
    public Boolean addSkill(@RequestBody SkillDescription skillDescription){
        try{
            if(!skillDAO.getSkillByLabel(skillDescription.getLabel())){
                skillDAO.addSkill(new DescriptionToSkill().convert(skillDescription));
                return true;
            }
            else{
                return false;
            }
        }
        catch (PersistenceException pe){
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.skills}", method = RequestMethod.GET)
    @ResponseBody
    public List<SkillDescription> getAllSkills() {
        try {
            return new SkillToDescription().convert(skillDAO.getAllSkills());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }
}

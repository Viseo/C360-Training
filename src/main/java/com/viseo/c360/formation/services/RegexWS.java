package com.viseo.c360.formation.services;

import java.util.HashMap;
import java.util.Map;

import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.dto.training.TrainingDescription;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegexWS {

	@RequestMapping(value="${endpoint.regexTrainings}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,String> getRegexTrainings(){
		Map<String,String> map = new HashMap<String,String>();
		map.put("TRAINING_TITLE", "^"+ TrainingDescription.Regex.TRAINING_TITLE +"+$");
		map.put("NUMBER_HALF_DAYS","^"+ TrainingDescription.Regex.NUMBER_HALF_DAYS +"+$");
		return map;
	}
	
	@RequestMapping(value="${endpoint.regexCollaborators}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String,String> getRegexCollaborators(){
		Map<String,String> map = new HashMap<String,String>();
		map.put("PERSONNAL_ID_NUMBER", "^"+ CollaboratorDescription.Regex.PERSONNAL_ID_NUMBER+"$");
		map.put("LAST_NAME","^"+ CollaboratorDescription.Regex.LAST_NAME +"+$");
		map.put("FIRST_NAME","^"+ CollaboratorDescription.Regex.FIRST_NAME +"+$");
		map.put("EMAIL","^"+ CollaboratorDescription.Regex.EMAIL +"+$");
		return map;
	}
}

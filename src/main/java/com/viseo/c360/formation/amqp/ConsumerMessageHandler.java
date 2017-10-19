package com.viseo.c360.formation.amqp;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.viseo.c360.formation.controllers.CollaboratorWS;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.formation.converters.skill.SkillToDescription;
import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.dao.TrainingDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.dto.training.SkillDescription;
import com.viseo.c360.formation.services.SkillWS;
import jdk.internal.org.objectweb.asm.util.TraceAnnotationVisitor;
import org.apache.commons.collections.map.HashedMap;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import javax.inject.Inject;
import java.io.IOException;
import java.util.*;
import java.util.function.Function;

/**
 * Created by SJO3662 on 28/07/2017.
 */

public class ConsumerMessageHandler {
    @Inject
    CollaboratorDAO dao;

    @Inject
    CollaboratorWS ws;

    @Inject
    SkillWS SkillWs;

    @Inject
    TrainingDAO TrainingDAO;

    @Inject
    RabbitTemplate rabbitTemplate;

    @Inject
    Queue responseFormation;

    @Inject
    Queue responseCompetence;



    private Map<String, Function<JSONObject, RabbitMsg>> factory = ResolveMsgFactory.getFactory();

    public void handleMessage(String request) {
        SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
        //deserialiser json et repondre
        try {
            JSONObject jo = (JSONObject) new JSONParser().parse(request);
            RabbitMsg rabbitMsgResponse = factory.get(jo.get("type")).apply(jo);
            if (rabbitMsgResponse instanceof ConnectionMessage){
                ConnectionMessage connectionMessageResponse = (ConnectionMessage) rabbitMsgResponse;
                CollaboratorDescription collaborator = connectionMessageResponse.getCollaboratorDescription();
                System.out.println("Halelujah j'ai reçu ça   : " + request);
                if (connectionMessageResponse.getToken() != null) {
                    ws.checkIfAlreadyConnected(connectionMessageResponse);
                } else  {
                    Collaborator c = dao.getCollaboratorByLogin(collaborator.getEmail());
                    System.out.println("Le voila = " + c.getFirstName());
                    connectionMessageResponse.setCollaboratorDescription(new CollaboratorToDescription().convert(c));
                    if (c.getFirstName() != null) {
                        if (!connectionMessageResponse.getNameFileResponse().equals(responseFormation.getName())) {
                            ObjectMapper mapper = new ObjectMapper();
                            try{
                                rabbitTemplate.convertAndSend(connectionMessageResponse.getNameFileResponse(), mapper.writeValueAsString(connectionMessageResponse));
                                System.out.println("Collaborateur envoyé !");
                            }catch (JsonProcessingException e){
                                throw new RuntimeException(e);
                            }

                        }

                    }
                }
            }
            else if (rabbitMsgResponse instanceof DisconnectionMessage){
                DisconnectionMessage disconnectionMessage = (DisconnectionMessage) rabbitMsgResponse;
                ws.checkIfAlreadyConnected(disconnectionMessage);
            }
            else if (rabbitMsgResponse instanceof InformationMessage){
                InformationMessage informationMessageResponse = (InformationMessage) rabbitMsgResponse;
                informationMessageResponse.setSkillsDescription(new SkillToDescription().convert(TrainingDAO.getAllSkills()));
                if (!informationMessageResponse.getNameFileResponse().equals(responseFormation.getName())) {
                    ObjectMapper mapper = new ObjectMapper();
                    try{
                        rabbitTemplate.convertAndSend(informationMessageResponse.getNameFileResponse(), mapper.writeValueAsString(informationMessageResponse));
                        System.out.println("Skill list sent successfully : " + informationMessageResponse.getSkillsDescription().size());
                    }catch (JsonProcessingException e){
                        throw new RuntimeException(e);
                    }
                }
            }
            else if (rabbitMsgResponse instanceof DeleteSkillMessage){
                DeleteSkillMessage deleteSkillMessage = (DeleteSkillMessage) rabbitMsgResponse;
                SkillWs.removeSkill(deleteSkillMessage.getSkillDescription());
                System.out.println("Skill is deleted successfully");
            }
        } catch (ParseException pe) {
            pe.printStackTrace();
        }

    }

}
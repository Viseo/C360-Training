package com.viseo.c360.formation.amqp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viseo.c360.formation.controllers.CollaboratorWS;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import javax.inject.Inject;
import java.io.IOException;

/**
 * Created by SJO3662 on 28/07/2017.
 */

public class ConsumerMessageHandler {
    @Inject
    CollaboratorDAO dao;

    @Inject
    CollaboratorWS ws;


    @Inject
    RabbitTemplate rabbitTemplate;

    @Inject
    Queue responseFormation;

    @Inject
    Queue responseCompetence;


    public void handleMessage(String request) {
        SpringBeanAutowiringSupport.processInjectionBasedOnCurrentContext(this);
        com.fasterxml.jackson.databind.ObjectMapper mapperObj = new com.fasterxml.jackson.databind.ObjectMapper();

        try {
            RabbitMessage rabbitMessageResponse = new ObjectMapper().readValue(request, RabbitMessage.class);
            CollaboratorDescription collaborator = rabbitMessageResponse.getCollaboratorDescription();
            System.out.println("Halelujah j'ai reçu ça   : " + request);
            if (rabbitMessageResponse.getToken() != null) {
                ws.checkIfAlreadyConnected(rabbitMessageResponse);
            } else  {
                Collaborator c = dao.getCollaboratorByLogin(collaborator.getEmail());
                System.out.println("Le voila = " + c.getFirstName());
                rabbitMessageResponse.setCollaboratorDescription(new CollaboratorToDescription().convert(c));
                if (c.getFirstName() != null) {
                    if (!rabbitMessageResponse.getNameFileResponse().equals(responseFormation.getName())) {
                        rabbitTemplate.convertAndSend(rabbitMessageResponse.getNameFileResponse(), mapperObj.writeValueAsString(rabbitMessageResponse));
                        System.out.println("Collaborateur envoyé !");
                    }

                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
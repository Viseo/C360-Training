package com.viseo.c360.formation.amqp;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    CollaboratorDAO ws;


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
            ConnectionMessage connectionMessageResponse = new ConnectionMessage();
            connectionMessageResponse = new ObjectMapper().readValue(request, ConnectionMessage.class);

            CollaboratorDescription collaborator = connectionMessageResponse.getCollaboratorDescription();
            System.out.println("Halelujah j'ai reçu ça   : " + request);
            if(collaborator.getFirstName() == null){
                Collaborator c = ws.getCollaboratorByLogin(collaborator.getEmail());
                System.out.println("Le voila = " + c.getFirstName());
                connectionMessageResponse.setCollaboratorDescription(new CollaboratorToDescription().convert(c));
                if(c.getFirstName() != null)
                    if(!connectionMessageResponse.getNameFileResponse().equals(responseFormation.getName()))
                        rabbitTemplate.convertAndSend(connectionMessageResponse.getNameFileResponse(),mapperObj.writeValueAsString(connectionMessageResponse));
                else
                    System.out.println("Rien trouvé");
            }
            else{
                System.out.println("REPONSE : "+ collaborator.getFirstName() + " " + collaborator.getLastName());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
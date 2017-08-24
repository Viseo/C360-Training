package com.viseo.c360.formation.amqp;

import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import org.codehaus.jackson.map.ObjectMapper;
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
            CollaboratorDescription collaborator = mapperObj.readValue(request, CollaboratorDescription.class);
            System.out.println("Halelujah j'ai reçu ça   : " + request);
            if(collaborator.getFirstName() == null){
                Collaborator c = ws.getCollaboratorByLogin(collaborator.getEmail());
                System.out.println("Le voila = " + c.getFirstName());
                if(c.getFirstName() != null)
                    rabbitTemplate.convertAndSend(responseCompetence.getName(),mapperObj.writeValueAsString(c));
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
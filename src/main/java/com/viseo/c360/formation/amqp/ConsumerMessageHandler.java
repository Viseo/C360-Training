package com.viseo.c360.formation.amqp;

/**
 * Created by SJO3662 on 28/07/2017.
 */
import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;

import javax.inject.Inject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ConsumerMessageHandler {

    CollaboratorDAO collaboratorDAO = new CollaboratorDAO();

    public List<String> handleMessage(String request) {
        try {
            Collaborator collaborator = new ObjectMapper().readValue(request, Collaborator.class );
            System.out.println("Message Received at consumer end  : " + collaborator.getFirstName());
            Collaborator c = collaboratorDAO.getCollaboratorByLogin(collaborator.getEmail());
            System.out.println("COLLAB"+ c.getPassword()+ "COLLABAUTRE" + collaborator.getPassword());

        } catch (IOException e) {
            e.printStackTrace();
        }

        List<String> list = new ArrayList<String>();
        list.add("Hello.....");
        list.add("This is my response de C360_formation...");

        return list;

    }
}
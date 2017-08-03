package com.viseo.c360.formation.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.formation.converters.wish.DescriptionToWish;
import com.viseo.c360.formation.converters.wish.WishToDescription;
import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.dao.TrainingDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.collaborator.Wish;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.dto.collaborator.WishDescription;
import com.viseo.c360.formation.exceptions.C360Exception;
import com.viseo.c360.formation.exceptions.dao.UniqueFieldException;
import com.viseo.c360.formation.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.formation.exceptions.dao.util.UniqueFieldErrors;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import static java.util.Collections.emptyList;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class CollaboratorServicesImpl {

    @Inject
    private CollaboratorDAO collaboratorDAO;

    @Inject
    private TrainingDAO trainingDAO;

    @Inject
    private ExceptionUtil exceptionUtil;

    @Inject
    private RabbitTemplate rabbitTemplate;

    private static final ConcurrentHashMap<String, CollaboratorDescription> mapUserCache = new ConcurrentHashMap<>();


    public CollaboratorDescription handleReceivedCollaborator(CollaboratorDescription myCollaboratorDescription, CollaboratorDescription receivedCollab) {
        Collaborator storedCollaborator = collaboratorDAO.getCollaboratorByLoginPassword(myCollaboratorDescription.getEmail(), myCollaboratorDescription.getPassword());

        CollaboratorDescription addedCollaborator;

        if (isEmpty(storedCollaborator.getEmail())) {
            receivedCollab.setId(0);
            addedCollaborator = addCollaborator(receivedCollab);
            System.out.println("ADDEDCOLLAB" + addedCollaborator.getFirstName());
            return addedCollaborator;
        } else {
            // A COMPLETEE
            return null;
        }
    }

    public CollaboratorDescription checkIfCollaboratorExistElsewhere(CollaboratorDescription myCollaboratorDescription) {
        ObjectMapper mapperObj = new ObjectMapper();

        CollaboratorDescription receivedCollab;

        try {
            String consumerResponse = (String) this.rabbitTemplate.convertSendAndReceive(mapperObj.writeValueAsString(myCollaboratorDescription));

            if (consumerResponse != null) {
                receivedCollab = new ObjectMapper().readValue(consumerResponse, CollaboratorDescription.class);
                System.out.println("Received Collaborator : " + receivedCollab.getFirstName() + receivedCollab.getLastName());
                receivedCollab = handleReceivedCollaborator(myCollaboratorDescription, receivedCollab);

                return receivedCollab;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    public WishDescription addWish(String label, Long collaborator_id) {

        try {

            // TODO : Penser a faire du defensive programming

            Collaborator collaborator = collaboratorDAO.getCollaborator(collaborator_id);

            WishDescription wishDescription = new WishDescription.WishDescriptionBuilder(label, (new CollaboratorToDescription().convert(collaborator))).build();

            Wish wish = collaboratorDAO.addWish(new DescriptionToWish().convert(wishDescription));

            return new WishToDescription().convert(wish);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }
}
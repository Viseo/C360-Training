package com.viseo.c360.formation.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToIdentity;
import com.viseo.c360.formation.converters.collaborator.DescriptionToCollaborator;
import com.viseo.c360.formation.converters.requestTraining.DescriptionToRequestTraining;
import com.viseo.c360.formation.converters.requestTraining.RequestTrainingToDescription;
import com.viseo.c360.formation.converters.trainingsession.TrainingSessionToDescription;
import com.viseo.c360.formation.converters.wish.DescriptionToWish;
import com.viseo.c360.formation.converters.wish.WishToDescription;
import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.dao.TrainingDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.collaborator.RequestTraining;
import com.viseo.c360.formation.domain.collaborator.Wish;
import com.viseo.c360.formation.domain.training.Topic;
import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.domain.training.TrainingSession;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.dto.collaborator.CollaboratorIdentity;
import com.viseo.c360.formation.dto.collaborator.RequestTrainingDescription;
import com.viseo.c360.formation.dto.collaborator.WishDescription;
import com.viseo.c360.formation.dto.training.TrainingSessionDescription;
import com.viseo.c360.formation.email.sendMessage;
import com.viseo.c360.formation.exceptions.C360Exception;
import com.viseo.c360.formation.exceptions.dao.PersistentObjectNotFoundException;
import com.viseo.c360.formation.exceptions.dao.UniqueFieldException;
import com.viseo.c360.formation.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.formation.exceptions.dao.util.UniqueFieldErrors;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.convert.ConversionException;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.mail.MessagingException;
import javax.persistence.PersistenceException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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

    public List<WishDescription> getAllWishes() {
        try {
            return new WishToDescription().convert(collaboratorDAO.getIsNotCheckedWishes());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public List<WishDescription> getIsValidatedWishes() {
        try {
            return new WishToDescription().convert(collaboratorDAO.getIsValidatedWishes());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public WishDescription updateKoWish(WishDescription Wish, Long collaborator_id) {
        try {
            Wish wishToUpdate = new DescriptionToWish().convert(Wish);
            if (wishToUpdate == null) throw new PersistentObjectNotFoundException(15, Wish.class);
            Collaborator collaboratorToUpdate = collaboratorDAO.getCollaborator(collaborator_id);
            if (collaboratorToUpdate == null) throw new PersistentObjectNotFoundException(15, Collaborator.class);
            wishToUpdate = collaboratorDAO.addVoteKoToWish(wishToUpdate, collaboratorToUpdate);
            return new WishToDescription().convert(wishToUpdate);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public WishDescription updateOkWish(WishDescription Wish, Long collaborator_id) {
        try {
            Wish wishOkToUpdate = new DescriptionToWish().convert(Wish);
            if (wishOkToUpdate == null) throw new PersistentObjectNotFoundException(15, Wish.class);
            Collaborator collaboratorToUpdate = collaboratorDAO.getCollaborator(collaborator_id);
            if (collaboratorToUpdate == null) throw new PersistentObjectNotFoundException(15, Collaborator.class);
            wishOkToUpdate = collaboratorDAO.addVoteOkToWish(wishOkToUpdate, collaboratorToUpdate);
            return new WishToDescription().convert(wishOkToUpdate);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public WishDescription changeKoToOk(WishDescription Wish, Long collaborator_id) {
        try {
            Wish wishToUpdate = new DescriptionToWish().convert(Wish);
            if (wishToUpdate == null) throw new PersistentObjectNotFoundException(15, Wish.class);
            Collaborator collaboratorToUpdate = collaboratorDAO.getCollaborator(collaborator_id);
            if (collaboratorToUpdate == null) throw new PersistentObjectNotFoundException(15, Collaborator.class);
            wishToUpdate = collaboratorDAO.changeVoteKoToOk(wishToUpdate, collaboratorToUpdate);
            return new WishToDescription().convert(wishToUpdate);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public WishDescription changeOkToKo(WishDescription Wish, Long collaborator_id) {
        try {
            Wish wishOkToUpdate = new DescriptionToWish().convert(Wish);
            if (wishOkToUpdate == null) throw new PersistentObjectNotFoundException(15, Wish.class);
            Collaborator collaboratorToUpdate = collaboratorDAO.getCollaborator(collaborator_id);
            if (collaboratorToUpdate == null) throw new PersistentObjectNotFoundException(15, Collaborator.class);
            wishOkToUpdate = collaboratorDAO.changeVoteOkToKo(wishOkToUpdate, collaboratorToUpdate);
            return new WishToDescription().convert(wishOkToUpdate);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public List<WishDescription> updateIsChecked(List<WishDescription> Wishes) {
        List<WishDescription> updatedWishes = new ArrayList<>();
        try {
            for (int i = 0; i < Wishes.size(); i++) {
                Wish wishToUpdate = new DescriptionToWish().convert(Wishes.get(i));
                if (wishToUpdate == null) throw new PersistentObjectNotFoundException(15, Wish.class);
                wishToUpdate = collaboratorDAO.updateIsChecked(wishToUpdate);
                updatedWishes.add(new WishToDescription().convert(wishToUpdate));
            }
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
        return updatedWishes;
    }

    public CollaboratorDescription addCollaborator(CollaboratorDescription collaboratorDescription) {
        try {
            collaboratorDescription.setDefaultPicture(true);
            Collaborator collaborator = collaboratorDAO.addCollaborator(new DescriptionToCollaborator().convert(collaboratorDescription));
            return new CollaboratorToDescription().convert(collaborator);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    public CollaboratorDescription updateCollaborator(CollaboratorDescription collaborator) {
        try {
            Collaborator collaboratorToUpdate = collaboratorDAO.updateCollaborator(new DescriptionToCollaborator().convert(collaborator));
            return new CollaboratorToDescription().convert(collaboratorToUpdate);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    public List<CollaboratorIdentity> getAllCollaborators() {
        try {
            return new CollaboratorToIdentity().convert(collaboratorDAO.getAllCollaborators());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public CollaboratorDescription getCollaboratorById(Long collab_id) {
        try {
            return new CollaboratorToDescription().convert(collaboratorDAO.getCollaboratorById(collab_id));
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public List<CollaboratorIdentity> getNotAffectedCollaboratorsList(Long id) {
        try {
            TrainingSession trainingSession = trainingDAO.getSessionTraining(id);
            if (trainingSession == null) throw new PersistentObjectNotFoundException(id, TrainingSession.class);
            return new CollaboratorToIdentity().convert(collaboratorDAO.getNotAffectedCollaborators(trainingSession));
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public List<CollaboratorIdentity> getAffectedCollaboratorsList(Long id) {
        try {
            TrainingSession trainingSession = trainingDAO.getSessionTraining(id);
            if (trainingSession == null) throw new PersistentObjectNotFoundException(id, TrainingSession.class);
            return new CollaboratorToIdentity().convert(trainingSession.getCollaborators());
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public RequestTrainingDescription addRequestTraining(RequestTrainingDescription requestTrainingDescription) {
        Topic topic = trainingDAO.getTopic(requestTrainingDescription.getTrainingDescription().getTopicDescription().getId());
        Collaborator collaborator = collaboratorDAO.getCollaborator(requestTrainingDescription.getCollaboratorIdentity().getId());
        RequestTraining requestTraining = new DescriptionToRequestTraining().convert(requestTrainingDescription, collaborator, topic);
        requestTraining = collaboratorDAO.addRequestTraining(requestTraining);
        return new RequestTrainingToDescription().convert(requestTraining);
    }

    public List<RequestTraining> addRequestTrainingAssign(Long session_id,List<Long> id_collaborators) {
        try {
            List<RequestTraining> requestTrainings = new ArrayList<>();
            List<Collaborator> collaborators = new ArrayList<>();
            for (int i = 0; i < id_collaborators.size(); i++) {
                collaborators.add(collaboratorDAO.getCollaborator(id_collaborators.get(i)));
            }
            TrainingSession session = trainingDAO.getSessionTraining(session_id);
            Training training = session.getTraining();
            for (int i = 0; i < collaborators.size(); i++) {
                RequestTraining requestTraining = new RequestTraining();
                requestTraining.setTraining(training);
                requestTraining.addSession(session);
                requestTraining.setValidated(true);
                requestTraining.setCollaborator(collaborators.get(i));
                requestTraining = collaboratorDAO.addRequestTraining(requestTraining);
                requestTrainings.add(requestTraining);
            }
            return requestTrainings;
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    public List<RequestTrainingDescription> getRequestTrainings(Long training_id,Long collab_id) {
        return new RequestTrainingToDescription().convert(collaboratorDAO.getRequestTrainings(training_id, collab_id));
    }

    public List<CollaboratorIdentity> getCollaboratorsRequestingListByTrainingSession(Long id) {
        TrainingSession trainingSession;
        try {
            trainingSession = trainingDAO.getSessionTraining(id);
            return new CollaboratorToIdentity().convert(collaboratorDAO.getCollaboratorsRequestingBySession(trainingSession));
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    public CollaboratorDescription updateCollaboratorPassword(String collaboratorPassword,String collabId) {
        try {
            Collaborator collaborator = collaboratorDAO.getCollaborator(Long.parseLong(collabId));
            if (collaborator == null) throw new PersistentObjectNotFoundException(15, Collaborator.class);
            collaborator = collaboratorDAO.updateCollaboratorPassword(collaborator, collaboratorPassword);
            return new CollaboratorToDescription().convert(collaborator);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    public void sendCollaboratorEmail(String collaboratorId) {
        try {
            Collaborator collaborator = collaboratorDAO.getCollaborator(Long.parseLong(collaboratorId));
            sendMessage sendmessage = new sendMessage();
            try {
                sendmessage.main(collaborator.getEmail(), collaborator.getId());
            } catch (MessagingException e) {
                e.printStackTrace();
            }
            if (collaborator == null) throw new PersistentObjectNotFoundException(15, Collaborator.class);

        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }
        public TrainingSessionDescription updateCollaboratorsTrainingSession(Long idTrainingSession,List<CollaboratorIdentity> collaboratorIdentities) {
        try {
            TrainingSession trainingSession = trainingDAO.getSessionTraining(idTrainingSession);
            if (trainingSession == null)
                throw new PersistentObjectNotFoundException(idTrainingSession, TrainingSession.class);
            trainingSession = collaboratorDAO.affectCollaboratorsTrainingSession(trainingSession, collaboratorIdentities);
            return new TrainingSessionToDescription().convert(trainingSession);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

        public List<WishDescription> getIsNotCheckedWishes() {
        try {
            return new WishToDescription().convert(collaboratorDAO.getIsNotCheckedWishes());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

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
            return new CollaboratorToDescription().convert(storedCollaborator);
        }
    }

    public CollaboratorDescription checkIfCollaboratorExistElsewhere(CollaboratorDescription myCollaboratorDescription) {
        ObjectMapper mapperObj = new ObjectMapper();

        CollaboratorDescription receivedCollab = null;

        try {
            String consumerResponse = (String) this.rabbitTemplate.convertSendAndReceive(mapperObj.writeValueAsString(myCollaboratorDescription));

            if (consumerResponse != null) {
                receivedCollab = new ObjectMapper().readValue(consumerResponse, CollaboratorDescription.class);
                System.out.println("Received Collaborator : " + receivedCollab.getFirstName() + receivedCollab.getLastName());
            }
                receivedCollab = handleReceivedCollaborator(myCollaboratorDescription, receivedCollab);

                return receivedCollab;

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
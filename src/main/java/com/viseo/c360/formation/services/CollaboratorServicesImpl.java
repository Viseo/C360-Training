package com.viseo.c360.formation.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.GetResponse;
import com.viseo.c360.formation.amqp.RabbitMessage;
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
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.ChannelCallback;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.convert.ConversionException;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import javax.mail.MessagingException;
import javax.persistence.PersistenceException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
public class CollaboratorServicesImpl {

    @Inject
    private CollaboratorDAO collaboratorDAO;

    @Inject
    private FanoutExchange fanout;

    @Inject
    Queue responseFormation;

    @Inject
    Queue responseCompetence;

    @Inject
    private TrainingDAO trainingDAO;

    @Inject
    private ExceptionUtil exceptionUtil;

    @Inject
    private RabbitTemplate rabbitTemplate;

    private boolean compteExisteInOtherApp = false;


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

        RabbitMessage checkIfUserExist = new RabbitMessage();
        UUID personalMessageSequence = UUID.randomUUID();
        checkIfUserExist.setCollaboratorDescription(collaboratorDescription).
                setMessageDate(new Date()).
                setNameFileResponse(responseFormation.getName()).
                setSequence(personalMessageSequence);
        ObjectMapper mapper = new ObjectMapper();
        try{
            rabbitTemplate.convertAndSend(fanout.getName(),"",mapper.writeValueAsString(checkIfUserExist));
        }catch (Exception e){
            e.printStackTrace();
        }

        RabbitMessage connectedUser = this.rabbitTemplate.execute(new ChannelCallback<RabbitMessage>() {

            @Override
            public RabbitMessage doInRabbit(final Channel channel) throws Exception {
                long startTime = System.currentTimeMillis();
                long elapsedTime = 0;
                RabbitMessage mostRecentConsumerResponse = null;
                GetResponse consumerResponse;
                long deliveryTag;
                sleep();
                do {
                    elapsedTime = (new Date()).getTime() - startTime;
                    consumerResponse = channel.basicGet(responseFormation.getName(), false);
                    if (consumerResponse != null) {
                        deliveryTag = consumerResponse.getEnvelope().getDeliveryTag();
                        RabbitMessage rabbitMessageResponse = new ObjectMapper().readValue(consumerResponse.getBody(), RabbitMessage.class);
                        channel.basicAck(deliveryTag, true);
                        if (rabbitMessageResponse.getSequence().equals(personalMessageSequence)) {
                            if (mostRecentConsumerResponse == null ||
                                    rabbitMessageResponse.getCollaboratorDescription().getLastUpdateDate()
                                            .after(mostRecentConsumerResponse.getCollaboratorDescription().getLastUpdateDate())) {
                                mostRecentConsumerResponse = rabbitMessageResponse;
                            }
                        } else {
                            channel.basicPublish("", responseFormation.getName(), null, consumerResponse.getBody());
                        }
                        System.out.println("compte existe!");
                        compteExisteInOtherApp = true;
                        return null;
                    }
                    else{
                        System.out.println("compte existe pas!");
                        compteExisteInOtherApp = false;
                    }
                } while (consumerResponse != null && elapsedTime < 2000);
                return mostRecentConsumerResponse;
            }
        });
        if (compteExisteInOtherApp){
            //if the email is already exist in other microservice
            throw new UniqueFieldException("email");
        }
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

    public List<RequestTraining> addRequestTrainingAssign(Long session_id, List<Long> id_collaborators) {
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

    public List<RequestTrainingDescription> getRequestTrainings(Long training_id, Long collab_id) {
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

    public CollaboratorDescription updateCollaboratorPassword(String collaboratorPassword, String collabId) {
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

    public TrainingSessionDescription updateCollaboratorsTrainingSession(Long idTrainingSession, List<CollaboratorIdentity> collaboratorIdentities) {
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
        Collaborator storedCollaborator = collaboratorDAO.getCollaboratorByLogin(myCollaboratorDescription.getEmail());

        CollaboratorDescription addedCollaborator;

        if (isEmpty(storedCollaborator.getEmail())) {
            if (receivedCollab.getPassword().equals(myCollaboratorDescription.getPassword())) {
                receivedCollab.setId(0);
                addedCollaborator = addCollaboratorDirectly(receivedCollab);
                System.out.println("ADDEDCOLLAB" + addedCollaborator.getFirstName());
                return addedCollaborator;
            } else
                return null;
        } else {
            //  COMPLET
            CollaboratorDescription storedcollaboratorDescription = new CollaboratorToDescription().convert(storedCollaborator);

            if (receivedCollab == null || receivedCollab.getFirstName() == null || (storedcollaboratorDescription.getPassword().equals(receivedCollab.getPassword()) && (storedcollaboratorDescription.getPassword().equals(myCollaboratorDescription.getPassword()))) || (storedcollaboratorDescription.getLastUpdateDate().after(receivedCollab.getLastUpdateDate()) && storedcollaboratorDescription.getPassword().equals(myCollaboratorDescription.getPassword()))) {
                System.out.println("MOT DE PASSE IDENTIQUE OU PLUS RECENT");
                return storedcollaboratorDescription;
            } else if ((myCollaboratorDescription.getPassword().equals(receivedCollab.getPassword())) && (storedcollaboratorDescription.getLastUpdateDate().before(receivedCollab.getLastUpdateDate()))) {
                storedcollaboratorDescription = updateCollaboratorPassword(receivedCollab.getPassword(), String.valueOf(storedcollaboratorDescription.getId()));
                return storedcollaboratorDescription;
            } else {
                System.out.println("MOT DE PASSE MOINS RECENT");

                return null;
            }

        }
    }

    private CollaboratorDescription addCollaboratorDirectly(CollaboratorDescription collaboratorDescription){
        try {
            System.out.println("ADDING COLLABORAOR DIRECTLY");
            collaboratorDescription.setDefaultPicture(true);
            Collaborator collaborator = collaboratorDAO.addCollaborator(new DescriptionToCollaborator().convert(collaboratorDescription));
            return new CollaboratorToDescription().convert(collaborator);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    private boolean shouldNotUpdateCollaboratorData(CollaboratorDescription storedcollaboratorDescription, CollaboratorDescription receivedCollab, CollaboratorDescription myCollaboratorDescription) {
        return receivedCollab != null &&
                receivedCollab.getFirstName() != null &&
                (!storedcollaboratorDescription.getPassword().equals(myCollaboratorDescription.getPassword()) &&
                        (!storedcollaboratorDescription.getPassword().equals(receivedCollab.getPassword()) ||
                                (!storedcollaboratorDescription.getLastUpdateDate().before(receivedCollab.getLastUpdateDate()))));


    }

    public void sleep() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
        }
    }

    public CollaboratorDescription checkIfCollaboratorExistElsewhere(CollaboratorDescription inputCollaboratorData) {
        ObjectMapper mapperObj = new ObjectMapper();
        UUID personalMessageSequence = UUID.randomUUID();
        RabbitMessage connectionMessage = new RabbitMessage()
                .setCollaboratorDescription(inputCollaboratorData)
                .setNameFileResponse(responseFormation.getName())
                .setSequence(personalMessageSequence)
                .setMessageDate(new Date());
        try {
            this.rabbitTemplate.convertAndSend(fanout.getName(), "", mapperObj.writeValueAsString(connectionMessage));
            RabbitMessage mostRecentRemoteCollaborator = null;
            mostRecentRemoteCollaborator = this.rabbitTemplate.execute(new ChannelCallback<RabbitMessage>() {

                @Override
                public RabbitMessage doInRabbit(final Channel channel) throws Exception {
                    long startTime = System.currentTimeMillis();
                    long elapsedTime = 0;
                    RabbitMessage mostRecentConsumerResponse = null;
                    GetResponse consumerResponse;
                    long deliveryTag;
                    sleep();
                    do {
                        elapsedTime = (new Date()).getTime() - startTime;
                        consumerResponse = channel.basicGet(responseFormation.getName(), false);
                        if (consumerResponse != null) {
                            deliveryTag = consumerResponse.getEnvelope().getDeliveryTag();
                            RabbitMessage rabbitMessageResponse = new ObjectMapper().readValue(consumerResponse.getBody(), RabbitMessage.class);
                            channel.basicAck(deliveryTag, true);
                            if ((new Date().getTime() - rabbitMessageResponse.getMessageDate().getTime()) < 50000) {
                                if (rabbitMessageResponse.getSequence().equals(personalMessageSequence)) {
                                    if (mostRecentConsumerResponse == null ||
                                            rabbitMessageResponse.getCollaboratorDescription().getLastUpdateDate()
                                                    .after(mostRecentConsumerResponse.getCollaboratorDescription().getLastUpdateDate())) {
                                        mostRecentConsumerResponse = rabbitMessageResponse;
                                    }
                                } else {
                                    channel.basicPublish("", responseFormation.getName(), null, consumerResponse.getBody());
                                }
                            }
                        }
                    } while (consumerResponse != null && elapsedTime < 2000);


                    return mostRecentConsumerResponse;
                }
            });
            if (mostRecentRemoteCollaborator != null)
                return mostRecentRemoteCollaborator.getCollaboratorDescription();
            return null;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
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
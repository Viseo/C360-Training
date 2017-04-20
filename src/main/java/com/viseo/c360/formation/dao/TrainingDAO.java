package com.viseo.c360.formation.dao;

import java.util.Collection;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.*;


import com.viseo.c360.formation.dao.db.DAOFacade;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.training.Topic;
import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.domain.training.TrainingSession;
import com.viseo.c360.formation.exceptions.dao.PersistentObjectNotFoundException;
import com.viseo.c360.formation.exceptions.dao.TrainingSessionException;
import com.viseo.c360.formation.exceptions.dao.util.TrainingSessionErrors;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import static com.viseo.c360.formation.dao.db.DAOFacade.Parameter.param;

@Repository
public class TrainingDAO {

    @Inject
    DAOFacade daoFacade;

    /***
     * Training
     ***/
    public Training getTraining(long id) {
        return daoFacade.find(Training.class, id);
    }

    @Transactional
    public Training addTraining(Training training) throws PersistenceException {
        daoFacade.persist(training);
        daoFacade.flush();
        return training;
    }

    public List<Training> getAllTrainings() {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select a from Training a");
    }

    @Transactional
    public Training updateTrainingTopic(Training training, String trainingTopic){
        training = daoFacade.merge(training);
        training.setTrainingTitle(trainingTopic);
        daoFacade.flush();
        return training;
    }

    /***
     * Topic
     ***/
    @Transactional
    public Topic addTopic(Topic topic) throws PersistenceException {
        daoFacade.persist(topic);
        daoFacade.flush();
        return topic;
    }

    public Topic getTopic(long id){
        return daoFacade.find(Topic.class,id);
    }

    public List<Topic> getAllTopics(){
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select t from Topic t");
    }


    /***
     * Session Training
     ***/
    public List<TrainingSession> getSessionByTraining(long myTrainingId) {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select s from TrainingSession s where s.training.id=:myTrainingId",
        param("myTrainingId", myTrainingId));
    }

    public List<TrainingSession> getRequestedSessionByTraining(long myTrainingId, long byCollabId) {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select s from RequestTraining t join t.sessions s where t.training.id=:myTrainingId and t.collaborator.id=:byCollabId",
                param("myTrainingId", myTrainingId),
                param("byCollabId", byCollabId));
    }


    public List<TrainingSession> getAllTrainingSessions() {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select s from TrainingSession s");
    }

    @Transactional
    public TrainingSession getSessionTraining(long id) throws PersistentObjectNotFoundException{
            TrainingSession trainingSession = daoFacade.find(TrainingSession.class, id);
            if (trainingSession == null) throw new PersistentObjectNotFoundException(id, TrainingSession.class);
            trainingSession.getCollaborators().size();
            return trainingSession;
    }

    @Transactional
    public TrainingSession addSessionTraining(TrainingSession trainingSession) {
        if (this.isThereOneSessionTrainingAlreadyPlanned(trainingSession)){
            throw new TrainingSessionException(TrainingSessionErrors.TRAINING_SESSION_ALREADY_PLANNED.getMessage());
        }
        if(!trainingSession.getBeginning().before(trainingSession.getEnding())) {
            throw new TrainingSessionException(TrainingSessionErrors.TRAINING_SESSION_INCORRECT_DATES.getMessage());
        }
        daoFacade.persist(trainingSession);
        daoFacade.flush();
        return trainingSession;
    }

    @Transactional
    public TrainingSession removeTrainingSession(TrainingSession trainingSession){
        daoFacade.remove(trainingSession);
        daoFacade.flush();
        return trainingSession;
    }

    @Transactional
    public TrainingSession updateTrainingSession(TrainingSession trainingSession, TrainingSession trainingSessionTemp){
        if (this.isThereOneSessionTrainingAlreadyPlanned(trainingSessionTemp)){
            throw new TrainingSessionException(TrainingSessionErrors.TRAINING_SESSION_ALREADY_PLANNED.getMessage());
        }
        if(!trainingSessionTemp.getBeginning().before(trainingSessionTemp.getEnding())) {
            throw new TrainingSessionException(TrainingSessionErrors.TRAINING_SESSION_INCORRECT_DATES.getMessage());
        }
        trainingSession = daoFacade.merge(trainingSession);
        trainingSession.setBeginning(trainingSessionTemp.getBeginning());
        trainingSession.setEnding(trainingSessionTemp.getEnding());
        trainingSession.setLocation(trainingSessionTemp.getLocation());
        daoFacade.flush();
        return trainingSession;
    }

    @Transactional
    public TrainingSession addCollaboratorToTrainingSession(TrainingSession trainingSession, List<Collaborator> collaborators){
        trainingSession = daoFacade.merge(trainingSession);
        for(int i=0;i<collaborators.size();i++){
            trainingSession.addCollaborator(collaborators.get(i));
        }
        daoFacade.flush();
        return trainingSession;
    }

    public boolean isThereOneSessionTrainingAlreadyPlanned(TrainingSession trainingSession) {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        List<TrainingSession> list = daoFacade.getList("select s from TrainingSession s " +
                "where s.training=:training and s.id != :trainingSessionId and s.location =:trainingSessionLocation and" +
                "( (s.beginning >= :beginning and s.beginning < :ending) or" +
                "(s.ending >= :beginning and s.ending <= :ending) or " +
                "(s.beginning <= :beginning and s.ending >= :ending) )",
                param("trainingSessionId", trainingSession.getId()),
                param("trainingSessionLocation", trainingSession.getLocation()),
                param("training", trainingSession.getTraining()),
                param("beginning", trainingSession.getBeginning()),
                param("ending", trainingSession.getEnding()));
        return !list.isEmpty();
    }
}

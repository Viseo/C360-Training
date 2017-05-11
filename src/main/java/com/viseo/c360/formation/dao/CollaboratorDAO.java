package com.viseo.c360.formation.dao;

import java.util.*;


import com.viseo.c360.formation.dao.db.DAOFacade;
import com.viseo.c360.formation.domain.collaborator.RequestTraining;
import com.viseo.c360.formation.domain.collaborator.Wish;
import com.viseo.c360.formation.domain.training.TrainingSession;
import com.viseo.c360.formation.dto.collaborator.CollaboratorIdentity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import static com.viseo.c360.formation.dao.db.DAOFacade.Parameter.param;

import com.viseo.c360.formation.domain.collaborator.Collaborator;

import javax.inject.Inject;
import javax.persistence.FlushModeType;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceException;

@Repository
public class CollaboratorDAO {

    @Inject
    DAOFacade daoFacade;

    //wish
    @Transactional
    public Wish addWish(Wish wish) throws PersistenceException {
        daoFacade.persist(wish);
        daoFacade.flush();
        return wish;
    }

    @Transactional
    public Wish removeWish(Wish wish){
        daoFacade.remove(wish);
        daoFacade.flush();
        return wish;
    }

    @Transactional
    public Wish addVoteOkToWish(Wish wish, Collaborator collaborator){
        wish = daoFacade.merge(wish);
        wish.addVote_ok(collaborator);
        daoFacade.flush();
        return wish;
    }

    @Transactional
    public Wish addVoteKoToWish(Wish wish, Collaborator collaborator){
        wish = daoFacade.merge(wish);
        wish.addVote_ko(collaborator);
        daoFacade.flush();
        return wish;
    }

    @Transactional
    public Wish changeVoteOkToKo(Wish wish, Collaborator collaborator){
        wish = daoFacade.merge(wish);
        wish.removeVote_ok(collaborator);
        wish.addVote_ko(collaborator);
        daoFacade.flush();
        return wish;
    }

    @Transactional
    public Wish changeVoteKoToOk(Wish wish, Collaborator collaborator){
        wish = daoFacade.merge(wish);
        wish.removeVote_ko(collaborator);
        wish.addVote_ok(collaborator);
        daoFacade.flush();
        return wish;
    }

    public List<Wish> getIsNotCheckedWishes(){
        List<Wish> listWish = daoFacade.getList(
                "select w from Wish w where w.isChecked = false");
        return listWish;
    }

    public List<Wish> getAllWishes(){
        List<Wish> listWish = daoFacade.getList(
                "select w from Wish w");
        return listWish;
    }

    //collaborateur
    @Transactional
    public Collaborator addCollaborator(Collaborator collaborator) throws PersistenceException {
        daoFacade.persist(collaborator);
        daoFacade.flush();
        return collaborator;
    }

    public Collaborator getCollaboratorByLoginPassword(String personnalEmail,String personnalPassword){
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        Collaborator registredUser =
                (Collaborator) daoFacade.getSingle(
                        "select c from Collaborator c where c.email = :personnalEmail and c.password = :personnalPassword",
                        param("personnalEmail",personnalEmail), param("personnalPassword",personnalPassword));
        return registredUser;
    }

    public Collaborator getCollaboratorByLogin(String personnalEmail){
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        Collaborator registredUser =
                (Collaborator) daoFacade.getSingle(
                        "select c from Collaborator c where c.email = :personnalEmail",
                        param("personnalEmail",personnalEmail));
        return registredUser;
    }

    public List<Collaborator> getAllCollaborators() {
        return daoFacade.getList("select c from Collaborator c");
    }

    public List<RequestTraining> getRequestTrainings(long training_id,long collab_id){
        List<RequestTraining> result = new ArrayList<>();
        try{
            result =
        daoFacade.getList("select r from RequestTraining r where r.training.id =:training_id and r.collaborator.id =:collab_id",
                param("training_id",training_id),param("collab_id",collab_id));
        } catch (NoResultException e){
            System.out.println(e);
        }
        return result;
    }

    public Collaborator getCollaborator(long id) {
        return daoFacade.find(Collaborator.class, id);
    }

    //request training
    @Transactional
    public RequestTraining addRequestTraining(RequestTraining requestTraining) throws PersistenceException {
        daoFacade.persist(requestTraining);
        daoFacade.flush();
        return requestTraining;
    }


    @Transactional
    public Collaborator updateCollaboratorPassword(Collaborator collaborator, String collaboratorPassword){

        collaborator = daoFacade.merge(collaborator);
        collaborator.setPassword(collaboratorPassword);
        daoFacade.flush();
        return collaborator;
    }

    public TrainingSession affectCollaboratorsTrainingSession(TrainingSession trainingSession, List<CollaboratorIdentity> collaboratorIdentities)
            throws PersistenceException
    {
        trainingSession = daoFacade.merge(trainingSession);
        trainingSession.removeCollaborators();
        for (CollaboratorIdentity collaboratorIdentity : collaboratorIdentities) {
            trainingSession.addCollaborator(daoFacade.find(Collaborator.class, collaboratorIdentity.getId()));
        }
        daoFacade.flush();
        return trainingSession;
    }

    public List<Collaborator> getNotAffectedCollaborators(TrainingSession myTrainingSession) {
        if (!myTrainingSession.getCollaborators().isEmpty()) {
            List<Collaborator> listCollaborator = daoFacade.getList(
                    "select c from Collaborator c where c NOT IN :listCollaborators",
                    param("listCollaborators", myTrainingSession.getCollaborators()));
            return listCollaborator;
        } else {
            List<Collaborator> listCollaborator = daoFacade.getList("select c from Collaborator c");
            return listCollaborator;
        }
    }

    public List<Collaborator> getCollaboratorsRequestingBySession(TrainingSession myTrainnigSession){
        List<Collaborator> listCollaborator =  daoFacade.getList(
                "select r.collaborator from RequestTraining r join r.sessions rs where rs = :session",
                param("session", myTrainnigSession));
        return listCollaborator;
    }
}


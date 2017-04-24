package com.viseo.c360.formation.dao;

import java.util.*;


import com.viseo.c360.formation.dao.db.DAOFacade;
import com.viseo.c360.formation.domain.collaborator.RequestTraining;
import com.viseo.c360.formation.domain.training.TrainingSession;
import com.viseo.c360.formation.dto.collaborator.CollaboratorIdentity;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import static com.viseo.c360.formation.dao.db.DAOFacade.Parameter.param;

import com.viseo.c360.formation.domain.collaborator.Collaborator;

import javax.inject.Inject;
import javax.persistence.FlushModeType;
import javax.persistence.PersistenceException;

@Repository
public class CollaboratorDAO {

    @Inject
    DAOFacade daoFacade;

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


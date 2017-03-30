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

    public List<Collaborator> getCollaboratorsRequestingBySession(TrainingSession myTrainnigSession) {
        Set<Collaborator> listCollaborator = new HashSet<Collaborator>((Collection) daoFacade.getList(
                "select c from RequestTraining r Inner Join r.collaborator c Inner Join r.sessions s Where s = :session",
                param("session", myTrainnigSession)));
        listCollaborator.addAll((Collection) daoFacade.getList(
                "select c from RequestTraining r Inner Join r.collaborator c Where r.training = :training",
                param("training", myTrainnigSession.getTraining())));
        listCollaborator.removeAll(daoFacade.getList(
                "select c from TrainingSession s Inner Join s.collaborators c Where s.training = :training",
                param("training", myTrainnigSession.getTraining())));
        return new ArrayList<>(listCollaborator);
    }
}


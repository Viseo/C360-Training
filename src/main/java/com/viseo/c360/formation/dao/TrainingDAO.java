package com.viseo.c360.formation.dao;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.*;


import com.viseo.c360.formation.converters.collaborator.CollaboratorToIdentity;
import com.viseo.c360.formation.dao.db.DAOFacade;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.collaborator.RequestTraining;
import com.viseo.c360.formation.domain.training.*;
import com.viseo.c360.formation.dto.training.TrainingScore;
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

    @Inject
    CollaboratorDAO collaboratorDAO;

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

    @Transactional
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

    //Feedback
    @Transactional
    public Feedback addFeedback(Feedback feedback) throws PersistenceException {
        if(feedback.getComment() == ""){ feedback.setComment(null); }
        daoFacade.persist(feedback);
        daoFacade.flush();
        return feedback;
    }

    @Transactional
    public List<Feedback> getAllFeedbacks(){
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select f from Feedback f");
    }

    @Transactional
    public List<TrainingScore> getTrainingsScore(){
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        List<TrainingScore> trainingscores = new ArrayList<>();
        return daoFacade.getList("select t,avg(f.score) from Feedback f join f.training t group by t");
    }

    @Transactional
    public List<Training> getTrainingsToGiveFeedbacks(Collaborator collaborator){
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        Date today = new Date();
        return daoFacade.getList("SELECT DISTINCT ts.training FROM TrainingSession ts JOIN ts.collaborators tsc WHERE :collaborator IN tsc AND ts.training NOT IN (SELECT f.training FROM Feedback f WHERE f.collaborator = :collaborator) AND ts.ending < :today",
                param("collaborator", collaborator),
                param("today", today));
    }

    @Transactional
    public List<Feedback> getFeedbackByTraining(Training training){
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("SELECT f FROM Feedback f WHERE f.training = :training AND f.comment IS NOT NULL",
                param("training", training));
    }

    @Transactional
    public Feedback delateFeedbackComment(Feedback feedback){
        feedback = daoFacade.merge(feedback);
        feedback.setComment(null);
        daoFacade.flush();
        return feedback;
    }

    @Transactional
    public Feedback addFeedbackLikes(Feedback feedback, Collaborator collaborator){
        feedback = daoFacade.merge(feedback);
        feedback.addLikers(collaborator);
        daoFacade.flush();
        return feedback;
    }

    @Transactional
    public Feedback removeFeedbackLikes(Feedback feedback,Collaborator collaborator){
        feedback = daoFacade.merge(feedback);
        feedback.removeLiker(collaborator);
        daoFacade.flush();
        return feedback;
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
    @Transactional
    public Topic removeTopic(Topic topic) throws PersistenceException {
        daoFacade.executeSQLRequest("Delete from trainingsession_collaborator tc where tc.trainingsession_id in (select ts.id from trainingsession ts where ts.training_id in (select t.id from training t where t.topic_id =:id))",param("id",topic.getId()));
        daoFacade.executeSQLRequest("Delete from requesttraining_trainingsession rtt where rtt.requesttraining_id in (select rt.id from requesttraining rt where rt.training_id in (select t.id from training t where t.topic_id =:id))",param("id",topic.getId()));
        daoFacade.executeRequest("Delete FROM RequestTraining rt WHERE rt.training.id in (SELECT t.id from Training t where t.topic.id =:id)",param("id",topic.getId()));
        daoFacade.executeRequest("Delete FROM TrainingSession ts WHERE ts.training.id in (SELECT t.id from Training t where t.topic.id =:id)",param("id",topic.getId()));
        daoFacade.executeRequest("Delete FROM Feedback f WHERE f.training.id in (select t.id from Training t where t.topic.id = :id)",param("id",topic.getId()));
        daoFacade.executeRequest("Delete FROM Training t WHERE t.topic.id =:id",param("id",topic.getId()));
        daoFacade.remove(topic);
        daoFacade.flush();
        return topic;
    }
    @Transactional
    public Training removeTraining(Training training) throws PersistenceException {
        daoFacade.executeSQLRequest("Delete from trainingsession_collaborator tc where tc.trainingsession_id in (select ts.id from trainingsession ts where ts.training_id =:training_id)",param("training_id",training.getId()));
        daoFacade.executeSQLRequest("Delete from requesttraining_trainingsession rtt where rtt.requesttraining_id in (select rt.id from requesttraining rt where rt.training_id = :training_id) ",param("training_id",training.getId()));
        daoFacade.executeRequest("Delete FROM RequestTraining rt WHERE rt.training.id=:training_id",param("training_id",training.getId()));
        daoFacade.executeRequest("Delete FROM TrainingSession ts WHERE ts.training.id=:training_id",param("training_id",training.getId()));
        daoFacade.executeRequest("Delete FROM Feedback f WHERE f.training.id = :training_id",param("training_id",training.getId()));
        daoFacade.remove(training);
        daoFacade.flush();
        return training;
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

    public List<Training> getTrainingBySession() {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select distinct s.training from TrainingSession s");
    }

    public List<TrainingSession> getSessionCollaborators() {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select s from TrainingSession s where s.ending > current_date");
    }

    public List<TrainingSession> getRequestedSessionByTraining(long myTrainingId, long byCollabId) {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select s from RequestTraining t join t.sessions s where t.training.id=:myTrainingId" +
                        " and t.collaborator.id=:byCollabId",
                param("myTrainingId", myTrainingId),
                param("byCollabId", byCollabId));
    }


    public List<TrainingSession> getAllTrainingSessions() {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select s from TrainingSession s");
    }

    public List<Collaborator> getCollaboratorsBySession(long sessionID){
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select sc from TrainingSession s join s.collaborators sc where s.id = :sessionID",
                param("sessionID", sessionID));
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
        daoFacade.executeSQLRequest("Delete FROM trainingsession_collaborator tc where tc.trainingsession_id = :id",param("id",trainingSession.getId()));
        daoFacade.executeSQLRequest("Delete FROM requesttraining_trainingsession rtt where rtt.sessions_id = :id",param("id",trainingSession.getId()));
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
    public TrainingSession addCollaboratorToTrainingSession(TrainingSession trainingSession,
                                                            List<Collaborator> collaborators){
        trainingSession = daoFacade.merge(trainingSession);
        for(int i=0;i<collaborators.size();i++){
            trainingSession.addCollaborator(collaborators.get(i));
            setIsValidated(collaborators.get(i),trainingSession.getTraining());
        }
        daoFacade.flush();
        return trainingSession;
    }

    public void setIsValidated(Collaborator collaborator, Training training){
        daoFacade.updateSingle("UPDATE RequestTraining ts SET ts.isValidated = 'true' WHERE ts.collaborator.id =:collaborator_id " +
                        "AND ts.training.id =:training_id",
                param("collaborator_id",collaborator.getId()),
                param("training_id",training.getId()));
        daoFacade.flush();
    }

    public boolean isThereOneSessionTrainingAlreadyPlanned(TrainingSession trainingSession) {
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        List<TrainingSession> list = daoFacade.getList("select s from TrainingSession s " +
                "where s.id != :trainingSessionId and s.location =:trainingSessionLocation and" +
                "( (s.beginning >= :beginning and s.beginning < :ending) or" +
                "(s.ending >= :beginning and s.ending <= :ending) or " +
                "(s.beginning <= :beginning and s.ending >= :ending) )",
                param("trainingSessionId", trainingSession.getId()),
                param("trainingSessionLocation", trainingSession.getLocation()),
                param("beginning", trainingSession.getBeginning()),
                param("ending", trainingSession.getEnding()));
        return !list.isEmpty();
    }

    public List<Training> getTrainings(Long collaborator_id){
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        return daoFacade.getList("select ts.training from TrainingSession ts  ");
    }

    @Transactional
    public CollaboratorRequestTraining getTrainingSession(Long collaborator_id, Long training_id){
        CollaboratorRequestTraining collaboratorRequestTraining = new CollaboratorRequestTraining();
        daoFacade.setFlushMode(FlushModeType.COMMIT);
        collaboratorRequestTraining.setTrainingSessions(daoFacade.getList("select ts from TrainingSession ts join ts.collaborators c" +
                        " where c.id =:collaborator_id and ts.training.id =:training_id and ts.ending > current_date",
                param("collaborator_id", collaborator_id),
                param("training_id", training_id)) );
        collaboratorRequestTraining.setRequestTrainingList(daoFacade.getList("SELECT rt.sessions FROM RequestTraining rt WHERE" +
                        " rt.collaborator.id =:collaborator_id" +
                        " AND rt.training.id =:training_id" +
                        " AND rt.isValidated = 'false'",
                param("collaborator_id", collaborator_id),
                param("training_id", training_id)));
        return collaboratorRequestTraining;
    }


    /***
     *Skill
     ***/
    @Transactional
    public Skill addSkill(Skill skill) throws PersistenceException {
        skill.setId(0);
        daoFacade.persist(skill);
        daoFacade.flush();
        return skill;
    }

    @Transactional
    public Skill getSkillById(long id) throws PersistenceException{
        Skill skill = daoFacade.find(Skill.class,id);
        return skill;
    }

    @Transactional
    public Skill updateSkill(Skill skill) throws PersistenceException {
        skill = daoFacade.merge(skill);
        daoFacade.flush();
        return skill;
    }

    /*
    @Transactional
    public Skill removeAllSkill(Skill skill) throws PersistenceException{
        daoFacade.executeRequest("Delete from Link l where l.skill1.id =:skill or l.skill2.id =:skill",param("skill",skill.getId()));
        daoFacade.flush();
        daoFacade.remove(skill);
        daoFacade.flush();
        return skill;
    }
    */

    @Transactional
    public List<Skill> getAllSkills() {
        return daoFacade.getList("select s from Skill s");
    }

    @Transactional
    public boolean getSkillByLabel(String label) {
        List<Skill> skill = daoFacade.getList("select s from Skill s where s.label = :label",
                param("label", label));
        if(skill.size() != 0){
            return true;
        }else{
            return false;
        }
    }

    @Transactional
    public List<Skill> getSkillByTraining(long trainingId){
        return daoFacade.getList("select s from Training t join t.skills s where t.id = :trainingId",
                param("trainingId", trainingId));
    }


}

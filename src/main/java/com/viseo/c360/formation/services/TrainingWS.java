package com.viseo.c360.formation.services;

import java.util.List;

import javax.inject.Inject;
import javax.persistence.PersistenceException;

import com.viseo.c360.formation.converters.topic.DescriptionToTopic;
import com.viseo.c360.formation.converters.topic.TopicToDescription;
import com.viseo.c360.formation.converters.training.DescriptionToTraining;
import com.viseo.c360.formation.converters.training.TrainingToDescription;
import com.viseo.c360.formation.converters.trainingsession.TrainingSessionToDescription;

import com.viseo.c360.formation.dao.TrainingDAO;
import com.viseo.c360.formation.domain.training.Topic;
import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.domain.training.TrainingSession;
import com.viseo.c360.formation.dto.training.TrainingDescription;
import com.viseo.c360.formation.dto.training.TrainingSessionDescription;
import com.viseo.c360.formation.converters.trainingsession.DescriptionToTrainingSession;

import com.viseo.c360.formation.dto.training.TopicDescription;
import com.viseo.c360.formation.exceptions.C360Exception;
import com.viseo.c360.formation.exceptions.dao.UniqueFieldException;
import com.viseo.c360.formation.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.formation.exceptions.dao.util.UniqueFieldErrors;
import org.springframework.core.convert.ConversionException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.viseo.c360.formation.exceptions.dao.PersistentObjectNotFoundException;


@RestController
public class TrainingWS {

    @Inject
    TrainingDAO trainingDAO;

    @Inject
    ExceptionUtil exceptionUtil;

    /***
     * Training
     ***/
    @RequestMapping(value = "${endpoint.trainings}", method = RequestMethod.POST)
    @ResponseBody
    public TrainingDescription addTraining(@RequestBody TrainingDescription myTrainingDescription) {
        try {
            long topicId = myTrainingDescription.getTopicDescription().getId();
            Topic topic = trainingDAO.getTopic(topicId);
            if (topic == null) throw new PersistentObjectNotFoundException(topicId, Topic.class);
            Training training = trainingDAO.addTraining(new DescriptionToTraining().convert(myTrainingDescription, topic));
            return new TrainingToDescription().convert(training);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if(uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @RequestMapping(value = "${endpoint.trainings}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingDescription> getAllTrainingsDescriptions() {
        return new TrainingToDescription().convert(trainingDAO.getAllTrainings());
    }

    //update training topic
    @RequestMapping(value = "${endpoint.trainingtopic}", method = RequestMethod.PUT)
    @ResponseBody
    public TrainingDescription updateTrainingTopic(@PathVariable String trainingTopic, @PathVariable String formationId) {
        try {
            Training training= trainingDAO.getTraining(Long.parseLong(formationId));
            if(training == null) throw new PersistentObjectNotFoundException(15,Training.class);
            training = trainingDAO.updateTrainingTopic(training, trainingTopic);
            return new TrainingToDescription().convert(training);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    /***
     * Topic
     ***/
    @RequestMapping(value = "${endpoint.topics}", method = RequestMethod.POST)
    @ResponseBody
    public TopicDescription addTopic(@RequestBody TopicDescription topicDescription) {
        try {
            Topic topic = trainingDAO.addTopic(new DescriptionToTopic().convert(topicDescription));
            return new TopicToDescription().convert(topic);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @RequestMapping(value = "${endpoint.topics}", method = RequestMethod.GET)
    @ResponseBody
    public List<TopicDescription> getAllTopics() {
        try {
            return new TopicToDescription().convert(trainingDAO.getAllTopics());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    /***
     * TrainingSession
     ***/
    @RequestMapping(value = "${endpoint.sessions}", method = RequestMethod.POST)
    @ResponseBody
    public TrainingSessionDescription addTrainingSession(@RequestBody TrainingSessionDescription trainingSessionDescription) {
        try {
            Training training = trainingDAO.getTraining(trainingSessionDescription.getTrainingDescription().getId());
            if (training == null)
                throw new PersistentObjectNotFoundException(trainingSessionDescription.getTrainingDescription().getId(), Training.class);
            TrainingSession trainingSession = new DescriptionToTrainingSession().convert(trainingSessionDescription, training);
            trainingSession = trainingDAO.addSessionTraining(trainingSession);
            return new TrainingSessionToDescription().convert(trainingSession);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    //Update Training Session
    @RequestMapping(value = "${endpoint.sessions}", method = RequestMethod.PUT)
    @ResponseBody
    public TrainingSessionDescription updateTrainingSession(@RequestBody TrainingSessionDescription trainingSessionDescription) {
        try {
            TrainingSession trainingSession = trainingDAO.getSessionTraining(trainingSessionDescription.getId());
            TrainingSession newTrainingSession = new DescriptionToTrainingSession().convert(trainingSessionDescription, trainingSession.getTraining());
            if (trainingSession == null)
                throw new PersistentObjectNotFoundException(trainingSession.getId(), TrainingSession.class);
            return new TrainingSessionToDescription().convert(trainingDAO.updateTrainingSession(trainingSession, newTrainingSession));
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.sessions}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingSessionDescription> getTrainingSessionsDescriptions() {
        return new TrainingSessionToDescription().convert(trainingDAO.getAllTrainingSessions());
    }

    @RequestMapping(value = "${endpoint.sessionsbyid}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingSessionDescription> getTrainingSessionsByTraining(@PathVariable String id) {
        return new TrainingSessionToDescription().convert(trainingDAO.getSessionByTraining(Long.parseLong(id)));
    }

    @RequestMapping(value = "${endpoint.alreadyrequestedsession}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingSessionDescription> getRequestedSessionByTraining(@PathVariable String trainingId, @PathVariable String collabId) {
        return new TrainingSessionToDescription().convert(trainingDAO.getRequestedSessionByTraining(Long.parseLong(trainingId),Long.parseLong(collabId)));
    }

}
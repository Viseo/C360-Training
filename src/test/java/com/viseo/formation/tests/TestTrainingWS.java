package com.viseo.formation.tests;

import com.viseo.TestUtil;
import com.viseo.c360.formation.dao.TrainingDAO;
import com.viseo.c360.formation.domain.training.Topic;
import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.dto.training.TopicDescription;
import com.viseo.c360.formation.dto.training.TrainingDescription;
import com.viseo.c360.formation.services.TrainingWS;
import com.viseo.fake.db.FakeDAOFacade;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

public class TestTrainingWS {
    FakeDAOFacade fakeDaoFacade = null;
    TrainingDAO trainingDAO = null;
    TrainingWS trainingWS = null;
    TrainingDescription trainingDescription = null;
    TopicDescription topicDescription = null;
    TrainingDescription trainingNotFilled = null;
    Topic topic = null;

    public void prepareBase(){
        topic = new Topic();
        topic.setName("Dev Web");
        fakeDaoFacade.persist(topic);
    }

    public void prepareDTO(){
        topicDescription = new TopicDescription();
        topicDescription.setName("Dev Web");
        topicDescription.setId(topic.getId());
        trainingDescription = new TrainingDescription();
        trainingDescription.setTrainingTitle("AngularJs");
        trainingDescription.setNumberHalfDays(5);
        trainingDescription.setTopicDescription(topicDescription);
        trainingNotFilled = new TrainingDescription();
        trainingNotFilled.setNumberHalfDays(0);
        trainingNotFilled.setTopicDescription(topicDescription);
        trainingNotFilled.setTrainingTitle("");
    }


    @Before
    public void setUp(){
        trainingWS = new TrainingWS();
        trainingDAO = new TrainingDAO();
        TestUtil.inject(trainingWS, "trainingDAO", trainingDAO);
        fakeDaoFacade = new FakeDAOFacade();
        TestUtil.inject(trainingDAO, "daoFacade", fakeDaoFacade);
        fakeDaoFacade.declareEntityClasses(Training.class);
        fakeDaoFacade.declareEntityClasses(Topic.class);
        fakeDaoFacade.registerFilter("select a from Training a",(facade, entity, paramRegistry) -> {
            return entity instanceof Training;});
        prepareBase();
        prepareDTO();
    }

    @Test
    public void testAddTraining(){
        trainingDescription = trainingWS.addTraining(trainingDescription);
        Assert.assertEquals(trainingDescription,trainingWS.getAllTrainingsDescriptions().get(0));
    }

}
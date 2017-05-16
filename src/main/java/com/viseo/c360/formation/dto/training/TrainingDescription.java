package com.viseo.c360.formation.dto.training;


import com.viseo.c360.formation.dto.BaseDTO;

public class TrainingDescription extends BaseDTO {

    public static class Regex{
        public static final String TRAINING_TITLE = "(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]+[\\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]*)";
        public static final String NUMBER_HALF_DAYS = "[0-9]";
    }

    String trainingTitle;

    int numberHalfDays;

    TopicDescription topicDescription;

    public TrainingDescription() {
    }

    public String getTrainingTitle() {
        return trainingTitle;
    }

    public void setTrainingTitle(String trainingTitle) {
        this.trainingTitle = trainingTitle;
    }

    public int getNumberHalfDays() {
        return numberHalfDays;
    }

    public void setNumberHalfDays(int numberHalfDays) {
        this.numberHalfDays = numberHalfDays;
    }

    public TopicDescription getTopicDescription() {
        return topicDescription;
    }

    public void setTopicDescription(TopicDescription topicDescription) {
        this.topicDescription = topicDescription;
    }
}

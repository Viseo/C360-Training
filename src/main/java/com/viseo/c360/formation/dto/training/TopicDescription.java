package com.viseo.c360.formation.dto.training;

import com.viseo.c360.formation.dto.BaseDTO;

public class TopicDescription extends BaseDTO {

    public static class Regex{
        public static final String NAME = "[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]";
    }

    String name;

    public TopicDescription() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
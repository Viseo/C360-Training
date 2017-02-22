package com.viseo.c360.formation.exceptions.dao.util;

public enum TrainingSessionErrors {
    TRAINING_SESSION_ALREADY_PLANNED("TrainingSession already planned"),
    TRAINING_SESSION_INCORRECT_DATES("TrainingSession dates chronology do not fit");

    String message;

    TrainingSessionErrors() {
    }

    TrainingSessionErrors(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

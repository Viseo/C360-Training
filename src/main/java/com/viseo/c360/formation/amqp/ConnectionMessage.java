package com.viseo.c360.formation.amqp;

import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;

import javax.inject.Inject;

/**
 * Created by SJO3662 on 24/08/2017.
 */
public class ConnectionMessage {

    @Inject
    private CollaboratorDescription collaboratorDescription;

    private String nameFileResponse;

    public CollaboratorDescription getCollaboratorDescription() {
        return collaboratorDescription;
    }

    public ConnectionMessage setCollaboratorDescription(CollaboratorDescription collaboratorDescription) {
        this.collaboratorDescription = collaboratorDescription;
        return this;
    }

    public String getNameFileResponse() {
        return nameFileResponse;
    }

    public ConnectionMessage setNameFileResponse(String nameFileResponse) {
        this.nameFileResponse = nameFileResponse;
        return this;
    }
}

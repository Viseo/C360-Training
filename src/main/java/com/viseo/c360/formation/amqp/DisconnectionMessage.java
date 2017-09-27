package com.viseo.c360.formation.amqp;

import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;

import javax.inject.Inject;
import java.util.Date;
import java.util.UUID;

public class DisconnectionMessage extends RabbitMsg {

    private String token;
    private String nameFileResponse;
    private Date messageDate;
    @Inject
    private CollaboratorDescription collaboratorDescription;

    public DisconnectionMessage(){
        super(MessageType.DISCONNECTION);
    }

    public String getToken() {
        return token;
    }

    public DisconnectionMessage setToken(String token) {
        this.token = token;
        return this;
    }

    public Date getMessageDate() {
        return messageDate;
    }

    public DisconnectionMessage setMessageDate(Date messageDate) {
        this.messageDate = messageDate;
        return this;
    }

    public String getNameFileResponse() {
        return nameFileResponse;
    }

    public DisconnectionMessage setNameFileResponse(String nameFileResponse) {
        this.nameFileResponse = nameFileResponse;
        return this;
    }

    public CollaboratorDescription getCollaboratorDescription() {
        return collaboratorDescription;
    }

    public DisconnectionMessage setCollaboratorDescription(CollaboratorDescription collaboratorDescription) {
        this.collaboratorDescription = collaboratorDescription;
        return this;
    }
}

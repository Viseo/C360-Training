package com.viseo.c360.formation.amqp;

import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;

import javax.inject.Inject;
import java.util.Date;
import java.util.UUID;

/**
 * Created by SJO3662 on 24/08/2017.
 */
public class RabbitMessage {

    @Inject
    private CollaboratorDescription collaboratorDescription;

    private UUID Sequence;

    private String nameFileResponse;

    private Date messageDate;

    private String token;

    private MessageType type = MessageType.CONNECTION;

    public UUID getSequence() {
        return Sequence;
    }

    public RabbitMessage setSequence(UUID sequence) {
        this.Sequence = sequence;
        return this;
    }

    public String getToken() {
        return token;
    }

    public RabbitMessage setToken(String token) {
        this.token = token;
        return this;
    }

    public CollaboratorDescription getCollaboratorDescription() {
        return collaboratorDescription;
    }

    public RabbitMessage setCollaboratorDescription(CollaboratorDescription collaboratorDescription) {
        this.collaboratorDescription = collaboratorDescription;
        return this;
    }

    public Date getMessageDate() {
        return messageDate;
    }

    public RabbitMessage setMessageDate(Date messageDate) {
        this.messageDate = messageDate;
        return this;
    }

    public String getNameFileResponse() {
        return nameFileResponse;
    }

    public RabbitMessage setNameFileResponse(String nameFileResponse) {
        this.nameFileResponse = nameFileResponse;
        return this;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }
}

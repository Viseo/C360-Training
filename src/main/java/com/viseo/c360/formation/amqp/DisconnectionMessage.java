package com.viseo.c360.formation.amqp;

import java.util.Date;
import java.util.UUID;

public class DisconnectionMessage extends RabbitMsg {

    private String token;
    private UUID sequence;
    private String nameFileResponse;
    private Date messageDate;

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

    public UUID getSequence() {
        return sequence;
    }

    public DisconnectionMessage setSequence(UUID sequence) {
        this.sequence = sequence;
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
}

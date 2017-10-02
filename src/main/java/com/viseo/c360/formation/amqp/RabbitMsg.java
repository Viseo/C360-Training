package com.viseo.c360.formation.amqp;

public abstract class RabbitMsg {
    private MessageType type;

    public RabbitMsg(MessageType type) {
        this.type = type;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }
}

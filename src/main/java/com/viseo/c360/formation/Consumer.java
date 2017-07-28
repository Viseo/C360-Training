package com.viseo.c360.formation;

/**
 * Created by SJO3662 on 28/07/2017.
 */
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;

public class Consumer implements MessageListener {

    @Override
    public void onMessage(Message message) {
        System.out.println(new String(message.getBody()));
    }
}
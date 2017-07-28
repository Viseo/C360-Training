package com.viseo.c360.formation.amqp;

/**
 * Created by SJO3662 on 28/07/2017.
 */
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;

import java.util.ArrayList;
import java.util.List;

public class ConsumerMessageHandler {

    public List<String> handleMessage(String request) {
        System.out.println("Message Received at consumer end  : " + request);

        List<String> list = new ArrayList<String>();
        list.add("Hello.....");
        list.add("This is my response de C360_formation...");
        list.add(request);

        return list;

    }
}
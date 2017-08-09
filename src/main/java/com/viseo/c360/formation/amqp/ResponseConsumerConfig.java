//package com.viseo.c360.formation.amqp;
//
///**
// * Created by SJO3662 on 27/07/2017.
// */
//import com.viseo.c360.formation.dao.CollaboratorDAO;
//import com.viseo.c360.formation.domain.collaborator.Collaborator;
//import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
//import org.springframework.amqp.rabbit.connection.ConnectionFactory;
//import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
//import org.springframework.amqp.rabbit.listener.adapter.MessageListenerAdapter;
//import org.springframework.amqp.support.converter.JsonMessageConverter;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import javax.inject.Inject;
//
//@Configuration
//public class ResponseConsumerConfig {
//
//    private static final String SIMPLE_MESSAGE_QUEUE = "simple.queue.name";
//
//    @Bean
//    public ConnectionFactory connectionFactory() {
//        CachingConnectionFactory connectionFactory = new CachingConnectionFactory("localhost");
//        connectionFactory.setUsername("guest");
//        connectionFactory.setPassword("guest");
//        return connectionFactory;
//    }
//
//    @Bean
//    public SimpleMessageListenerContainer listenerContainer() {
//        SimpleMessageListenerContainer listenerContainer = new SimpleMessageListenerContainer();
//        listenerContainer.setConnectionFactory(connectionFactory());
//        listenerContainer.setQueueNames(this.SIMPLE_MESSAGE_QUEUE);
//        listenerContainer.setMessageListener(new MessageListenerAdapter(new ConsumerMessageHandler(), new JsonMessageConverter()));
//        return listenerContainer;
//    }
//
//}
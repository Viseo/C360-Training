package com.viseo.c360.formation.amqp;

/**
 * Created by BBA3616 on 28/07/2017.
 */
import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
import org.springframework.amqp.support.converter.JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RequestConsumerConfig {

    private static final String SIMPLE_MESSAGE_QUEUE = "simple.queue.name";
    protected final String replyQueueName = "reply.queue.formation";

    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory connectionFactory = new CachingConnectionFactory("localhost");
        connectionFactory.setUsername("guest");
        connectionFactory.setPassword("guest");
        return connectionFactory;
    }

    @Bean
    public Queue simpleQueue() {
        return new Queue(SIMPLE_MESSAGE_QUEUE);
    }

    @Bean
    public MessageConverter jsonMessageConverter(){
        return new JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate() {
        RabbitTemplate template = new RabbitTemplate(connectionFactory());
        template.setRoutingKey(SIMPLE_MESSAGE_QUEUE);
        template.setMessageConverter(jsonMessageConverter());
        template.setReplyQueue(replyQueue());
        template.setReplyTimeout(1000);
        return template;
    }

    @Bean
    public Queue replyQueue() {
        return new Queue(this.replyQueueName);
    }

    @Bean
    public SimpleMessageListenerContainer listenerContainer() {
        SimpleMessageListenerContainer listenerContainer = new SimpleMessageListenerContainer();
        listenerContainer.setConnectionFactory(connectionFactory());
        listenerContainer.setQueues(replyQueue());
        listenerContainer.setMessageConverter(jsonMessageConverter());
        listenerContainer.setMessageListener(rabbitTemplate());
        listenerContainer.setAcknowledgeMode(AcknowledgeMode.AUTO);
        return listenerContainer;
    }

}
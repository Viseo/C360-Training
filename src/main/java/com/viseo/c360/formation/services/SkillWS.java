package com.viseo.c360.formation.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.GetResponse;
import com.viseo.c360.formation.amqp.InformationMessage;
import com.viseo.c360.formation.amqp.MessageType;
import com.viseo.c360.formation.amqp.RabbitMsg;
import com.viseo.c360.formation.amqp.ResolveMsgFactory;
import com.viseo.c360.formation.converters.skill.DescriptionToSkill;
import com.viseo.c360.formation.converters.skill.SkillToDescription;
import com.viseo.c360.formation.dao.TrainingDAO;
import com.viseo.c360.formation.domain.training.Skill;
import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.dto.training.SkillDescription;
import com.viseo.c360.formation.exceptions.C360Exception;
import com.viseo.c360.formation.exceptions.dao.UniqueFieldException;
import com.viseo.c360.formation.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.formation.exceptions.dao.util.UniqueFieldErrors;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.ChannelCallback;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.convert.ConversionException;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;


/**
 * Created by YGU3747 on 11/10/2017
 */

@RestController
public class SkillWS {
    @Inject
    TrainingDAO skillDAO;

    @Inject
    ExceptionUtil exceptionUtil;

    @Inject
    Queue responseFormation;

    @Inject
    private RabbitTemplate rabbitTemplate;

    @Inject
    private FanoutExchange fanout;

    public SkillWS(){
        TimerTask timerTask = new synchronizeDateBase();
        Timer timer = new Timer(true);
        timer.scheduleAtFixedRate(timerTask, 1*1000, 15*1000);
        System.out.println("Synchronize DateBase for skill data started");
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.addskill}", method = RequestMethod.POST)
    @ResponseBody
    public List<SkillDescription>  addSkill(@RequestBody SkillDescription skillDescription){
        try{
            if(skillDAO.getSkillByLabel(skillDescription.getLabel()).size() == 0){
                skillDAO.addSkill(new DescriptionToSkill().convert(skillDescription));
                return getAllSkills();
            }
            else{
                return null;
            }
        }
        catch (PersistenceException pe){
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.skills}", method = RequestMethod.GET)
    @ResponseBody
    public List<SkillDescription> getAllSkills() {
        try {
            List<SkillDescription> listSkill = new SkillToDescription().convert(skillDAO.getAllSkills());
            return listSkill;
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.skillbytraining}", method = RequestMethod.GET)
    @ResponseBody
    public List<SkillDescription> getSkillsByTraining(@PathVariable("skillId") Long id) {
        try{
            return new SkillToDescription().convert(skillDAO.getSkillByTraining(id));
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }


    @CrossOrigin
    @RequestMapping(value = "${endpoint.skilltraining}", method = RequestMethod.POST)
    @ResponseBody
    public List<SkillDescription> addSkillTrainingConnection(@PathVariable Long skillId,
                                                             @PathVariable Long trainingId)
    {
        try{
            return new SkillToDescription().convert(skillDAO.addSkillTrainingConnection(skillId, trainingId));
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "${endpoint.skilltraining}", method = RequestMethod.PUT)
    @ResponseBody
    public List<SkillDescription> addSkillTrainingConnection(@PathVariable Long skillId,
                                                             @PathVariable Long trainingId,
                                                             @RequestBody SkillDescription skillDescription)
    {
        try{
            return new SkillToDescription().convert(skillDAO.removeSkillTrainingConnection(skillId, trainingId));
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }


    private List<SkillDescription> getSkillsFromOtherServices(){
        ObjectMapper mapperObj = new ObjectMapper();
        UUID personalMessageSequence = UUID.randomUUID();
        InformationMessage informationMessage = new InformationMessage()
                .setNameFileResponse(responseFormation.getName())
                .setMessageDate(new Date())
                .setSequence(personalMessageSequence);
        try{
            this.rabbitTemplate.convertAndSend(fanout.getName(),"",mapperObj.writeValueAsString(informationMessage));
            InformationMessage result;
            result = this.rabbitTemplate.execute(new ChannelCallback<InformationMessage>(){

                @Override
                public InformationMessage doInRabbit(Channel channel) throws Exception {
                    long startTime = System.currentTimeMillis();
                    long elapsedTime;
                    InformationMessage collectedResponse = new InformationMessage();
                    GetResponse consumerResponse;
                    long deliveryTag;
                    sleep();
                    do{
                        elapsedTime = (new Date()).getTime() - startTime;
                        consumerResponse = channel.basicGet(responseFormation.getName(), false);
                        if (consumerResponse != null){
                            deliveryTag = consumerResponse.getEnvelope().getDeliveryTag();
                            channel.basicAck(deliveryTag, true);
                            // check if the right msg type
                            JSONObject jo = (JSONObject) new JSONParser().parse(new String(consumerResponse.getBody(), StandardCharsets.UTF_8));
                            RabbitMsg rbtMsg = ResolveMsgFactory.getFactory().get(jo.get("type")).apply(jo);
                            if (rbtMsg.getType() == MessageType.INFORMATION){
                                InformationMessage rabbitMessageResponse = new ObjectMapper().readValue(consumerResponse.getBody(), InformationMessage.class);
                                if ((new Date().getTime() - rabbitMessageResponse.getMessageDate().getTime()) < 50000) {
                                    if (rabbitMessageResponse.getSequence().equals(personalMessageSequence)) {
                                        collectedResponse.setSkillsDescription(mergeTwoSkillList(collectedResponse.getSkillsDescription()
                                                , rabbitMessageResponse.getSkillsDescription()));
                                    } else {
                                        channel.basicPublish("", responseFormation.getName(), null, consumerResponse.getBody());
                                    }
                                }
                            }
                            else if (rbtMsg.getType() == MessageType.DELETESKILL){
                                System.out.println("doInhabbit of getSkill receive a delete request!");
                            }
                            else{
                                channel.basicPublish("", responseFormation.getName(), null, consumerResponse.getBody());
                            }
                        }
                    }while(elapsedTime < 2000);
                    //PROBLEM!!!CONTINUE RECEIVING DATA WILL MIX THE MSGs
                    // the expiration time is 2s, during this 2s, service will continue to receive the skill list
                    return collectedResponse;
                }
            });
            return result.getSkillsDescription();

        }catch (JsonProcessingException jpe){
            throw new RuntimeException(jpe);
        }
    }

    public void sleep() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
        }
    }

    private List<SkillDescription> mergeTwoSkillList (List<SkillDescription> listSkill, List<SkillDescription> otherListSkill){
        if(listSkill == null){
            return otherListSkill;
        }
        else if (otherListSkill == null){
            return listSkill;
        }
        Set<String> labels = otherListSkill.stream().map(SkillDescription::getLabel).collect(Collectors.toSet());
        List<SkillDescription> mergedListSkill = listSkill.stream().filter(skill -> !labels.contains(skill.getLabel()))
                .collect(Collectors.toList());
        return mergedListSkill;
    }

    private List<SkillDescription> handleReceivedCollaborator (List<SkillDescription> listReceived){
        if(listReceived != null){
            for (SkillDescription s : listReceived){
                if (skillDAO.getSkillByLabel(s.getLabel()).size() == 0){
                    skillDAO.addSkill(new DescriptionToSkill().convert(s));
                }
            }
        }
        return new SkillToDescription().convert(skillDAO.getAllSkills());
    }

    private class synchronizeDateBase extends TimerTask{

        @Override
        public void run() {
            List<SkillDescription> otherListSkill = getSkillsFromOtherServices();
            handleReceivedCollaborator(otherListSkill);
            System.out.println("Skill data is synchronized");
        }
    }

    public Boolean removeSkill(SkillDescription skillDescription){
        Skill s = skillDAO.getSkillByLabel(skillDescription.getLabel()).get(0);
        if (s != null){
            try {
                // à modifier après
                for (Training t : s.getTrainings()){
                    skillDAO.removeSkillTrainingConnection(s.getId(), t.getId());
                }

                skillDAO.removeSkill(s);
                return true;
            } catch (PersistenceException pe) {
                UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
                if (uniqueFieldErrors == null) throw new C360Exception(pe);
                else throw new UniqueFieldException(uniqueFieldErrors.getField());
            }
        }
        else
            return false;
    }





}

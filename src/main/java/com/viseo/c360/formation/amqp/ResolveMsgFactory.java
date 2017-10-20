package com.viseo.c360.formation.amqp;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.training.Skill;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.dto.training.SkillDescription;
import org.apache.commons.collections.map.HashedMap;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

/**
 * Created by YGU3747 on 18/10/2017
 */

public class ResolveMsgFactory {

    private static Map<String, Function<JSONObject, RabbitMsg>> factory = new HashedMap();

    private static Boolean initialization = false;

    private ResolveMsgFactory(){

    }

    public static Map<String, Function<JSONObject, RabbitMsg>> getFactory() {
        if (!initialization){
            //initialiser factory
            factory.put(MessageType.CONNECTION.toString(), json->{
                ObjectMapper objectMapper = new ObjectMapper();
                ConnectionMessage connectionMessage = new ConnectionMessage();
                try{
                    connectionMessage.setToken((String)json.get("token"))
                            .setSequence(UUID.fromString((String)json.get("sequence")))
                            .setNameFileResponse((String)json.get("nameFileResponse"))
                            .setMessageDate(new Date((long)json.get("messageDate")));
                    if(json.get("collaboratorDescription") != null){
                        connectionMessage.setCollaboratorDescription(objectMapper.readValue(json.get("collaboratorDescription").toString(), CollaboratorDescription.class));
                    }
                    return connectionMessage;
                }catch (IOException ioe){
                    throw new RuntimeException(ioe);
                }
            });
            factory.put(MessageType.DISCONNECTION.toString(), json->{
                ObjectMapper objectMapper = new ObjectMapper();
                DisconnectionMessage disconnectionMessage = new DisconnectionMessage();
                try{
                    disconnectionMessage.setToken((String)json.get("token"))
                            .setNameFileResponse((String)json.get("nameFileResponse"));
                    if(json.get("collaboratorDescription") != null){
                        disconnectionMessage.setCollaboratorDescription(objectMapper.readValue(json.get("collaboratorDescription").toString(), CollaboratorDescription.class));
                    }
                    return disconnectionMessage;
                }catch (IOException ioe){
                    throw new RuntimeException(ioe);
                }
            });
            factory.put(MessageType.INFORMATION.toString(),json->{
                //ObjectMapper objectMapper = new ObjectMapper();
                InformationMessage informationMessage = new InformationMessage();
                try{
                    informationMessage.setNameFileResponse((String)json.get("nameFileResponse"))
                            .setSequence(UUID.fromString((String)json.get("sequence")))
                            .setMessageDate(new Date((long)json.get("messageDate")));
                /*
               if(json.get("skillsDescription") != null){
                   informationMessage.setSkillsDescription(objectMapper.readValue(json.get("skillsDescription").toString()
                           , new TypeReference<List<SkillDescription>>(){}));
               }
               */
                    return informationMessage;
                }catch (Exception e){
                    throw new RuntimeException(e);
                }
            });
            factory.put(MessageType.DELETESKILL.toString(),json->{
                ObjectMapper objectMapper = new ObjectMapper();
                DeleteSkillMessage deleteSkillMessage = new DeleteSkillMessage();
                try{
                    if(json.get("skillDescription") != null){
                        deleteSkillMessage.setSkillDescription(objectMapper.readValue(json.get("skillDescription").toString()
                                , SkillDescription.class))
                        .setSequence(UUID.fromString((String)json.get("sequence")));
                    }
                    return deleteSkillMessage;
                }catch (Exception e){
                    throw new RuntimeException(e);
                }
            });
            factory.put(MessageType.ADDSKILLLEVEL.toString(),json->{
                ObjectMapper objectMapper = new ObjectMapper();
                AddSkillLevelMessage addSkillLevelMessage = new AddSkillLevelMessage();
                try{
                    if(json.get("skills") != null){
                        addSkillLevelMessage.setSkills(objectMapper.readValue(json.get("skills").toString()
                                ,new TypeReference<List<Skill>>(){}));
                    }
                    if(json.get("collaborators") != null){
                        addSkillLevelMessage.setCollaborators(objectMapper.readValue(json.get("collaborators").toString()
                                ,new TypeReference<List<Collaborator>>(){}));
                    }
                    addSkillLevelMessage.setSequence(UUID.fromString((String)json.get("sequence")))
                        .setNameFileResponse((String)json.get("nameFileResponse"));
                    return addSkillLevelMessage;
                }catch (Exception e){
                    throw new RuntimeException(e);
                }
            });
            initialization = true;
        }
        return factory;
    }
}

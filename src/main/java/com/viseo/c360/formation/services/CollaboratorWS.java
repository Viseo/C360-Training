package com.viseo.c360.formation.services;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.security.Key;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.persistence.PersistenceException;

import com.viseo.c360.formation.converters.collaborator.CollaboratorToIdentity;
import com.viseo.c360.formation.converters.collaborator.DescriptionToCollaborator;
import com.viseo.c360.formation.converters.wish.DescriptionToWish;
import com.viseo.c360.formation.converters.wish.WishToDescription;
import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.domain.collaborator.RequestTraining;
import com.viseo.c360.formation.domain.collaborator.Wish;
import com.viseo.c360.formation.domain.training.Topic;
import com.viseo.c360.formation.domain.training.Training;
import com.viseo.c360.formation.domain.training.TrainingSession;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.dto.collaborator.CollaboratorIdentity;
import com.viseo.c360.formation.dto.collaborator.RequestTrainingDescription;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.formation.converters.requestTraining.DescriptionToRequestTraining;
import com.viseo.c360.formation.converters.requestTraining.RequestTrainingToDescription;
import com.viseo.c360.formation.converters.trainingsession.TrainingSessionToDescription;
import com.viseo.c360.formation.dto.collaborator.WishDescription;
import com.viseo.c360.formation.dto.training.TrainingSessionDescription;
import com.viseo.c360.formation.email.sendMessage;
import com.viseo.c360.formation.exceptions.dao.UniqueFieldException;
import com.viseo.c360.formation.exceptions.dao.util.UniqueFieldErrors;
import com.viseo.c360.formation.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.formation.dao.TrainingDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;


import com.viseo.c360.formation.exceptions.C360Exception;
import com.viseo.c360.formation.exceptions.dao.PersistentObjectNotFoundException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.impl.crypto.MacProvider;

import java.util.concurrent.ConcurrentHashMap;
import org.springframework.core.convert.ConversionException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
public class CollaboratorWS {

    @Inject
    CollaboratorDAO collaboratorDAO;
    @Inject
    TrainingDAO trainingDAO;

    @Inject
    ExceptionUtil exceptionUtil;


    @RequestMapping(value = "${endpoint.user}", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, CollaboratorDescription> getUserByLoginPassword(@RequestBody CollaboratorDescription myCollaboratorDescription) {
        try {
            InitializeMap();
            Collaborator c = collaboratorDAO.getCollaboratorByLoginPassword(myCollaboratorDescription.getEmail(), myCollaboratorDescription.getPassword());
            CollaboratorDescription user = new CollaboratorToDescription().convert(c);
            Key key = MacProvider.generateKey();
            String compactJws = Jwts.builder()
                    .setSubject(user.getFirstName())
                    .claim("lastName", user.getLastName())
                    .claim("roles", user.getIsAdmin())
                    .claim("id",user.getId())
                    .signWith(SignatureAlgorithm.HS512, key)
                    .compact();
            Map currentUserMap = new HashMap<>();
            putUserInCache(compactJws, user);
            currentUserMap.put("userConnected", compactJws);
            return currentUserMap;
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    private static ConcurrentHashMap<String, CollaboratorDescription> mapUserCache;

    private void InitializeMap() {
        if (mapUserCache == null)
            mapUserCache = new ConcurrentHashMap<String, CollaboratorDescription>();
    }

    private void putUserInCache(String token, CollaboratorDescription user) {
        mapUserCache.put(token, user);
    }

    @RequestMapping(value = "${endpoint.getuserrole}", method = RequestMethod.POST)
    @ResponseBody
    public boolean checkIsAdminAlreadyConnected(@RequestBody String thisToken){
        try {
            return mapUserCache.get(thisToken).getIsAdmin();
        }catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.isconnected}", method = RequestMethod.POST)
    @ResponseBody
    public boolean checkIsAlreadyConnected(@RequestBody String thisToken){
        try {
            return mapUserCache.get(thisToken) != null;
        }catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.userdisconnect}", method = RequestMethod.POST)
    @ResponseBody
    public Boolean deleteDisconnectedUserFromCache(@RequestBody String token) {
        try {
            mapUserCache.remove(token);
            if (mapUserCache.get(token) == null)
                return true;
            else
                return false;
        } catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.wish}", method = RequestMethod.POST)
    @ResponseBody
    public WishDescription addWish(@RequestBody WishDescription wishDescription,@PathVariable Long collaborator_id) {
        try {
            Collaborator collaborator = collaboratorDAO.getCollaborator(collaborator_id);
            wishDescription.setCollaborator(new CollaboratorToDescription().convert(collaborator));
            wishDescription.setVote_ok(new ArrayList<>());
            wishDescription.setVote_ko(new ArrayList<>());
            Wish wish = collaboratorDAO.addWish(new DescriptionToWish().convert(wishDescription));
            return new WishToDescription().convert(wish);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if(uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @RequestMapping(value = "${endpoint.wish}", method = RequestMethod.GET)
    @ResponseBody
    public List<WishDescription> getIsNotCheckedWishes(@PathVariable Long collaborator_id) {
        try {
            return new WishToDescription().convert(collaboratorDAO.getIsNotCheckedWishes());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.allwishes}", method = RequestMethod.GET)
    @ResponseBody
    public List<WishDescription> getAllWishes() {
        try {
            return new WishToDescription().convert(collaboratorDAO.getAllWishes());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.allvalidatedwishes}", method = RequestMethod.GET)
    @ResponseBody
    public List<WishDescription> getIsValidatedWishes() {
        try {
            return new WishToDescription().convert(collaboratorDAO.getIsValidatedWishes());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }


    @RequestMapping(value = "${endpoint.kowishtoadd}", method = RequestMethod.PUT)
    @ResponseBody
    public WishDescription updateKoWish(@RequestBody WishDescription Wish, @PathVariable Long collaborator_id) {
        try {
            Wish wishToUpdate = new DescriptionToWish().convert(Wish);
            if(wishToUpdate == null) throw new PersistentObjectNotFoundException(15,Wish.class);
            Collaborator collaboratorToUpdate = collaboratorDAO.getCollaborator(collaborator_id);
            if(collaboratorToUpdate == null) throw new PersistentObjectNotFoundException(15,Collaborator.class);
            wishToUpdate = collaboratorDAO.addVoteKoToWish(wishToUpdate, collaboratorToUpdate);
            return new WishToDescription().convert(wishToUpdate);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.okwishtoadd}", method = RequestMethod.PUT)
    @ResponseBody
    public WishDescription updateOkWish(@RequestBody WishDescription Wish, @PathVariable Long collaborator_id) {
        try {
            Wish wishOkToUpdate = new DescriptionToWish().convert(Wish);
            if(wishOkToUpdate == null) throw new PersistentObjectNotFoundException(15,Wish.class);
            Collaborator collaboratorToUpdate = collaboratorDAO.getCollaborator(collaborator_id);
            if(collaboratorToUpdate == null) throw new PersistentObjectNotFoundException(15,Collaborator.class);
            wishOkToUpdate = collaboratorDAO.addVoteOkToWish(wishOkToUpdate, collaboratorToUpdate);
            return new WishToDescription().convert(wishOkToUpdate);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.kowishtochange}", method = RequestMethod.PUT)
    @ResponseBody
    public WishDescription changeKoToOk(@RequestBody WishDescription Wish, @PathVariable Long collaborator_id) {
        try {
            Wish wishToUpdate = new DescriptionToWish().convert(Wish);
            if(wishToUpdate == null) throw new PersistentObjectNotFoundException(15,Wish.class);
            Collaborator collaboratorToUpdate = collaboratorDAO.getCollaborator(collaborator_id);
            if(collaboratorToUpdate == null) throw new PersistentObjectNotFoundException(15,Collaborator.class);
            wishToUpdate = collaboratorDAO.changeVoteKoToOk(wishToUpdate, collaboratorToUpdate);
            return new WishToDescription().convert(wishToUpdate);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.okwishtochange}", method = RequestMethod.PUT)
    @ResponseBody
    public WishDescription changeOkToKo(@RequestBody WishDescription Wish, @PathVariable Long collaborator_id) {
        try {
            Wish wishOkToUpdate = new DescriptionToWish().convert(Wish);
            if(wishOkToUpdate == null) throw new PersistentObjectNotFoundException(15,Wish.class);
            Collaborator collaboratorToUpdate = collaboratorDAO.getCollaborator(collaborator_id);
            if(collaboratorToUpdate == null) throw new PersistentObjectNotFoundException(15,Collaborator.class);
            wishOkToUpdate = collaboratorDAO.changeVoteOkToKo(wishOkToUpdate, collaboratorToUpdate);
            return new WishToDescription().convert(wishOkToUpdate);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.ischeckedwishestoupdate}", method = RequestMethod.POST)
    @ResponseBody
    public List<WishDescription> updateIsChecked(@RequestBody List<WishDescription> Wishes) {
        List<WishDescription> updatedWishes=new ArrayList<>();
        try {
            for (int i=0;i < Wishes.size();i++){
                Wish wishToUpdate = new DescriptionToWish().convert(Wishes.get(i));
                if(wishToUpdate == null) throw new PersistentObjectNotFoundException(15,Wish.class);
                wishToUpdate = collaboratorDAO.updateIsChecked(wishToUpdate);
                updatedWishes.add(new WishToDescription().convert(wishToUpdate));
            }
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
        return updatedWishes;
    }

    @RequestMapping(value = "${endpoint.collaborators}", method = RequestMethod.POST)
    @ResponseBody
    public CollaboratorDescription addCollaborator(@RequestBody CollaboratorDescription collaboratorDescription) {
        try {
            collaboratorDescription.setDefaultPicture(true);
            Collaborator collaborator = collaboratorDAO.addCollaborator(new DescriptionToCollaborator().convert(collaboratorDescription));
            return new CollaboratorToDescription().convert(collaborator);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if(uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @RequestMapping(value = "${endpoint.updatecollaborator}", method = RequestMethod.PUT)
    @ResponseBody
    public CollaboratorDescription updateCollaborator(@RequestBody CollaboratorDescription collaborator) {
        try {
            Collaborator collaboratorToUpdate = collaboratorDAO.updateCollaborator(new DescriptionToCollaborator().convert(collaborator));
            return new CollaboratorToDescription().convert(collaboratorToUpdate);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if(uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @RequestMapping(value = "${endpoint.collaborators}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getAllCollaborators() {
        try {
            return new CollaboratorToIdentity().convert(collaboratorDAO.getAllCollaborators());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.collaboratorbyid}", method = RequestMethod.GET)
    @ResponseBody
    public CollaboratorDescription getCollaboratorById(@PathVariable Long collab_id) {
        try {
            return new CollaboratorToDescription().convert(collaboratorDAO.getCollaboratorById(collab_id));
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.collaboratorsNotAffectedBySession}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getNotAffectedCollaboratorsList(@PathVariable Long id) {
        try {
            TrainingSession trainingSession = trainingDAO.getSessionTraining(id);
            if (trainingSession == null) throw new PersistentObjectNotFoundException(id, TrainingSession.class);
            return new CollaboratorToIdentity().convert(collaboratorDAO.getNotAffectedCollaborators(trainingSession));
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.collaboratorsAffectedBySession}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getAffectedCollaboratorsList(@PathVariable Long id) {
        try {
            TrainingSession trainingSession = trainingDAO.getSessionTraining(id);
            if (trainingSession == null) throw new PersistentObjectNotFoundException(id, TrainingSession.class);
            return new CollaboratorToIdentity().convert(trainingSession.getCollaborators());
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }


    @RequestMapping(value = "${endpoint.requests}", method = RequestMethod.POST)
    @ResponseBody
    public RequestTrainingDescription addRequestTraining(@RequestBody RequestTrainingDescription requestTrainingDescription) {
        Topic topic = trainingDAO.getTopic(requestTrainingDescription.getTrainingDescription().getTopicDescription().getId());
        Collaborator collaborator = collaboratorDAO.getCollaborator(requestTrainingDescription.getCollaboratorIdentity().getId());
        RequestTraining requestTraining = new DescriptionToRequestTraining().convert(requestTrainingDescription, collaborator, topic);
        requestTraining = collaboratorDAO.addRequestTraining(requestTraining);
        return new RequestTrainingToDescription().convert(requestTraining);
    }

    @RequestMapping(value = "${endpoint.requestsassign}", method = RequestMethod.POST)
    @ResponseBody
    public List<RequestTraining> addRequestTrainingAssign(@PathVariable Long session_id,@PathVariable List<Long> id_collaborators) {
        try {
            List<RequestTraining> requestTrainings = new ArrayList<>();
            List<Collaborator> collaborators=new ArrayList<>();
            for(int i=0;i<id_collaborators.size();i++){
                collaborators.add(collaboratorDAO.getCollaborator(id_collaborators.get(i)));
            }
            TrainingSession session = trainingDAO.getSessionTraining(session_id);
            Training training = session.getTraining();
            for(int i=0; i<collaborators.size();i++){
                RequestTraining requestTraining = new RequestTraining();
                requestTraining.setTraining(training);
                requestTraining.addSession(session);
                requestTraining.setValidated(true);
                requestTraining.setCollaborator(collaborators.get(i));
                requestTraining = collaboratorDAO.addRequestTraining(requestTraining);
                requestTrainings.add(requestTraining);
            }
            return requestTrainings;
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.listrequests}", method = RequestMethod.GET)
    @ResponseBody
    public List<RequestTrainingDescription> getRequestTrainings(@PathVariable Long training_id,@PathVariable Long collab_id) {
        return new RequestTrainingToDescription().convert(collaboratorDAO.getRequestTrainings(training_id,collab_id));
    }

    @RequestMapping(value = "${endpoint.collaboratorsbysession}", method = RequestMethod.POST)
    @ResponseBody
    public TrainingSessionDescription updateCollaboratorsTrainingSession(@PathVariable Long idTrainingSession, @RequestBody List<CollaboratorIdentity> collaboratorIdentities) {
        try {
            TrainingSession trainingSession = trainingDAO.getSessionTraining(idTrainingSession);
            if (trainingSession == null) throw new PersistentObjectNotFoundException(idTrainingSession, TrainingSession.class);
            trainingSession = collaboratorDAO.affectCollaboratorsTrainingSession(trainingSession, collaboratorIdentities);
            return new TrainingSessionToDescription().convert(trainingSession);
        } catch (PersistentObjectNotFoundException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.collaboratorsRequestingListByTrainingSession}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getCollaboratorsRequestingListByTrainingSession(@PathVariable Long id) {
        TrainingSession trainingSession = null;
        try {
            trainingSession = trainingDAO.getSessionTraining(id);
            return new CollaboratorToIdentity().convert(collaboratorDAO.getCollaboratorsRequestingBySession(trainingSession));
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    //Update Collaborator Password
    @RequestMapping(value = "${endpoint.collaboratorspassword}", method = RequestMethod.PUT)
    @ResponseBody
    public CollaboratorDescription updateCollaboratorPassword(@PathVariable String collaboratorPassword, @PathVariable String collabId) {
        try {
            Collaborator collaborator= collaboratorDAO.getCollaborator(Long.parseLong(collabId));
            if(collaborator == null) throw new PersistentObjectNotFoundException(15,Collaborator.class);
            collaborator = collaboratorDAO.updateCollaboratorPassword(collaborator, collaboratorPassword);
            return new CollaboratorToDescription().convert(collaborator);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    //Send Collaborator Email
    @RequestMapping(value = "${endpoint.collaboratorsemailpassword}", method = RequestMethod.POST)
    @ResponseBody
    public void sendCollaboratorEmail(@PathVariable String collaboratorId) {
        try {
            Collaborator collaborator= collaboratorDAO.getCollaborator(Long.parseLong(collaboratorId));
            sendMessage sendmessage = new sendMessage();
            try {
                sendmessage.main(collaborator.getEmail(),collaborator.getId());
            } catch (MessagingException e) {
                e.printStackTrace();
            }
            if(collaborator == null) throw new PersistentObjectNotFoundException(15,Collaborator.class);

        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

//    //Save collaborator image
//    @RequestMapping(value = "${endpoint.updatecollaboratorpicture}", method = RequestMethod.POST)
//    @ResponseBody
//    public void FileUploadService(@PathVariable FilecollaboratorImage) {
//        String name ="blabla";
//        if(!collaboratorImage){
//            try{
//                byte[] bytes = collaboratorImage.getBytes();
//                BufferedOutputStream stream =
//                        new BufferedOutputStream(new FileOutputStream(new File(name + "-uploaded")));
//                stream.write(bytes);
//                stream.close();
//
//            } catch (Exception e) {
//            }
//        } else {
//
//        }
//
//        }



}
package com.viseo.c360.formation.controllers;

import com.viseo.c360.formation.domain.collaborator.RequestTraining;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.dto.collaborator.CollaboratorIdentity;
import com.viseo.c360.formation.dto.collaborator.RequestTrainingDescription;
import com.viseo.c360.formation.dto.collaborator.WishDescription;
import com.viseo.c360.formation.dto.training.TrainingSessionDescription;
import com.viseo.c360.formation.exceptions.C360Exception;
import com.viseo.c360.formation.services.CollaboratorServicesImpl;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static io.jsonwebtoken.impl.crypto.MacProvider.generateKey;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@RestController
public class CollaboratorWS {

    @Inject
    private CollaboratorServicesImpl collaboratorServices;

    @Inject
    private RabbitTemplate rabbitTemplate;

    private static final ConcurrentHashMap<String, CollaboratorDescription> mapUserCache = new ConcurrentHashMap<>();

    private void putUserInCache(String token, CollaboratorDescription user) {
        this.mapUserCache.put(token, user);
    }

    private String createSecurityToken(CollaboratorDescription user){
        return Jwts.builder()
                .setSubject(user.getFirstName())
                .claim("lastName", user.getLastName())
                .claim("roles", user.getIsAdmin())
                .claim("id", user.getId())
                .signWith(SignatureAlgorithm.HS512, generateKey())
                .compact();
    }

    @RequestMapping(value = "${endpoint.user}", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> getUserByLoginPassword(@RequestBody CollaboratorDescription myCollaboratorDescription) {
        CollaboratorDescription externalDescription = collaboratorServices.checkIfCollaboratorExistElsewhere(myCollaboratorDescription);
        CollaboratorDescription user = collaboratorServices.handleReceivedCollaborator(myCollaboratorDescription,externalDescription);
        String compactJws = createSecurityToken(user);
        this.putUserInCache(compactJws, user);
        Map<String, String> currentUserMap = new HashMap<>();
        currentUserMap.put("userConnected", compactJws);
        return currentUserMap;
    }


    @RequestMapping(value = "${endpoint.getuserrole}", method = RequestMethod.POST)
    @ResponseBody
    public boolean checkIsAdminAlreadyConnected(@RequestBody String thisToken) {
        try {
            return mapUserCache.get(thisToken).getIsAdmin();
        } catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.isconnected}", method = RequestMethod.POST)
    @ResponseBody
    public boolean checkIsAlreadyConnected(@RequestBody String thisToken) {
        try {
            return mapUserCache.get(thisToken) != null;
        } catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.userdisconnect}", method = RequestMethod.POST)
    @ResponseBody
    public Boolean deleteDisconnectedUserFromCache(@RequestBody String token) {
        try {

            if (isEmpty(token)) {
                return false;
            }

            mapUserCache.remove(token);
            return mapUserCache.contains(token);
        } catch (Exception e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.addwish}", method = RequestMethod.POST)
    @ResponseBody
    public WishDescription addWish(@RequestBody WishDescription wishDescription, @PathVariable Long collaborator_id) {

        // TODO : Changer pour un label coté Front
        return collaboratorServices.addWish(wishDescription.getLabel(), collaborator_id);
    }

    @RequestMapping(value = "${endpoint.isnotcheckedwishes}", method = RequestMethod.GET)
    @ResponseBody
    public List<WishDescription> getIsNotCheckedWishes() {
            return collaboratorServices.getIsNotCheckedWishes();
    }

    @RequestMapping(value = "${endpoint.allwishes}", method = RequestMethod.GET)
    @ResponseBody
    public List<WishDescription> getAllWishes() {
        List<WishDescription> list = this.collaboratorServices.getAllWishes();
        return this.collaboratorServices.getAllWishes();
    }

    @RequestMapping(value = "${endpoint.allvalidatedwishes}", method = RequestMethod.GET)
    @ResponseBody
    public List<WishDescription> getIsValidatedWishes() {
        return collaboratorServices.getIsValidatedWishes();
    }


    @RequestMapping(value = "${endpoint.kowishtoadd}", method = RequestMethod.PUT)
    @ResponseBody
    public WishDescription updateKoWish(@RequestBody WishDescription Wish, @PathVariable Long collaborator_id) {
        return collaboratorServices.updateKoWish(Wish,collaborator_id);
    }

    @RequestMapping(value = "${endpoint.okwishtoadd}", method = RequestMethod.PUT)
    @ResponseBody
    public WishDescription updateOkWish(@RequestBody WishDescription Wish, @PathVariable Long collaborator_id) {
        return collaboratorServices.updateOkWish(Wish,collaborator_id);
    }

    @RequestMapping(value = "${endpoint.kowishtochange}", method = RequestMethod.PUT)
    @ResponseBody
    public WishDescription changeKoToOk(@RequestBody WishDescription Wish, @PathVariable Long collaborator_id) {
        return collaboratorServices.changeKoToOk(Wish,collaborator_id);
    }

    @RequestMapping(value = "${endpoint.okwishtochange}", method = RequestMethod.PUT)
    @ResponseBody
    public WishDescription changeOkToKo(@RequestBody WishDescription Wish, @PathVariable Long collaborator_id) {
        return collaboratorServices.changeOkToKo(Wish,collaborator_id);
    }

    @RequestMapping(value = "${endpoint.ischeckedwishestoupdate}", method = RequestMethod.POST)
    @ResponseBody
    public List<WishDescription> updateIsChecked(@RequestBody List<WishDescription> Wishes) {
        return collaboratorServices.updateIsChecked(Wishes);
    }


    @RequestMapping(value = "${endpoint.collaborators}", method = RequestMethod.POST)
    @ResponseBody
    public CollaboratorDescription addCollaborator(@RequestBody CollaboratorDescription collaboratorDescription) {
        return collaboratorServices.addCollaborator(collaboratorDescription);
    }

    @RequestMapping(value = "${endpoint.updatecollaborator}", method = RequestMethod.PUT)
    @ResponseBody
    public CollaboratorDescription updateCollaborator(@RequestBody CollaboratorDescription collaborator) {
        return collaboratorServices.updateCollaborator(collaborator);
    }

    @RequestMapping(value = "${endpoint.collaborators}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getAllCollaborators() {
        return collaboratorServices.getAllCollaborators();
    }

    @RequestMapping(value = "${endpoint.collaboratorbyid}", method = RequestMethod.GET)
    @ResponseBody
    public CollaboratorDescription getCollaboratorById(@PathVariable Long collab_id) {
        return collaboratorServices.getCollaboratorById(collab_id);
    }

    @RequestMapping(value = "${endpoint.collaboratorsNotAffectedBySession}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getNotAffectedCollaboratorsList(@PathVariable Long id) {
        return collaboratorServices.getNotAffectedCollaboratorsList(id);
    }

    @RequestMapping(value = "${endpoint.collaboratorsAffectedBySession}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getAffectedCollaboratorsList(@PathVariable Long id) {
        return collaboratorServices.getAffectedCollaboratorsList(id);
    }


    @RequestMapping(value = "${endpoint.requests}", method = RequestMethod.POST)
    @ResponseBody
    public RequestTrainingDescription addRequestTraining(@RequestBody RequestTrainingDescription requestTrainingDescription) {
        return collaboratorServices.addRequestTraining(requestTrainingDescription);
    }

    @RequestMapping(value = "${endpoint.requestsassign}", method = RequestMethod.POST)
    @ResponseBody
    public List<RequestTraining> addRequestTrainingAssign(@PathVariable Long session_id, @PathVariable List<Long> id_collaborators) {
        return collaboratorServices.addRequestTrainingAssign(session_id,id_collaborators);
    }

    @RequestMapping(value = "${endpoint.listrequests}", method = RequestMethod.GET)
    @ResponseBody
    public List<RequestTrainingDescription> getRequestTrainings(@PathVariable Long training_id, @PathVariable Long collab_id) {
        return collaboratorServices.getRequestTrainings(training_id,collab_id);
    }

    @RequestMapping(value = "${endpoint.collaboratorsbysession}", method = RequestMethod.POST)
    @ResponseBody
    public TrainingSessionDescription updateCollaboratorsTrainingSession(@PathVariable Long idTrainingSession, @RequestBody List<CollaboratorIdentity> collaboratorIdentities) {
        return collaboratorServices.updateCollaboratorsTrainingSession(idTrainingSession,collaboratorIdentities);
    }

    @RequestMapping(value = "${endpoint.collaboratorsRequestingListByTrainingSession}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getCollaboratorsRequestingListByTrainingSession(@PathVariable Long id) {
        return collaboratorServices.getCollaboratorsRequestingListByTrainingSession(id);
    }

    //Update Collaborator Password
    @RequestMapping(value = "${endpoint.collaboratorspassword}", method = RequestMethod.PUT)
    @ResponseBody
    public CollaboratorDescription updateCollaboratorPassword(@PathVariable String collaboratorPassword, @PathVariable String collabId) {
        return collaboratorServices.updateCollaboratorPassword(collaboratorPassword,collabId);
    }

    //Send Collaborator Email
    @RequestMapping(value = "${endpoint.collaboratorsemailpassword}", method = RequestMethod.POST)
    @ResponseBody
    public void sendCollaboratorEmail(@PathVariable String collaboratorId) {
        collaboratorServices.sendCollaboratorEmail(collaboratorId);
    }

}
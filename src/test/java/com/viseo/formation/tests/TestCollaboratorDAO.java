package com.viseo.formation.tests;

import com.viseo.TestUtil;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToIdentity;
import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.collaborator.RequestTraining;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.dto.collaborator.CollaboratorIdentity;
import com.viseo.c360.formation.services.CollaboratorWS;

import com.viseo.fake.db.FakeDAOFacade;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

public class TestCollaboratorDAO {
    FakeDAOFacade fakeDaoFacade = null;
    CollaboratorDAO collaboratorDAO = null;
    CollaboratorWS collaboratorWS = null;
    CollaboratorDescription collaboratorDescriptionThomas = null;
    CollaboratorDescription collaboratorDescriptionBayrek = null;

    void prepareDto(){
        collaboratorDescriptionThomas = new CollaboratorDescription();
        collaboratorDescriptionThomas.setPersonnalIdNumber("TLE3473");
        collaboratorDescriptionThomas.setLastName("Lecomte");
        collaboratorDescriptionThomas.setFirstName("Thomas");
        collaboratorDescriptionThomas.setEmail("thomas.lecomte@viseo.com");
        collaboratorDescriptionThomas.setPassword("thomas");
        collaboratorDescriptionBayrek = new CollaboratorDescription();
        collaboratorDescriptionBayrek.setPersonnalIdNumber("BMO3473");
        collaboratorDescriptionBayrek.setLastName("Mokni");
        collaboratorDescriptionBayrek.setFirstName("Bayrek");
        collaboratorDescriptionBayrek.setEmail("bayrek.mokni@viseo.com");
        collaboratorDescriptionBayrek.setPassword("bayrek");
    }

    @Before
    public void setUp() {
        prepareDto();
        collaboratorWS = new CollaboratorWS();
        collaboratorDAO = new CollaboratorDAO();
        TestUtil.inject(collaboratorWS, "collaboratorDAO", collaboratorDAO);
        fakeDaoFacade = new FakeDAOFacade();
        fakeDaoFacade.declareEntityClasses(Collaborator.class);
        fakeDaoFacade.declareEntityClasses(RequestTraining.class);
        fakeDaoFacade.registerFilter("select c from Collaborator c", (facade, entity, paramRegistry) -> {
            return entity instanceof Collaborator;
        });
        fakeDaoFacade.registerFilter("select c from Collaborator c where c.personnalIdNumber = :personnalIdNumber", (facade, entity, paramRegistry) -> {
            if(!(entity instanceof Collaborator)) return false;
            Collaborator collaborator = (Collaborator) entity;
            return collaborator.getPersonnalIdNumber().equals(paramRegistry.get("personnalIdNumber"));
        });
        TestUtil.inject(collaboratorDAO, "daoFacade", fakeDaoFacade);
    }

    @Test
    public void testAddCollaborator(){
        collaboratorDescriptionThomas = collaboratorWS.addCollaborator(collaboratorDescriptionThomas);
        collaboratorDescriptionBayrek = collaboratorWS.addCollaborator(collaboratorDescriptionBayrek);
        Collaborator thomas = fakeDaoFacade.find(Collaborator.class, collaboratorDescriptionThomas.getId());
        Collaborator bayrek = fakeDaoFacade.find(Collaborator.class, collaboratorDescriptionBayrek.getId());
        List<CollaboratorIdentity> collaboratorList = new ArrayList<>();
        collaboratorList.add(new CollaboratorToIdentity().convert(thomas));
        collaboratorList.add(new CollaboratorToIdentity().convert(bayrek));
        Assert.assertEquals(collaboratorList,collaboratorWS.getAllCollaborators());
    }
}
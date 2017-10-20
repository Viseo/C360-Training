package com.viseo.c360.formation.amqp;

import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.training.Skill;

import javax.inject.Inject;
import java.util.List;
import java.util.UUID;

/**
 * Created by YGU3747 on 20/10/2017
 */

public class AddSkillLevelMessage extends RabbitMsg{

    @Inject
    List<Skill> skills;

    @Inject
    List<Collaborator> collaborators;

    private UUID sequence = new UUID(0L, 0L);
    private String nameFileResponse;

    public AddSkillLevelMessage() {
        super(MessageType.ADDSKILLLEVEL);
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public AddSkillLevelMessage setSkills(List<Skill> skills) {
        this.skills = skills;
        return this;
    }

    public List<Collaborator> getCollaborators() {
        return collaborators;
    }

    public AddSkillLevelMessage setCollaborators(List<Collaborator> collaborators) {
        this.collaborators = collaborators;
        return this;
    }

    public UUID getSequence() {
        return sequence;
    }

    public AddSkillLevelMessage setSequence(UUID sequence) {
        this.sequence = sequence;
        return this;
    }

    public String getNameFileResponse() {
        return nameFileResponse;
    }

    public AddSkillLevelMessage setNameFileResponse(String nameFileResponse) {
        this.nameFileResponse = nameFileResponse;
        return this;
    }
}

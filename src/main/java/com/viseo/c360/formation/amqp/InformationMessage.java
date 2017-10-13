package com.viseo.c360.formation.amqp;

import com.viseo.c360.formation.dto.training.SkillDescription;

import javax.inject.Inject;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Created by YGU3747 on 12/10/2017
 */

public class InformationMessage extends RabbitMsg {

    private UUID sequence;

    private String nameFileResponse;

    private Date messageDate;

    @Inject
    private List<SkillDescription> skillsDescription;

    public InformationMessage() {
        super(MessageType.INFORMATION);
    }

    public UUID getSequence() {
        return sequence;
    }

    public InformationMessage setSequence(UUID sequence) {
        this.sequence = sequence;
        return this;
    }

    public String getNameFileResponse() {
        return nameFileResponse;
    }

    public InformationMessage setNameFileResponse(String nameFileResponse) {
        this.nameFileResponse = nameFileResponse;
        return this;
    }

    public Date getMessageDate() {
        return messageDate;
    }

    public InformationMessage setMessageDate(Date messageDate) {
        this.messageDate = messageDate;
        return this;
    }

    public List<SkillDescription> getSkillsDescription() {
        return skillsDescription;
    }

    public InformationMessage setSkillsDescription(List<SkillDescription> skillsDescription) {
        this.skillsDescription = skillsDescription;
        return this;
    }
}

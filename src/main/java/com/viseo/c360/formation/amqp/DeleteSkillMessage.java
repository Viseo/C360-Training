package com.viseo.c360.formation.amqp;

import com.viseo.c360.formation.dto.training.SkillDescription;

import javax.inject.Inject;
import java.util.UUID;

/**
 * Created by YGU3747 on 16/10/2017
 */

public class DeleteSkillMessage extends RabbitMsg {

    @Inject
    private SkillDescription skillDescription;

    private UUID sequence = new UUID(0L, 0L);

    public DeleteSkillMessage() {
        super(MessageType.DELETESKILL);
    }

    public SkillDescription getSkillDescription() {
        return skillDescription;
    }

    public DeleteSkillMessage setSkillDescription(SkillDescription skillsDescription) {
        this.skillDescription = skillsDescription;
        return this;
    }

    public UUID getSequence() {
        return sequence;
    }

    public DeleteSkillMessage setSequence(UUID sequence) {
        this.sequence = sequence;
        return this;
    }
}

package com.viseo.c360.formation.dto.collaborator;

import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.dto.BaseDTO;
import org.apache.commons.collections.CollectionUtils;

import java.util.Collections;
import java.util.List;

public class WishDescription extends BaseDTO {

    public static class Regex {
        public static final String LABEL = "[a-zA-Z0-9+#'-. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæ\u0153ÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝ\u0178Æ\u0152]";
    }

    private String label;

    private CollaboratorDescription collaborator;

    private Boolean isChecked;

    public WishDescription() {
    }

    private List<Collaborator> vote_ok;

    private List<Collaborator> vote_ko;

    public WishDescription(WishDescriptionBuilder wishDescriptionBuilder) {
        this.label = wishDescriptionBuilder.label;
        this.collaborator = wishDescriptionBuilder.collaborator;
        this.isChecked = wishDescriptionBuilder.isChecked;
        this.vote_ok = wishDescriptionBuilder.vote_ok;
        this.vote_ko = wishDescriptionBuilder.vote_ko;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public CollaboratorDescription getCollaborator() {
        return collaborator;
    }

    public void setCollaborator(CollaboratorDescription collaborator) {
        this.collaborator = collaborator;
    }

    public Boolean getChecked() {
        return isChecked;
    }

    public void setChecked(Boolean checked) {
        isChecked = checked;
    }

    public List<Collaborator> getVote_ok() {
        return vote_ok;
    }

    public void setVote_ok(List<Collaborator> vote_ok) {

        this.vote_ok = vote_ok;
    }

    public List<Collaborator> getVote_ko() {
        return vote_ko;
    }

    public void setVote_ko(List<Collaborator> vote_ko) {
        this.vote_ko = vote_ko;
    }


    public static class WishDescriptionBuilder {

        private String label;
        private CollaboratorDescription collaborator;
        private Boolean isChecked;
        private List<Collaborator> vote_ok;
        private List<Collaborator> vote_ko;

        public WishDescriptionBuilder(String label, CollaboratorDescription collaborator) {
            this.label = label;
            this.collaborator = collaborator;
        }

        public WishDescriptionBuilder voteOk(List<Collaborator> vote_ok) {
            this.vote_ok = vote_ok;
            return this;
        }

        public WishDescriptionBuilder voteKO(List<Collaborator> vote_ko) {
            this.vote_ko = vote_ko;
            return this;
        }

        public WishDescription build() {

            if (CollectionUtils.isEmpty(this.vote_ok)) {
                this.vote_ok = Collections.emptyList();
            }

            if (CollectionUtils.isEmpty(this.vote_ko)) {
                this.vote_ko = Collections.emptyList();
            }

            this.isChecked = null;

            return new WishDescription(this);
        }
    }
}

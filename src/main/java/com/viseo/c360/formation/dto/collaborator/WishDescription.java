package com.viseo.c360.formation.dto.collaborator;
import com.viseo.c360.formation.dto.BaseDTO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;

import java.util.List;
import java.util.StringJoiner;

public class WishDescription extends BaseDTO{

    public static class Regex{
        public static final String LABEL = "[a-zA-Z0-9+#'-. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæ\u0153ÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝ\u0178Æ\u0152]";
    }

    String label;

    CollaboratorDescription collaborator;

    Boolean isChecked;

    List<Collaborator> vote_ok;

    List<Collaborator> vote_ko;

    public WishDescription() {
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
}

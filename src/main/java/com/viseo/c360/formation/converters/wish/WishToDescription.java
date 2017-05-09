package com.viseo.c360.formation.converters.wish;


import com.viseo.c360.formation.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.formation.domain.collaborator.Wish;
import com.viseo.c360.formation.dto.collaborator.WishDescription;

import java.util.ArrayList;
import java.util.List;

public class WishToDescription {
    public WishToDescription() {
    }

    public WishDescription convert(Wish source) {
        WishDescription dto = new WishDescription();
        dto.setId(source.getId());
        dto.setVersion(source.getVersion());
        dto.setLabel(source.getLabel());
        dto.setCollaborator(new CollaboratorToDescription().convert(source.getCollaborator()));
        return dto;
    }

    public List<WishDescription> convert(List<Wish> sourceList) {
        List<WishDescription> listDescription = new ArrayList<>();
        for(Wish wish : sourceList){
            listDescription.add(convert(wish));
        }
        return listDescription;
    }
}

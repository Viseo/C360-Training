package com.viseo.c360.formation.converters.wish;

import com.viseo.c360.formation.converters.collaborator.DescriptionToCollaborator;
import com.viseo.c360.formation.domain.collaborator.Wish;
import com.viseo.c360.formation.dto.collaborator.WishDescription;

import java.util.ArrayList;
import java.util.List;


public class DescriptionToWish {
    public Wish convert(WishDescription dto) {
        Wish domain = new Wish();
        domain.setId(dto.getId());
        domain.setVersion(dto.getVersion());
        domain.setLabel(dto.getLabel());
        domain.setChecked(dto.getChecked());
        domain.setCollaborator(new DescriptionToCollaborator().convert(dto.getCollaborator()));
        domain.setVote_ok(dto.getVote_ok());
        domain.setVote_ko(dto.getVote_ko());
        return domain;

    }

    public List<Wish> convert(List<WishDescription> listDto) {
        List<Wish> listWish = new ArrayList<Wish>();
        for (WishDescription myWishDescription : listDto) {
            listWish.add(
                    convert(myWishDescription)
            );
        }
        return listWish;
    }
}

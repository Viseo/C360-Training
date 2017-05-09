package com.viseo.c360.formation.converters.wish;

import com.viseo.c360.formation.converters.collaborator.DescriptionToCollaborator;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.collaborator.Wish;
import com.viseo.c360.formation.dto.collaborator.WishDescription;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.TypeDescriptor;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;


public class DescriptionToWish {
    public Wish convert(WishDescription dto, Collaborator collaborator, List<Collaborator> vote_ok, List<Collaborator> vote_ko) {
        Wish domain = new Wish();
        domain.setId(dto.getId());
        domain.setVersion(dto.getVersion());
        domain.setLabel(dto.getLabel());
        domain.setCollaborator(collaborator);
        return domain;

    }

    public List<Wish> convert(List<WishDescription> listDto, Collaborator collaborator, List<Collaborator> vote_ok, List<Collaborator> vote_ko) {
        List<Wish> listWish = new ArrayList<Wish>();
        for (WishDescription myWishDescription : listDto) {
            listWish.add(
                    convert(myWishDescription,
                            new DescriptionToCollaborator().convert(myWishDescription.getCollaborator()),
                            new DescriptionToCollaborator().convert(myWishDescription.getVote_ok()),
                            new DescriptionToCollaborator().convert(myWishDescription.getVote_ko())
                    )
            );
        }
        return listWish;
    }
}

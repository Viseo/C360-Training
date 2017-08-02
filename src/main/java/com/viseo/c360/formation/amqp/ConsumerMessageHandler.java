package com.viseo.c360.formation.amqp;

/**
 * Created by SJO3662 on 28/07/2017.
 */
import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;
import com.viseo.c360.formation.services.CollaboratorWS;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ConsumerMessageHandler {

    public String handleMessage(String request) {
        return request;

    }
}
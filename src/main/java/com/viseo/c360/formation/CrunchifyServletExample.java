package com.viseo.c360.formation;

import com.viseo.c360.formation.dao.CollaboratorDAO;
import org.springframework.stereotype.Repository;

import javax.inject.Inject;
import javax.servlet.http.HttpServlet;

/**
 * Created by BBA3616 on 26/07/2017.
 */
@Repository
public class CrunchifyServletExample extends HttpServlet {

    @Inject
    CollaboratorDAO collaboratorDAO;

    /*public void init() throws ServletException
    {
        System.out.println("----------");
        System.out.println("---------- CrunchifyServletExample Initialized successfully ----------");
        System.out.println("----------");


        try {
            ConnectionFactory var1 = new ConnectionFactory();
            var1.setHost("localhost");
            Connection var2 = null;
            var2 = var1.newConnection();
            final Channel var3 = var2.createChannel();
            var3.queueDeclare("hello", false, false, false, (Map)null);
            System.out.println(" [*] Waiting for messages. To exit press CTRL+C");
            DefaultConsumer var4 = new DefaultConsumer(var3) {
                public void handleDelivery(String var1, Envelope var2, BasicProperties var3, byte[] var4) throws IOException {
                    String var5 = new String(var4, "UTF-8");
                    Collaborator collaborator = new ObjectMapper().readValue(var5, Collaborator.class );
                    List<Collaborator> list = collaboratorDAO.getAllCollaborators();
                    for(int i =0; i< list.size(); i++){
                        if(list.get(i).getFirstName() == collaborator.getFirstName()) {
                            System.out.println("Il existe !");
                        }
                        else if(i == (list.size() -1))
                        System.out.println("Il existe PAS!");

                    }
                }

            };
            var3.basicConsume("hello", true, var4);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (TimeoutException e) {
            e.printStackTrace();
        }

    }*/

}

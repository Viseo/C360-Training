package com.viseo.c360.formation.file;

/**
 * Created by BBA3616 on 22/05/2017.
 */

import java.io.File;
import java.io.IOException;
import java.net.URL;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@WebServlet("/fileUpload")
@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 1, // 1 MB
        maxFileSize = 1024 * 1024 * 5, // 5 MB
        maxRequestSize = 1024 * 1024 * 10)
// 10 MB
public class FileUploadController extends HttpServlet {

    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response) throws ServletException, IOException {
        Part part = request.getPart("blob");
        String idCollaborator = request.getParameter("idCollaborator");
        String fileName = null;
        URL resource = getClass().getResource("/");
        System.out.println("test"+ resource );
        String path = resource.getPath();
        System.out.println("test"+ resource.getPath() );
        if (part != null) {
            //writing blob
            part.write( resource.getPath().replace("WEB-INF/classes/","") + "img/" + File.separator + idCollaborator + ".jpg");

        } else {
            //Writing image or file
            part = request.getPart("file");
            part.write(resource.getPath().replace("WEB-INF/classes/","") + "img/" + File.separator + idCollaborator + ".jpg");
        }

        // Extra logic to support multiple domain - you may want to remove this
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.getWriter().print(" uploaded successfully");
    }

}
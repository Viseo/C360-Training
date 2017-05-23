package com.viseo.c360.formation.file;

/**
 * Created by BBA3616 on 22/05/2017.
 */

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

    protected void setServerResponse(HttpServletResponse response,String successMessage) throws IOException {
        try {
        response.getWriter().print(successMessage);
        System.out.println(successMessage);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    protected void createImage(Part image, String Path) throws IOException {
        try {
            image.write(Path);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    protected String getCurrentPath(){
        URL resource = getClass().getResource("/");
        return resource.getPath();
    }

    protected boolean isMimeTypeImage(Part image){
        String mimeType = image.getContentType().split("/")[0];
        return mimeType.equals("image");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Part imageCollaborator = request.getPart("file");
        String idCollaborator = request.getParameter("idCollaborator");
        String imgPath = getCurrentPath().replace("WEB-INF/classes/", "") + "img/";
        String imageName = idCollaborator + ".jpg";

        if(isMimeTypeImage(imageCollaborator)) {
            createImage(imageCollaborator, imgPath + imageName);
            setServerResponse(response, "Upload/Update profil image successfully, id collaborator:"+idCollaborator+"\n");
        }
        else{
            response.sendError(404,"File MimeType is not an image");
        }
    }

}
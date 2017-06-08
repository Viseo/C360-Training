let profilToUpdate = Vue.component('profil-to-update', {
    template: `
<form id="register-form"
      @submit.prevent="updateCollaboratorInfo()"
      enctype="multipart/form-data">
    <div class="col-lg-6 col-sm-12 col-xs-12 col-md-6 col-lg-offset-3 col-md-offset-3">
        <div class="panel panel-default">
            <div class="panel-header">
                <span>
                    <span class="glyphicon glyphicon-user"></span>
                    1. Mes coordonnées
                </span>
                <div class="boxon">
                    <img id="profilImageToChange" class="image" v-if="defaultPicture"
                                                 src="img/profile.jpg">
                                            <img id="profilImageToChange" class="image" v-else
                                                 :src="'img/'+collaborator_id+'.jpg'"> 
                    <p class="text">
                        <input ref="loadProfilImage"
                               id="loadProfilImage"
                               type="file"
                               accept="image/*"
                               style="opacity: 0.0;
                                      position: absolute;
                                      top:0;
                                      left: 0;
                                      bottom: 0;
                                      right:0;
                                      width: 100%;
                                      height:100%;
                                      cursor:pointer;"/>
                        <br><br><br><b>MODIFIER</b>
                    </p>
                </div>
            </div>
            <div class="panel-body">
                <div class="col-lg-10 col-sm-12 col-xs-12 col-md-10 col-lg-offset-1 col-md-offset-1"> 
                    <div class="row">
                        <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6"> 

                            <!-- PRENOM -->
                            <customInput
                                    label="prenom"
                                    labelText="Prénom"
                                    icon="glyphicon-user"
                                    type="text"
                                    tab="2"
                                    v-model="firstName"
                                    maxlength="125" minlength="2"
                                    @focus="setFirstNameEmptyToFalse()"
                                    @blur="isFirstNameEmpty()"
                                    :emptyField="firstNameEmpty"
                                    :errorField="isErrorFirstName()"
                                    :errorMessage="errorMessageFirstName">
                            </customInput>
                        </div>
                        <div class="col-lg-6 col-md-6"> 

                            <!-- FONCTION -->
                            <customInput
                                    label="fonction"
                                    labelText="Fonction"
                                    icon="glyphicon-tag"
                                    type="text"
                                    tab="2"
                                    v-model="fonction"
                                    maxlength="50">
                            </customInput>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-lg-6 col-sm-6 col-xs-6 col-md-6"> 
                            <!-- NOM -->
                            <customInput
                                    label="nom"
                                    labelText="Nom"
                                    icon="glyphicon-user"
                                    type="text"
                                    tab="2"
                                    v-model="lastName"
                                    maxlength="125" minlength="2"
                                    @focus="setLastNameEmptyToFalse()"
                                    @blur="isLastNameEmpty()"
                                    :emptyField="lastNameEmpty"
                                    :errorField="isErrorLastName()"
                                    :errorMessage="errorMessageLastName">
                            </customInput>
                        </div>
                        <div class="col-lg-6 col-md-6 "> 
                            <!-- BUSINESS UNIT -->
                            <table style="border-spacing: 0px">
                                <div class="form-group has-feedback">
                                    <label>Business Unit</label>
                                    <div class="inner-addon left-addon">
                                        <tr>
                                            <td style="width: 500px;">
                                                <i class="glyphicon"></i>
                                                <select class="form-control" v-model="businessUnit">
                                                    <option>VISEO DATA & PROCESS</option>
                                                    <option>VISEO TECHNOLOGIES</option>
                                                    <option>VISEO DIGITAL</option>
                                                </select>
                                            </td>
                                        </tr>
                                    </div>
                                </div>
                            </table>
                        </div>
                    </div>
                    <br>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-6 col-sm-12 col-xs-12 col-md-6 col-lg-offset-3 col-md-offset-3">
        <div class="panel panel-default">
            <div class="panel-header">
                <span>
                    <span class="glyphicon glyphicon-user"></span>
                    2. Mes identifiants
                </span>
            </div>
            <div class="panel-body">
                <div class="col-lg-10 col-sm-12 col-xs-12 col-md-6 col-lg-offset-1 col-md-offset-3">
                    <div class="row">
                        <div class="col-lg-5 col-sm-6 col-xs-6 col-md-12"> 
                            <!-- MOT DE PASSE -->
                            <customPasswordInput
                                    label="ancienmdp"
                                    labelText="Ancien mot de passe"
                                    v-model="password"
                                    @focus="setOldPasswordEmptyToFalse()"
                                    @blur="isOldPasswordEmpty()"
                                    :emptyField="oldPasswordEmpty"
                                    :errorField="isErrorOldPassword()"
                                    :errorMessage="errorMessageOldPassword"
                                    :show="showPass"
                                    @click="toggleShowPassword()"
                                    :isValid="isValidOldPassword"
                                    :isNotValid="isNotValidOldPassword">
                            </customPasswordInput>
                        </div>
                        <div class="col-lg-6 col-lg-offset-1 col-md-12"> 
                            <!-- EMAIL-->
                            <customInput
                                    label="email"
                                    labelText="Email"
                                    icon="glyphicon-envelope"
                                    type="text"
                                    tab="2"
                                    v-model="email"
                                    @focus="setEmailAlreadyExistToTrue()"
                                    @blur="isEmailEmpty()"
                                    :emptyField="emailEmpty"
                                    :errorField="isErrorEmail()"
                                    :errorMessage="errorMessageEmail"
                                    :disabled = "true" >
                            </customInput>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-lg-5 col-sm-6 col-xs-6 col-md-12"> 
                            <!-- NOUVEAU MOT DE PASSE -->
                            <customPasswordInput
                                    label="nouveaumdp"
                                    labelText="Nouveau mot de passe"
                                    v-model="newPassword"
                                    @focus="setPasswordEmptyToFalse()"
                                    @blur="isPasswordEmpty()"
                                    :emptyField="passwordEmpty"
                                    :errorField="isErrorPassword()"
                                    :errorMessage="errorMessagePassword"
                                    :show="showPass"
                                    @click="toggleShowPassword()"
                                    :isValid="isValidPassword"
                                    :isNotValid="isNotValidPassword">
                            </customPasswordInput>

                        </div>
                        <div class="col-lg-6 col-lg-offset-1 col-md-offset-1">
                            <span><b>Remarque:</b></span><br>
                            <p>Votre nouveau mot de passe doit contenir au minimum 6 caractères.</p>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-lg-5 col-sm-6 col-xs-6 col-md-12"> 
                            <!-- CONFIRMATION MOT DE PASSE -->
                            <customPasswordInput
                                    label="mdpc"
                                    labelText="Confirmation mot de passe"
                                    v-model="confirmPassword"
                                    @focus="setConfirmPasswordEmptyToFalse()"
                                    @blur="isConfirmPasswordEmpty()"
                                    :emptyField="confirmPasswordEmpty"
                                    :errorField="isErrorConfirmPassword()"
                                    :errorMessage="errorMessageConfirmPassword"
                                    :show="showPass"
                                    @click="toggleShowPassword()"
                                    :isValid="isValidConfirmPassword"
                                    :isNotValid="isNotValidConfirmPassword">
                            </customPasswordInput>
                        </div>
                        <div class="col-lg-6 col-lg-offset-1 col-md-offset-1">
                            <br>
                            <span v-show="!isRightOldPassword " class="color-red">
                                        <b>{{errorMessageOnSubmit}}</b>
                                    </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-lg-6 col-sm-12 col-xs-12 col-md-6 col-lg-offset-3 col-md-offset-3">
            <div class="form-group">
                <div class="row">
                    <div class="col-lg-5 col-lg-offset-1 col-md-3 col-md-offset-3 col-sm-6 col-xs-6">
                            <button type="submit"
                                    name="register-submit"
                                    id="register-submit"
                                    tabindex="4"
                                    class="form-control btn btn-primary">
                                Enregistrer
                            </button>
                    </div>
                    <div class="col-lg-5 col-sm-6 col-xs-6 col-md-3">
                            <button @click="goTo('registerTrainingCollaborator')"
                                    name="cancel-submit"
                                    id="cancel-submit"
                                    tabindex="4"
                                    class="form-control btn btn-primary">Annuler
                            </button>
                    </div>
                    <br><br>
                </div>
            </div>
        </div>
</form>
`,

    data: function () {
        return {
            firstName: '',
            fonction: '',
            lastName: '',
            businessUnit: '',
            email: '',
            password: '',
            newPassword: '',
            confirmPassword: '',

            lastNameEmpty: false,
            isLastNameValid: true,
            errorMessageLastName: '',

            firstNameEmpty: false,
            isFirstNameValid: true,
            errorMessageFirstName: '',

            emailEmpty: false,
            isEmailValid: true,
            errorMessageEmail: '',

            passwordEmpty: false,
            isPasswordValid: true,
            errorMessagePassword: '',
            isValidPassword: false,
            isNotValidPassword: false,

            oldPasswordEmpty: false,
            isOldPasswordValid: true,
            errorMessageOldPassword: '',
            errorMessageOnSubmit:'',
            isValidOldPassword: false,
            isNotValidOldPassword: false,

            confirmPasswordEmpty: false,
            isConfirmPasswordValid: true,
            errorMessageConfirmPassword: '',
            isValidConfirmPassword: false,
            isNotValidConfirmPassword: false,

            isRightOldPassword: true,

            showPass: false,
            infoCollab: [],
            CollabToUpdate: {},
            imagePathName: 'img/profile.jpg',
            imageHasBeenChanged: false,
            imagePath: '',

            collaborator_id:'',
            defaultPicture:''

        }
    },

    watch: {
        lastName: function (value) {
            this.verifyLastName(value);
        },
        firstName: function (value) {
            this.verifyFirstName(value);
        },
        email: function (value) {
            this.verifyEmail(value);
        },
        password: function (value) {
            this.verifyOldPassword(value);
        },
        newPassword: function (value) {
            this.verifyPassword(value);
            if (this.confirmPassword != '')
                this.verifyConfirmPassword(value);
        },
        confirmPassword: function (value) {
            this.verifyConfirmPassword(value);
        }
    },

    mounted: function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.initializeInformationsFromCookie();
        this.getInfoCollaborator();
        this.checkIfProfilImageHasBeenChanged("#loadProfilImage");
        this.imagePath = "img/" + this.collaborator_id + ".jpg";
    },

    methods: {
        getDefautPictureCookie(){
            let cookie = this.getCookie("defaultPicture");
            if(cookie == "false"){
                this.defaultPicture = false;
            }else if(cookie == "true"){
                this.defaultPicture = true;
            }
        },
        checkIfProfilImageHasBeenChanged(idImage) {
            let currentProfilImage = $(idImage);
            let self = this;

            function displayNewImageFile(input, idImage) {
                let imageFile = input.files[0];
                let isImageSelected = input.files && input.files[0];
                let newProfilImage = $(idImage);

                if (isImageSelected) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        newProfilImage.attr('src', e.target.result);
                    };
                    reader.readAsDataURL(imageFile);
                    console.log("File: " + imageFile.name + " selected");
                }

            };

            currentProfilImage.change(function () {
                displayNewImageFile(this, '#profilImageToChange');
                self.imageHasBeenChanged = true;
            });
        },

        setLastNameEmptyToFalse() {
            this.lastNameEmpty = false;
        },

        setFirstNameEmptyToFalse() {
            this.firstNameEmpty = false;
        },

        setEmailAlreadyExistToTrue() {
            this.emailEmpty = false
        },

        verifyLastName(lastName) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/.test(lastName)) {
                this.errorMessageLastName = '';
                this.isLastNameValid = true;
            } else {
                this.errorMessageLastName = 'Veuillez entrer un nom valide';
                this.isLastNameValid = false;
            }
        },

        isLastNameEmpty(){
            if (this.lastName == '') {
                this.lastNameEmpty = true;
            }
        },

        isErrorLastName() {
            return !this.isLastNameValid && !this.lastNameEmpty;
        },

        verifyFirstName(firstName) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/.test(firstName)) {
                this.errorMessageFirstName = '';
                this.isFirstNameValid = true;
            } else {
                this.errorMessageFirstName = 'Veuillez entrer un prénom valide';
                this.isFirstNameValid = false;
            }
        },

        isFirstNameEmpty(){
            if (this.firstName == '') {
                this.firstNameEmpty = true;
            }
        },

        isErrorFirstName() {
            return !this.isFirstNameValid && !this.firstNameEmpty;
        },

        verifyEmail(email){
            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([0-9]{1,3}\.)+[0-9]{1,3})|(([a-zA-ZàÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/
                    .test(email)) {
                this.errorMessageEmail = '';
                this.isEmailValid = true;
            } else {
                this.errorMessageEmail = 'Veuillez entrer un email valide';
                this.isEmailValid = false;
            }
        },

        isEmailEmpty(){
            if (this.email == '') {
                this.emailEmpty = true;
            }
        },

        isErrorEmail() {
            return !this.isEmailValid && !this.emailEmpty;
        },

        setConfirmPasswordEmptyToFalse(){
            this.confirmPasswordEmpty = false;
        },

        isConfirmPasswordEmpty(){
            if (this.confirmPassword == '') {
                this.confirmPasswordEmpty = true;
                this.isValidConfirmPassword = false;
                this.isNotValidConfirmPassword = true;

            }
        },

        isErrorConfirmPassword(){
            return !this.isConfirmPasswordValid && !this.confirmPasswordEmpty;
        },

        setOldPasswordEmptyToFalse(){
            this.oldPasswordEmpty = false;
        },

        isOldPasswordEmpty(){
            if (this.password == '') {
                this.oldPasswordEmpty = true;
                this.isValidOldPassword = false;
                this.isNotValidOldPassword = false;
            }
        },

        isErrorOldPassword(){
            return !this.isOldPasswordValid && !this.oldPasswordEmpty;
        },

        setPasswordEmptyToFalse(){
            this.passwordEmpty = false;
        },

        isPasswordEmpty(){
            if (this.newPassword == '') {
                this.passwordEmpty = true;
                this.isValidPassword = false;
                this.isNotValidPassword = false;
            }
        },

        isErrorPassword(){
            return !this.isPasswordValid && !this.passwordEmpty;
        },

        toggleShowPassword(){
            this.showPass = !this.showPass;
        },

        verifyOldPassword(password) {
            if (/^(.){6,125}$/.test(password)) {
                this.errorMessageOldPassword = '';
                this.isOldPasswordValid = true;
                this.isValidOldPassword = true;
                this.isNotValidOldPassword = false;
            } else {
                this.errorMessageOldPassword = 'Le mot de passe doit avoir au minimum 6 caractères';
                this.isOldPasswordValid = false;
                this.isValidOldPassword = false;
                this.isNotValidOldPassword = true;
            }
        },

        verifyPassword(password) {
            console.log(password)
            if (/^(.){6,125}$/.test(password)) {
                this.errorMessagePassword = '';
                this.isPasswordValid = true;
                this.isValidPassword = true;
                this.isNotValidPassword = false;
            } else {
                this.errorMessagePassword = 'Le mot de passe doit avoir au minimum 6 caractères';
                this.isPasswordValid = false;
                this.isValidPassword = false;
                this.isNotValidPassword = true;
            }
        },

        verifyConfirmPassword(confirmPassword) {
            if (this.confirmPassword === this.newPassword) {
                this.errorMessageConfirmPassword = '';
                this.isConfirmPasswordValid = true;
                this.isValidConfirmPassword = true;
                this.isNotValidConfirmPassword = false;
            } else {
                this.errorMessageConfirmPassword = 'La confirmation du mot de passe n\'est pas valide';
                this.isConfirmPasswordValid = false;
                this.isValidConfirmPassword = false;
                this.isNotValidConfirmPassword = true;
            }
        },

        initializeInformationsFromCookie(){
            let collaboratorInfo = this.getCollaboratorInfoFromCookie();
            let isCollaboratorInfoNotEmpty = collaboratorInfo!="";
            if(isCollaboratorInfoNotEmpty){
                this.collaborator_id = collaboratorInfo.id;
            }
            this.getDefautPictureCookie();
        },

        getInfoCollaborator(){
            this.$http.get("api/getcollaborator/" + this.collaborator_id).then(
                function (response) {
                    console.log("success to get user information");
                    this.infoCollab = response.data;
                    this.firstName = this.infoCollab.firstName;
                    this.lastName = this.infoCollab.lastName;
                    this.email = this.infoCollab.email;
                    this.fonction = this.infoCollab.function;
                    this.businessUnit = this.infoCollab.businessUnit;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },

        updateCollaboratorImage(){
            let dataToSend = new FormData();
            let imageCollaboratorFile = this.$refs.loadProfilImage.files[0];
            dataToSend.append("file", imageCollaboratorFile);
            dataToSend.append("idCollaborator", this.collaborator_id);
            this.$http.post('/fileUpload', dataToSend).then(function (response) {
                console.log(response);
            }, function (response) {

            });
        },

        saveUpdateCollaborator(){
            let saveModification = (response) => {
                if (response) {
                    console.log("success to update user information");
                    this.imageHasBeenChanged = false;
                    this.goTo('profiltoupdate');
                }
            };
            this.put("api/updatecollaborator", this.CollabToUpdate, saveModification);
        },

        updateCollaboratorInfo(){
            this.isFirstNameEmpty();
            this.isLastNameEmpty();
            this.isEmailEmpty();
            this.CollabToUpdate = this.infoCollab;
            this.CollabToUpdate.firstName = this.firstName;
            this.CollabToUpdate.lastName = this.lastName;
            this.CollabToUpdate.email = this.email;
            this.CollabToUpdate.function = this.fonction;
            this.CollabToUpdate.businessUnit = this.businessUnit;
           if (this.password == '' && this.newPassword == '' && this.confirmPassword == '') {
                        this.oldPasswordEmpty = false;
                        this.passwordEmpty = false;
                        this.confirmPasswordEmpty = false;
                        this.isRightOldPassword = true;
                        if (this.imageHasBeenChanged === true) {
                            this.updateCollaboratorImage();
                            this.CollabToUpdate.defaultPicture = false;
                            document.cookie = "defaultPicture=false";
                        }
                        this.saveUpdateCollaborator();
           } else {
               if (this.infoCollab.password == this.password){
                    this.isRightOldPassword = true;
                    this.oldPasswordEmpty = false;
                    this.passwordEmpty = false;
                    if(this.infoCollab.password != this.newPassword){
                        if (this.newPassword == this.confirmPassword) {
                            this.CollabToUpdate.password = this.newPassword;
                            if (this.imageHasBeenChanged === true) {
                                this.updateCollaboratorImage();
                                this.CollabToUpdate.defaultPicture = false;
                                document.cookie = "defaultPicture=false";

                            }
                            this.saveUpdateCollaborator();
                        }
                    }else{
                        console.log("mot de passe" + this.infoCollab.password);
                        this.isRightOldPassword = false;
                        this.errorMessageOnSubmit ="Votre nouveau mot de passe doit être différent de votre ancien mot de passe."
                    }

                }else {
                   console.log(this.infoCollab.password);
                    this.isRightOldPassword = false;
                    this.errorMessageOnSubmit = "Ancien mot de passe incorrect."
                }
           }
        },

            imageLoadOnError () {
            let defaultImagePath = "img/profile.jpg";
            this.imagePath = defaultImagePath;
        }
    }
});

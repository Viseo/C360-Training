Vue.use(VueResource);

Vue.component('connect-user',{
    data:function(){
        return{
            color_inscription: 'color-blue',
            color_connexion: 'color-blue',
            tabconnexion: "tab",
            tabinscription: "tab active",
            newCollab: true
        }
    },
    template:`
            <div class="panel panel-default">
                <ul class="tab-group">
                    <li :class="tabinscription">
                        <a @click="showInscriptionForm()">Inscription</a>
                    </li>
                    <li :class="tabconnexion">
                        <a @click="showConnexionForm()">Connexion</a>
                    </li>
                </ul>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-xs-12 col-xm-12 col-md-6 cold-lg-6 col-offset-3 col-md-offset-3">
                            <inscription-form v-if="newCollab"></inscription-form>
                            <connexion-form v-else></connexion-form>
                        </div>
                    </div>
                </div>
            </div>
        `,
    methods: {
        showInscriptionForm() {
            this.tabinscription = 'tab active';
            this.tabconnexion = 'tab';
            this.newCollab=true;
        },
        showConnexionForm() {
            this.tabinscription = 'tab';
            this.tabconnexion = 'tab active';
            this.newCollab=false;
        }
    }
}),

Vue.component('inscriptionForm', {
    template: `
             <form id="registr-form" @submit.prevent="verifyForm">
                <!-- MATRICULE-->
                <div class="form-group">
                    <label for="matricule">Code de login</label>
                    <div class="inner-addon left-addon" :class="{'has-error': loginEmpty || !isLoginValid || !personalIdNumberAlreadyExist}">
                        <i class="glyphicon glyphicon-th"></i>
                        <input type="text" id="matricule" name="matricule" tabindex="1" class="form-control has-left-icon"
                               placeholder="ABC1234" v-model="personnalIdNumber" @focus="loginEmpty = false" @blur="isLoginEmpty"
                               onblur="this.placeholder = 'ABC1234' " maxlength="20" minlength="2">
                        <span v-show="loginEmpty" class="color-red">Code de login est obligatoire.</span>
                        <span v-show="!personalIdNumberAlreadyExist" class="color-red ">Ce code de login a déjà été enregistré.</span>
                        <span v-show="!isLoginValid && !loginEmpty" class="color-red">{{ errorMessageLogin }}</span>
                    </div>
                </div>
                <!-- NOM -->
                <div class="form-group" :class="{'has-error': lastNameEmpty || !isLastNameValid}">
                    <label for="nom">Nom</label>
                    <div class="inner-addon left-addon">
                        <i class="glyphicon glyphicon-user"></i>
                        <input type="text" name="nom" id="nom" tabindex="1" class="form-control " placeholder="DUPONT" v-model="lastName"
                               onfocus="this.placeholder = ''" onblur="this.placeholder = 'DUPONT'" @focus="lastNameEmpty = false" @blur="isLastNameEmpty"
                               maxlength="125" minlength="2">
                        <span v-show="lastNameEmpty" class="color-red">Nom est obligatoire.</span>
                        <span v-show="!isLastNameValid && !lastNameEmpty" class="color-red">{{ errorMessageLastName }}</span>
                    </div>
                </div>
                <!-- PRENOM -->
                <div class="form-group" :class="{'has-error': !isFirstNameValid || firstNameEmpty }">
                    <label for="prenom">Prénom</label>
                    <div class="inner-addon left-addon" :class="{ 'control': true }">
                        <i class="glyphicon glyphicon-user"></i>
                        <input type="text"  name="prenom" id="prenom" tabindex="2" class="form-control" placeholder="Eric" v-model="firstName"
                               onfocus="this.placeholder = ''" onblur="this.placeholder = 'Eric'" @focus="firstNameEmpty = false" @blur="isFirstNameEmpty"
                               maxlength="125" minlength="2">
                        <span v-show="firstNameEmpty" class="color-red ">Prénom est obligatoire.</span>
                        <span v-show="!isFirstNameValid && !firstNameEmpty" class="color-red">{{ errorMessageFirstName }}</span>
                    </div>
            
                </div>
                <!-- EMAIL-->
                <div class="form-group" :class="{'has-error':!isEmailValid || emailEmpty || !emailAlreadyExist}">
                    <label for="email">Email</label>
                    <div class="inner-addon left-addon" :class="{ 'control': true }">
                        <i class="glyphicon glyphicon-envelope"></i>
                        <input type="email"  name="email" id="email" tabindex="2"  class="form-control"  placeholder="eric.dupont@viseo.com"
                               v-model="email" @focus="emailAlreadyExist = true; emailEmpty = false"  @blur="isEmailEmpty" onfocus="this.placeholder = ''"
                               onblur="this.placeholder = 'eric.dupont@viseo.com'">
                        <span v-show="emailEmpty" class="color-red ">Email est obligatoire.</span>
                        <span v-show="!isEmailValid && !emailEmpty" class="color-red">{{ errorMessageEmail }}</span>
                        <span v-show="!emailAlreadyExist" class="color-red ">Ce email a déjà été enregistré.</span>
                    </div>
                </div>
                <!-- MOT DE PASSE -->
                <div class="form-group" :class="{'has-error': !isPasswordValid || passwordEmpty }">
                    <label for="mdp">Mot de passe</label>
                    <div class="password" :class="{ 'control': true }">
                        <i class="glyphicon glyphicon-lock"></i>
                        <span @click="showPass = !showPass" v-show="!showPass && password" class="glyphicon glyphicon-eye-open"> </span>
                        <span @click="showPass = false" v-show="showPass && password" class="glyphicon glyphicon-eye-close"> </span>
                        <input type="password" v-model="password" v-show="!showPass" name="mdp" id="mdp" tabindex="2" class="form-control"
                               placeholder="••••••" onfocus="this.placeholder = ''" onblur="this.placeholder = '••••••'" @focus="passwordEmpty = false"
                               @blur="isPasswordEmpty">
                        <input type="text" v-model="password" v-show="showPass"  name="mdp" id="mdp2" tabindex="2" class="form-control"
                               @focus="passwordEmpty = false" @blur="isPasswordEmpty">
                        <span v-show="passwordEmpty"  class="color-red ">Mot de passe est obligatoire.</span>
                        <span v-show="!isPasswordValid && !passwordEmpty" class="color-red">{{ errorMessagePassword }}</span>
                    </div>
                </div>
                <!-- CONFIRMATION MOT DE PASSE -->
                <div class="form-group"   :class="{'has-error': !isConfirmPasswordValid|| confirmPasswordEmpty }">
                    <label for="mdpc">Confirmation mot de passe</label>
                    <div class="password" :class="{ 'control': true }">
                        <i class="glyphicon glyphicon-lock "></i>
                        <span @click="showPassConf = !showPassConf" v-show="!showPassConf && confirmPassword" class="glyphicon glyphicon-eye-open "> </span>
                        <span @click="showPassConf = false"  v-show="showPassConf && confirmPassword" class="glyphicon glyphicon-eye-close "> </span>
                        <input type="password" v-model="confirmPassword"  v-show="!showPassConf" name="mdpc" id="mdpc" tabindex="2" class="form-control"
                               placeholder="••••••"  onfocus="this.placeholder = ''" onblur="this.placeholder = '••••••'" @focus="confirmPasswordEmpty = false"
                               @blur="isConfirmPasswordEmpty">
                        <input type="text" v-model="confirmPassword" v-show="showPassConf" name="mdpc" id="mdpc2" tabindex="2" class="form-control"
                               @focus="confirmPasswordEmpty = false"  @blur="isConfirmPasswordEmpty">
                        <span v-show="confirmPasswordEmpty" class="color-red ">Confirmation est obligatoire.</span>
                        <span v-show="!isConfirmPasswordValid && !confirmPasswordEmpty" class="color-red">{{ errorMessageConfirmPassword }}</span>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-xs-12 col-xm-12 col-md-12 cold-lg-12 ">
                            <button type="submit" name="register-submit" id="register-submit"
                                    tabindex="4" class="form-control btn btn-primary">S'inscrire
                            </button>
                        </div>
                    </div>
                </div>
            </form>          
            `,
    data: function () {
        return {
            collaborator:{
                personnalIdNumber:'',
                lastName:'',
                firstName:'',
                email:'',
                password:'',
                confirmPassword:'',
            },
            personnalIdNumber:'',
            lastName:'',
            firstName:'',
            email:'',
            password:'',
            confirmPassword:'',
            errorMessageLogin:'',
            errorMessageLastName:'',
            errorMessageFirstName:'',
            errorMessageEmail:'',
            errorMessagePassword:'',
            errorMessageConfirmPassword:'',
            collaboratorToRegister:{},
            verif: true,
            personalIdNumberAlreadyExist:true,
            emailAlreadyExist:true,
            loginEmpty:false,
            lastNameEmpty:false,
            firstNameEmpty:false,
            emailEmpty:false,
            passwordEmpty:false,
            confirmPasswordEmpty:false,
            showPass:false,
            showPassConf:false,
            border: 'color-red',
            isLoginValid:true,
            isLastNameValid:true,
            isFirstNameValid:true,
            isEmailValid :true,
            isPasswordValid:true,
            isConfirmPasswordValid:true
        }
    },

    watch: {
        personnalIdNumber: function(value) {
            this.verifyLogin(value, 'errorMessageLogin');
        },
        lastName: function(value) {
            this.verifyLastName(value, 'errorMessageLastName');
        },
        firstName: function(value) {
            this.verifyFirstName(value, 'errorMessageFirstName');
        },
        email: function(value) {
            this.verifyEmail(value, 'errorMessageEmail');
        },
        password: function(value) {
            this.verifyPassword(value, 'errorMessagePassword');
            if(this.confirmPassword!='')
                this.verifyConfirmPassword(value, 'errorMessageConfirmPassword');
        },
        confirmPassword: function(value) {
            this.verifyConfirmPassword(value, 'errorMessageConfirmPassword');
        }
    },

    methods: {
        verifyLogin(personnalIdNumber, errorMessageLogin) {
            this.personalIdNumberAlreadyExist = true;
            this.loginEmpty = false;
            if (/^[A-Z]{3}[0-9]{4}$/.test(personnalIdNumber)) {
                this[errorMessageLogin] = '';
                this.isLoginValid = true;
            } else {
                this[errorMessageLogin] = 'Veuillez entrer  code de login valide';
                this.isLoginValid = false;
            }
        },

        isLoginEmpty(){
            if (this.personnalIdNumber == '') {
                this.loginEmpty = true;
            }
        },

        verifyLastName(lastName, errorMessageLastName) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/.test(lastName)) {
                this[errorMessageLastName] = '';
                this.isLastNameValid=true;
            } else {
                this[errorMessageLastName] = 'Veuillez entrer un nom valide';
                this.isLastNameValid=false;
            }
        },

        isLastNameEmpty(){
            if(this.lastName == ''){
                this.lastNameEmpty = true;
            }
        },

        verifyFirstName(firstName, errorMessageFirstName) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/ .test(firstName)) {
                this[errorMessageFirstName] = '';
                this.isFirstNameValid=true;
            } else {
                this[errorMessageFirstName] = 'Veuillez entrer un Prénom valide';
                this.isFirstNameValid=false;
            }
        },

        isFirstNameEmpty(){
            if(this.firstName == ''){
                this.firstNameEmpty = true;
            }
        },

        verifyEmail(email, errorMessageEmail){
            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([0-9]{1,3}\.)+[0-9]{1,3})|(([a-zA-ZàÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/
                    .test(email)) {

                this[errorMessageEmail] = '';
                this.isEmailValid=true;
            } else {
                this[errorMessageEmail] = 'Veuillez entrer un email valide';
                this.isEmailValid=false;
            }
        },

        isEmailEmpty(){
            if(this.email == ''){
                this.emailEmpty = true;
            }
        },

        verifyPassword(password, errorMessagePassword) {
            if (/^(.){6,125}$/.test(password)) {
                this[errorMessagePassword] = '';
                this.isPasswordValid=true;
            } else {
                this[errorMessagePassword] = 'Le mot de passe doit avoir au minimum 6 caractères';
                this.isPasswordValid=false;
            }
        },

        isPasswordEmpty(){
            if(this.password == ''){
                this.passwordEmpty = true;
            }
        },
        verifyConfirmPassword(confirmPassword, errorMessageConfirmPassword) {
            if (this.confirmPassword === this.password) {
                this[errorMessageConfirmPassword] = '';
                this.isConfirmPasswordValid=true;
            } else {
                this[errorMessageConfirmPassword] = 'La confirmation du mot de passe n\'est pas valide';
                this.isConfirmPasswordValid=false;
            }
        },

        isConfirmPasswordEmpty(){
            if(this.confirmPassword == ''){
                this.confirmPasswordEmpty = true;
            }
        },

        saveAction() {
            delete this.collaboratorToRegister['confirmPassword'];  //delete la confirmation de password
            //post the form to the server
            this.$http.post("api/collaborateurs", this.collaboratorToRegister)
                .then(
                    function (response) {
                        this.emailAlreadyExist = true;
                        this.personalIdNumberAlreadyExist = true;
                        window.location.pathname = '/pageblanche.html';
                    },
                    function (response) {
                        if (response.data.message == "personnalIdNumber") {
                            this.personalIdNumberAlreadyExist = false;
                            this.emailAlreadyExist = true;
                        }
                        else if(response.data.message == "email"){
                            this.emailAlreadyExist = false;
                            this.personalIdNumberAlreadyExist = true;
                        }else{
                            console.error(response);
                        }
                    }
                );
        },

        verifyForm (){
            this.lastName = this.lastName.replace(/ +/g, " ").replace(/ +$/, "");
            this.firstName = this.firstName.replace(/ +/g, " ").replace(/ +$/, "");
            this.isLoginEmpty(); this.isLastNameEmpty(); this.isFirstNameEmpty(); this.isEmailEmpty(); this.isPasswordEmpty(); this.isConfirmPasswordEmpty();
            if(!this.loginEmpty && !this.lastNameEmpty && !this.firstNameEmpty && !this.emailEmpty && !this.passwordEmpty && !this.confirmPasswordEmpty && this.isConfirmPasswordValid){
                this.personalIdNumberAlreadyExist = true;
                this.emailAlreadyExist = true;
                this.collaborator.personnalIdNumber=this.personnalIdNumber;
                this.collaborator.lastName=this.lastName;
                this.collaborator.firstName=this.firstName;
                this.collaborator.email=this.email;
                this.collaborator.password=this.password;
                this.collaborator.confirmPassword=this.confirmPassword;
                this.collaboratorToRegister = JSON.parse(JSON.stringify(this.collaborator));
                this.saveAction();
            }
        },
    }
}),

Vue.component('connexionForm', {
    template: `
             <form id="registr-form" @submit.prevent="VerifyForm">
                <!-- EMAIL-->
                <div class="form-group" :class="{'has-error':emailEmpty || !isNotNewEmail}">
                    <label for="email">Email</label>
                    <div class="inner-addon left-addon" :class="{ 'control': true }">
                        <i class="glyphicon glyphicon-envelope"></i>
                        <input type="email"  name="email" id="email" tabindex="2"  class="form-control"  placeholder="eric.dupont@viseo.com"
                               v-model="email" @focus="emailEmpty = false; isNotNewEmail = true;"  @blur="isEmailEmpty" onfocus="this.placeholder = ''"
                               onblur="this.placeholder = 'eric.dupont@viseo.com'">
                        <span v-show="emailEmpty" class="color-red ">Email est obligatoire.</span>
                        <span v-show="!isNotNewEmail && !emailEmpty" class="color-red ">Veuillez renseigner votre Email</span>
                    </div>
                </div>
                <!-- MOT DE PASSE -->
                <div class="form-group" :class="{'has-error':passwordEmpty }">
                    <label for="mdp">Mot de passe</label>
                    <div class="password" :class="{ 'control': true }">
                        <i class="glyphicon glyphicon-lock"></i>
                        <span @click="showPass = !showPass" v-show="!showPass && password" class="glyphicon glyphicon-eye-open"> </span>
                        <span @click="showPass = false" v-show="showPass && password" class="glyphicon glyphicon-eye-close"> </span>
                        <input type="password" v-model="password" v-show="!showPass" name="mdp" id="mdp" tabindex="2" class="form-control"
                               placeholder="••••••" onfocus="this.placeholder = ''" onblur="this.placeholder = '••••••'" @focus="passwordEmpty = false"
                               @blur="isPasswordEmpty">
                        <input type="text" v-model="password" v-show="showPass"  name="mdp" id="mdp2" tabindex="2" class="form-control"
                               @focus="passwordEmpty = false" @blur="isPasswordEmpty">
                        <span v-show="passwordEmpty"  class="color-red ">Mot de passe est obligatoire.</span>
                        
                    </div>
                </div>
                <div class="checkbox">
                     <label><input type="checkbox" value="" v-model="stayConnected">Rester Connecté</label>
                     <a href="#" @click="showPopupFn" class="forgotPassword">Mot de passe oublié</a>
                     <br><span v-show="isErrorAuthentification" class="color-red">Connexion refusée: veuillez entrer une adresse e-mail et un mot de passe valide</span>
                     <div class="popup col-md-12 col-sm-12 col-lg-12" v-show="showPopup">
                        <span class="popuptext animated slideInUp" id="myPopup">Le mot de passe a été envoyé à {{email}}</span>
                     </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-xs-12 col-xm-12 col-md-12 cold-lg-12 ">
                            <button type="submit" name="register-submit" id="register-submit"
                                    tabindex="4" class="form-control btn btn-primary">Se connecter
                            </button>
                        </div>
                    </div>
                </div>
            </form>          
            `,
    data: function () {
        return {
            user:{
                email:'',
                password:'',
            },
            email:'',
            password:'',
            userToRegister:{},
            isErrorAuthentification:false,
            verif: true,
            emailEmpty:false,
            passwordEmpty:false,
            showPass:false,
            stayConnected:true,
            showPopup:false,
            border: 'color-red',
            allUsers:undefined,
            isNotNewEmail:true,
            emailToSend:'',
            passwordToSend:''
        }
    },
    methods: {
        showPopupFn() {
            if (this.email == '') {
                this.emailEmpty = true;
            } else {
                this.VerifyEmailFromDatabase();
                this.isErrorAuthentification = false;
                if(this.isNotNewEmail == true){
                    var self = this;
                    this.showPopup = true;
                    setTimeout(function () {
                        self.showPopup = false;
                    }, 10000);
                }
            }
        },
        isEmailEmpty(){
            if(this.email == ''){
                this.emailEmpty = true;
            }
        },
        isPasswordEmpty(){
            if(this.password == ''){
                this.passwordEmpty = true;
            }
        },
        VerifyForm(){
            this.isEmailEmpty(); this.isPasswordEmpty();
            if(!this.emailEmpty && !this.passwordEmpty){
                this.user.email=this.email;
                this.user.password=this.password;
                this.userToRegister = JSON.parse(JSON.stringify(this.user));
                this.VerifyUserByDatabase();
            }
        },
        VerifyUserByDatabase(){
            this.$http.post("api/user", this.userToRegister)
                .then(
                    function (response) {
                        window.location.pathname = '/pageblanche.html';
                    }
                ).catch(function () {
                    this.password = "";
                    this.user.password = "";
                    this.isErrorAuthentification = true;
                    this.gatherUsersFromDatabase();
                });
        },
        gatherUsersFromDatabase(){
            this.$http.get("api/collaborateurs").then(
                function (response) {
                    this.allUsers = response.data;

                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        VerifyEmailFromDatabase(){
            this.isNotNewEmail = false;
            for (var tmp in this.allUsers) {
                if (this.user.email == this.allUsers[tmp].email){
                    this.emailToSend = this.allUsers[tmp].email;
                    this.passwordToSend = this.allUsers[tmp].password;
                    this.isNotNewEmail = true;
                    break;
                }

            }
        }
    }
})

new Vue({
    el: '#app',
});
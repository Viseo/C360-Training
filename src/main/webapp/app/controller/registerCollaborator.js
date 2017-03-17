/**
 * Created by XME3612 on 20/02/2017.
 */
Vue.use(VueResource);

new Vue({
    el: '#app',
    data: {
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
        matriculeMsg:'',
        lastNameMsg:'',
        firstNameMsg:'',
        emailMsg:'',
        passwordMsg:'',
        confirmPasswordMsg:'',
        collaboratorToRegister:{},
        verif: true,
        isNewPersonalIdNumber:true,
        isNewEmail:true,
        msgmatricule:false,
        msgnom:false,
        msgprenom:false,
        msgemail:false,
        msgpwd:false,
        msgconfirmpwd:false,
        showPass:false,
        showPassConf:false,
        border: 'color-red',
        color_inscription: 'color-blue',
        color_connexion: 'color-blue',
        tabconnexion: "tab",
        tabinscription: "tab active",
        isMatriculeValid:true,
        isLastNameValid:true,
        isFirstNameValid:true,
        isEmailValid :true,
        isPasswordValid:true,
        isConfirmPasswordValid:true
},
    watch: {
        personnalIdNumber: function(value) {
            this.VerfiMatricule(value, 'matriculeMsg');
        },
        lastName: function(value) {
            this.verifLastName(value, 'lastNameMsg');
        },
        firstName: function(value) {
            this.verifFirstName(value, 'firstNameMsg');
        },
        email: function(value) {
            this.verifEmail(value, 'emailMsg');
        },
        password: function(value) {
            this.verifPassword(value, 'passwordMsg');
            this.verifConfirmPassword(value, 'passwordMsg');
        },
        confirmPassword: function(value) {
            this.verifConfirmPassword(value, 'confirmPasswordMsg');
        }
    },
    methods: {
        VerfiMatricule(personnalIdNumber, msg) {
            this.isNewPersonalIdNumber = true;
            this.msgmatricule = false;
            if (/^[A-Z]{3}[0-9]{4}$/.test(personnalIdNumber)) {
                this[msg] = '';
                this.isMatriculeValid = true;
            } else {
                this[msg] = 'Veuillez entrer  code de login valide';
                this.isMatriculeValid = false;
            }
        },
        messageMatricule(){
            if (this.personnalIdNumber == '') {
                this.msgmatricule = true;
            }
        },
        verifLastName(lastName, msg) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/.test(lastName)) {
                this[msg] = '';
                this.isLastNameValid=true;
            } else {
                this[msg] = 'Veuillez entrer un nom valide';
                this.isLastNameValid=false;
            }
        },
        messageNom(){
            if(this.lastName == ''){
                this.msgnom = true;
            }
        },
        verifFirstName(firstName, msg) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/ .test(firstName)) {
                this[msg] = '';
                this.isFirstNameValid=true;
            } else {
                this[msg] = 'Veuillez entrer un Prénom valide';
                this.isFirstNameValid=false;
            }
        },
        messagePrenom(){
            if(this.firstName == ''){
                this.msgprenom = true;
            }
        },
        verifEmail(email, msg) {
            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([0-9]{1,3}\.)+[0-9]{1,3})|(([a-zA-ZàÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/
                    .test(email)) {

                this[msg] = '';
                this.isEmailValid=true;
            } else {
                this[msg] = 'Veuillez entrer un email valide';
                this.isEmailValid=false;
            }
        },
        messageEmail(){
            if(this.email == ''){
                this.msgemail = true;
            }
        },
        verifPassword(password, msg) {
            if (/^(.){6,125}$/.test(password)) {
                this[msg] = '';
                this.isPasswordValid=true;
            } else {
                this[msg] = 'Le mot de passe doit avoir au minimum 6 caractères';
                this.isPasswordValid=false;
            }
        },
        messagePwd(){
            if(this.password == ''){
                this.msgpwd = true;
            }
        },
        verifConfirmPassword(confirmPassword, msg) {
            if (this.confirmPassword === this.password) {
                this[msg] = '';
                this.isConfirmPasswordValid=true;
            } else {
                this[msg] = 'La confirmation du mot de passe n\'est pas valide';
                this.isConfirmPasswordValid=false;
            }
        },
        messageConfirmpwd(){
            if(this.confirmPassword == ''){
                this.msgconfirmpwd = true;
            }
        },
        saveAction() {
            delete this.collaboratorToRegister['confirmPassword'];  //delete la confirmation de password
            //post the form to the server
            this.$http.post("api/collaborateurs", this.collaboratorToRegister)
                .then(
                    function (response) {
                        this.isNewEmail = true;
                        this.isNewPersonalIdNumber = true;
                        window.location.pathname = '/pageblanche.html';
                    },
                    function (response) {
                        console.log("Error: ",response);
                        if (response.data.message == "personnalIdNumber") {
                            this.isNewPersonalIdNumber = false;
                            this.isNewEmail = true;
                        }
                        else if(response.data.message == "email"){
                            this.isNewEmail = false;
                            this.isNewPersonalIdNumber = true;
                        }else{
                            console.error(response);
                        }
                    }
                );
        },
        verifyForm() {
            this.lastName = this.lastName.replace(/ +/g, " ").replace(/ +$/, "");
            this.firstName = this.firstName.replace(/ +/g, " ").replace(/ +$/, "");
            this.messageMatricule(); this.messageNom(); this.messagePrenom(); this.messageEmail(); this.messagePwd(); this.messageConfirmpwd();
            if(!this.msgmatricule && !this.msgnom && !this.msgprenom && !this.msgemail && !this.msgpwd && !this.msgconfirmpwd && this.isConfirmPasswordValid){
                this.isNewPersonalIdNumber = true;
                this.isNewEmail = true;
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
});
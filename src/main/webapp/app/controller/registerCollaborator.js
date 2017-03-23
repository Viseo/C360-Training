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
        color_inscription: 'color-blue',
        color_connexion: 'color-blue',
        tabconnexion: "tab",
        tabinscription: "tab active",
        isLoginValid:true,
        isLastNameValid:true,
        isFirstNameValid:true,
        isEmailValid :true,
        isPasswordValid:true,
        isConfirmPasswordValid:true
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
                this.verifyConfirmPassword(value, 'errorMessageConfirmPasswor');
        },
        confirmPassword: function(value) {
            this.verifyConfirmPassword(value, 'errorMessageConfirmPassword');
        }
    },
    methods: {
        verifyLogin(personnalIdNumber, msg) {
            this.personalIdNumberAlreadyExist = true;
            this.loginEmpty = false;
            if (/^[A-Z]{3}[0-9]{4}$/.test(personnalIdNumber)) {
                this[msg] = '';
                this.isLoginValid = true;
            } else {
                this[msg] = 'Veuillez entrer  code de login valide';
                this.isLoginValid = false;
            }
        },
        isLoginEmpty(){
            if (this.personnalIdNumber == '') {
                this.loginEmpty = true;
            }
        },
        verifyLastName(lastName, msg) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/.test(lastName)) {
                this[msg] = '';
                this.isLastNameValid=true;
            } else {
                this[msg] = 'Veuillez entrer un nom valide';
                this.isLastNameValid=false;
            }
        },
        isLastNameEmpty(){
            if(this.lastName == ''){
                this.lastNameEmpty = true;
            }
        },
        verifyFirstName(firstName, msg) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/ .test(firstName)) {
                this[msg] = '';
                this.isFirstNameValid=true;
            } else {
                this[msg] = 'Veuillez entrer un Prénom valide';
                this.isFirstNameValid=false;
            }
        },
        isFirstNameEmpty(){
            if(this.firstName == ''){
                this.firstNameEmpty = true;
            }
        },
        verifyEmail(email, msg) {
            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([0-9]{1,3}\.)+[0-9]{1,3})|(([a-zA-ZàÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/
                    .test(email)) {

                this[msg] = '';
                this.isEmailValid=true;
            } else {
                this[msg] = 'Veuillez entrer un email valide';
                this.isEmailValid=false;
            }
        },
        isEmailEmpty(){
            if(this.email == ''){
                this.emailEmpty = true;
            }
        },
        verifyPassword(password, msg) {
            if (/^(.){6,125}$/.test(password)) {
                this[msg] = '';
                this.isPasswordValid=true;
            } else {
                this[msg] = 'Le mot de passe doit avoir au minimum 6 caractères';
                this.isPasswordValid=false;
            }
        },
        isPasswordEmpty(){
            if(this.password == ''){
                this.passwordEmpty = true;
            }
        },
        verifyConfirmPassword(confirmPassword, msg) {
            if (this.confirmPassword === this.password) {
                this[msg] = '';
                this.isConfirmPasswordValid=true;
            } else {
                this[msg] = 'La confirmation du mot de passe n\'est pas valide';
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
                        console.log("Error: ",response);
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
});
/**
 * Created by XME3612 on 20/02/2017.
 */
Vue.use(VueResource);
Vue.use(VeeValidate);

new Vue({
    el: '#app',
    data: {
        collaborator:{
            personnalIdNumber:'',
            firstName:'',
            lastName:'',
            email:'',
            password:'',
            confirmPassword:''
        },
        collaboratorToRegister:{},

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
        tabinscription: "tab active"

    },
    methods: {
        messageMatricule(){
            if(this.collaborator.personnalIdNumber == ''){
                this.msgmatricule = true;
            }
        },
        messageNom(){
            if(this.collaborator.lastName == ''){
                this.msgnom = true;
            }
        },
        messagePrenom(){
            if(this.collaborator.firstName == ''){
                this.msgprenom = true;
            }
        },
        messageEmail(){
            if(this.collaborator.email == ''){
                this.msgemail = true;
            }
        },
        messagePwd(){
            if(this.collaborator.password == ''){
                this.msgpwd = true;
            }
        },
        messageConfirmpwd(){
            if(this.collaborator.confirmPassword == ''){
                this.msgconfirmpwd = true;
            }
        },
        resetForm() {
            this.collaborator.personnalIdNumber = '';
            this.collaborator.lastName = '';
            this.collaborator.firstName = '';
            this.collaborator.email = '';
            this.collaborator.password = '';
            this.collaborator.confirmPassword = '';
            this.collaboratorToRegister = {};
        },
        saveAction() {
            delete this.collaboratorToRegister['confirmPassword'];  //delete la confirmation de password

            //post the form to the server
            this.$http.post("api/collaborateurs", this.collaboratorToRegister)
                .then(
                    function (response) {
                        this.isNewEmail = true;
                        this.isNewPersonalIdNumber = true;
                        this.resetForm(); //Reset the Form
                        window.location.replace('pageblanche.html');
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
            this.collaborator.lastName = this.collaborator.lastName.replace(/ +/g, " ").replace(/ +$/, "");
            this.collaborator.firstName = this.collaborator.firstName.replace(/ +/g, " ").replace(/ +$/, "");
            this.messageMatricule(); this.messageNom(); this.messagePrenom(); this.messageEmail(); this.messagePwd(); this.messageConfirmpwd();
            if(!this.msgmatricule && !this.msgnom && !this.msgprenom && !this.msgemail && !this.msgpwd && !this.msgconfirmpwd){
                this.isNewPersonalIdNumber = true;
                this.isNewEmail = true;
                this.collaboratorToRegister = JSON.parse(JSON.stringify(this.collaborator));
                this.saveAction();
            }
        },


    }
});
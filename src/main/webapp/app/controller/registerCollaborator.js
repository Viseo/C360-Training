/**
 * Created by XME3612 on 20/02/2017.
 */
Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.use(VueRouter);
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
        collaboratorToRegister:{}, // on le définit dans la fonction verifyFrom()
        isNewPersonalIdNumber:true,
        isNewEmail:true,
        border: 'color-red',
        color_inscription: 'color-blue',
        color_connexion: 'color-blue'
    },
    methods: {
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
            this.collaboratorToRegister.lastName = this.collaborator.lastName.replace(" ", "");  //delete useless spaces between words
            this.collaboratorToRegister.firstName = this.collaborator.firstName.replace(" ", "");  //delete useless spaces between words
            delete this.collaboratorToRegister['confirmPassword'];  //delete la confirmation de password

            //post the form to the server
            this.$http.post("api/collaborateurs", this.collaboratorToRegister)
                .then(
                    function (response) {
                        this.isNewEmail = true;
                        this.isNewPersonalIdNumber = true;
                        this.resetForm(); //Reset the Form
                        window.location.replace('pageblanche.html');
                        //this.$router.replace('pageblanche.html');
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
            this.isNewPersonalIdNumber = true;
            this.isNewEmail = true;
            this.collaboratorToRegister = JSON.parse(JSON.stringify(this.collaborator));
            this.saveAction();
        },
        changeColorConnexion(){
            if(this.color_connexion == 'color-blue' && this.color_inscription == 'color-blue'){
                this.color_connexion = 'color-grey';
            }else if(this.color_connexion == 'color-blue' && this.color_inscription == 'color-grey'){
                this.color_connexion = 'color-grey';
                this.color_inscription = 'color-blue';
            }
        },
        changeColorInscription(){
            if(this.color_inscription == 'color-blue' && this.color_connexion == 'color-blue'){
                this.color_inscription = 'color-grey';
            }else if(this.color_inscription == 'color-blue' && this.color_connexion == 'color-grey'){
                this.color_inscription = 'color-grey';
                this.color_connexion = 'color-blue';
            }
        }
    }
});

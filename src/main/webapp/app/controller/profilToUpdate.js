let profilToUpdate = Vue.component('profil-to-update', {
    template: `
<form id="registr-form" @submit.prevent="updateCollaboratorInfo()">
    <div class="col-lg-6 col-sm-12 col-xs-12 col-md-6 col-lg-offset-3 col-md-offset-3">
            <div class="panel panel-default">
                <div class="panel-header">
                    <span class="glyphicon glyphicon-user"> 1. Mes coordonnées</span>
                </div>
                <div class="panel-body">
                        <div class="col-lg-10 col-sm-12 col-xs-12 col-md-6 col-lg-offset-1 col-md-offset-1">
                            <div class="row">
                                <div class="col-lg-6 col-sm-6 col-xs-6 col-md-3 col-lg-offset-0 col-md-offset-0">
                                    <!-- PRENOM -->
                                    <customInput
                                        label="prenom"
                                        labelText="Prénom"
                                        icon="glyphicon-user"
                                        type="text"
                                        tab="2"
                                        v-model="firstName"
                                        maxlength="125" minlength="2">
                                    </customInput>
                                </div>
                                <div class="col-lg-6 col-lg-offset-0 col-md-offset-0">
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
                                <div class="col-lg-6 col-sm-6 col-xs-6 col-md-3 col-lg-offset-0 col-md-offset-0">
                                    <!-- NOM -->
                                    <customInput
                                        label="nom"
                                        labelText="Nom"
                                        icon="glyphicon-user"
                                        type="text"
                                        tab="2"
                                        v-model="lastName"
                                        maxlength="125" minlength="2">
                                    </customInput>
                                </div>
                                <div class="col-lg-6 col-lg-offset-0 col-md-offset-0">
                                    <!-- BUSINESS UNIT -->
                                    <table style="border-spacing: 0px">
                                        <div class="form-group has-feedback">
                                            <label>Business Unit</label>
                                            <div class="inner-addon left-addon">
                                                <tr><td style="width: 500px;">
                                                    <i class="glyphicon"></i>
                                                    <select class="form-control" v-model="businessUnit">
                                                        <option ></option>
                                                        <option >VISEO DATA & PROCESS</option>
                                                        <option >VISEO TECHNOLOGIES</option>
                                                        <option >VISEO DIGITAL</option>
                                                    </select>
                                                </td></tr>
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
                    <span class="glyphicon glyphicon-user"> 2. Mes identifiants</span>
                </div>
                <div class="panel-body">
                        <div class="col-lg-10 col-sm-12 col-xs-12 col-md-6 col-lg-offset-1 col-md-offset-1">
                            <div class="row">
                                <div class="col-lg-5 col-sm-6 col-xs-6 col-md-3 col-lg-offset-0 col-md-offset-0">
                                    <!-- MOT DE PASSE -->
                                    <customPasswordInput
                                        label="ancienmdp"
                                        labelText="Ancien mot de passe"
                                        v-model="password">
                                    </customPasswordInput>
                                </div>
                                <div class="col-lg-6 col-lg-offset-1 col-md-offset-0">
                                    <!-- EMAIL-->
                                    <customInput
                                        label="email"
                                        labelText="Email"
                                        icon="glyphicon-envelope"
                                        type="text"
                                        tab="2"
                                        v-model="email">
                                    </customInput>
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                <div class="col-lg-5 col-sm-6 col-xs-6 col-md-3 col-lg-offset-0 col-md-offset-0">
                                    <!-- NOUVEAU MOT DE PASSE -->
                                    <customPasswordInput
                                        label="nouveaumdp"
                                        labelText="Nouveau mot de passe"
                                        v-model="newPassword">
                                    </customPasswordInput>
                                </div>
                                <div class="col-lg-6 col-lg-offset-1 col-md-offset-1">
                                    <span><b>Remarque:</b></span><br>
                                    <p>Votre nouveau mot de passe doit contenir au minimum 6 caractères.</p>
                                </div>
                            </div>
                            <br>
                            <div class="row">
                                <div class="col-lg-5 col-sm-6 col-xs-6 col-md-3 col-lg-offset-0 col-md-offset-0">
                                    <!-- CONFIRMATION MOT DE PASSE -->
                                    <customPasswordInput
                                        label="mdpc"
                                        labelText="Confirmation mot de passe"
                                        v-model="confirmPassword">
                                    </customPasswordInput>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
    </div>
    <div class="col-lg-6 col-sm-12 col-xs-12 col-md-6 col-lg-offset-3 col-md-offset-3">
        <div class="col-lg-10 col-sm-12 col-xs-12 col-md-6 col-lg-offset-1 col-md-offset-1">
            <div class="form-group">
                <div class="row">
                    <div class="col-lg-6 col-sm-6 col-xs-6 col-md-3 col-lg-offset-0 col-md-offset-0">
                        <div class="col-xs-6 col-xm-6 col-md-6 cold-lg-6 col-lg-offset-6 col-md-offset-6">
                            <button type="submit" name="register-submit" id="register-submit"
                            tabindex="4" class="form-control btn btn-primary">Enregistrer
                            </button>
                        </div>
                    </div>
                    <div class="col-lg-6 col-lg-offset-0 col-md-offset-0">
                        <div class="col-xs-6 col-xm-6 col-md-6 cold-lg-6 ">
                            <button @click="changePage()" name="register-submit" id="register-submit"
                            tabindex="4" class="form-control btn btn-primary">Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>`,

    data: function () {
        return {
            firstName:'',
            fonction:'',
            lastName:'',
            businessUnit:'',
            email:'',
            password:'',
            newPassword:'',
            confirmPassword:'',
            infoCollab:[],
            CollabToUpdate:{"id":1,"version":1,"personnalIdNumber":"ABC1234","lastName":"meng","firstName":"xiangzhe","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false,"function":"Chef de JAVA","businessUnit":"VISEO Digital","admin":false}

        }
    },
    mounted:function () {
        this.getCookies();
        this.getInfoCollaborator();
    },
    methods: {
        changPage(){
            this.$router.push('/registerTrainingCollaborator');
        },
        getCookies(){
            let regexCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
            if(regexCookieToken){
                if(!regexCookieToken[0].includes('undefined')) {
                    if (this.token != 'undefined'){
                        this.token = String(regexCookieToken.pop());
                        this.collaborator_id = jwt_decode(this.token).id;
                    }
                }
            }
        },
        getInfoCollaborator(){
            this.$http.get("api/getcollaborator/"+this.collaborator_id).then(
                function (response) {
                    console.log("success to get user information");
                    this.infoCollab = response.data;
                    this.firstName = this.infoCollab.firstName;
                    this.lastName = this.infoCollab.lastName;
                    this.email = this.infoCollab.email;
                    this.fonction = this.infoCollab.function;
                    this.businessUnit = this.infoCollab.businessUnit;
                },
                function(response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        updateCollaboratorInfo(){
            if (this.infoCollab.password ==  this.password){
                if(this.newPassword == this.confirmPassword){
                    this.CollabToUpdate = this.infoCollab;
                    this.CollabToUpdate.firstName = this.firstName;
                    this.CollabToUpdate.lastName = this.lastName;
                    this.CollabToUpdate.email = this.email;
                    this.CollabToUpdate.function = this.fonction;
                    this.CollabToUpdate.businessUnit = this.businessUnit;
                    this.CollabToUpdate.password = this.newPassword;
                    this.$http.put("api/updatecollaborator",this.CollabToUpdate).then(
                        function (response) {
                            console.log("success to update user information");
                        },
                        function(response) {
                            console.log("Error: ", response);
                            console.error(response);
                        });
                }
            }
        }
    }
});

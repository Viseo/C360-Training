/**
 * Created by NBE3663 on 18/04/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

let assignCollaborator = Vue.component('assign-collaborator', {
    props: [],
    data: function () {
        return {
            sessionIdChosen:0,
            numberPlacesAvailable:15,
            collaboratorsRequesting:[],
            requestedCollaborators:[],
            requestedCollaboratorsMemo:[],
            allCollaboratorsIdChosen:[],
            allCollaboratorsAlreadyInSessions:[],
            collaboratorAlreadyInSession:false,
            allCollaboratorsIdChosen:[],
            checkedNames: true,
            isRegistrationAvailable: true,
            validatedCollab: [],
            allCollaborators: [],
            allCollaboratorsName:[],
            value: '',
            collaboratorsFound: [],
            displayCollaborators: false,
            noCollaboratorsFound: false,
            numberAddedCollab: 0,
            isDisabled: true,
            state: training_store.state,
            confirmCollaboratorAddedSession: false,
            isSearchNameValid: true,
            lastNameRegexErrorMessage: ''
        }
    },
    template: `
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-12"></div>
                    <div class="row">
                        <div class="col-lg-9 col-md-9 text-center">
                            <legend>Affecter un collaborateur</legend>
                        </div>
                    </div>
                    <div class="row">
                        <div id="assignCollaborator">
                                <select
                                        class="form-control" 
                                        v-model="sessionIdChosen"
                                        >
                                        <option :value="session.id" v-for="session in state.allSessions" > {{session.trainingDescription.topicDescription.name}} - {{session.trainingDescription.trainingTitle}} -  {{session.beginning}} - {{session.location}}</option>
                                </select>
                        <!--<select class="col-sm-10 col-md-10 col-lg-10">
                        </select>-->
                            <div class="col-sm-6 col-md-6 col-lg-6">
                                 <div class="row">
                                     <h4 class="col-sm-12 col-md-12 col-lg-12">Liste des collaborateurs</h4>
                                        <div class="checkbox col-sm-12 col-md-12 col-lg-12" >
                                             <label ><input type="checkbox" value="" v-model="checkedNames" :disabled="isDisabled">Afficher les demandes</label>
                                             
                                        </div> 
                                        
                                           
                                 </div>
                                 <div class="searchCollab panel panel-default" :class="{disabled : isDisabled}">
                                    <div class="panel-body">
                                         <div id="typeahead" v-show="!isDisabled" class=" col-sm-12 col-md-12 col-lg-12 searchField">
                                                <span class="glyphicon glyphicon-search" @click="storeCollaboratorsFound" value=""></span>
                                                <typeahead class="col-sm-12 col-dm-12 col-lg-12" v-model="value" v-bind:data="allCollaboratorsName" placeholder="Nom ou prénom du collaborateur"></typeahead> 
                                                                               
                                         </div><br/><br/>
                                         
                                         <div align="center" style="overflow: auto; position:fixed; height:33vh;">
                                           <div v-show="noCollaboratorsFound" style="margin-top:10px;"> Aucun résultat trouvé </div>
                                             <table class="tabCentring">
                                                 <tr v-for="collaborator in requestedCollaborators">
                                                     <td @click="moveCollabRight(collaborator)" >{{collaborator.lastName}} {{collaborator.firstName}} </td>  
                                                     <td @click="moveCollabRight(collaborator)"><span  class="glyphicon glyphicon-circle-arrow-right green" style="top:2px"></span></td>
                                                 </tr>
                                             </table>
                                         </div>
                                    </div>
                                 </div>
                            </div>
                                 
                                 
                                <div class="col-sm-6 col-md-6 col-lg-6">
                                    <div class="row">
                                     <h4 class="col-sm-12 col-md-12 col-lg-12">Collaborateurs ajoutés: {{validatedCollab.length}}</h4>
                                     <div class="checkbox col-sm-12 col-md-12 col-lg-12">
                                     <label>Nombre de places disponibles : {{15 - allCollaboratorsAlreadyInSessions.length}}</label>
                                     </div>
                                    </div>
                                     <div class="searchCollab panel panel-default" :class="{disabled : isDisabled}">
                                        <div class="panel-body">
                                            <br/><br/>
                                             <div align="center" style="overflow: auto; position:fixed; height:33vh;">
                                                 <table class="tabCentring">
                                                     <tr v-for="collaborator in validatedCollab">
                                                      <td @click="moveCollabLeft(collaborator)"><span  class="glyphicon glyphicon-circle-arrow-left blue" style="top:2px"></span></td>
                                                         <td @click="moveCollabLeft(collaborator)">{{collaborator.lastName}} {{collaborator.firstName}} </td>  
                                                     </tr>
                                                 </table>
                                             </div>
                                            
                                        </div>
                                        
                                     </div>
                                 </div>
                            <button class="col-sm-offset-4 col-dm-offset-4 col-lg-offset-4 col-sm-4 col-md-4 col-lg-4 btn btn-primary" @click="saveCollabInSessions()" :class="{disabled : isDisabled || validatedCollab.length == 0}">Enregistrer</button>
                            <error-messages class="col-sm-offset-3 col-dm-offset-3 col-lg-offset-3 col-sm-4 col-md-4 col-lg-4"
                                            style="margin-left:153px;margin-top:10px;"
                                            :height="80" 
                                            :width="250"
                                            successMessage="Vos modifications ont bien été enregistrées" 
                                            :emptySuccess="confirmCollaboratorAddedSession"
                                            fillFieldErrorMessage="Vous avez dépassé le nombre de places disponibles"
                                            :emptyFillError="!isRegistrationAvailable"
                                            :regexErrorMessage="lastNameRegexErrorMessage"
                                            :emptyRegexError="!isSearchNameValid"
                                            >
                            </error-messages>
                        </div>
                    </div>
                </div>
            </div>
            

`,
    mounted: function () {
        this.GatherAllSessions();
    },
    methods: {
        GatherAllSessions(){
            this.$http.get("api/sessions").then(
        function (response) {
            console.log("success to get all sessions from database");
            this.state.allSessions = response.data;
        },
        function(response) {
            console.log("Error: ", response);
            console.error(response);
        });
},
        GatherAllRequestsBySession(){
            this.$http.get("api/requests/session/"+ this.sessionIdChosen + "/collaborators").then(
                function (response) {
                    console.log("success to get all requests from database");
                    console.log(response.data);
                    this.collaboratorsRequesting = response.data;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        AddCollaboratorsToTrainingSession(){
            this.$http.put("api/sessions/" + this.sessionIdChosen + "/" + this.allCollaboratorsIdChosen + "/collaborators").then(
                function (response) {
                    console.log("success to modify the table trainingsession_collaborator");
                    console.log(response.data);
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        gatherCollaboratorsRequestingBySession(){
            this.$http.get("api/requests/session/" + this.sessionIdChosen + "/collaborators").then(
                function (response) {
                    console.log("success to get all collaborators from the table requesttraining_trainingsession");
                    console.log(response.data);
                    this.collaboratorsRequesting = response.data;
                    this.VerifyCollaboratorsRequestingNotYetAccepted();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        VerifyCollaboratorsRequestingNotYetAccepted(){
            this.$http.get("api/sessions/" + this.sessionIdChosen + "/collaborators").then(
                function (response) {
                    console.log("success to get all collaborators from the table trainingsession_collaborator");
                    console.log(response.data);
                    this.allCollaboratorsAlreadyInSessions = response.data;
                    var collaborators = this.collaboratorsRequesting;
                    this.collaboratorsRequesting=[];
                    for (var tmp1 in collaborators) {
                        this.collaboratorAlreadyInSession = false;
                        for (var tmp2 in this.allCollaboratorsAlreadyInSessions){
                            if (collaborators[tmp1].id == this.allCollaboratorsAlreadyInSessions[tmp2].id){
                                this.collaboratorAlreadyInSession = true;
                            }
                        }
                        if(!this.collaboratorAlreadyInSession){
                            this.requestedCollaborators.push(collaborators[tmp1]);
                        }
                    }
                    this.requestedCollaboratorsMemo = this.requestedCollaborators;
                    this.selectCollaborators();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },

        VerifyAllCollaboratorsNotYetAccepted(){
            this.$http.get("api/sessions/" + this.sessionIdChosen + "/collaborators").then(
                function (response) {
                    console.log("success to get all collaborators from the table trainingsession_collaborator");
                    console.log(response.data);
                    this.allCollaboratorsAlreadyInSessions = response.data;
                    var collaborators = this.allCollaborators;
                    this.allCollaborators=[];
                    for (var tmp1 in collaborators) {
                        this.collaboratorAlreadyInSession = false;
                        for (var tmp2 in this.allCollaboratorsAlreadyInSessions){
                            if (collaborators[tmp1].id == this.allCollaboratorsAlreadyInSessions[tmp2].id){
                                this.collaboratorAlreadyInSession = true;
                            }
                        }
                        if(!this.collaboratorAlreadyInSession){
                            this.allCollaborators.push(collaborators[tmp1]);
                        }
                    }
                    this.requestedCollaborators = this.allCollaborators;
                    this.requestedCollaboratorsMemo = this.allCollaborators;
                    this.selectCollaborators();

                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },

        verifyCheckedNames() {
            this.collaboratorsRequesting.splice(0,this.collaboratorsRequesting.length);
            this.requestedCollaborators.splice(0,this.requestedCollaborators.length);
            this.validatedCollab.splice(0,this.validatedCollab.length);
            this.allCollaboratorsName = [];

            if (this.checkedNames === true) {
                this.gatherCollaboratorsRequestingBySession();
            }
            else{
                this.gatherCollaboratorsFromDatabase();

            }

        },
        moveCollabRight(nameCollab){
            this.validatedCollab.push(nameCollab);
            this.requestedCollaborators.indexOf(nameCollab);
            this.requestedCollaborators.splice(this.requestedCollaborators.indexOf(nameCollab),1);
        },
        moveCollabLeft(nameCollab){
            this.requestedCollaborators.push(nameCollab);
            this.validatedCollab.indexOf(nameCollab);
            this.validatedCollab.splice(this.validatedCollab.indexOf(nameCollab),1);
        },
        saveCollabInSessions(){
            this.numberAddedCollabCounter();
            if(this.isRegistrationAvailable && this.validatedCollab.length>0) {
                var i;
                for (i = 0; i < this.validatedCollab.length; i++) {
                    this.allCollaboratorsIdChosen.push(this.validatedCollab[i].id);
                }
                this.AddCollaboratorsToTrainingSession();
                this.resetAssignCollaboratorsForm();
                this.confirmCollaboratorAddedSession = true;
                setTimeout(function(){ this.confirmCollaboratorAddedSession = false; }.bind(this), 2000);
            }
        },
        gatherCollaboratorsFromDatabase(){
         this.$http.get("api/collaborateurs").then(
         function (response) {
         this.allCollaborators = response.data;
         this.allCollaborators.sort(function (a, b) {
         return (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0);
         });
         this.VerifyAllCollaboratorsNotYetAccepted();

         },
         function (response) {
         console.log("Error: ", response);
         console.error(response);
         }
         );
         },

        storeCollaboratorsFound(){
            this.requestedCollaborators=[];
            for (index in this.requestedCollaboratorsMemo)
            {
                if ( (this.requestedCollaboratorsMemo[index].lastName.toUpperCase()).indexOf(this.value.toUpperCase()) != -1
                    || (this.requestedCollaboratorsMemo[index].firstName.toUpperCase()).indexOf(this.value.toUpperCase()) != -1
                    || ((this.requestedCollaboratorsMemo[index].lastName.toUpperCase())+" "+(this.requestedCollaboratorsMemo[index].firstName.toUpperCase())).indexOf(this.value.toUpperCase()) != -1
                    || ((this.requestedCollaboratorsMemo[index].firstName.toUpperCase())+" "+(this.requestedCollaboratorsMemo[index].lastName.toUpperCase())).indexOf(this.value.toUpperCase()) != -1 ) {
                    this.requestedCollaborators.push(this.requestedCollaboratorsMemo[index]);
                }
            }


        },
        selectCollaborators(){
            for (index in this.requestedCollaborators) {
                this.allCollaboratorsName.push(this.requestedCollaborators[index].lastName +" " +this.requestedCollaborators[index].firstName);
            }
        },
        numberAddedCollabCounter (){

            this.numberAddedCollab = this.validatedCollab.length;
            this.numberPlacesAvailable = 15 - this.allCollaboratorsAlreadyInSessions.length;

            if(this.numberAddedCollab <= this.numberPlacesAvailable){
                this.isRegistrationAvailable = true;
            }
            else{
                this.isRegistrationAvailable = false;
            }
        },
        resetAssignCollaboratorsForm(){
            this.validatedCollab.splice(0,this.validatedCollab.length);
            this.allCollaboratorsIdChosen.splice(0,this.allCollaboratorsIdChosen.length);
            this.allCollaboratorsAlreadyInSessions.splice(0,this.allCollaboratorsAlreadyInSessions.length);
            this.sessionIdChosen = 0;
            this.isDisabled = true;
            this.allCollaboratorsName.splice(0, this.allCollaboratorsName.length);
            this.allCollaborators.splice(0,this.allCollaborators.length);
            this.requestedCollaborators.splice(0,this.requestedCollaborators.length);
            this.isRegistrationAvailable = true;
            this.value = '';
        },
        clearGreyPanel(){
            this.isDisabled = false;
        },

        verifyLastName(lastName, errorMessage) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){0,125}$/.test(lastName)) {
                this[errorMessage] = '';
                this.isSearchNameValid = true;
            } else {
                this[errorMessage] = "Veuillez entrer un nom ou prénom valide";
                this.isSearchNameValid = false;
            }
        }


    },
    watch: {
        value: function (lastName) {
            this.verifyLastName(lastName, 'lastNameRegexErrorMessage');
            if(this.requestedCollaboratorsMemo.length>0 && this.value)
                this.storeCollaboratorsFound();
            if(this.value==""){
                this.requestedCollaborators = this.requestedCollaboratorsMemo;
            }
        },
        sessionIdChosen: function(value) {
            if(value) {
                this.verifyCheckedNames();
                this.clearGreyPanel();
            }
        },
        checkedNames: function(value) {
            this.allCollaboratorsName.splice(0,this.allCollaboratorsName.length);
            this.allCollaboratorsAlreadyInSessions.splice(0,this.allCollaboratorsAlreadyInSessions.length);
            this.verifyCheckedNames();
        },
        noCollaboratorsFound: function(){
            if(this.collaboratorsRequesting.length>0){
                this.noCollaboratorsFound = false;
            }
            else {
                this.noCollaboratorsFound = true;
            }
        },
        validatedCollab: function(){
            this.numberAddedCollabCounter();

        }
    },
});
Vue.component('typeahead', VueStrap.typeahead);
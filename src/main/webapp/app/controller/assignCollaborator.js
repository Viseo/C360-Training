/**
 * Created by NBE3663 on 18/04/2017.
 */
Vue.use(VueResource);

let assignCollaborator = Vue.component('assign-collaborator', {
    props: [],
    data: function () {
        return {
            allSessions:[],
            sessionIdChosen:'',
            collaboratorsRequesting:[],
            requestedCollaborators:[],
            allCollaboratorsIdChosen:[],
            allCollaboratorsAlreadyInSessions:[],
            collaboratorAlreadyInSession:false,
            allCollaboratorsIdChosen:[],
            checkedNames: true,
            validatedCollab: [],
            allCollaborators: [],
            allCollaboratorsName:[],
            value: '',
            collaboratorsFound: [],
            displayCollaborators: false,
            noCollaboratorsFound: false,
            numberAddedCollab: 0
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
                                        <option :value="session.id" v-for="session in allSessions" > {{session.trainingDescription.topicDescription.name}} - {{session.trainingDescription.trainingTitle}} -  {{session.beginning}} - {{session.location}}</option>
                                </select>
                        <!--<select class="col-sm-10 col-md-10 col-lg-10">
                        </select>-->
                        </br>
                        </br>
                            <div class="col-sm-6 col-md-6 col-lg-6">
                                 <div class="row">
                                     <h4 class="col-sm-12 col-md-12 col-lg-12">Liste des collaborateurs</h4>
                                        <div class="checkbox col-sm-12 col-md-12 col-lg-12" >
                                             <label><input type="checkbox" value="" v-model="checkedNames">Afficher les demandes</label>
                                             
                                        </div> 
                                        
                                           
                                 </div>
                                 <div class="panel panel-default">
                                    <div class="panel-body">
                                         <div class=" col-sm-12 col-md-12 col-lg-12 searchField">
                                                <span class="glyphicon glyphicon-search" @click="storeCollaboratorsFound" value=""></span>
                                                <typeahead class="col-sm-12 col-dm-12 col-lg-12" v-model="value" v-bind:data="allCollaboratorsName" placeholder="Nom ou prénom du collaborateur"></typeahead> 
                                                                               
                                         </div><br/><br/>
                                         
                                         <div align="center" >
                                           <div v-show="noCollaboratorsFound" style="margin-top:10px;"> Aucun résultat trouvé </div>
                                             <table class="tabCentring" >
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
                                     <h4 class="col-sm-12 col-md-12 col-lg-12">Collaborateurs ajoutés: {{allCollaboratorsAlreadyInSessions.length}}</h4>
                                     <div class="checkbox col-sm-12 col-md-12 col-lg-12">
                                     <label>Nombre de places disponibles : 15</label>
                                     </div>
                                    </div>
                                     <div class="panel panel-default">
                                        <div class="panel-body">
                                            <br/><br/>
                                             <div align="center">
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
                            <button class="col-sm-offset-4 col-dm-offset-4 col-lg-offset-4 col-sm-4 col-md-4 col-lg-4 btn btn-primary" @click="saveCollabInSessions()">Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>
            

`,
    mounted: function () {
        this.GatherAllSessions();
        this.gatherCollaboratorsFromDatabase();
    },
    methods: {
        GatherAllSessions(){
            this.$http.get("api/sessions").then(
        function (response) {
            console.log("success to get all sessions from database");
            this.allSessions = response.data;
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
        VerifyFormBeforeSubmit(){
            this.$http.get("api/sessions/" + this.sessionIdChosen + "/collaborators").then(
                function (response) {
                    console.log("success to get all collaborators from the table trainingsession_collaborator");
                    console.log(response.data);
                    this.collaboratorAlreadyInSession = false;
                    this.allCollaboratorsAlreadyInSessions = response.data;
                    for (var tmp1 in this.allCollaboratorsIdChosen) {
                        for (var tmp2 in this.allCollaboratorsAlreadyInSessions){
                            if (this.allCollaboratorsIdChosen[tmp1] == this.allCollaboratorsAlreadyInSessions[tmp2].id){
                                this.collaboratorAlreadyInSession = true;
                            }
                        }
                    }
                    if(!this.collaboratorAlreadyInSession){
                        this.AddCollaboratorsToTrainingSession();
                    }
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
                    var collaborators =this.collaboratorsRequesting;
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
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        verifyCheckedNames(checkedNames) {
            this.collaboratorsRequesting.splice(0,this.collaboratorsRequesting.length);
            this.requestedCollaborators.splice(0,this.requestedCollaborators.length);

            if (this.checkedNames === true) {
                this.gatherCollaboratorsRequestingBySession();
            }
                else{
                this.gatherCollaboratorsFromDatabase();
                this.requestedCollaborators = this.allCollaborators;

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
            var i;
            for (i = 0; i < this.validatedCollab.length; i++){
                this.allCollaboratorsIdChosen.push(this.validatedCollab[i].id);
            }
            this.AddCollaboratorsToTrainingSession();
            this.resetAssignCollaboratorsForm();
        },
        gatherCollaboratorsFromDatabase(){
         this.$http.get("api/collaborateurs").then(
         function (response) {
         this.allCollaborators = response.data;
         this.allCollaborators.sort(function (a, b) {
         return (a.lastName > b.lastName) ? 1 : ((b.lastName > a.lastName) ? -1 : 0);
         });
         this.selectCollaborators();
         },
         function (response) {
         console.log("Error: ", response);
         console.error(response);
         }
         );
         },

        storeCollaboratorsFound(){
            this.requestedCollaborators.splice(0, this.requestedCollaborators.length);
            this.displayCollaborators = false;

            for (index in this.allCollaborators)
            {
                if ( (this.allCollaborators[index].lastName +" " +this.allCollaborators[index].firstName) === this.value ) {
                    this.requestedCollaborators.push(this.allCollaborators[index]);
                }
            }

            this.value = null;
        },
        selectCollaborators(){
            for (index in this.allCollaborators) {
                this.allCollaboratorsName.push(this.allCollaborators[index].lastName +" " +this.allCollaborators[index].firstName);
            }
        },
        numberAddedCollabCounter (){
            this.numberAddedCollab = this.allCollaboratorsAlreadyInSessions.length;
        },
        resetAssignCollaboratorsForm(){
            this.validatedCollab.splice(0,this.validatedCollab.length);
            this.allCollaboratorsIdChosen.splice(0,this.allCollaboratorsIdChosen.length);
            this.allCollaboratorsAlreadyInSessions.splice(0,this.allCollaboratorsAlreadyInSessions.length);
            this.sessionIdChosen = "";
        }


    },
    watch: {
        sessionIdChosen: function(value) {
            this.verifyCheckedNames(value);
        },
        checkedNames: function(value) {
            this.verifyCheckedNames(value);
        },
        noCollaboratorsFound: function(){
            if(this.collaboratorsRequesting.length>0){
                this.noCollaboratorsFound = false;
            }
            else {
                this.noCollaboratorsFound = true;
            }
        }
    },
});
Vue.component('typeahead', VueStrap.typeahead);
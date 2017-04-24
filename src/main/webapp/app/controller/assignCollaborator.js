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
            nomrequest:[],
            allCollaboratorsIdChosen:[],
            allCollaboratorsAlreadyInSessions:[],
            collaboratorAlreadyInSession:false
            allCollaboratorsIdChosen:[],
            checkedNames: true,
            validatedCollab: [],
            allCollaborators: [],
            allCollaboratorsName:[],
            value: '',
            collaboratorsFound: [],
            displayCollaborators: false,
            noCollaboratorsFound: false
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
                                                 <tr v-for="collaborator in nomrequest">
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
                                     <h4 class="col-sm-12 col-md-12 col-lg-12">Collaborateurs ajoutés: </h4>
                                     <div class="checkbox col-sm-12 col-md-12 col-lg-12">
                                     <label>Nombre de places disponibles</label>
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
        updateV1 (v) {
            this.sessionIdChosen = v;
        },
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
                    this.nomrequest = response.data;
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
            this.$http.get("api/sessions/" + this.sessionIdChosen + "/" + this.allCollaboratorsIdChosen + "/collaborators").then(
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
        }
    },
        verifyCheckedNames(checkedNames) {
            if (this.checkedNames === true) {
                this.GatherAllRequestsBySession();
            }
            else {
                this.nomrequest = ""
            }

        },
        moveCollabRight(nameCollab){
            this.validatedCollab.push(nameCollab);
            this.nomrequest.indexOf(nameCollab);
            this.nomrequest.splice(this.nomrequest.indexOf(nameCollab),1);
        },
        moveCollabLeft(nameCollab){
            this.nomrequest.push(nameCollab);
            this.validatedCollab.indexOf(nameCollab);
            this.validatedCollab.splice(this.validatedCollab.indexOf(nameCollab),1);
        },
        saveCollabInSessions(){
           var i;
            for (i = 0; i < this.validatedCollab.length; i++){
                this.allCollaboratorsIdChosen.push(this.validatedCollab[i].id);
            }
            this.AddCollaboratorsToTrainingSession();
            this.validatedCollab.splice(0,this.validatedCollab.length);
            this.allCollaboratorsIdChosen.splice(0,this.allCollaboratorsIdChosen.length);
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
            this.nomrequest.splice(0, this.nomrequest.length);
            this.displayCollaborators = false;

                for (index in this.allCollaborators)
                {
                     if ( (this.allCollaborators[index].lastName +" " +this.allCollaborators[index].firstName) === this.value ) {
                        this.nomrequest.push(this.allCollaborators[index]);
                    }
                }

               this.value = null;
        },
        selectCollaborators(){
            for (index in this.allCollaborators) {
                this.allCollaboratorsName.push(this.allCollaborators[index].lastName +" " +this.allCollaborators[index].firstName);
            }
        }
    },

        watch: {
            sessionIdChosen: function(value) {
                this.verifyCheckedNames(value);
            },
            checkedNames: function(value) {
                this.verifyCheckedNames(value);
            },
            nomrequest: function(){
                if(this.nomrequest.length>0){
                    this.noCollaboratorsFound = false;
                }
                else {
                    this.noCollaboratorsFound = true;
                }
            }
        },


});
Vue.component('typeahead', VueStrap.typeahead);
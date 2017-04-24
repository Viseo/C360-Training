/**
 * Created by CLH3623 on 10/04/2017.
 */
let CollaboratorFormation = Vue.component('collaborator-formation', {
    data: function () {
        return {
            sessionAlreadybooked:[],
            trainingsFound: [],
            sessionAlreadyBookedMessage:false,
            noTrainingFound: false,
            sessionsByCollab:[],
            allTrainings: [],
            addingRequestSucceeded: false,
            noSessionsSelectedError: false,
            checkedSessions: [],
            selected: '',
            check: false,
            idTraining: '3',
            listTrainingSessions: [],
            collaboratorIdentity: {
                id: '',
                lastName: '',
                firstName: ''
            },
            RequestToRegister: {
                trainingDescription: {},
                collaboratorIdentity: {},
                trainingSessionsDescriptions: []
            },
            allTrainingTitles: [],
            value: '',
            selectedTraining: '',
            trainingSelected: {},
            emptyTraining: false,
            emptyTrainingErrorMessage: "Veuillez sélectionner une formation",
            listTrainingSession: [],
            isNoSession: true,
            displayTrainings: false,
            nomrequest:[]
        }
    },
    template: `<div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12 col-lg-12 col-sm-12" style="padding:10px;" ></div>
                            <div class="col-sm-12 col-md-10 col-lg-7">
                                <div class="row">
                                    <div class="col-lg-7 col-md-7 text-center">
                                        <legend>Demande de formation</legend>
                                    </div>
                                </div>
                                <div class="row">
                                    <div id="trainingContainer">
                                        <div class="row" style="margin-bottom:35px">
                                            <div class="col-lg-4 col-md-4 col-sm-12">
                                                <select required class="form-control" v-model="selectedTraining">
                                                    <option  value="" disabled hidden>Formations disponibles</option>
                                                    <option v-for="training in allTrainings" :value="training.id">{{training.trainingTitle}}</option>
                                                </select>
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-12">
                                                <input ref="btnValidateSearch" @click="displayTrainingsFn" type="submit" class="btn btn-primary" value="Valider"/>
                                            </div>
                                        <div class="col-lg-4 col-lg-offset-2 col-md-offset-2 col-md-4 col-sm-12 searchField">
                                                <span ref="btnLoadTrainings" class="glyphicon glyphicon-search" @click="storeTrainingsFound" value=""></span>
                                                <typeahead v-model="value" v-bind:data="allTrainingTitles" placeholder="Entrer une formation">
                                                    </typeahead>  
                                                     <div v-show="noTrainingFound" style="margin-top:10px;"> Aucun résultat trouvé </div>                                    
                                        </div>
                                    </div>

                                                   <div class="row">
                                            <p id="trainingErrorMessage" class="color-red col-lg-4 col-md-4 col-sm-12" v-show="emptyTraining">{{emptyTrainingErrorMessage}}</p>
                                        </div>
                                        <div class="row">
                                        <div class="col-lg-12" style="margin-bottom:30px">
                                              <img v-show="showChevrons" src="css/up.png" id="scroll-up-2" width="60" height="20" style="position: absolute; left:50%; z-index:1;">
                                        </div></div>
                                        <div id="scroll"class="col-lg-12 col-md-12 col-sm-12" v-show="displayTrainings">

                                            <accordion id="accordionId" :one-at-atime="true" type="info">
                                                <div v-for="training in trainingsFound">
                                                    <panel ref="selectingTraining" @openPanel="renitialize(training)"type="primary">
                                                        <strong  slot="header"><u>{{training.trainingTitle}}</u></strong>
                                                        <h4 v-show="!isNoSession"class="col-lg-8"><u>Sessions disponibles</u></h4>
                                                        <div v-show="!isNoSession" class="col-lg-4"><input type="checkbox" @click="disabling(training.id)">Indifférent</div>
                                                        <div :id="training.id">
                                                            <div  class="col-lg-12"  v-for="i in listTrainingSession">
                                                                <div v-if="i.trainingDescription.id == training.id" >
                                                                    <input :id="i.id" type="checkbox" v-model="checkedSessions" :value="i"> 
                                                                    <span>{{i.beginning}} - {{i.ending}} - {{i.location}} </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-12">
                                                            <center>
                                                                <p style="color:#B22222" v-show="noSessionsSelectedError"> Vous n'avez sélectionné aucune session </p>
                                                                <p style="color:blue" v-show="isNoSession"> Aucune session n'est prévue, vous pouvez néanmoins envoyer une demande</p>
                                                                <button ref="btnSendRequest" class="btn btn-primary" value="Envoyer une demande" @click="VerifyTrainingSessionCollaborator">Envoyer une demande</button>
                                                                <p style="color:green" v-show="addingRequestSucceeded"> Demande envoyée avec succès </p>
                                                            </center>
                                                        </div>
                                                    </panel>
                                                </div>
                                            </accordion>
                                        </div>
                                        <div class="row">
                                        <div class="col-lg-12" style="margin-top:10px">
                                        <img v-show="showChevrons" src="css/down.png" id="scroll-down-2" width="60" height="20" style="position: relative; left:50%; z-index:1;">
                                        </div>
                                        </div>
                                        <center v-show="showChevrons"><p style="margin:10px;"><span class="glyphicon glyphicon-info-sign" style="margin-right:5px;"></span>Toutes les formations démarrent à 9h00</p></center>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    mounted: function () {
        this.gatherTrainingsFromDatabase();
        this.GetCookies();
    },
    computed: {
        searchFormatted: function () {
            if(this.value) return this.value.toUpperCase();
            else return '';
        },
        showChevrons(){
            if(this.trainingsFound.length >0){
                return true;
            }
            else{
                return false;
            }
        }
    },

    methods: {
        disablingSessions(){
            for(i in this.sessionsByCollab){
                temp=document.getElementById(this.sessionsByCollab[i].id);
                temp.disabled =true;
                this.sessionAlreadyBookedMessage = true;
                temp.nextElementSibling.innerHTML="";
                $("#"+this.sessionsByCollab[i].id).after('<span class="alwaysshowme">' + this.sessionsByCollab[i].beginning + ' ' +this.sessionsByCollab[i].ending + ' ' + this.sessionsByCollab[i].location + '<span class="showmeonhover" style="background-color: #b8b8b8;margin-left: 10px"> Une demande est déjà en cours pour cette session </span></span>');
            }
        },
        renitialize(training){
            this.checkedSessions.splice(0, this.checkedSessions.length);
            this.storeTrainingSessions(training.id);
            this.trainingSelected = training;
            this.storeSessionsByCollab(training.id);
            this.check = false;
            this.addingRequestSucceeded = false;
            this.noSessionsSelectedError = false;
            this.sessionAlreadybooked.splice(0, this.sessionAlreadybooked.length);

        },
        disabling(id, runtime){
            this.check = !this.check;
            var test = document.getElementById(id);
            if (test != null){
                var nodes= document.getElementById(id).getElementsByTagName("*");
            }
            else if (runtime == "test") {
                var nodes = ["input","input"];
            }
            if (this.check == true) {
                this.$http.get("api/formations/" + id + "/sessions").then(
                    function (response) {
                        this.checkedSessions.splice(0, this.checkedSessions.length);
                        this.checkedSessions = response.data;
                        if (this.checkedSessions.length === 0) {
                            this.isNoSession = true;
                        }
                        else {
                            this.isNoSession = false;
                        }
                    });
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].disabled = true;
                }
            }
            else {
                this.checkedSessions.splice(0, this.checkedSessions.length)
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].disabled = false;
                }
            }
        },
        displayTrainingsFn(){
            this.emptyTraining = this.selectedTraining ? false : true;
            this.trainingsFound.splice(0, this.trainingsFound.length);
            if (!this.emptyTraining) {
                let selectedTraining = this.selectedTraining;
                this.$http.get("api/formations/" + this.selectedTraining + "/sessions").then(
                    function (response) {
                        this.listTrainingSession = response.data;
                        for (key in this.allTrainings) {
                            if (this.allTrainings[key].id == selectedTraining) {
                                this.trainingsFound.push(this.allTrainings[key]);
                            }
                        }
                        if (this.listTrainingSession.length === 0) {
                            this.displayTrainings = true;
                            this.isNoSession = true;
                        }
                        else {
                            this.displayTrainings = true;
                            this.isNoSession = false;
                        }
                    },
                function(error) {
                        console.log(error);
                });
            }
        },
        gatherTrainingsFromDatabase(){
            this.$http.get("api/formations").then(
                function (response) {
                    this.allTrainings = response.data;
                    this.allTrainings.sort(function (a, b) {
                        return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                    });
                    this.selectTrainingTitles();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        GetCookies(){
            let regexCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
           try {
               this.token = String(regexCookieToken.pop());
               if (this.token != 'undefined'){
                   this.collaboratorIdentity.id = jwt_decode(this.token).id;
                   this.collaboratorIdentity.lastName = jwt_decode(this.token).lastName;
                   this.collaboratorIdentity.firstName = jwt_decode(this.token).sub;
           }
           } catch(e) {
           }
        },
        VerifyTrainingSessionCollaborator(){
            this.addingRequestSucceeded = false;
            this.noSessionsSelectedError = false;
            if (this.isNoSession == true || this.checkedSessions.length != 0) {
                this.RequestToRegister.trainingDescription = this.trainingSelected;
                this.RequestToRegister.collaboratorIdentity = this.collaboratorIdentity;
                this.RequestToRegister.trainingSessionsDescriptions = this.checkedSessions;
                this.RequestToRegister = JSON.parse(JSON.stringify(this.RequestToRegister));
                this.SaveTrainingSessionCollaborator();
            } else {
                this.noSessionsSelectedError = true;
            }
            this.storeSessionsByCollab(this.trainingSelected.id);
        },
        SaveTrainingSessionCollaborator(){
            this.$http.post("api/requests", this.RequestToRegister).then(
                function (response) {
                    this.addingRequestSucceeded = true;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        selectTrainingTitles(){
            for (index in this.allTrainings) {
                this.allTrainingTitles.push(this.allTrainings[index].trainingTitle)
            }
        },
        storeTrainingsFound(){
            this.trainingsFound.splice(0, this.trainingsFound.length);
            this.displayTrainings = true;
            this.$http.get("api/formations").then(function(response){
                for (index in this.allTrainings) {
                    if (this.allTrainings[index].trainingTitle.indexOf(this.searchFormatted) != -1) {
                        this.trainingsFound.push(this.allTrainings[index]);
                    }
                }
                this.noTrainingFound = (this.trainingsFound.length == 0) ? true : false;
                console.log(this.noTrainingFound);
                this.value = null;
            });
        },
        storeSessionsByCollab(id){
            this.$http.get("api/formations/"+id+"/alreadyrequestedsession/"+ this.collaboratorIdentity.id).then(
                function (response){
                    this.sessionsByCollab = response.data;
                    this.disablingSessions();
                }

            )
        },
        storeTrainingSessions(id){
            this.$http.get("api/formations/" + id + "/sessions").then(
                function (response) {
                    this.listTrainingSession = response.data;
                    if (this.listTrainingSession.length === 0) {
                        this.displayTrainings = true;
                        this.isNoSession = true;
                    }
                    else {
                        this.displayTrainings= true;
                        this.isNoSession = false;
                    }
                });
        }
    }
});
Vue.component('typeahead', VueStrap.typeahead);
Vue.component('accordion', VueStrap.accordion);
Vue.component('panel', VueStrap.panel);


/**
 * Created by CLH3623 on 10/04/2017.
 */
Vue.component('collaborator-formation', {
    data: function(){
        return {
            trainingsFound:[],
            noTrainingFound:false,
            allTrainings: [],
            checkedSessions:[],
            selected: '',
            check:false,
            idTraining:'3',
            listTrainingSessions:[],
            collaboratorIdentity:{
                id:'',
                lastName:'',
                firstName:''
            },
            RequestToRegister:{
                trainingDescription:{},
                collaboratorIdentity:{},
                trainingSessionsDescriptions:[]
            },
            allTrainingTitles:[],
            value:'',
            selectedTraining: '',
            trainingSelected:{},
            emptyTraining: false,
            emptyTrainingErrorMessage: "Veuillez sélectionner une formation",
            listTrainingSession: [],
            isNoSession: true,
            displayTrainings: false
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
                                                      <div class="row">
                                            <div class="col-lg-4 col-md-4 col-sm-12">
                                                <select required class="form-control" v-model="selectedTraining">
                                                    <option  value="" disabled hidden>Formations disponibles</option>
                                                    <option v-for="training in allTrainings" :value="training.id">{{training.trainingTitle}}</option>
                                                </select>
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-12">
                                                <input @click="displayTrainingsFn" type="submit" class="btn btn-primary" value="Valider"/>
                                            </div>
                                        <div class="col-lg-4 col-lg-offset-2 col-md-offset-2 col-md-4 col-sm-12 searchField">
                                                <span class="glyphicon glyphicon-search" @click="storeTrainingsFound"></span>
                                                <typeahead v-model="value" v-bind:data="allTrainingTitles" placeholder="Entrer une formation">
                                                    </typeahead>  
                                                     <div v-show="noTrainingFound" style="margin-top:10px;"> Aucun résultat trouvé </div>                                    
                                        </div>
                                    </div>
                                                   <div class="row">
                                            <p id="trainingErrorMessage" class="color-red col-lg-4 col-md-4 col-sm-12" v-show="emptyTraining">{{emptyTrainingErrorMessage}}</p>
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12" v-show="displayTrainings">
                                            <p style="margin-top:50px;"></p>
                                            <hr style="margin:0px">
                                            <accordion :one-at-atime="true" type="info">
                                            
                                            <div v-for="training in trainingsFound">
                                            <panel @openPanel="renitialize(training)"type="primary">
                                                <strong  slot="header"><u>{{training.trainingTitle}}</u></strong>
                                                <h4 class="col-lg-8"><u>Sessions disponibles</u></h4>
                                                <div class="col-lg-4"><input type="checkbox" @click="disabling(training.id)">Indifférent</div>
                                                <div :id="training.id">
                                                <div  class="col-lg-12"  v-for="i in listTrainingSession">
                                                <div v-if="i.trainingDescription.id == training.id" >
                                       
                                                <input type="checkbox" v-model="checkedSessions" :value="i"> {{i.beginning}} - {{i.ending}} - {{i.location}}
                                                
                                                
                                                </div>
                                                </div>
                                                <button class="btn btn-primary" value="Envoyer une demande" @click="VerifyTrainingSessionCollaborator">Envoyer une demande</button>
                                                </div>

                                            </panel>
                                            </accordion>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    mounted: function(){
        this.gatherTrainingsFromDatabase();
        this.GatherSessionsByTrainingFromDatabase();
        this.GetCookies();
    },
    computed: {
        searchFormatted: function() {
            return this.value.toUpperCase();
        }
    },

    methods: {
        renitialize(training){
            this.trainingSelected = training;
            this.check = false;
        },
        disabling(id){
            this.check = !this.check;
            var nodes = document.getElementById(id).getElementsByTagName("*");
            if(this.check === true){
            for(var i = 0; i < nodes.length; i++){
                nodes[i].disabled = true;
            }}
            else{
                for(var i = 0; i < nodes.length; i++){
                    nodes[i].disabled = false;
                }
            }
        },
        displayTrainingsFn(){
            this.emptyTraining = this.selectedTraining ? false : true;
            this.trainingsFound.splice(0,this.trainingsFound.length);
            if (!this.emptyTraining) {
                this.$http.get("api/formations/" + this.selectedTraining + "/sessions").then(
                    function (response) {
                        this.listTrainingSession = response.data;
                        for (key in this.allTrainings) {
                            if ( this.allTrainings[key].id == this.selectedTraining) {
                                this.trainingsFound.push(this.allTrainings[key]);
                            }
                        }
                        if (this.listTrainingSession.length === 0) {
                            this.displayTrainings=true;
                            this.isNoSession = true;
                        }
                        else{
                            this.displayTrainings=true;
                            this.isNoSession = false;
                        }
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
            this.token = String(regexCookieToken.pop());
            this.collaboratorIdentity.id = jwt_decode(this.token).id;
            this.collaboratorIdentity.lastName = jwt_decode(this.token).lastName;
            this.collaboratorIdentity.firstName = jwt_decode(this.token).sub;
        },
        GatherSessionsByTrainingFromDatabase(){
            this.$http.get("api/formations/" + this.idTraining + "/sessions").then(
                function (response) {
                    this.listTrainingSessions = response.data;
                });
        },
        VerifyTrainingSessionCollaborator(){
            //à changer
            this.RequestToRegister.trainingDescription = this.trainingSelected;
            this.RequestToRegister.collaboratorIdentity = this.collaboratorIdentity;
            this.RequestToRegister.trainingSessionsDescriptions = this.checkedSessions;
            this.RequestToRegister = JSON.parse(JSON.stringify(this.RequestToRegister));
            console.log(this.RequestToRegister);
            this.SaveTrainingSessionCollaborator();
        },
        SaveTrainingSessionCollaborator(){
            this.$http.post("api/requests", this.RequestToRegister).then(
                function (response) {
                    console.log("success");
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        selectTrainingTitles(){
            for(index in this.allTrainings){
                this.allTrainingTitles.push(this.allTrainings[index].trainingTitle)
            }
            console.log(this.allTrainingTitles);
        },
        storeTrainingsFound(){
            this.storeTrainingSessions();
            this.displayTrainings = true;
            this.trainingsFound.splice(0, this.trainingsFound.length);
            for (index in this.allTrainings) {
                if (this.allTrainings[index].trainingTitle.indexOf(this.searchFormatted) != -1) {
                    this.trainingsFound.push(this.allTrainings[index])
                }
            }
            this.noTrainingFound = (this.trainingsFound.length==0) ? true : false;
            this.value = null;
            for(i in this.trainingsFound){
            }
        },
        storeTrainingSessions(){
            this.$http.get("api/sessions").then(
                function (response) {
                    this.listTrainingSession = response.data;
                    if (this.listTrainingSession.length === 0) {
                        this.isNoSession = true;
                    }
                    else {
                        this.isNoSession = false;
                    }
                    console.log(this.listTrainingSession);
                });
        }


    }

})
Vue.component('typeahead',VueStrap.typeahead);
Vue.component('accordion',VueStrap.accordion);
Vue.component('panel',VueStrap.panel);
/**
 * Created by CLH3623 on 10/04/2017.
 */
Vue.component('collaborator-formation', {
    data: function(){
        return {
            trainingsFound:[],
            allTrainings: [],
            allTrainingTitles:[],
            value:'',
            selectedTraining: '',
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
                                        </div>
                                    </div>
                                                   <div class="row">
                                            <p id="trainingErrorMessage" class="color-red col-lg-4 col-md-4 col-sm-12" v-show="emptyTraining">{{emptyTrainingErrorMessage}}</p>
                                        </div>
                                        <div class="col-lg-12 col-md-12 col-sm-12" v-show="displayTrainings">
                                            <p style="margin-top:50px;">{{selectedTraining}}</p>
                                            <hr style="margin:0px">
                                            <accordion :one-at-atime="true" type="info">
                                            
                                            <div v-for="training in trainingsFound">
                                            <panel>
                                                <strong  slot="header"><u>{{training.trainingTitle}}</u></strong>

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
    },
    methods: {
        displayTrainingsFn(){
            this.emptyTraining = this.selectedTraining ? false: true;
            if (!this.emptyTraining) {
                this.$http.get("api/formations/" + this.selectedTraining + "/sessions").then(
                    function (response) {
                        console.log(this.allTrainings);
                        this.listTrainingSession = response.data;
                        for (key in this.allTrainings) {
                            if ( this.allTrainings[key] == this.selectedTraining) {
                                console.log(training.trainingTitle);
                            }
                            else console.log(this.allTrainings[key]);
                        }
                        if (this.listTrainingSession.length === 0) {
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
        selectTrainingTitles(){
            for(index in this.allTrainings){
                this.allTrainingTitles.push(this.allTrainings[index].trainingTitle)
            }
            console.log(this.allTrainingTitles);
        },
        storeTrainingsFound(){
            this.trainingsFound.splice(0,this.trainingsFound.length);
            for(index in this.allTrainings){
                if(this.allTrainings[index].trainingTitle.indexOf(this.value) != -1){
                this.trainingsFound.push(this.allTrainings[index])
                }
            }
            this.value=null;
            console.log(this.trainingsFound.length);
        }


    }

})
Vue.component('typeahead',VueStrap.typeahead);
Vue.component('accordion',VueStrap.accordion);
Vue.component('panel',VueStrap.panel);
/**
 * Created by SJO3662 on 02/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

Vue.component('training-to-come', {
    template: `
        <div class="container-fluid">
            <button @click="gatherTrainingsAlreadyHaveSessionsFromDatabase()">get all trainings</button><br>
            <button @click="gatherTrainingSessionsByTrainingFromDatabase(4)">get all training sessions by trainings</button><br>
            <button @click="VerifyCollaboratorRequestsExistence(7)">VerifyCollaboratorRequestsExistence</button><br>
            <div class="row">
                <div class="row">
                    <div class="col-lg-9 col-md-9 text-center">
                        <legend>Formation à venir</legend>
                    </div>
                </div>
                    <div class="row">                     
                        <div class="row">
                            <div id="training-to-come" style="border: 1px grey solid;">
                            
                                <div >
                                    Coucou coucou
                                    <table style="width: 500px; padding-left: 5%;">
                                        <tr v-for = "n in 10">
                                            <td style="border-bottom-style: solid; border-bottom-color: grey; border-bottom-width: thin; " > 
                                                <div style="text-align: left"> <b>{{n}} </b><br/>  coucou .............................</div>
                                                <div style="text-align: right">0 places disponibles  </div>
                                            </td>  
                                                                                    
                                        </tr>
                                    </table>
                                </div>
                               
                            </div>
                        </div>
                    </div>                
            </div>
        </div>    

    `,
    data: function () {
        return {
            collaborator_id:10,
            allTrainingsAlreadyHaveSessions:[],
            trainingSessions:[],
            collaboratorsRequesting:[],
            numberOfAvailablePlaces:15,
            existCollaboratorRequest:false,
        }
    },
    methods: {
        gatherTrainingsAlreadyHaveSessionsFromDatabase(){
            this.$http.get("api/formations/sessions").then(
                function (response) {
                    console.log("success to get all trainings");
                    this.allTrainingsAlreadyHaveSessions = response.data;
                    this.allTrainingsAlreadyHaveSessions.sort(function (a, b) {
                        return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                    });
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        gatherTrainingSessionsByTrainingFromDatabase(training_id){
            this.trainingSessions = [];
            this.$http.get("api/formations/"+ training_id +"/sessions").then(
                function (response) {
                    console.log("success to get training sessions by training");
                    this.trainingSessions = response.data;
                    this.trainingSessions = this.reorganizeTrainingSessionsByTraining(this.trainingSessions);
                    for(var tmp in this.trainingSessions){
                        this.calculateNumberOfAvailablePlaces(tmp,this.trainingSessions[tmp].id);
                    }
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        reorganizeTrainingSessionsByTraining(sessions){
            var trainingSessions = sessions;
            trainingSessions.sort(function(a,b) {
                var x = a.beginning.split('/').reverse().join('');
                var y = b.beginning.split('/').reverse().join('');
                return x > y ? 1 : x < y ? -1 : 0;
            });
            return trainingSessions;
        },
        calculateNumberOfAvailablePlaces(indice,session_id){
            this.numberOfAvailablePlaces = 15;
            this.$http.get("api/sessions/" + session_id + "/collaborators").then(
                function (response) {
                    console.log("success to get all collaborators from the table trainingsession_collaborator in order to calculate numbers of available places");
                    var allCollaboratorsAlreadyInSessions = response.data;
                    this.numberOfAvailablePlaces = 15 - allCollaboratorsAlreadyInSessions.length;
                    this.trainingSessions[indice].numberOfAvailablePlaces = this.numberOfAvailablePlaces;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        VerifyCollaboratorRequestsExistence(session_id){
            this.$http.get("api/requests/session/"+ session_id + "/collaborators").then(
                function (response) {
                    console.log("success to get all requests from database");
                    console.log(response.data);
                    this.collaboratorsRequesting = response.data;
                    this.existCollaboratorRequest = false;
                    for(var tmp in this.collaboratorsRequesting){
                        if(this.collaborator_id == this.collaboratorsRequesting[tmp].id){
                            this.existCollaboratorRequest = true;
                            break;
                        }
                    }
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
    }
});
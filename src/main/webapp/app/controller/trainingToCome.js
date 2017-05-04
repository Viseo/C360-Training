/**
 * Created by SJO3662 on 02/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

Vue.component('training-to-come', {
    template: `
            <div class="container-fluid">
                <div class="row">
                    <div class="row">
                        <div class="col-lg-7 col-md-7 text-center">
                            <legend>Formation à venir</legend>
                        </div>
                    </div>
                    <div class="row">                     
                        <div class="row">
                            <div id="training-to-come" style="width: 100%; height: 360px; overflow-y:hidden; overflow-x:hidden;" id="test" class="roundedCorner">
                                <img v-show="showChevrons" src="css/up.png" id="scroll-up" width="60" height="20" style="position: absolute; left:50%; z-index:1;">
                                <table style="width: 500px; padding-left: 5%;">
                                    <tr v-for = "n in allTrainingsAndSessions">
                                        <td style="border-bottom-style: solid; border-bottom-color: grey; border-bottom-width: thin;"> 
                                            <div style="text-align: left"> <b>{{n[0].trainingDescription.trainingTitle}} </b></div>
                                        </td>  
                                        <td  v-for = "m in n" style="border-bottom-style: solid; border-bottom-color: grey; border-bottom-width: thin;"> 
                                            <div style="text-align: left">
                                                {{m.beginning}} - {{m.location}}
                                                <!--<div>{{calculate(m.id)}} places disponibles</div>-->
                                                <div>{{ m.numberOfAvailablePlaces }} places disponibles</div>
                                            </div>
                                            <br>
                                        </td>
                                    </tr>
                                </table>
                                  <img v-show="showChevrons" src="css/down.png" id="scroll-down" width="60" height="20" style="position: absolute; left:50%; top:95%; z-index:1;">
                            
                            </div>
                        </div>
                    </div>                
                </div>
                <!--<pre>{{$data|json}}</pre>-->
            </div>`,

    data: function () {
        return {
            collaborator_id:10,
            allTrainingsAlreadyHaveSessions:[],
            trainingSessions:[],
            collaboratorsRequesting:[],
            numberOfAvailablePlaces:15,
            existCollaboratorRequest:false,
            trainingAndSessions:[],
            allTrainingsAndSessions:[],
            allCollaboratorsAlreadyInSessions:[],
        }
    },

    computed: {
        showChevrons(){
            return true;
        }
    },

    mounted:function () {
        this.gatherTrainingsAlreadyHaveSessionsFromDatabase();
        $('#scroll-up').click(function() {
            $('#test').animate({scrollTop: "-=100"}, 500);
        });

        $('#scroll-down').click(function() {
            $('#test').animate({scrollTop: "+=100"}, 500);
        });

        $('#test').bind('mousewheel DOMMouseScroll', function(event){
            if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                $('#test').animate({scrollTop: "-=100"}, 80);
            }
            else{
                $('#test').animate({scrollTop: "+=100"}, 80);
            }
        });
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
                    for(var tmp in this.allTrainingsAlreadyHaveSessions){
                        var training_id = this.allTrainingsAlreadyHaveSessions[tmp].id;
                        this.gatherTrainingSessionsByTrainingFromDatabase(training_id);
                    }
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        gatherTrainingSessionsByTrainingFromDatabase(training_id){
            this.trainingSessions = [];
            this.trainingAndSessions = [];
            this.$http.get("api/formations/"+ training_id +"/sessions").then(
                function (response) {
                    console.log("success to get training sessions by training");
                    this.trainingSessions = response.data;
                    this.trainingSessions = this.reorganizeTrainingSessionsByTraining(this.trainingSessions);
                    for(var tmp in this.trainingSessions){
                        this.calculateNumberOfAvailablePlaces(tmp,this.trainingSessions[tmp].id);
                    }
                    this.allTrainingsAndSessions.push(this.trainingSessions);
                    this.allTrainingsAndSessions.sort(function (a, b) {
                        return (a[0].trainingDescription.trainingTitle > b[0].trainingDescription.trainingTitle) ? 1 : ((b[0].trainingDescription.trainingTitle > a[0].trainingDescription.trainingTitle) ? -1 : 0);
                    });
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
        calculate(session_id){
            var numberOfAvailablePlaces = 15;
            this.allCollaboratorsAlreadyInSessions = [];
            this.$http.get("api/sessions/" + session_id + "/collaborators").then(
                function (response) {
                    console.log("success to get all collaborators from the table trainingsession_collaborator in order to calculate numbers of available places");
                    this.allCollaboratorsAlreadyInSessions = response.data;
                    numberOfAvailablePlaces = 15 - this.allCollaboratorsAlreadyInSessions.length;
                    console.log(this.numberOfAvailablePlaces);
                });
            return numberOfAvailablePlaces;
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
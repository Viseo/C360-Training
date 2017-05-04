/**
 * Created by SJO3662 on 02/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

Vue.component('training-to-come', {
    template: `<div class="row" >
                        <div class="row">
                            <div style="margin-left:30px;" class="col-lg-7 col-md-7 text-center">
                                <legend>Formation à venir</legend>
                            </div>
                        </div>
                            <div style="margin-left:30px;width: 550px;border:1px solid #dcdcdc;border-radius: 10px;"> 
                                    <div class="col-lg-12" style="margin-bottom:30px">
                                        <img v-show="showChevrons" src="css/up.png" id="scroll-up-3" width="60" height="20" style="position: absolute; left:45%; margin-top:10px; z-index:1;">
                                    </div>
                                <div id="test" style=" height: 260px; overflow-y:hidden; overflow-x:hidden;" class="col-lg-12 col-md-12 col-sm-12" >
                                    <table v-for = "n in allTrainingsAndSessions" style="width: 500px;">
                                        <tr>
                                            <td>
                                                <div style="text-align: left"> <b>{{n[0].trainingDescription.trainingTitle}} </b></div>
                                            </td>
                                        </tr>
                                        <tr v-for = "m in n">
                                            <td>
                                                <div style="text-align: left">
                                                    {{m.beginning}} - {{m.location}} - {{ m.numberOfAvailablePlaces }} places disponibles
                                                <!--<div>{{calculate(m.id)}} places disponibles</div>-->
                                                <!--<div>{{ m.numberOfAvailablePlaces }} places disponibles</div>-->
                                                </div>
                                            </td>
                                        </tr><hr>
                                    </table>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12" style="margin-top:10px">
                                        <img v-show="showChevrons" src="css/down.png" id="scroll-down-3" width="60" height="20" style="position: absolute; left:45%; margin-bottom: 20px; top:95%; z-index:1;">
                                    </div>
                                </div>
                                <div style="margin-top:20px; margin-left: 25px;">
                                    <table style="width: 530px;">
                                        <tr>
                                            <td> 
                                                <p>
                                                    <span class="glyphicon glyphicon-eye-open"></span> Voir la liste des souhaits
                                                </p>
                                            </td>  
                                            <td >
                                                <p >
                                                    <span class="glyphicon glyphicon-pencil"></span> Vous ne trouver pas la formation qui vous convient?
                                                </p>
                                        </tr>
                                    </table>
                                    
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
        $('#scroll-up-3').click(function() {
            $('#test').animate({scrollTop: "-=100"}, 500);
        });

        $('#scroll-down-3').click(function() {
            $('#test').animate({scrollTop: "+=100"}, 500);
        });

        // $('#scroll').bind('mousewheel DOMMouseScroll', function(event){
        //     if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
        //         $('#scroll').animate({scrollTop: "-=100"}, 80);
        //     }
        //     else{
        //         $('#scroll').animate({scrollTop: "+=100"}, 80);
        //     }
        // });
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
                    for(var tmp in this.trainingSessions){

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
            var numberOfAvailablePlaces = 10;
            this.allCollaboratorsAlreadyInSessions = [];
            this.$http.get("api/sessions/" + session_id + "/collaborators").then(
                function (response) {
                    console.log("success to get all collaborators from the table trainingsession_collaborator in order to calculate numbers of available places");
                    this.allCollaboratorsAlreadyInSessions = response.data;
                    numberOfAvailablePlaces = 15 - this.allCollaboratorsAlreadyInSessions.length;
                    console.log(numberOfAvailablePlaces);
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
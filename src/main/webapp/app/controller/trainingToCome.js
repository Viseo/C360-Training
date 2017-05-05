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
                                        <img v-show="showChevrons" src="css/up.png" id="scroll-up-3" width="60" height="20" style="position: absolute; left:50%; z-index:1;">
                                    </div>
                                <div id="test" style=" height: 260px; overflow-y:hidden; overflow-x:hidden;" class="col-lg-12 col-md-12 col-sm-12" >
                                    <table v-for = "n in allTrainingsAndSessions" style=" width: 100%;" >
                                        <tr>
                                            <td>
                                                <div style="text-align: left"> <b>{{n[0].trainingDescription.trainingTitle}} </b></div>
                                            </td>
                                        </tr>
                                        <tr v-for = "m in n" >
                                            <td style="text-align: left">
                                                    {{m.beginning}} - {{m.location}} 
                                            </td>
                                            <td style="text-align: right">
                                                     {{ 15 - m.collaborators.length }} places disponibles
                                            </td>
                                        </tr>
                                        <tr><td colspan="2"><hr></td></tr>
                                    </table>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12" style="margin-top:10px">
                                        <img v-show="showChevrons" src="css/down.png" id="scroll-down-3" width="60" height="20" style="position: absolute; left:50%; top:95%; z-index:1;">
                                    </div>
                                </div>
                                <div style="margin-top:20px; margin-left: 25px">
                                    <table style="width: 530px">
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
            numberOfAvailablePlaces:undefined,
            existCollaboratorRequest:false,
            trainingAndSessions:[],
            allTrainingsAndSessions:[],
            allCollaboratorsAlreadyInSessions:[],
            test123:[]
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
                    this.gatherAllSessionsAndCollaboratorsFromDatabase();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        gatherAllSessionsAndCollaboratorsFromDatabase(){
            this.$http.get("api/formations/sessions/collaborators").then(
                function (response) {
                    console.log("success to get all trainings sessions and collaborators");
                    this.trainingAndSessions = response.data;
                    for(var tmp1 in this.allTrainingsAlreadyHaveSessions){
                        var tmp3 = [];
                        for(var tmp2 in this.trainingAndSessions){
                            if(this.allTrainingsAlreadyHaveSessions[tmp1].id == this.trainingAndSessions[tmp2].trainingDescription.id){
                                tmp3.push(this.trainingAndSessions[tmp2]);
                            }
                        }
                        tmp3 = this.reorganizeTrainingSessionsByTraining(tmp3);
                        this.allTrainingsAndSessions.push(tmp3);
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
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
            <div class="row">
                <div class="row">
                    <div class="col-lg-9 col-md-9 text-center">
                        <legend>Formation à venir</legend>
                    </div>
                </div>
                    <div class="row">                     
                        <div class="row">
                            <div id="training-to-come" style="border: 1px red solid;">
                            
                                <div>
                                    Coucou coucou
                                    <table >
                                        <tr v-for = "n in 10">
                                            <td style="border-bottom 1px grey solid">{{n}} {{coucou}} </td>  
                                                                                    
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
            allTrainingsAlreadyHaveSessions:[],
            trainingSessions:[]
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
        }
    }
});
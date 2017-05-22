/**
 * Created by NBE3663 on 02/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);
Date.prototype.getMonthName = function() {
    var monthNames = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return monthNames[this.getMonth()];
}

let stateRequest = Vue.component('state-request', {
        props: [],
        data: function() {
            return {
                noSessionForCollaborator: true,
                collaboratorIdentity: {
                    id: '',
                    lastName: '',
                    firstName: ''
                },
                requestedTrainingByCollaborator:[],
                requestedTraining:[{
                    requestTrainingList: [],
                    trainingSessions: [],
                    title:''
                }],
                allTrainingsAlreadyHaveSessions:[],
                allTrainingsAndSessions:[{
                    collaborators: []
                }],
                trainingAndSessions:[],

                //feedback
                score:'',
                comment:'',
                feedback:{
                    score:'',
                    comment:'',
                    training:''
                },
                /*feedback:{
                    "score":5,
                    "comment":"HELLO WORLD",
                    "training":{"id":3,"version":0,"trainingTitle":"FORMATION","numberHalfDays":3,"topic":{"id":2,"version":0,"name":"C"}}
                },*/
                allTrainingsToGiveFeedbacks:[],
                testest:[]
            }
        },
        template: `
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-7 col-md-7 col-sm-7 text-center" style="width:200px">
                    <legend> Mes formations </legend>
                </div>
            </div>
            <div class="row">
                <div class="panel panel-default" style="margin-left:10px; margin-bottom:10px; ">
                     <div class="panel-body" style="padding:5px; height:202px">
                        <div class="row">
                            <div v-show="!noSessionForCollaborator" class="col-lg-12" style="margin-bottom:30px">
                                <img src="css/up.png" id="scroll-up-3" width="60" height="20" style="position: absolute; left:50%; z-index:1;">
                            </div>
                        </div>
                        <div id="scrollMyTrainings">
                                <div class="col-sm-12 col-md-11 col-lg-11" style="line-height:2em; font-size:1em">
                                    <div v-show="noSessionForCollaborator">
                                        <p style="text-align: center; margin:50px;">Vous n'êtes inscrit à aucune session.</p>
                                    </div>
                                    <div v-for="training in requestedTrainingByCollaborator" >
                                        <strong> {{training.title}}</strong>
                                        <div v-for="session in training.sessionsPending">
                                            {{getDate(session.beginning)}} - {{getDate(session.ending)}} - {{session.location}}
                                            <span class="glyphicon glyphicon-time alignIcon"></span>
                                        </div>
                                        <div v-for="session in training.sessionsValidated">
                                            {{getDate(session.beginning)}} - {{getDate(session.ending)}} - {{session.location}}
                                            <span class="glyphicon glyphicon-ok-circle alignIcon" style="color: green"></span>
                                        </div>
                                        <hr style="margin:4.5px"/>
                                    </div>
                            </div>
                        </div>
                        <div v-show="!noSessionForCollaborator" class="col-lg-12" style="margin-top:10px">
                            <img src="css/down.png" id="scroll-down-3" width="60" height="20" style="position: relative; bottom:10px; left:50%; z-index:1;">
                        </div>
                     </div>
                </div>
            </div>
        </div>

`,
    mounted: function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.activateScrollUp('#scroll-up-3','#scrollMyTrainings');
        this.activeScrollDown('#scroll-down-3','#scrollMyTrainings');
        this.activateScrollWheel('#scrollMyTrainings');
        this.getCookies();
        this.fetchTrainingsSessions();
        this.collectAllTrainingsToGiveFeedbacks();
    },

        methods: {
            getDate(date){
                dateToConvert = new Date(date);
                formattedDate = dateToConvert.getDate() + " " + (dateToConvert.getMonthName()) + " " + dateToConvert.getFullYear();
                return formattedDate;
            },

            getCookies(){
                let regexCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
                if(regexCookieToken){
                    if(!regexCookieToken[0].includes('undefined')) {
                        if (this.token != 'undefined'){
                            this.token = String(regexCookieToken.pop());
                            this.collaboratorIdentity.id = jwt_decode(this.token).id;
                            this.collaboratorIdentity.lastName = jwt_decode(this.token).lastName;
                            this.collaboratorIdentity.firstName = jwt_decode(this.token).sub;
                        }
                    }
                }
            },
            orderSessions(){
                this.requestedTrainingByCollaborator.sort(function(a, b) {
                    if(a.sessionsValidated[0] && b.sessionsValidated[0]){
                        return parseFloat(a.sessionsValidated[0].beginning) - parseFloat(b.sessionsValidated[0].beginning);
                    }
                    else if(a.sessionsPending[0] && b.sessionsPending[0]){
                        return parseFloat(a.sessionsPending[0].beginning) - parseFloat(b.sessionsPending[0].beginning);
                    }
                });
            },
            fetchTrainingsSessions(){
                this.requestedTrainingByCollaborator.splice(0,this.requestedTrainingByCollaborator.length);
                this.$http.get("api/sessions/"+this.collaboratorIdentity.id+"/requestedSessions").then(
                    function (response) {
                        this.requestedTraining=response.data;
                        for (let i =0;i<Object.keys(this.requestedTraining).length;i++) {
                            if(Object.values(this.requestedTraining)[i].requestTrainingList.length!=0 || Object.values(this.requestedTraining)[i].trainingSessions.length!=0){
                                this.requestedTrainingByCollaborator.push({
                                title: Object.keys(this.requestedTraining)[i],
                                sessionsPending: Object.values(this.requestedTraining)[i].requestTrainingList,
                                sessionsValidated: Object.values(this.requestedTraining)[i].trainingSessions
                            });
                                this.noSessionForCollaborator = false;
                            }
                            this.orderSessions();

                         }
                        console.log(this.requestedTrainingByCollaborator);
                       this.orderSessions();
                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                );
            },

            addFeedback(training){
                if(this.score != '' && this.comment != ''){
                    this.feedback.training = training;
                    this.feedback.score = this.score;
                    this.feedback.comment = this.comment;
                    this.$http.post("api/feedback/"+this.collaboratorIdentity.id,this.feedback).then(
                        function (response) {
                            console.log("success to add a feedback");
                        },
                        function (response) {
                            console.log("Error: ", response);
                            console.error(response);
                        }
                    );
                }
            },
            /*collectAllTrainingsToGiveFeedbacks(){
                var dateToday = new Date();
                for(var tmp1 in this.requestedTrainingByCollaborator){ //pour chaque formation
                    for(var tmp2 in this.requestedTrainingByCollaborator[tmp1].sessionsValidated){ //pour chaque session d'une formation
                        //à modifier pour faire l'inverse
                        if(this.requestedTrainingByCollaborator[tmp1].sessionsValidated[tmp2].ending > dateToday){
                            this.allTrainingsToGiveFeedbacks.push(this.requestedTrainingByCollaborator[tmp1].sessionsValidated[tmp2].training);
                            break;
                        }
                    }
                }
                this.allTrainingsToGiveFeedbacks.sort(function (a, b) {
                    return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                });
            },*/
            collectAllTrainingsToGiveFeedbacks(){
                this.$http.get("api//trainingstogivefeedbacks/"+this.collaboratorIdentity.id).then(
                    function (response) {
                        console.log("success to get all trainings to give feedbacks");
                        this.allTrainingsToGiveFeedbacks = response.data;
                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                );
            },
        }
    }
)

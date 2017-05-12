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
                trainingAndSessions:[]
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
                     <div class="panel-body" style="padding:5px;">
                        <div class="row">
                            <div class="col-lg-12" style="margin-bottom:30px">
                                <img src="css/up.png" id="scroll-up-3" width="60" height="20" style="position: absolute; left:50%; z-index:1;">
                            </div>
                        </div>
                        <div id="scrollMyTrainings">
                                <div class="col-sm-12 col-md-11 col-lg-11" style="line-height:2em; font-size:1em">
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
                        <div class="col-lg-12" style="margin-top:10px">
                            <img src="css/down.png" id="scroll-down-3" width="60" height="20" style="position: relative; left:50%; z-index:1;">
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
        this.getCookies();
        this.fetchTrainingsSessions();
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
                    console.log(!regexCookieToken[0].includes('undefined'));
                    if(!regexCookieToken[0].includes('undefined')) {
                        console.log("hello");
                        if (this.token != 'undefined'){
                            this.token = String(regexCookieToken.pop());
                            this.collaboratorIdentity.id = jwt_decode(this.token).id;
                            console.log(this.collaboratorIdentity.id);
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
                        console.log(Object.keys(this.requestedTraining)[0]);
                        for (let i =0;i<Object.keys(this.requestedTraining).length;i++) {
                            if(Object.values(this.requestedTraining)[i].requestTrainingList.length!=0 || Object.values(this.requestedTraining)[i].trainingSessions.length!=0){
                                this.requestedTrainingByCollaborator.push({
                                title: Object.keys(this.requestedTraining)[i],
                                sessionsPending: Object.values(this.requestedTraining)[i].requestTrainingList,
                                sessionsValidated: Object.values(this.requestedTraining)[i].trainingSessions
                            });}
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
        }
    }
)

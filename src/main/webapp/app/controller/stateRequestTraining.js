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
                    firstName: '',
                    alreadyShownPopUp:false,
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
                testest:[],
                showModal:false
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
             <div v-show = "showModal" style="position: fixed;z-index: 9998;top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(0, 0, 0, .5);display: table;transition: opacity .3s ease;">
                 <alert type = "info" placement = "top" width="40%" style="top:25%;background-color:white;">
                     <center><h2 style="color:rgba(66, 139, 202,0.8);">Notez vos formations!</h2></center> 
                     <span style="top:-60px;left:98%" class="glyphicon glyphicon-remove-sign color-red" @click="showModal = false;createCookie();"></span>
                     <br><br>
                     <accordion id="accordionId" :one-at-atime="true" type="info" style="height:100%">
                            <div v-for="training in allTrainingsToGiveFeedbacks">
                                  <panel :is-open="openPanel" type="default" >
                                        <p  slot="header" style="color: black;">{{training.trainingTitle}}</p>
                                             <div class="container">
                                                    <div class="row">
                                                         <div class="col-sm-4 col-md-4 col-lg-4 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
                                                               <div class="stars " >
                                                                    <input class="star star-5" id="star-5" type="radio" name="star" @click="setScore(5)"/>
                                                                    <label class="star star-5" for="star-5" @click="setScore(5)"></label>
                                                                    <input class="star star-4" id="star-4" type="radio" name="star" @click="setScore(4)"/>
                                                                    <label class="star star-4" for="star-4" @click="setScore(4)"></label>
                                                                    <input class="star star-3" id="star-3" type="radio" name="star" @click="setScore(3)"/>
                                                                    <label class="star star-3" for="star-3" @click="setScore(3)"></label>
                                                                    <input class="star star-2" id="star-2" type="radio" name="star" @click="setScore(2)"/>
                                                                    <label class="star star-2" for="star-2" @click="setScore(2)"></label>
                                                                    <input class="star star-1" id="star-1" type="radio" name="star" @click="setScore(1)"/>
                                                                    <label class="star star-1" for="star-1" @click="setScore(1)"></label>
                                                               </div>
                                                         </div>
                                                    </div>
                                                    <div class="row">
                                                        <center>
                                                         <div class="col-sm-2 col-md-2 col-lg-2 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
                                                                    <input type="text" class="form-control" placeholder="Commentaire" v-model="comment">
                                                         </div>
                                                         <div class="col-sm-1 col-md-1 col-lg-1">
                                                                     <button type="button" class="btn btn-default" @click="addFeedback(training);createCookie();">Enregistrer</button>
                                                         </div>
                                                         </center>
                                                    </div>                        
                                             </div>
                                  </panel>
                            </div>
                     </accordion>
                 </alert>
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
            setScore(value){
                this.score = value;
            },
            getDate(date){
                dateToConvert = new Date(date);
                formattedDate = dateToConvert.getDate() + " " + (dateToConvert.getMonthName()) + " " + dateToConvert.getFullYear();
                return formattedDate;
            },

            getCookies(){
                let regexCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
                this.alreadyShownPopUp=this.getCookie("alreadyShownPopUp");
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
            getCookie(cname) {
                var name = cname + "=";
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for(var i = 0; i <ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        console.log(c.substring(name.length, c.length));
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
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
                if (this.score != '' && this.comment != '') {
                    this.feedback.training = training;
                    this.feedback.score = this.score;
                    this.feedback.comment = this.comment;
                    this.$http.post("api/feedback/"+this.collaboratorIdentity.id,this.feedback).then(
                        function (response) {
                            console.log("success to add a feedback");
                            this.collectAllTrainingsToGiveFeedbacks();
                        },
                        function(response) {
                            console.log("Error: ", response);
                            console.error(response);
                        }
                    );
                }
            },
            createCookie(){
                document.cookie = "alreadyShownPopUp=true;"
            },
            collectAllTrainingsToGiveFeedbacks(){
                this.$http.get("api/trainingstogivefeedbacks/"+this.collaboratorIdentity.id).then(
                    function (response) {
                        console.log("success to get all trainings to give feedbacks");
                        this.allTrainingsToGiveFeedbacks = response.data;
                        this.allTrainingsToGiveFeedbacks.sort(function (a, b) {
                            return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                        });
                        if(this.allTrainingsToGiveFeedbacks.length == 0){
                            this.showModal = false;
                        }else if(!this.alreadyShownPopUp){
                            this.showModal = true;
                        }
                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                );
            },
        }
    }
);

Vue.component('accordion', VueStrap.accordion);
Vue.component('panel', VueStrap.panel);
Vue.component('alert', VueStrap.alert);



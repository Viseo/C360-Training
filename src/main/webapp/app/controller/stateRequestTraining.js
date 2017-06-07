/**
 * Created by NBE3663 on 02/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);
Date.prototype.getMonthName = function() {
    var monthNames = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return monthNames[this.getMonth()];
};

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
                score:'',
                comment:'',
                feedback:{
                    score:'',
                    comment:'',
                    training:''
                },
                allTrainingsToGiveFeedbacks:[],
                showRatingTrainingsPopup:false,
                openPanel: false
            }
        },
        template: `
        <div class="container-fluid">
             <div class="row">
                    <div class="col-lg-7 col-md-7 col-sm-7 text-center" 
                         style="width:200px">
                            <legend> Mes formations </legend>
                    </div>
             </div>
             <div class="row">
                   <div class="panel panel-default" 
                        style="margin-left:10px; margin-bottom:10px; ">
                         <div class="panel-body" 
                              style="padding:5px; 
                                     height:202px">
                                <div class="row">
                                       <div v-show="!noSessionForCollaborator" 
                                            class="col-lg-12" 
                                            style="margin-bottom:30px">
                                             <img src="css/up.png" 
                                                  id="scroll-up-3" 
                                                  width="60" 
                                                  height="20" 
                                                  style="position: absolute; 
                                                         left:50%; 
                                                         z-index:1;">
                                       </div>
                                </div>
                                <div id="scrollMyTrainings">
                                       <div class="col-sm-12 col-md-11 col-lg-11" 
                                            style="line-height:2em; 
                                                   font-size:1em">
                                              <div v-show="noSessionForCollaborator">
                                                   <p style="text-align: center; 
                                                             margin:50px;">
                                                             Vous n'êtes inscrit à aucune session.
                                                   </p>
                                              </div>
                                              <div v-for="training in requestedTrainingByCollaborator" >
                                                    <strong> {{training.title}}</strong>
                                                         <div v-for="session in training.sessionsValidated">
                                                              {{getDate(session.beginning)}} - {{getDate(session.ending)}} - {{session.location}}
                                                              <span class="glyphicon glyphicon-ok-circle alignIcon" 
                                                                      style="color: green"></span>
                                                         </div>
                                                         <div v-for="session in training.sessionsPending">
                                                              {{getDate(session.beginning)}} - {{getDate(session.ending)}} - {{session.location}}
                                                                <span class="glyphicon glyphicon-time alignIcon">
                                                                </span>
                                                         </div>
                                                         <hr style="margin:4.5px"/>
                                              </div>
                                       </div>
                                </div>
                                <div v-show="!noSessionForCollaborator" 
                                     class="col-lg-12" 
                                     style="margin-top:10px">
                                       <img src="css/down.png" 
                                            id="scroll-down-3" 
                                            width="60" 
                                            height="20" 
                                            style="position: relative; 
                                                   bottom:10px; 
                                                   left:50%; 
                                                   z-index:1;">
                                </div>
                         </div>
                   </div>
             </div>
             <div v-show = "showRatingTrainingsPopup" 
                  style="position: fixed;
                         z-index: 9998;
                         top: 0;
                         left: 0;
                         width: 100%;
                         height: 100%;
                         background-color: rgba(0, 0, 0, .5);
                         display: table;
                         transition: opacity .3s ease;">
                 <alert type="info" 
                        placement="top" 
                        width="40%" 
                        style="top:25%;
                               background-color:white;">
                     <center>
                        <h2 style="color:rgba(66, 139, 202,0.8);">Notez vos formations!</h2>
                     </center> 
                     <span style="top:-60px;left:98%" 
                           class="glyphicon glyphicon-remove-sign color-red" 
                           @click="showRatingTrainingsPopup = false;createShowPopUpOnceCookie();">
                     </span>
                     <br><br>
                     <accordion id="accordionId" 
                                :one-at-atime="true" 
                                type="info" 
                                style="height:100%">
                            <div v-for="training in allTrainingsToGiveFeedbacks">
                                  <panel :is-open="openPanel" 
                                         type="default" >
                                        <p slot="header" 
                                           style="color:black;">
                                           {{training.trainingTitle}}
                                        </p>
                                             <div class="container">
                                                    <div class="row">
                                                         <div class="col-sm-4 col-md-4 col-lg-4 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
                                                               <div class="stars " >
                                                                    <input class="star star-5" 
                                                                           id="star-5" 
                                                                           type="radio" 
                                                                           name="star" 
                                                                           @click="setScore(5)"/>
                                                                        <label class="star star-5" 
                                                                           for="star-5" 
                                                                           @click="setScore(5)">
                                                                        </label>
                                                                    <input class="star star-4" 
                                                                           id="star-4" 
                                                                           type="radio" 
                                                                           name="star" 
                                                                           @click="setScore(4)"/>
                                                                        <label class="star star-4" 
                                                                               for="star-4" 
                                                                               @click="setScore(4)">
                                                                        </label>
                                                                    <input class="star star-3" 
                                                                           id="star-3" 
                                                                           type="radio" 
                                                                           name="star" 
                                                                           @click="setScore(3)"/>
                                                                        <label class="star star-3" 
                                                                               for="star-3" 
                                                                               @click="setScore(3)">
                                                                        </label>
                                                                    <input class="star star-2" 
                                                                           id="star-2" 
                                                                           type="radio" 
                                                                           name="star" 
                                                                           @click="setScore(2)"/>
                                                                        <label class="star star-2" 
                                                                               for="star-2" 
                                                                               @click="setScore(2)">
                                                                        </label>
                                                                    <input class="star star-1" 
                                                                           id="star-1" 
                                                                           type="radio" 
                                                                           name="star" 
                                                                           @click="setScore(1)"/>
                                                                        <label class="star star-1" 
                                                                               for="star-1" 
                                                                               @click="setScore(1)">
                                                                        </label>
                                                               </div>
                                                         </div>
                                                    </div>
                                                    <div class="row">
                                                        <center>
                                                         <div class="col-sm-2 col-md-2 col-lg-2 col-sm-offset-1 col-md-offset-1 col-lg-offset-1">
                                                                    <input type="text"
                                                                           class="form-control" 
                                                                           placeholder="Commentaire" 
                                                                           v-model="comment"
                                                                            maxlength="500">
                                                         </div>
                                                         <div class="col-sm-1 col-md-1 col-lg-1">
                                                                     <button type="button" 
                                                                             class="btn btn-default" 
                                                                             @click="addFeedback(training);createShowPopUpOnceCookie();">
                                                                             Enregistrer
                                                                     </button>
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
        this.initializeInformationsFromCookie();
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

            initializeInformationsFromCookie(){
                let isPopUpAlreadyShownDuringFirstConnection = this.getCookie("alreadyShownPopUp");
                this.alreadyShownPopUp= isPopUpAlreadyShownDuringFirstConnection;
                let collaboratorInfo = this.getCollaboratorInfoFromCookie();
                let isCollaboratorInfoNotEmpty = collaboratorInfo != "";
                if(isCollaboratorInfoNotEmpty){
                    this.collaboratorIdentity.id = collaboratorInfo.id;
                    this.collaboratorIdentity.lastName = collaboratorInfo.lastName;
                    this.collaboratorIdentity.firstName = collaboratorInfo.firstName;
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
                this.requestedTrainingByCollaborator.splice(0, this.requestedTrainingByCollaborator.length);
                let fetchTrainingSessionsSuccess = (response) => {
                    if (response) {
                        this.requestedTraining = response.data;
                        for (let i = 0; i < Object.keys(this.requestedTraining).length; i++) {
                            if (Object.values(this.requestedTraining)[i].requestTrainingList.length != 0 || Object.values(this.requestedTraining)[i].trainingSessions.length != 0) {
                                this.requestedTrainingByCollaborator.push({
                                title: Object.keys(this.requestedTraining)[i],
                                sessionsPending: Object.values(this.requestedTraining)[i].requestTrainingList,
                                sessionsValidated: Object.values(this.requestedTraining)[i].trainingSessions
                            });
                                this.noSessionForCollaborator = false;
                            }
                        }
                        console.log(this.requestedTrainingByCollaborator);
                        this.orderSessions();
                    }
                };

                let fetchTrainingSessionsError = (response) => {
                    if (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                };

                this.get("api/sessions/" + this.collaboratorIdentity.id + "/requestedSessions", fetchTrainingSessionsSuccess, fetchTrainingSessionsError);
            },

            addFeedback(training){
                let isCollaboratorHasAddedAScore = this.score != '';
                if (isCollaboratorHasAddedAScore) {
                    this.feedback.training = training;
                    this.feedback.score = this.score;
                    this.feedback.comment = this.comment;
                    let addFeedbackSuccess = (response) => {
                        if (response) {
                            console.log("success to add a feedback");
                            this.collectAllTrainingsToGiveFeedbacks();
                        }
                    };
                    this.post("api/feedback/" + this.collaboratorIdentity.id, this.feedback, addFeedbackSuccess);
                    this.comment = '';
                    this.score = '';
                }
            },

            createShowPopUpOnceCookie(){
                document.cookie = "alreadyShownPopUp=true;"
            },

            collectAllTrainingsToGiveFeedbacks(){
                let collectAllTrainingsToGiveFeedbacksSuccess = (response) => {
                    if (response) {
                        console.log("success to get all trainings to give feedbacks");
                        this.allTrainingsToGiveFeedbacks = response.data;
                        this.allTrainingsToGiveFeedbacks.sort(function (a, b) {
                            return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                        });
                        let isThereTrainingsToGiveFeedbacks = this.allTrainingsToGiveFeedbacks.length != 0;
                        if (isThereTrainingsToGiveFeedbacks && !this.alreadyShownPopUp) {
                            this.showRatingTrainingsPopup = true;
                        } else {
                            this.showRatingTrainingsPopup = false;
                        }
                    }
                };

                let collectAllTrainingsToGiveFeedbacksError = (response) => {
                    if (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                };
                this.get("api/trainingstogivefeedbacks/" + this.collaboratorIdentity.id, collectAllTrainingsToGiveFeedbacksSuccess, collectAllTrainingsToGiveFeedbacksError);

            },
        }
    }
);
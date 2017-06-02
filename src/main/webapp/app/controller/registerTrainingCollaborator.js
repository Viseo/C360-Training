/**
 * Created by CLH3623 on 10/04/2017.
 */
let CollaboratorFormation = Vue.component('collaborator-formation', {
    data: function () {
        return {
            isSearchValid: true,
            searchNotValidErrorMessage: "Veuillez entrer un nom de formation valide",
            sessionAlreadybooked:[],
            trainingsFound: [],
            numberOfSessionsToDisable:0,
            disableSendButton:false,
            sessionAlreadyBookedMessage:false,
            noTrainingFound: false,
            sessionsByCollab:[],
            allTrainings: [],
            addingRequestSucceeded: false,
            noSessionsSelectedError: false,
            checkedSessions: [],
            selected: '',
            check: false,
            idTraining: '3',
            listTrainingSessions: [],
            collaboratorIdentity: {
                id: '',
                lastName: '',
                firstName: ''
            },
            requestToRegister: {
                trainingDescription: {},
                collaboratorIdentity: {},
                trainingSessionsDescriptions: []
            },
            allTrainingTitles: [],
            value: '',
            selectedTraining: '',
            trainingrequested:false,
            trainingSelected: {},
            emptyTraining: false,
            emptyTrainingErrorMessage: "Veuillez sélectionner une formation",
            listTrainingSession: [],
            isNoSession: true,
            displayTrainings: false,
            openPanel: false,
            state: training_store.state,
            test:false,
            feedbackComments: [],
            collaboratorLike: false,
            allFeedbacks: [],
            showComment: false,
        }
    },

    template: `<div class="container-fluid">
    <div class="row">
        <!--<div class="col-md-12 col-lg-8 col-sm-8"></div>-->
        <div class="row">
            <div class="col-lg-8 col-md-8 text-center">
                <legend>Demande de formation</legend>
            </div>
        </div>
        <div class="row">
            <div id="trainingContainer">
                <div class="row" id="upperContainer" style="margin-bottom: 15px; ">
                    <div class="col-lg-4 col-md-4 col-sm-12">
                        <select required class="form-control" v-model="selectedTraining">
                            <option value="" disabled hidden>Formations disponibles</option>
                            <option v-for="training in allTrainings" :value="training.id">{{training.trainingTitle}}</option>
                        </select>
                    </div>
                    <div class="col-lg-2 col-md-2 col-sm-12">
                        <input ref="btnValidateSearch" @click="displayTrainingsFn(selectedTraining)" type="submit"
                               class="btn btn-primary" value="Valider"/>
                    </div>
                    <div @keyup.enter="storeTrainingsFound(capitalizeSearch)"
                         class="col-lg-4 col-lg-offset-2 col-md-offset-2 col-md-4 col-sm-12 searchField">
                        <span ref="btnLoadTrainings" class="glyphicon glyphicon-search"
                              @click="storeTrainingsFound(capitalizeSearch)"></span>
                        <typeahead v-model="value" v-bind:data="allTrainingTitles"
                                   placeholder="Entrer une formation"></typeahead>
                        <div v-show="!isSearchValid" class="errorMessage col-sm-12">{{ searchNotValidErrorMessage }}</div>
                        <div class="col-sm-12" v-show="noTrainingFound" style="margin-top:10px;"> Aucun résultat
                            trouvé
                        </div>
                    </div>
                </div>
                <div class="row">
                    <p id="trainingErrorMessage" class="color-red col-lg-4 col-md-4 col-sm-12" v-show="emptyTraining">
                        {{emptyTrainingErrorMessage}}</p>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-sm-12 sol-md-12" style="margin-bottom:30px">
                        <img v-show="showChevrons" src="css/up.png" id="scroll-up-2" width="60" height="20"
                             style="position: absolute; left:50%; z-index:1;">
                    </div>
                </div>
                <div id="scroll" class="col-lg-12 col-md-12 col-sm-12" v-show="displayTrainings">
                    <accordion id="accordionId" :one-at-atime="true" type="info">
                        <div v-for="training in trainingsFound">
                            <panel :is-open="openPanel" ref="selectingTraining" @openPanel="reinitialize(training)"
                                   type="default">
                                <span slot="header"
                                      style="color: rgba(66, 139, 202,0.8); text-align: none !important;">
                                    <span>{{training.trainingTitle}}</span>
                                </span>
                                <div v-show="!showComment">
                                    <span v-if="commentsExist(training.id)" v-show="!showComment"
                                          style="cursor:pointer; float:right; margin-right:10px;" @click="showComments()">
                                        <i class="glyphicon glyphicon-list"></i> Commentaires
                                    </span>
                                    <h4 v-show="!isNoSession" class="col-lg-8"><u>Sessions disponibles</u></h4>
                                    <div v-show="!isNoSession" class="col-lg-4">
                                        <input type="checkbox" @click="disabling(training.id)">Indifférent
                                    </div>
                                    <div :id="training.id">
                                        <div class="col-lg-12" v-for="i in listTrainingSession">
                                            <div v-if="i.trainingDescription.id == training.id">
                                                <input :id="i.id" type="checkbox" v-model="checkedSessions" :value="i">
                                                <span>{{i.beginning}} - {{i.ending}} - {{i.location}} </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12">
                                        <center>
                                            <p style="color:#B22222" v-show="noSessionsSelectedError"> Vous n'avez
                                                sélectionné aucune session </p>
                                            <p style="color:blue" v-show="isNoSession && !trainingrequested"> Aucune
                                                session n'est prévue, vous pouvez néanmoins envoyer une demande</p>
                                            <button :disabled="disableSendButton"
                                                    v-show="!trainingrequested || !isNoSession " ref="btnSendRequest"
                                                    class="btn btn-primary" value="Envoyer une demande"
                                                    @click="verifyTrainingSessionCollaborator">Envoyer une demande
                                            </button>
                                            <p style="color:green" v-show="addingRequestSucceeded"> Demande envoyée avec
                                                succès </p>
                                            <p style="color:orange" v-show="isNoSession && trainingrequested"> Vous avez
                                                déjà effectué une demande pour cette formation </p>
                                        </center>
                                    </div>
                                </div>
                                <div>
                                    <span v-if="commentsExist(training.id)" v-show="showComment"
                                          style="cursor:pointer; float:right; margin-right:15px; color:red;"
                                          @click="hideComments">
                                        <i class="glyphicon glyphicon-remove"></i>
                                    </span>
                                    <br>
                                    <div id="feedback-collab" v-if="feedback.training.id == training.id"
                                         v-show="showComment" class="row" v-for="feedback in allFeedbacks">
                                        <div class="col-lg-12">
                                            <img class="profile-picture" v-if="feedback.collaborator.defaultPicture"
                                                 src="img/profile.jpg">
                                            <img class="profile-picture" v-else
                                                 :src="'img/'+feedback.collaborator.id+'.jpg'">
                                            <div style="padding-top:15px;">
                                                <span>{{feedback.collaborator.firstName}} {{feedback.collaborator.lastName}} </span>
                                                <span class="date-on-right">
                                                    <i class="glyphicon glyphicon-time"></i> {{getDate(feedback.date)}}
                                                </span>
                                                <hr>
                                                <p>{{feedback.comment}}</p>
                                                <div style="float:right">
                                                    <span>{{feedback.likers.length}}</span>
                                                    <span v-if="collaboratorLikesFeedback(feedback)"
                                                          class="glyphicon glyphicon-heart"
                                                          @click="removeLiker(feedback, collaboratorIdentity.id)"></span>
                                                    <span v-else class="glyphicon glyphicon-heart-empty"
                                                          @click="addLiker(feedback, collaboratorIdentity.id)"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </panel>
                        </div>
                    </accordion>
                </div>
                <div class="row">
                    <div class="col-lg-12" style="margin-top:10px">
                        <img v-show="showChevrons" src="css/down.png" id="scroll-down-2" width="60" height="20"
                             style="position: relative; left:50%; z-index:1;">
                    </div>
                </div>
                <center v-show="showChevrons">
                    <p style="margin:10px;">
                        <span class="glyphicon glyphicon-info-sign" style="margin-right:5px;"></span>
                        Toutes les formations démarrent à 9h00
                    </p>
                </center>
            </div>
        </div>
    </div>
</div>`,

    mounted: function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.gatherTrainingsFromDatabase(this.storeTrainingsFound);
        this.initializeInformationsFromCookie();
        this.activateScrollUp('#scroll-up-2','#scroll');
        this.activeScrollDown('#scroll-down-2','#scroll');
        this.activateScrollWheel('#scroll');
        this.getAllFeedbacks();
    },

    watch: {
      value: function() {
          this.verifySearch(this.value);
      }
    },

    computed: {
        capitalizeSearch: function () {
            if(this.value) {return this.value.toUpperCase();
            }
                else return null;
        },

        showChevrons(){
            let numberOfTrainings = this.trainingsFound.length;
            return numberOfTrainings;
        }
    },

    methods: {
        disablingSessions(){
            this.disableSendButton = false;
            this.trainingalreadyrequested(this.trainingSelected.id);
            this.numberOfSessionsToDisable = 0;
            if(this.listTrainingSessionSelected != null && this.sessionsByCollab != null && this.listTrainingSession.length == this.sessionsByCollab.length){
                this.test = true;
            }
            for(i in this.sessionsByCollab){
                temp = document.getElementById(this.sessionsByCollab[i].id);
                if(temp!=null) {
                    temp.disabled =true;
                    temp.checked = false;
                    this.sessionAlreadyBookedMessage = true;
                    temp.nextElementSibling.innerHTML="";
                    $("#"+this.sessionsByCollab[i].id).after('<span class="alwaysshowme">' + this.sessionsByCollab[i].beginning + ' ' +this.sessionsByCollab[i].ending + ' ' + this.sessionsByCollab[i].location + '<span class="showmeonhover" style="background-color: #b8b8b8;margin-left: 10px"> Une demande est déjà en cours pour cette session </span></span>');
                }
            }
            for(i in this.sessionsByCollab){
                for(j in this.listTrainingSession){
                    if(i==j)
                        this.numberOfSessionsToDisable++;
                }
            }
            if(this.numberOfSessionsToDisable == this.listTrainingSession.length && this.listTrainingSession.length != 0)
                this.disableSendButton = true;
            if(this.isNoSession && this.trainingrequested)
                this.disableSendButton = true;
        },

        reinitialize(training){
            this.showComment = false;
            this.disableSendButton = false;
            this.trainingalreadyrequested(training.id);
            this.checkedSessions.splice(0, this.checkedSessions.length);
            this.storeTrainingSessions(training.id);
            this.trainingSelected = training;
            this.storeSessionsByCollab(training.id);
            this.check = false;
            this.addingRequestSucceeded = false;
            this.noSessionsSelectedError = false;
            this.sessionAlreadybooked.splice(0, this.sessionAlreadybooked.length);
        },

        disabling(id){
            this.check = !this.check;
            let isindifferentChecked = this.check;
            let nodes;
            let getHTMLSessionInsideTraining = () => {
                let idTrainingWithSession = document.getElementById(id);
                if (idTrainingWithSession != null){
                    nodes= document.getElementById(id).getElementsByTagName("*");
                }
            };

            let getSessionAlreadyBooked = () => {
                this.$http.get("api/formations/" + id + "/sessions").then(
                    function (response) {
                        this.checkedSessions.splice(0, this.checkedSessions.length);
                        this.checkedSessions = response.data;
                        if (this.checkedSessions.length === 0) {
                            this.isNoSession = true;
                        }
                        else {
                            this.isNoSession = false;
                        }
                    });
            };

            let disableSessions = () => {
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].disabled = true;
                }
            };

            let enableSessions = () => {
                this.checkedSessions.splice(0, this.checkedSessions.length)
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].disabled = false;
                }
            };
            getHTMLSessionInsideTraining();
            if (isindifferentChecked == true) {
                getSessionAlreadyBooked();
                disableSessions();
                this.disablingSessions();
            }
            else {
                enableSessions();
                this.disablingSessions();
            }
        },

        displayTrainingsFn(selectedTraining){
            this.selectedTraining = selectedTraining;
            this.emptyTraining = this.selectedTraining ? false : true;
            if (!this.emptyTraining) {
                let selectedTraining = this.selectedTraining;
                this.$http.get("api/formations/" + this.selectedTraining + "/sessions").then(
                    function (response) {
                        this.listTrainingSession = response.data;
                        this.trainingsFound.splice(0, this.trainingsFound.length);
                        for (key in this.allTrainings) {
                            if (this.allTrainings[key].id == selectedTraining) {
                                this.trainingsFound.push(this.allTrainings[key]);
                            }
                        }
                        if (this.listTrainingSession.length === 0) {
                            this.displayTrainings = true;
                            this.isNoSession = true;
                        }
                        else {
                            this.displayTrainings = true;
                            this.isNoSession = false;
                        }
                    },
                function(error) {
                        console.log(error);
                });
            }
        },

        gatherTrainingsFromDatabase(storeTraining){
            this.$http.get("api/formations").then(
                function (response) {
                    this.allTrainings = response.data;
                    this.allTrainings.sort(function (a, b) {
                        return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                    });
                    this.selectTrainingTitles();
                    storeTraining("");
                    this.test = false;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },

        initializeInformationsFromCookie(){
            let collaboratorInfo = this.getCollaboratorInfoFromCookie();
            let isCollaboratorInfoNotEmpty = collaboratorInfo!="";
            if(isCollaboratorInfoNotEmpty){
                this.collaboratorIdentity.id = collaboratorInfo.id;
                this.collaboratorIdentity.lastName = collaboratorInfo.lastName;
                this.collaboratorIdentity.firstName = collaboratorInfo.firstName;
            }
        },

        verifyTrainingSessionCollaborator(){
            this.addingRequestSucceeded = false;
            this.noSessionsSelectedError = false;
            if (this.isNoSession == true || this.checkedSessions.length != 0) {
                this.requestToRegister.trainingDescription = this.trainingSelected;
                this.requestToRegister.collaboratorIdentity = this.collaboratorIdentity;
                this.requestToRegister.trainingSessionsDescriptions = this.checkedSessions;
                this.requestToRegister = JSON.parse(JSON.stringify(this.requestToRegister));
                this.SaveTrainingSessionCollaborator();
                console.log(this);
                if(this.$parent.$children[3]){
                    let trainingToComeComponent = this.$parent.$children[3];
                    trainingToComeComponent.gatherTrainingsAlreadyHaveSessionsFromDatabase();
                }
            } else {
                this.noSessionsSelectedError = true;
            }
            this.storeSessionsByCollab(this.trainingSelected.id);
            this.checkedSessions = [];
        },

        SaveTrainingSessionCollaborator(){
            let stateRequestTrainingComponent = this.$parent.$children[2];

            let addRequestSuccess = (response) => {
                this.addingRequestSucceeded = true;
                stateRequestTrainingComponent.fetchTrainingsSessions();
                this.storeSessionsByCollab(this.trainingSelected.id);
            };

            this.post("api/requests", this.requestToRegister, addRequestSuccess);
        },

        selectTrainingTitles(){
            for (index in this.allTrainings) {
                this.allTrainingTitles.push(this.allTrainings[index].trainingTitle)
            }
        },

        storeTrainingsFound(trainingTitle){
            this.trainingsFound.splice(0, this.trainingsFound.length);
            this.displayTrainings = true;
            this.$http.get("api/formations").then(function(response) {
                for (index in this.allTrainings) {
                    if (this.allTrainings[index].trainingTitle.indexOf(trainingTitle) != -1) {
                        this.trainingsFound.push(this.allTrainings[index]);
                    }
                }
                this.noTrainingFound = (this.trainingsFound.length == 0) ? true : false;
                if (this.trainingsFound.length != 1)
                    this.openPanel = false;
                this.value = null;
            });
        },

        storeSessionsByCollab(id){
            this.$http.get("api/formations/"+id+"/alreadyrequestedsession/"+ this.collaboratorIdentity.id).then(
                function (response){
                    this.sessionsByCollab = response.data;
                    this.disablingSessions();
                }
            )
        },

        storeTrainingSessions(id){
            this.$http.get("api/formations/" + id + "/sessions").then(
                function (response) {
                    this.listTrainingSession = response.data;
                    if (this.listTrainingSession.length === 0) {
                        this.displayTrainings = true;
                        this.isNoSession = true;
                    }
                    else {
                        this.displayTrainings = true;
                        this.isNoSession = false;
                    }
                });
        },

        trainingalreadyrequested(training_id){
            this.$http.get("api/listrequests/" + training_id + "/" + this.collaboratorIdentity.id).then(
                function (response) {
                    this.trainingrequested = false;
                    if (response.data.length != 0) {
                        this.trainingrequested = true;
                     }
                });
        },

        verifySearch(search) {
          if  (/^[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+# ]*$/.test(search))  {
              this.isSearchValid = true;
              $("#trainingContainer div div div").removeClass("has-error");

          } else {
                this.isSearchValid = false;
              $("#trainingContainer div div div").addClass("has-error");

          }
        },

        getFeedbackCommentByTraining(training_id){
            this.$http.get("api/feedbackcomment/"+ training_id).then(
                function (response) {
                    console.log("success to get all feedback comments of the same training");
                    this.feedbackComments = response.data;
                    this.orderFeedbacks();
                    console.log(this.feedbackComments);
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },

        addLiker(feedbackToAdd,collaborator_id){
            this.$http.put("api/addfeedbacklikes/"+collaborator_id,feedbackToAdd).then(
                function (response) {
                    console.log("success to add liker");
                    this.getAllFeedbacks();

                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },

        removeLiker(feedbackToRemove,collaborator_id){
            this.$http.put("api/removefeedbacklikes/"+collaborator_id,feedbackToRemove).then(
                function (response) {
                    console.log("success to remove liker");
                    this.getAllFeedbacks();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );

        },

        collaboratorLikesFeedback(feedback) {
          for(let i in feedback.likers) {
              if(feedback.likers[i].id == this.collaboratorIdentity.id) {
                  return true;
              }
          }
          return false;
        },

        getDate(date){
            let dateToConvert = new Date(date);
            let addZero = "";
            if((dateToConvert.getMonth()+1)<10) addZero="0";
            formattedDate = dateToConvert.getDate()+"/"+addZero+(dateToConvert.getMonth()+1)+ "/" + dateToConvert.getFullYear()+ " à " + dateToConvert.getHours()+ "h"+ dateToConvert.getMinutes();
            return formattedDate;
        },

        getAllFeedbacks(){
            this.$http.get("api/feedbacks").then(
                function (response) {
                    console.log("success to get all feedbacks");
                    this.allFeedbacks = response.data;
                    this.orderFeedbacks();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },

        commentsExist(trainingId){
          for(let i in this.allFeedbacks){
              if(this.allFeedbacks[i].training.id == trainingId){
                  if(this.allFeedbacks[i].comment!=null){
                      return true;
                  }
              }
          }
          return false;
        },

        showComments(){
            this.showComment= true;
        },

        hideComments(){
            this.showComment= false;
        },
        orderFeedbacks(){
            this.allFeedbacks.sort(function(a, b) {
                    return parseFloat(a.date) - parseFloat(b.date);
            });
        },

    }
});


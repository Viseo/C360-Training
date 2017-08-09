/**
 * Created by NBE3663 on 23/05/2017.
 */
let trainingRanking = Vue.component('training-ranking', {
        props: [],
        data: function() {
            return {
                allTrainingScore: [],
                //US13
                collaborator_id:'1',
                feedbackComments:[],
                feedbackCommentToDelete:{},
                allFeedbacks: [],
                openPanel: false,
                showComment: false,
                showChevrons: false
            }
        },
        template: `
        <div>
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-12">
                        <div class="row" >
                            <div id="trainingRanking" class="col-lg-12 col-md-12 text-center">
                                <legend> <router-link :to="{path: '/addTrainingTopic'}">
                                                <img src="img/other_icon/left-arrow.png"
                                                width="30"
                                                height="30"
                                                style="cursor: pointer; position: relative; right: 13em;">
                                        </router-link>Classement des formations</legend>
                            </div>
                        </div>
                    <div class="row">
                         <div id="rankingTraining" class="trainingBlock">
                              <div class="row">
                                    
                                    <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                            <br/>
                                            <img 
                                            v-show="showChevrons"
                                             src="img/chevrons/up.png"
                                             id="scroll-up-4"
                                             width="60"
                                             height="20"
                                             style="position: absolute; 
                                             left:50%; 
                                             z-index:1;">
                                    </div>
                              </div>
                              <div id="scrollRanking"
                                            style="width: 100%; 
                                            overflow-y:hidden; 
                                            overflow-x:hidden;">
                                            <accordion id="accordionIdAdmin" 
                                                       :one-at-atime="true" 
                                                       type="info" 
                                                       style="height:100%;">
                                                    <div class="row">
                                                        <p  class="col-xs-12 col-sm-12 col-md-12 col-lg-12 " v-show="allTrainingScore.length===0" style="text-align: center;">Aucune formation n'a été notée.</p>
                                                         <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"  v-for="training in allTrainingScore" @click="getFeedbackCommentByTraining(training[0].id)">
                                                         <panel :is-open="openPanel"
                                                                    type="default">
                                                                    <p slot="header" 
                                                                     style="color:#337ab7;padding-bottom: 10px;">
                                                                        <span class="col-sx-3 col-sm-3 col-md-3 col-lg-3" >
                                                                             {{training[0].trainingTitle}}
                                                                        </span>
                                                                        <span class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
                                                                            <span v-for="i in training[1]">
                                                                                <span class="glyphicon glyphicon-star fullStar">
                                                                                </span>
                                                                            </span>
                                                                            <span v-for="i in (5-training[1])">
                                                                                <span class="glyphicon glyphicon-star-empty emptyStar">
                                                                                </span>
                                                                            </span>
                                                                        </span>
                                                                            <span class="col-xs-4 col-sm-4 col-md-4 col-lg-4" > 
                                                                            <i class="glyphicon glyphicon-list"></i> Commentaires
                                                                        </span>
                                                                    </p>
                                                                     <div class="container-fluid">
                                                                        <div class="row" style="font-weight: 600;">
                                                                            <center><span> {{feedbackComments.length}} commentaires</span></center>
                                                                        </div>
                                                                        <br>
                                                                        <div class="row" v-for="comments in feedbackComments">
                                                                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
                                                                                <div class="col-xs-3 col-sm-2 col-md-2 col-lg-2">
                                                                                    <img class="profile-picture" v-if="comments.collaborator.defaultPicture"
                                                                                    src="img/profile.jpg"
                                                                                    style="width:60px; height:60px">
                                                                                    <img class="profile-picture" v-else
                                                                                    :src="'img/'+comments.collaborator.id+'.jpg'"
                                                                                    style="-webkit-border-radius:50px;
                                                                                    -moz-border-radius:50px;
                                                                                    border-radius:50px;
                                                                                    width:60px;
                                                                                    height:60px;">
                                                                                </div>
                                                                                <br>
                                                                                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><strong>{{comments.collaborator.firstName}} {{comments.collaborator.lastName}}<strong> </div>
                                                                                <div class="date-on-right col-xs-4 col-sm-4 col-md-4 col-lg-4 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                                                                    <i class="glyphicon glyphicon-time"></i> <strong>{{getDate(comments.date)}}</strong>
                                                                                </div>
                                                                                <br><br>
                                                                                <br>
                                                                                <div class="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                                                                                <p >{{comments.comment}}</p>
                                                                                </div >
                                                                                <a class="col-sm-offset-12 col-md-offset-7 col-lg-offset-7" @click="deleteFeedbackComment(comments)" style="cursor: pointer"> Supprimer le commentaire </a> 
                                                                                 <hr>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                         </panel>
                                                         </div>
                                                    </div>
                                            </accordion>
                                       <br>
                              </div>
                                     
                             <div class="row">
                                  <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">
                                       <img v-show="showChevrons"
                                       src="img/chevrons/down.png"
                                       id="scroll-down-4"
                                       width="60" height="20"
                                       style="position: absolute; 
                                       left:50%; top:95%; 
                                       z-index:1;">
                                  </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
        
`,
        mounted: function () {
            Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
            this.getTrainingsScore();
            this.deleteFeedbackComment();
            this.activateScrollUp('#scroll-up-4','#scrollRanking');
            this.activeScrollDown('#scroll-down-4','#scrollRanking');
            this.activateScrollWheel('#scrollRanking');
        },

        methods: {
            getTrainingsScore(){
                this.$http.get("api/trainingscore").then(
                    function (response) {
                        console.log("success to get all training score");
                        this.allTrainingScore = response.data;
                        this.orderRatings();
                        for (let index in this.allTrainingScore){
                            this.allTrainingScore[index][1]= Math.floor(this.allTrainingScore[index][1])
                        }

                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                ).then(function() {
                    this.showChevrons =  this.checkForChevrons('accordionIdAdmin')
                });
            },

            getFeedbackCommentByTraining(training_id){
                this.$http.get("api/feedbackcomment/" + training_id).then(
                    function (response) {
                        console.log("success to get all feedback comments of the same training");
                        this.feedbackComments = response.data;
                        this.orderFeedbacks();
                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                );
                let self = this;
                setTimeout(function () {
                    self.showChevrons = self.checkForChevrons('accordionIdAdmin')
                },1000);
            },

            deleteFeedbackComment(feedbackCommentToDelete){
                this.$http.put("api/deletefeedbackcomment",feedbackCommentToDelete).then(
                    function (response) {
                        console.log("success to delete feedback comment");
                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                );
            },

            getDate(date){
                let dateToConvert = new Date(date);
                let addZero = "";
                if((dateToConvert.getMonth()+1)<10) addZero="0";
                formattedDate = dateToConvert.getDate()+"/"+addZero+(dateToConvert.getMonth()+1)+ "/" + dateToConvert.getFullYear()+ " à " + dateToConvert.getHours()+ "h"+ dateToConvert.getMinutes();
                return formattedDate;
            },

            orderRatings(){
                this.allTrainingScore.sort(function(a,b) {
                    return (a[1] < b[1]) ? 1 : ((b[1] < a[1]) ? -1 : 0);
                })
            },

            orderFeedbacks(){
                this.feedbackComments.sort(function(a, b) {
                    return (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0);
                });
            },

            addLiker(feedbackToAdd,collaborator_id){
                this.$http.put("api/addfeedbacklikes/"+collaborator_id,feedbackToAdd).then(
                    function (response) {
                        console.log("success to add liker");
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
                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                );
            }
        }
    }
);
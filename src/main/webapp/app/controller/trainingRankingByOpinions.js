/**
 * Created by NBE3663 on 23/05/2017.
 */
let trainingRanking = Vue.component('training-ranking', {
        props: [],
        data: function() {
            return {
                allTrainingScore: []
            }
        },
        template: `
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-12">
                    <div class="row" >
                        <div class="col-lg-9 col-md-9 text-center">
                            <legend>Classement formations</legend>
                        </div>
                    </div>
                    <div class="row">
                        <div id="rankingTraining">
                            <div class="row">
                                <div class="col-sm-12 col-md-2 col-lg-2">
                                    <img src="css/left-arrow.png"
                                         width="40"
                                         height="40"
                                         @click="goTo('addTrainingTopic')"
                                         style="cursor: pointer;">
                                </div>
                                <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                    <br/>
                                    <img 
                                         src="css/up.png"
                                         id="scroll-up-3"
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
                                         <div v-for=" training in allTrainingScore">
                                         <span class="col-lg-8">{{training[0].trainingTitle}}</span>
                                         <span class="col-lg-4"><span v-for="i in training[1]"><span class="glyphicon glyphicon-star fullStar"></span></span>
                                         <span v-for="i in (5-training[1])"><span class="glyphicon glyphicon-star-empty emptyStar"></span></span>
                                         </span>
                                         <br>
                                         <hr/>
                                         </div>
                                      
                            </div>
                           
                            <div clas="row">
                                <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">
                                    <img 
                                         src="css/down.png"
                                         id="scroll-down-3"
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
            this.getTrainingsScore();
        },

        methods: {
            getTrainingsScore(){
                this.$http.get("api/trainingscore").then(
                    function (response) {
                        console.log("success to get all training score");
                        this.allTrainingScore = response.data;
                        for (let index in this.allTrainingScore){
                            this.allTrainingScore[index][1]= Math.floor(this.allTrainingScore[index][1])

                            console.log(this.allTrainingScore[index][1]);
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
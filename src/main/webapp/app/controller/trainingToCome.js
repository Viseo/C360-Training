/**
 * Created by SJO3662 on 02/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

let trainingToComeComponent = Vue.component('training-to-come', {
    template: `<div class="row" >
                        <div class="row">
                            <div style="margin-left:30px;" class="col-lg-7 col-md-7 text-center">
                                <legend>Formation à venir</legend>
                            </div>
                        </div>
                            <div style="margin-left:30px; height: 400px; width: 550px;border:1px solid #dcdcdc;border-radius: 10px;"> 
                                    <div class="col-lg-12" style="margin-bottom:30px">
                                        <img v-show="showChevrons" src="css/up.png" id="scroll-up-training-to-come" width="60" height="20" style="position: absolute; left:45%; margin-top:10px; z-index:1;">
                                    </div>
                                <div id="sessionsPanel" style=" height: 260px; overflow-y:hidden; overflow-x:hidden;" class="col-lg-12 col-md-12 col-sm-12" >
                                    <table  v-for = "n in allTrainingsAndSessions" style=" width: 100%;" >
                                        <tr >
                                            <td>                                                
                                                <div style="text-align: left"> <b>{{n[0].trainingDescription.trainingTitle}} </b></div>
                                            </td>
                                        </tr>
                                        <tr style="cursor:pointer;" @click="showTrainingAndSessionsSelected(n[0].trainingDescription)" v-for = "m in n" >
                                            <td  @mouseover="showInformationsMessage(m)" @mouseleave="hideInformationsMessage()" style="text-align: left;">
                                                    {{m.beginning}} - {{m.location}} 
                                            </td>
                                            <td @mouseover="showInformationsMessage(m)" @mouseleave="hideInformationsMessage()" style="text-align: right" :class="{ 'text-danger' : displayRedTextWhenOnly3SeatsAvailable(15 - m.collaborators.length), 'text-success' : !displayRedTextWhenOnly3SeatsAvailable(15 - m.collaborators.length)}">
                                                     {{ 15 - m.collaborators.length }} places disponibles
                                            </td>
                                            <div  v-show="verifyShowMessageOrNot(m)" class="sc-notification sc-info">
                                                <p><span class="glyphicon glyphicon-info-sign">&nbsp</span>{{ MouseOverMessage }}</p>
                                            </div>
                                        </tr>
                                        
                                        <tr><td colspan="2"><hr></td></tr>
                                    </table>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12" style="margin-top:10px">
                                        <img v-show="showChevrons" src="css/down.png" id="scroll-down-training-to-come" width="60" height="20" style="position: absolute; left:45%; margin-bottom: 20px; top:95%; z-index:1;">
                                    </div>
                                </div>
                                <br>
                                <div style="margin-top:20px; margin-left: 25px;">
                                    <table style="width: 530px;">
                                        <tr>
                                            <td> 
                                                <!--<br v-show="!showWish"/><br v-show="!showWish"/>-->
                                                <p>
                                                    <span @click="changePage()" style="position:absolute; left:7%; color: #0f0f0f;cursor: pointer"><span class="glyphicon glyphicon-eye-open"></span> Voir la liste des souhaits </span>
                                                </p>
                                            </td>  
                                            <td>
                                              <p>
                                                 <input-text 
                                                    v-show="!showWish"
                                                    :value = "wish" 
                                                    style ="width:310px;position:absolute; left:40%; top:80%;"
                                                    @input = "updateV1"
                                                    placeholder = "Ex : javascript (50 caractères maximum)"
                                                    maxlength = "50"
                                                    icon = "glyphicon glyphicon-floppy-disk"
                                                    type = 'input'
                                                    @click="sendWish">
                                                 </input-text>
                                                 <span v-show="showWish" @click="showWish = !showWish" style="position:absolute; left:65%; color: #0f0f0f;cursor: pointer"><span class="glyphicon glyphicon-pencil"></span>Suggérer une formation</span>
                                              </p>
                                            </td>                         
                                        </tr>
                                        <tr>
                                            <td colspan="2">
                                                <br>
                                                <center><span v-show="wishSuccess" class="text-center color-green">Le souhait a bien été transmis</span></center>
                                                <center><span v-show="wishAlreadyExisted" class="text-center color-red">Le souhait a déjà été émis.</span></center>
                                            </td>
                                         </tr>
                                    </table>
                                    
                                </div>
                            </div>
                        </div>
            </div>
            `,

    data: function () {
        return {
            showWish:true,
            wish:'',
            collaborator_id:'',
            allTrainingsAlreadyHaveSessions:[],
            trainingSessions:[],
            collaboratorsRequesting:[],
            numberOfAvailablePlaces:undefined,
            existCollaboratorRequest:false,
            trainingAndSessions:[],
            allTrainingsAndSessions:[],
            allCollaboratorsAlreadyInSessions:[],
            wishToRegister:{},
            wishAlreadyExisted:false,
            wishSuccess:false,
            showMouseOverMessage: false,
            MouseOverMessage: "Désolé! Vous avez déja effectuer une demande",
            trainingSessionIdMouseOver: '',
            changePageToVote:false
        }
    },

    computed: {
        showChevrons(){
            return true;
        }
    },

    mounted:function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.getIdCollaboratorWithTokenCookies();
        this.gatherTrainingsAlreadyHaveSessionsFromDatabase();
        this.activateScrollUp('#scroll-up-training-to-come','#sessionsPanel');
        this.activeScrollDown('#scroll-down-training-to-come','#sessionsPanel');
    },
    methods: {
        updateV1 (v) {
            this.wish = v;
        },

        changePage(){
            this.$router.push('/WishToVote')
        },

        sendWish(){
            this.wishToRegister.label = this.wish;
            this.$http.post("api/wish/"+this.collaborator_id,this.wishToRegister).then(
                function (response) {
                    console.log("success to send a wish");
                    this.wishAlreadyExisted=false;
                    this.wishSuccess = true;
                    setTimeout(function(){ this.wishSuccess=false; this.showWish = !this.showWish; }.bind(this), 2000);
                },
                function (response) {
                    this.wishAlreadyExisted=true;
                    this.showWish = !this.showWish;
                    console.log("Error: ", response);
                    console.error(response);
                }
            );

        },

        getIdCollaboratorWithTokenCookies() {
            let cookiesToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
            if(cookiesToken) {
                let token = String(cookiesToken.pop());
                let tokenIdCollaborator = jwt_decode(token).id;
                this.collaborator_id = tokenIdCollaborator;
            }
        },

        showInformationsMessage(trainingSession){
            let seatsAvailable = 15 - trainingSession.collaborators.length;
            if (trainingSession.isCollaboratorDidRequest == true) {
                this.showMouseOverMessage = true;
                this.trainingSessionIdMouseOver = trainingSession.id;
                this.MouseOverMessage = "Désolé! Vous avez déja effectué une demande";
            }
            else if (seatsAvailable == 0) {
                this.showMouseOverMessage = true;
                this.trainingSessionIdMouseOver = trainingSession.id;
                this.MouseOverMessage = "Désolé! Vous ne pouvez pas effectuer de demande";
            }
        },

        hideInformationsMessage(){
            this.showMouseOverMessage = false;
        },

        verifyShowMessageOrNot(trainingSession){
            if (this.showMouseOverMessage == true && this.trainingSessionIdMouseOver == trainingSession.id) {
                return true;
            }
            return false;
        },

        showTrainingAndSessionsSelected(training){
            let formationRequestsComponent = this.$parent.$children[1];
            formationRequestsComponent.displayTrainingsFn(training.id);
            formationRequestsComponent.renitialize(training);
            formationRequestsComponent.openPanel = true;
        },

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
                    this.allTrainingsAndSessions.splice(0,this.allTrainingsAndSessions.length);
                    for (var tmp1 in this.allTrainingsAlreadyHaveSessions) {
                        var tmp3 = [];
                        for (var tmp2 in this.trainingAndSessions) {
                            if (this.allTrainingsAlreadyHaveSessions[tmp1].id == this.trainingAndSessions[tmp2].trainingDescription.id) {
                                this.VerifyCollaboratorRequestsExistence(this.trainingAndSessions[tmp2].id, this.trainingAndSessions[tmp2]);
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
            trainingSessions.sort(function (a, b) {
                var x = a.beginning.split('/').reverse().join('');
                var y = b.beginning.split('/').reverse().join('');
                return x > y ? 1 : x < y ? -1 : 0;
            });
            return trainingSessions;
        },

        VerifyCollaboratorRequestsExistence(session_id, trainingAndSessions){
            this.$http.get("api/requests/session/" + session_id + "/collaborators").then(
                function (response) {
                    console.log("success to get all requests from database");
                    this.collaboratorsRequesting = response.data;
                    this.existCollaboratorRequest = false;
                    trainingAndSessions.isCollaboratorDidRequest = this.existCollaboratorRequest;
                    for (var tmp in this.collaboratorsRequesting) {
                        console.log(this.collaborator_id + " " + this.collaboratorsRequesting[tmp].id);
                        if (this.collaborator_id == this.collaboratorsRequesting[tmp].id) {
                            this.existCollaboratorRequest = true;
                            trainingAndSessions.isCollaboratorDidRequest = this.existCollaboratorRequest;
                            break;
                        }
                    }
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },

        displayRedTextWhenOnly3SeatsAvailable(seatsAvailable){
            if(seatsAvailable > 3){
                return false;
            }
            return true;
        }

        },

});
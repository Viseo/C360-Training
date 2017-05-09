/**
 * Created by NBE3663 on 02/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

let stateRequest = Vue.component('state-request', {
        props: [],
        data: function() {
            return {
                collaboratorIdentity: {
                    id: '',
                    lastName: '',
                    firstName: ''
                },
                requestedTraining:[]
            }
        },
        template: `
        <div class="container-fluid" style="margin-top:18px;">
            <div class="row">
                <div class="col-lg-7 col-md-7 col-sm-7 text-center" style="width:200px">
                    <legend> Mes formations </legend>
                </div>
            </div>
            <div class="row">
                <div class="panel panel-default" style="margin-left:10px; ">
                     <div class="panel-body">
                         <div class="row">
                            <div class="col-lg-12" style="margin-bottom:30px">
                                <img src="css/up.png" id="scroll-up-3" width="60" height="20" style="position: absolute; left:50%; z-index:1;">
                            </div>
                        </div>
                        <div id="scrollMyTrainings">
                            <div>
                                <strong></strong>
                                <div class="col-sm-12 col-md-11 col-lg-11" style="line-height:2em">
                                    <div v-for="(training, index) in requestedTraining" >
                                    <strong> {{requestedTraining}}</strong>
                                    </div>
                                    <div>
                                        09 Mai 2017 - 11 Mai 2017 salle Bora Bora
                                        <span class="glyphicon glyphicon-ok-circle alignIcon" style="color: green; font-size: x-large; "></span>
                                    </div>
                                    <div>
                                        09 Mai 2017 - 11 Mai 2017 salle Bora Bora
                                        <span class="glyphicon glyphicon-time alignIcon" style="font-size: x-large;"></span>
                                    </div>
                                   
                                  
                                   
                                   
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
        this.getCookies();
        this.fetchTrainingsTitles();
        $('#scroll-up-3').click(function() {
            $('#scrollMyTrainings').animate({scrollTop: "-=100"}, 500);
        });

        $('#scroll-down-3').click(function() {
            $('#scrollMyTrainings').animate({scrollTop: "+=100"}, 500);
        });

    },

        methods: {
            getCookies(){
                let regexCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
                console.log("stateRequestTraining");
                console.log(regexCookieToken);
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
            fetchTrainingsTitles(){
                this.$http.get("api/sessions/"+this.collaboratorIdentity.id+"/requestedSessions").then(
                    function (response) {
                        this.requestedTraining=response.data;
                        let tab = [];
                            tab.trainingTitle=(Object.keys(this.requestedTraining));
                            console.log[tab.trainingTitle];
                        for(let index2 in this.requestedTraining) {
                            tab.session.push(this.requestedTraining[tab.trainingTitle[index2]]);
                        }
                        console.log(tab);
                        console.log(Object.keys(this.requestedTraining));

                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                );
            },
            fetchTrainigTitle(){
                this.$http.get()
            }


        }
    }
)

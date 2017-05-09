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
                                <div class="col-sm-12 col-md-11 col-lg-11" style="line-height:2em; font-size:1em">
                                    <div v-for="training in requestedTrainingByCollaborator" >
                                        <strong> {{training.title}}</strong>
                                        <div v-for="session in training.sessions">
                                            {{getDate(session.beginning)}} - {{getDate(session.ending)}} - {{session.location}}
                                            <span class="glyphicon glyphicon-ok-circle alignIcon" style="color: green"></span>
                                        </div>
                                    </div>
                                    <div>
                                        09 Mai 2017 - 11 Mai 2017 salle Bora Bora
                                        <span class="glyphicon glyphicon-time alignIcon""></span>
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
        this.fetchTrainingsSessions();
        $('#scroll-up-3').click(function() {
            $('#scrollMyTrainings').animate({scrollTop: "-=100"}, 500);
        });

        $('#scroll-down-3').click(function() {
            $('#scrollMyTrainings').animate({scrollTop: "+=100"}, 500);
        });

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
            fetchTrainingsSessions(){
                this.requestedTrainingByCollaborator.splice(0,this.requestedTrainingByCollaborator.length);
                this.$http.get("api/sessions/"+this.collaboratorIdentity.id+"/requestedSessions").then(
                    function (response) {
                        this.requestedTraining=response.data;
                       for (let index in this.requestedTraining) {
                           this.requestedTrainingByCollaborator.push({
                               title: index,
                               sessions: this.requestedTraining[index]
                           });
                        }
                        console.log("lalala");
                        console.log(this.requestedTrainingByCollaborator);
                       this.orderSessions();
                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                );
            },
            orderSessions(){
                this.requestedTrainingByCollaborator.sort(function(a, b) {
                    return parseFloat(a.sessions[0].beginning) - parseFloat(b.sessions[0].beginning);
                });
            }
        }
    }
)

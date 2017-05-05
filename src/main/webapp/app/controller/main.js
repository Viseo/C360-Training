Vue.use(VueResource);
Vue.use(VueRouter);

let Header = Vue.component('blue-header',{
    template:
        `<div id="wrap">
            <div class="navbar navbar-default navbar-fixed-top" style="background-color:#428bca;">
                <div class="container-fluid">
                    <div class="row">
                        <div id="custom-navbar" class="col-lg-4 col-md-6 col-sm-6 col-xs-6 navbar-header">
                            <p id="navbar-title" href="#">Collaborateur 360</p>
                            <p id="navbar-subtitle">Gestion des formations</p>
                        </div>
                        <div id="navbar-right-part" class="col-lg-3 col-lg-offset-5 col-md-5 col-sm-5 col-xs-5">
                            <div class="col-lg-8 col-md-8 col-sm-8 col-xs-9 text-right" id="navbar-user">
                                 <span @mouseover="setDisconnectedToTrue()" v-show="showName()">{{firstName}} {{lastName}}</span>
                                 <button @click="disconnectUser" @mouseout="setDisconnectedToFalse()" v-show="showDisconnexion()" id="btn-disconnect"><i class="glyphicon glyphicon-remove"></i> Déconnexion</button>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-3">     
                                <ul class="nav navbar-nav">
                                    <li class="dropdown">	
                                        <span id="navbar-app" class="col-lg-2 col-sm-2 col-md-2 glyphicon glyphicon-th dropdown-toggle" data-toggle="dropdown" aria-hidden="true" href="#"></span>
                                        <ul id="dropdown-app" class="dropdown-menu">
                                            <li>
                                                <span class="col-lg-5 col-md-12 col-sm-12" v-show="!app.skills"><img src="/img/icon_cv.png" href="#"class="text-center  icon-app"><p>GCv</p></span>
                                                <span class="col-lg-5 col-md-12 col-sm-12" v-show="!app.leave"><img src="/img/icon_conge.png" href="#"  class="text-center icon-app"><p>GCon</p></span>
                                                <span class="col-lg-5 col-md-12 col-sm-12" v-show="!app.training"><img src="/img/icon_formation.png" href="#" class="text-center icon-app"><p>GF</p></span>
                                                <span class="col-lg-5 col-md-12 col-sm-12" v-show="!app.mission"><img src="/img/icon_mission.png" href="#"  class="text-center icon-app"><p>GM</p></span>
                                            </li>
                                        </ul>
                                    </li> 
                                 </ul>
                            </div>
                        </div>     
                    </div>
                </div>
            </div>
            <div v-if="dialog" class="dialog">
                <div class="dialog-bg">
                    <div class="dialog-title">Oups....</div>
                    <div class="dialog-description">{{ firstName }} {{ lastName }},vous êtes restés trop longtemps inactif.</br>Vous venez d'être déconnecté</div>
                    <div class="dialog-buttons">
                        <router-link to="/login" class="large blue button">Retour à la page de connexion</router-link>
                    </div>
                </div>	
            </div>
        </div>
  `,
    data: function () {
        return {
            lastName:'',
            firstName:'',
            token:'',
            disconnect:false,
            app: {
                training: true,
                skills: false,
                mission: false,
                leave: false
            },
            IDLE_TIMEOUT: 20, //seconds
            idleSecondsCounter: 0,
            myInterval:'',
            stayConnected: true,
            dialog: false,
            timeconnected: 0,
        }
    },
    mounted: function () {
        this.getCookieInfos();
        if (this.stayConnected === false) {
            this.checkIfUserInactive();
        }
        $('ul.nav li.dropdown').hover(function() {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
        }, function () {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
        });
    },
    methods: {
        setDisconnectedToTrue(){
            this.disconnect = true;
        },
        setDisconnectedToFalse(){
            this.disconnect = false;
        },
        showName(){
            return !this.disconnect && !this.dialog;
        },
        showDisconnexion(){
            return this.disconnect && !this.dialog;
        },
        setIdleSecondsCounter(value){
            this.idleSecondsCounter = value;
        },
        checkIfUserInactive(){
            if (this.timeconnected != 0)
                if ((parseInt(String(new Date().getHours()) + String(new Date().getMinutes())) - parseInt(this.timeconnected)) >= 1) {
                    this.dialog = true;
                    this.disconnectUser();
                }
            document.onclick = function () {
                this.idleSecondsCounter = 0;
            }.bind(this);
            document.onmousemove = function () {
                this.idleSecondsCounter = 0;
            }.bind(this);
            document.onkeypress = function () {
                this.idleSecondsCounter = 0;
            }.bind(this);
            window.onbeforeunload = function () {
                if (!this.disconnect && !this.dialog)
                    document.cookie = "timeconnected=" + new Date().getHours() + new Date().getMinutes();
            }.bind(this);
            this.myInterval = window.setInterval(this.checkIdleTime, 1000);
        },
        checkIdleTime() {
            this.idleSecondsCounter++;
            var oPanel = document.getElementById("newVue");
            if (oPanel) {
                if (this.idleSecondsCounter >= this.IDLE_TIMEOUT) {
                    window.clearInterval(this.myInterval);
                    this.dialog = true;
                    this.disconnectUser();
                }
            }
        },
        getCookieInfos() {
            let regexCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
            let regexCookieStayConnected = document.cookie.match('(^|;)\\s*' + "stayconnected" + '\\s*=\\s*([^;]+)');
            let regexCookieTimeConnected = document.cookie.match('(^|;)\\s*' + "timeconnected" + '\\s*=\\s*([^;]+)');
            console.log(regexCookieToken);
            if(regexCookieToken!=null) {
                console.log(typeof regexCookieToken != 'undefined');
                if(typeof regexCookieToken == 'undefined') this.token = 'undefined';
                if (this.token == 'undefined') regexCookieToken = false;
                if (regexCookieToken && regexCookieStayConnected) {
                 if (this.$route.name != 'login')
                 this.stayConnected = JSON.parse(regexCookieStayConnected.pop());
                 this.token = String(regexCookieToken.pop());
                 if (regexCookieTimeConnected) {
                 if (this.$route.name != 'login')
                 this.timeconnected = parseInt(regexCookieTimeConnected.pop());
                 }
                 if(!jwt_decode(this.token).roles && this.$route.name != 'registerTrainingCollaborator'){
                 this.$router.push('/registerTrainingCollaborator');
                 }
                 if(jwt_decode(this.token).roles && this.$route.name != 'addTrainingTopic'){
                 this.$router.push('/addTrainingTopic');
                 }
                 this.lastName = jwt_decode(this.token).lastName;
                 console.log(this.lastName);
                 this.firstName = jwt_decode(this.token).sub;
                 }}
                 else {
                    console.log("salut");
                    if (this.$route.name != 'login'){
                        if(this.$route.name != 'resetPassword'){
                 this.$router.push('/login');}
                 }
                 }


        },
        disconnectUser(){
            this.$http.post("api/userdisconnect", this.token)
                .then(
                    function (response) {
                        if (response) {
                            let getCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
                            let getCookieStayConnected = document.cookie.match('(^|;)\\s*' + "stayconnected" + '\\s*=\\s*([^;]+)');
                            let getCookieTimeConnected = document.cookie.match('(^|;)\\s*' + "timeconnected" + '\\s*=\\s*([^;]+)');
                            if (getCookieToken && getCookieStayConnected) {
                                document.cookie = "token=" + this.token + "; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                                document.cookie = "stayconnected=" + this.stayConnected + "; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                                if (getCookieTimeConnected)
                                    document.cookie = "timeconnected=" + "; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                            }
                            if (!this.dialog)
                                this.$router.push('/login')
                        }
                    });
        }
    }
});
let router = new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: "/addTrainingTopic",
            component: {
                template: `<div id="newVue" v-cloak>
    <blue-header></blue-header>
    <div class="container-fluid">
        <div class="col-sm-12 col-md-7 col-lg-7">
            <add-formation-panel></add-formation-panel>
            <show-formation-panel></show-formation-panel>
            <add-session-panel></add-session-panel>
        </div>
        <div class="col-sm-12 col-md-5 col-lg-5">
            <assign-collaborator></assign-collaborator>
        </div>
    </div>

</div>`
            },
            name:'addTrainingTopic'
        },
        {
            path: "/registerTrainingCollaborator",
            name:'registerTrainingCollaborator',
            component: {
                template: `<div id="newVue" v-cloak>
                                <blue-header></blue-header>
                                <div class="container-fluid">
                                    <div class="col-sm-12 col-md-7 col-lg-7">
                                        <collaborator-formation ref="myComponent" ></collaborator-formation>
                                    </div>
                                    <div class="col-sm-12 col-md-5 col-lg-5">
                                        <training-to-come></training-to-come>
                                    </div>
                                </div>
                           </div>
                            `
            }
        },
        {
            path: "/login",
            name:'login',
            component: {
                template: `<div id="newVue" v-cloak>
                               <blue-header></blue-header>
                                       <connect-user></connect-user>
                            </div>`
            }
        },{
            path: "/resetPassword/:id",
            name:'resetPassword',
            component: {
                template: `<div class="container-fluid" id="newVue" v-cloak>
    <div class="row">
                                      <blue-header></blue-header>

        <div class="col-lg-8 col-sm-12 col-xs-12 col-md-6 col-lg-6 col-lg-offset-3  col-md-offset-3">
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="row">
                        <div class="col-xs-12 col-xm-12 col-md-6 cold-lg-6 col-offset-3 col-md-offset-3">
                            <form-reset-password></form-reset-password>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



<!--<div id="newVue" v-cloak>
                                       <form-reset-password></form-reset-password>
                            </div>-->`
            }
        },
        {
            path: "/",
            redirect :"/login"
        }
    ]
});
new Vue({
    el: '#newVue',
    router
});




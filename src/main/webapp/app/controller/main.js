Vue.use(VueResource);
Vue.use(VueRouter);



let Header = Vue.component('header-component', {
    props: ['title','headerColor'],
    template: `<div id="wrap">
            <div class="navbar navbar-default navbar-fixed-top" :class="headerColor">
                <div class="container-fluid" id="header-component">
                    <div class="row">
                        <div id="custom-navbar" class="col-lg-4 col-md-6 col-sm-6 col-xs-6 navbar-header">
                            <p id="navbar-title" href="#">Collaborateur 360</p>
                            <p id="navbar-subtitle">{{title}}</p>
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
                                                <span class="col-lg-5 col-md-6 col-sm-6 col-xs-6" v-show="!app.skills"><a href="http://localhost:8081/#/skillsStatementByCollaborators" @click="hrefSkills"> <img src="/img/icon_cv.png" class="text-center  icon-app"><p>GCv</p></a></span>
                                                <span class="col-lg-5 col-md-6 col-sm-6 col-xs-6" v-show="!app.leave"><img src="/img/icon_conge.png" href="#"  class="text-center icon-app"><p>GCon</p></span>
                                                <span class="col-lg-5 col-md-6 col-sm-6 col-xs-6" v-show="!app.training"><a href="http://localhost:8081/#/registerTrainingCollaborator" @click="hrefTrainings"><img src="/img/icon_formation.png" class="text-center icon-app"><p>GF</p></a></span>
                                                <span class="col-lg-5 col-md-6 col-sm-6 col-xs-6" v-show="!app.mission"><img src="/img/icon_mission.png" href="#"  class="text-center icon-app"><p>GM</p></span>
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
    data: function() {
        return {
            lastName: '',
            firstName: '',
            token: '',
            disconnect: false,
            app: {
                training: false,
                skills: false,
                mission: false,
                leave: false
            },
            IDLE_TIMEOUT: 60, //seconds
            idleSecondsCounter: 0,
            myInterval: '',
            stayConnected: true,
            dialog: false,
            timeConnected: 0,
        }
    },
    mounted: function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.getCookieInfos();
        if (this.stayConnected === false) {
            this.checkIfUserInactive();
        }
        $('ul.nav li.dropdown').hover(function () {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
        }, function() {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
        });
        if(this.title == "Gestion des formations"){
            this.app.training = true;
        } else {
            (this.skills == "Gestion des formations")
            this.app.skills = true;
        }
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
            if (this.timeConnected != 0)
                if ((parseInt(String(new Date().getHours()) + String(new Date().getMinutes())) - parseInt(this.timeConnected)) >= 1) {
                    this.dialog = true;
                    this.disconnectUser();
                }
            document.onclick = function() {
                this.idleSecondsCounter = 0;
            }.bind(this);
            document.onmousemove = function() {
                this.idleSecondsCounter = 0;
            }.bind(this);
            document.onkeypress = function() {
                this.idleSecondsCounter = 0;
            }.bind(this);
            window.onbeforeunload = function() {
                if (!this.disconnect && !this.dialog)
                    document.cookie = "timeConnected=" + new Date().getHours() + new Date().getMinutes();
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
            let isAdmin = () => jwt_decode(this.token).roles;

            let retrieveTimeOfExit = () => {
                let timeOfExit = document.cookie.match('(^|;)\\s*' + "timeConnected" + '\\s*=\\s*([^;]+)');
                if (timeOfExit) {
                    if (this.getPageName() != 'login') {
                        this.timeConnected = parseInt(timeOfExit.pop());
                    }
                }
            };

            let preventCollaboratorToGoToAdminPage = () => {
                if (!isAdmin() && this.getPageName() != 'registerTrainingCollaborator' && this.getPageName() != 'WishToVote' && this.getPageName() !='skillsStatementByCollaborators') {
                    this.goTo('registerTrainingCollaborator');
                }
            };

            let preventAdminToGoToCollaboratorPage = () => {
                if (isAdmin() && this.getPageName() != 'addTrainingTopic') {
                    this.goTo('addTrainingTopic');
                }
            };

            let retrieveUserInfoFromToken = () => {
                this.lastName = jwt_decode(this.token).lastName;
                this.firstName = jwt_decode(this.token).sub;
            };

            let isConnected = () => {
                let isTokenPresent = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
                let stayConnectedDefined = document.cookie.match('(^|;)\\s*' + "stayconnected" + '\\s*=\\s*([^;]+)');

                if (!isTokenPresent) delete this.token;
                if (this.token == 'undefined') isTokenPresent = false;
                if (isTokenPresent && stayConnectedDefined) {
                    this.token = String(isTokenPresent.pop());
                    return true;
                }
                return false;
            };

            let redirectToLoginPage = () => {
                if (this.getPageName() != 'login') {
                    if (this.getPageName() != 'resetPassword') {
                        this.goTo('login');
                    }
                }
            };

            let retrieveStayConnected = () => {
                let stayConnectedChecked = document.cookie.match('(^|;)\\s*' + "stayconnected" + '\\s*=\\s*([^;]+)');
                if (this.getPageName() != 'login') {
                    this.stayConnected = JSON.parse(stayConnectedChecked.pop());
                }
            };

            if (isConnected()) {
                retrieveStayConnected();
                retrieveTimeOfExit();
                preventCollaboratorToGoToAdminPage();
                preventAdminToGoToCollaboratorPage();
                retrieveUserInfoFromToken();
            }
            else {
                redirectToLoginPage();
            }
        },
        hrefSkills:function(){
          console.log();
        },
        hrefTrainings:function(){
            console.log();
        },

        disconnectUser(){
            let disconnect = (response) => {
                if (response) {
                    let getCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
                    let getCookieStayConnected = document.cookie.match('(^|;)\\s*' + "stayconnected" + '\\s*=\\s*([^;]+)');
                    let getCookieTimeConnected = document.cookie.match('(^|;)\\s*' + "timeConnected" + '\\s*=\\s*([^;]+)');
                    if (getCookieToken && getCookieStayConnected) {
                        document.cookie = "token=" + this.token + "; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                        document.cookie = "stayconnected=" + this.stayConnected + "; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                        if (getCookieTimeConnected)
                            document.cookie = "timeConnected=" + "; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                    }
                    if (!this.dialog)
                        this.$router.push('/login')
                }
            };

            this.post("api/userdisconnect", this.token, disconnect);
        }
    }
});

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: "/addTrainingTopic",
            name: 'addTrainingTopic',
            component: {
                template: `
                <div id="newVue" v-cloak>
                    <header-component title="Gestion des formations" headerColor="blue-header"></header-component>
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
        },
        {
            path: "/registerTrainingCollaborator",
            name: 'registerTrainingCollaborator',
            component: {
                template: `<div id="newVue" v-cloak>
                                <header-component title="Gestion des formations" headerColor="blue-header"></header-component>
                                    <div class="container-fluid">
                                        <div class="col-sm-12 col-md-7 col-lg-7">
                                            <collaborator-formation ref="myComponent" ></collaborator-formation>
                                        </div>
                                        <div class="col-sm-12 col-md-5 col-lg-5">
                                            <state-request></state-request>
                                            <training-to-come></training-to-come>
                                        </div>
                                    </div>
                           </div>`
            }
        }, {
            path: "/WishToVote",
            name: 'WishToVote',
            component: {
                template: `<div id="newVue" v-cloak>
                                <header-component title="Gestion des formations" headerColor="blue-header"></header-component>
                                    <div class="container-fluid">
                                        <div class="col-sm-12 col-md-7 col-lg-7">
                                            <collaborator-formation ref="myComponent" ></collaborator-formation>
                                        </div>
                                        <div class="col-sm-12 col-md-5 col-lg-5">
                                            <state-request></state-request>
                                            <wish-to-vote></wish-to-vote>
                                        </div>
                                    </div>
                           </div>`
            }
        },
        {
            path: "/login",
            name: 'login',
            component: {
                template: `<div id="newVue" v-cloak>
                               <header-component headerColor="blue-header"></header-component>
                               <connect-user></connect-user>
                           </div>`
            }
        }, {
            path: "/resetPassword/:id",
            name: 'resetPassword',
            component: {
                template: `
                <div class="container-fluid" id="newVue" v-cloak>
                   <div class="row">
                        <header-component headerColor="blue-header"></header-component>
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
                </div>`
            }
        },
        {
            path: "/",
            redirect: "/login"
        },
        {
            path:"/skillsStatementByCollaborators",
            name:'skillsStatementByCollaborators',
            component:{
                template: `<div id="newVue" v-cloak>
                            <header-component title="Gestion des compétences" headerColor="red-header"></header-component>
                            <statement-skills></statement-skills>
                         </div>`
            }
        }
    ]
});

const PAGE_TITLE = {
    "login": "Accueil C360",
    "resetPassword": "Mise à jour mot de passe",
    "registerTrainingCollaborator": "Gestion des formations",
    "WishToVote": "Gestion des formations",
    "addTrainingTopic": "Gestion des formations",
    "skillsStatementByCollaborators": "Gestion des compétences"

};

const PAGE_FAVICON = {
    "login": "img/icon_accueil.png",
    "resetPassword": "img/icon_accueil.png",
    "registerTrainingCollaborator": "img/icon_formation.png",
    "WishToVote": "img/icon_formation.png",
    "addTrainingTopic": "img/icon_formation.png"
};

router.afterEach((toRoute, fromRoute) => {
    window.document.title = PAGE_TITLE[toRoute.name];

    let pageOldIconTab = window.document.getElementById('dynamic-favicon');
    let pageNewIconTab = window.document.createElement('link');

    pageNewIconTab.id = 'dynamic-favicon';
    pageNewIconTab.rel = 'icon';
    pageNewIconTab.href = PAGE_FAVICON[toRoute.name];
    if (pageOldIconTab) {
        window.document.head.removeChild(pageOldIconTab);
    }
    window.document.head.appendChild(pageNewIconTab);
});

new Vue({
    el: '#newVue',
    router
});
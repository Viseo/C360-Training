Vue.use(VueResource);
Vue.use(VueRouter);
Vue.component('dropdown', VueStrap.dropdown);
Vue.component('accordion', VueStrap.accordion);
Vue.component('panel', VueStrap.panel);
Vue.component('alert', VueStrap.alert);
Vue.component('typeahead', VueStrap.typeahead);

let Header = Vue.component('header-component', {
    props: ['title',
        'headerColor'],
    template: `<div id="wrap"> 
    <div class="navbar navbar-default navbar-fixed-top" :class="headerColor"> 
        <div class="container-fluid" id="header-component"> 
            <div class="row"> 
                <div id="custom-navbar" @click="redirectPageHearder();" style="cursor:default;"
                    class="col-lg-4 col-md-6 col-sm-6 col-xs-6 navbar-header"> 
                    <p id="navbar-title">Collaborateur 360</p> 
                    <p id="navbar-subtitle">{{ title }}</p> 
                </div> 
                <div id="navbar-right-part" 
                    class="col-lg-4 col-lg-offset-4 col-md-5 col-sm-5 col-xs-5" 
                    @mouseleave="setDisconnectedToFalse()" > 
                    <div id="navbar-user" 
                        class="col-lg-7 col-lg-offset-1 col-md-8 col-sm-8 col-xs-9 text-right" @mouseover="setDisconnectedToTrue()"> 
                        <div v-show="showPicture()" class="col-lg-2 col-md-5 col-sm-5 col-xs-5"> 
                             <img style="cursor:default;" class="image-min" v-if="defaultPicture"
                                                 src="img/profile.jpg">
                             <img style="cursor:default;" class="image-min" v-else
                                                 :src="'img/'+collaboratorId+'.jpg'"> 
                        </div> 
                        <span class="text-left col-lg-8 col-lg-offset-2 col-md-5 col-sm-5 col-xs-5" style="margin-top:10px" @mouseover="setDisconnectedToTrue()" v-show="showName()" >{{ firstName }} {{ lastName }}</span> 
                        <dropdown class="col-lg-8 col-lg-offset-2 col-md-5 col-sm-5 col-xs-5" type="default" v-if="showPicture()" v-show="showDisconnexion()" text="Choisissez une action" id="menu"> 
                            <li><a @click="goTo('registerTrainingCollaborator');">Espace formations</a></li> 
                            <li><a @click="goTo('profiltoupdate');">Modifier mon profil</a></li> 
                            <li role="separator" class="divider"></li> 
                            <li><a @click="disconnectUser">Déconnexion</a></li> 
                        </dropdown> 
                    </div> 
                    <div style="margin-top:10px" class="col-lg-4 col-md-4 col-sm-4 col-xs-3"> 
                        <ul class="nav navbar-nav"> 
                            <li class="dropdown"> 
                                <span style="cursor:pointer;" id="navbar-app" class="col-lg-2 col-sm-2 col-md-2 glyphicon glyphicon-th dropdown-toggle" data-toggle="dropdown" aria-hidden="true" href="#"></span> 
                                <ul id="dropdown-app" class="dropdown-menu"> 
                                    <li> 
                                        <span style="cursor:pointer;" class="col-lg-5 col-md-6 col-sm-6 col-xs-6" v-show="!app.skills"><img src="/img/microservices_icon/icon_cv.png" class="text-center  icon-app"><p>GCv</p></span> 
                                        <span style="cursor:pointer;" class="col-lg-5 col-md-6 col-sm-6 col-xs-6" v-show="!app.leave"><img src="/img/microservices_icon/icon_competence.png" class="text-center icon-app"><p>GCon</p></span> 
                                        <span @click="goTo('registerTrainingCollaborator')" style="cursor:pointer;" class="col-lg-5 col-md-6 col-sm-6 col-xs-6" v-show="!app.training"><img src="/img/microservices_icon/icon_formation.png" class="text-center icon-app"><p>GF</p></span> 
                                        <span style="cursor:pointer;" class="col-lg-5 col-md-6 col-sm-6 col-xs-6" v-show="!app.mission"><img src="/img/microservices_icon/icon_mission.png" class="text-center icon-app"><p>GM</p></span> 
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
</div > 

  `,
    data: function () {
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
            IDLE_TIMEOUT: 180, //seconds
            idleSecondsCounter: 0,
            myInterval: '',
            stayConnected: true,
            dialog: false,
            timeConnected: 0,
            imagePath: 'img/profile.jpg',
            collaboratorId: '',
            validateToken: '',
            defaultPicture:''
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
        }, function () {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
        });

        this.setTitle();
        if(this.token && this.token!='')
        this.checkIfTokenExist();
        this.imagePath = "img/" + this.collaboratorId + ".jpg";
    },
    methods: {
        redirectPageHearder(){
            var isAdmin = jwt_decode(this.token).roles;

            if(isAdmin){
                this.goTo('addTrainingTopic');
            }
            else {
                this.goTo('registerTrainingCollaborator');
            }
        },

        checkIfTokenExist(){
            let isTokenValid = (response) => {
                this.validateToken = response.body;
                if (!this.validateToken) {
                    this.disconnectUser();
                }
            };
            this.post('api/sendtoken', this.token, isTokenValid);
        },

        setTitle(){
            if (this.title == "Gestion des formations") {
                this.app.training = true;
                this.app.skills=false;
                this.app.mission = false;
                this.app.leave= false;

            }
        },

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
        showPicture(){
            return (this.$route.name != 'login') && (this.$route.name !='resetPassword') ;
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
        createDefautPictureCookie(){
            let cookie = this.getCookie("defaultPicture");
            console.log(cookie);
            if (cookie == ""){
                this.$http.get("api/getcollaborator/" + this.collaboratorId).then(
                    function (response) {
                        this.defaultPicture = response.data.defaultPicture;
                        document.cookie = "defaultPicture=" + this.defaultPicture;
                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                )
            }else{
                if(cookie == "false"){
                    this.defaultPicture = false;
                }else if(cookie == "true"){
                    this.defaultPicture = true;
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
                if (!isAdmin() && this.getPageName() != 'registerTrainingCollaborator' && this.getPageName() != 'wishToVote' && this.getPageName() != 'profiltoupdate') {
                    this.goTo('registerTrainingCollaborator');
                }
            };

            let preventAdminToGoToCollaboratorPage = () => {
                if (isAdmin() && this.getPageName() != 'addTrainingTopic' && this.getPageName() != 'collectWishes' && this.getPageName() != 'trainingRanking' && this.getPageName() != 'addSession' && this.getPageName() != 'profiltoupdate') {
                    this.goTo('addTrainingTopic');
                }
            };

            let retrieveUserInfoFromToken = () => {
                this.lastName = jwt_decode(this.token).lastName;
                this.firstName = jwt_decode(this.token).sub;
                this.collaboratorId = jwt_decode(this.token).id;
            };

            let isConnected = () => {
                let isTokenPresent = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
                let stayConnectedDefined = document.cookie.match('(^|;)\\s*' + "stayconnected" + '\\s*=\\s*([^;]+)');

                if (!isTokenPresent || isTokenPresent == null)
                    delete this.token;

                if (this.token == undefined)
                    isTokenPresent = false;

                if (isTokenPresent != undefined && stayConnectedDefined != undefined && isTokenPresent != null && stayConnectedDefined != null) {
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
                this.createDefautPictureCookie();
            }
            else {
                redirectToLoginPage();
            }
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
                        document.cookie = "defaultPicture=; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                        if (getCookieTimeConnected)
                            document.cookie = "timeConnected=" + "; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                    }
                    if (!this.dialog)
                        this.goTo('login')
                }
                document.cookie = "alreadyShownPopUp=" + "; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
            };

            this.post("api/userdisconnect", this.token, disconnect);
        },

    }
});

// For 404 page
var notFound = Vue.extend({
    template: '<h1>Not Found</h1>'
});

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {
            path: "/addTrainingTopic",
            name: 'addTrainingTopic',
            component: {
                template: `
                <div id="newVue" class="allPageAdmin" v-cloak>
                    <header-component title="Gestion des formations" headerColor="blue-header"></header-component>
                    <div class="container-fluid">
                        <div class="col-sm-12 col-md-8 col-lg-10 col-lg-offset-1 col-md-offset-2">
                            <add-formation-panel></add-formation-panel>
                        </div>
                        <div id="addSessionsContainer" class="col-sm-12 col-md-6 col-lg-6">
                            <router-view name="showFormationPanel"></router-view>
                        </div>
                        <div id="assignCollaboratorContainer" class="col-sm-12 col-md-6 col-lg-6">
                            <router-view></router-view>
                        </div>
                    </div>
                </div>`
            },
            children: [
                {
                    name: 'addTrainingTopic',
                    path: '/addTrainingTopic',
                    components: {
                        default: Vue.component('assign-collaborator'),
                        showFormationPanel: Vue.component('show-formation-panel')
                    }
                },
                {
                    name: "collectWishes",
                    path: 'collectWishes',
                    components: {
                        default: Vue.component('collect-wishes'),
                        showFormationPanel: Vue.component('show-formation-panel')
                    }
                },
                {
                    name: "trainingRanking",
                    path: 'trainingRanking',
                    components: {
                        default: Vue.component('training-ranking'),
                        showFormationPanel: Vue.component('show-formation-panel')
                    }
                },
                {
                    name: "addSession",
                    path: 'addSession',
                    components: {
                        default: Vue.component('assign-collaborator'),
                        showFormationPanel: Vue.component('add-session-panel')
                    }
                }]
        },
        {
            path: "/registerTrainingCollaborator",
            name: 'registerTrainingCollaborator',
            component: {
                template: `<div id="newVue"  v-cloak>
                                <header-component title="Gestion des formations" headerColor="blue-header"></header-component>
                                    <div class="container-fluid collabPage">
                                        <div class="col-sm-12 col-md-7 col-lg-7">
                                            <collaborator-formation ref="myComponent" ></collaborator-formation>
                                        </div>
                                        <div class="col-sm-12 col-md-7 col-lg-5">
                                            <state-request></state-request>
                                            <router-view></router-view>
                                        </div>
                                    </div>
                           </div>`
            },
            children: [{
                name: 'registerTrainingCollaborator',
                path: "/registerTrainingCollaborator",
                component: Vue.component('training-to-come')
            },
                {
                    name: "wishToVote",
                    path: 'wishToVote',
                    component: Vue.component('wish-to-vote')
                }]
        },
        {
            path: "/login",
            name: 'login',
            component: {
                template: `<div id="newVue"  class="pictureLogin" v-cloak>
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
            path: "/profiltoupdate",
            name: 'profiltoupdate',
            component: {
                template: `<div id="newVue" v-cloak>
                                <header-component title="Gestion des formations" headerColor="blue-header"></header-component>
                                <div class="container-fluid">
                                    <div class="col-sm-12 col-md-12 col-lg-12" style="margin-top:37px;">
                                        <profil-to-update></profil-to-update>
                                    </div>
                                </div>
                           </div>`
            }
        },
        {
            path: "*",
            component: notFound
        }
    ]
});

const PAGE_TITLE = {
    "login": "Accueil C360",
    "resetPassword": "Mise à jour mot de passe",
    "registerTrainingCollaborator": "Gestion des formations",
    "wishToVote": "Gestion des formations",
    "addTrainingTopic": "Gestion des formations",
    "profiltoupdate": "Modifier mon profil",
    "collectWishes": "Gestion des formations",
    "addSession": "Gestion des sessions",
    "trainingRanking": "Gestion des formations"
};

const PAGE_FAVICON = {
    "login": "img/microservices_icon/icon_accueil.png",
    "resetPassword": "img/microservices_icon/icon_accueil.png",
    "registerTrainingCollaborator": "img/microservices_icon/icon_formation.png",
    "wishToVote": "img/microservices_icon/icon_formation.png",
    "addTrainingTopic": "img/microservices_icon/icon_formation.png",
    "profiltoupdate": "img/microservices_icon/icon_accueil.png",
    "collectWishes": "img/microservices_icon/icon_formation.png",
    "addSession": "img/microservices_icon/icon_formation.png",
    "trainingRanking": "img/microservices_icon/icon_formation.png"
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

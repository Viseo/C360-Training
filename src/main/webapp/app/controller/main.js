Vue.use(VueResource);

Vue.component('blue-header',{
    template: `<div id="wrap">
    <div class="navbar navbar-default navbar-fixed-top" style="background-color:#428bca;">
        <div class="container-fluid">
        <div class="row">
                <div id="custom-navbar" class="col-lg-4 col-md-6 col-sm-6 col-xs-6 navbar-header">
                    <p id="navbar-title" href="#">Collaborateur 360</p>
                    <p id="navbar-subtitle">Gestion des formations</p>
                </div>
                <span class="col-lg-10" style="text-align:right; padding-right:3em;">{{prenom}} {{nom}}</span>
                <div id="navbar-right-part" class="col-lg-3 col-lg-offset-5 col-md-5 col-sm-5 col-xs-5">
                    <div class="col-lg-8 col-md-8 col-sm-8 col-xs-9 text-right" id="navbar-user">
                         <span @mouseover="disconnect=true;" v-show="!disconnect">Prénom Nom</span>
                         <button @mouseout="disconnect=false;" v-show="disconnect" id="btn-disconnect"><i class="glyphicon glyphicon-remove"></i> Déconnexion</button>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-3">     
                        <ul class="nav navbar-nav">
                            <li class="dropdown">	
                                <span id="navbar-app" class="col-lg-2 col-sm-2 col-md-2 glyphicon glyphicon-th dropdown-toggle" data-toggle="dropdown" aria-hidden="true" href="#"></span>
                                <ul id="dropdown-app" class="dropdown-menu">
                                    <li>
                                        <span class="col-lg-5" v-show="!app.skills"><img src="/img/icon_cv.png" href="#"class="text-center  icon-app"><p>GCv</p></span>
                                        <span class="col-lg-5" v-show="!app.leave"><img src="/img/icon_conge.png" href="#"  class="text-center icon-app"><p>GCon</p></span>
                                        <span class="col-lg-5" v-show="!app.training"><img src="/img/icon_formation.png" href="#" class="text-center icon-app"><p>GF</p></span>
                                        <span class="col-lg-5" v-show="!app.mission"><img src="/img/icon_mission.png" href="#"  class="text-center icon-app"><p>GM</p></span>
                                    </li>
                                </ul>
                            </li>
                         </ul>
                    </div>
                </div>     
        </div>
        </div>
    </div>
</div>
  `,
    data: function(){
        return {
            nom:'',
            prenom:''
            disconnect:false,
            app: {
                training:true,
                skills:false,
                mission:false,
                leave:false
            }
        }
    },
    mounted: function(){
        this.getCookieNom();
        this.getCookiePrenom();
    },
    methods: {
        getCookieNom(){
            let regexCookie = document.cookie.match('(^|;)\\s*' + "nom" + '\\s*=\\s*([^;]+)');
            this.nom = regexCookie ? regexCookie.pop() : '';
            console.log(document.cookie);
        },
        getCookiePrenom(){
            let regexCookie = document.cookie.match('(^|;)\\s*' + "prenom" + '\\s*=\\s*([^;]+)');
            this.prenom = regexCookie ? regexCookie.pop() : '';
        }
    }
});

new Vue({
    el: '#newVue'
});

$('#scroll-up').click(function() {
    $('#test').animate({scrollTop: "-=100"}, 500);
})

$('#scroll-down').click(function() {
    $('#test').animate({scrollTop: "+=100"}, 500);
})

$('#test').bind('mousewheel DOMMouseScroll', function(event){
    if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
        $('#test').animate({scrollTop: "-=100"}, 80);
    }
    else{
        $('#test').animate({scrollTop: "+=100"}, 80);
    }
});

$('ul.nav li.dropdown').hover(function() {http://www.bootply.com/PZIuAAmHST#
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
}, function() {
    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
});


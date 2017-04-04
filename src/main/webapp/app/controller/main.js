Vue.use(VueResource);

Vue.component('blue-header',{
    template: `<div id="wrap">
    <div class="navbar navbar-default navbar-fixed-top" style="background-color:#428bca;">
        <div class="container-fluid">
                <div id="custom-navbar" class="col-lg-4 navbar-header">
                    <p id="navbar-title" href="#">Collaborateur 360</p>
                    <p id="navbar-subtitle">Gestion des formations</p>
                </div>
                <div id="navbar-right-part" class="col-lg-2 col-lg-offset-6">
                <span class="col-lg-10" style="text-align:right; padding-right:3em;">{{prenom}} {{nom}}</span>
                    <span id="navbar-app" class="col-lg-2 glyphicon glyphicon-th" aria-hidden="true"></span>
                </div>     
        </div>
    </div>
</div>
  `,
    data: function(){
        return {
            nom:'',
            prenom:''
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


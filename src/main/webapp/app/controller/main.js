Vue.use(VueResource);

Vue.component('blue-header',{
    template: `<div id="wrap">
    <div class="navbar navbar-default navbar-fixed-top" style="background-color:#428bca;">
        <div class="container-fluid">
                <div style="padding:10px 30px 10px 10px; " class="col-lg-4 navbar-header">
                    <p style="color:white; font-size:1.3em; margin:0px;" href="#">Collaborateur 360</p>
                    <p style="color:#16334d; margin:0px;" >Gestion des formations</p>
                </div>
                <div class="col-lg-2 col-lg-offset-6" style="float:right; margin:20px 10px 20px 0px; padding:0px;">
                <span class="col-lg-10" style="text-align:right; padding-right:3em;">Prénom Nom</span>
                <span class="col-lg-2 glyphicon glyphicon-th" style="font-size:1.7em; line-height:75%;" aria-hidden="true"></span>
                </div>     
        </div>
    </div>
</div>
  `,
    data: function(){
        return {
            email:''
        }
    },
    mounted: function(){
        this.getCookieEmail();
    },
    methods: {
        getCookieEmail() {
            let regexCookie = document.cookie.match('(^|;)\\s*' + "mail" + '\\s*=\\s*([^;]+)');
            this.email = regexCookie ? regexCookie.pop() : '';
        },
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


/**
 * Created by HBO3676 on 05/05/2017.
 */
function BaseComponent(prototype) {

    var result = {
        getPageName: function(){
            return this.$route.name;
        },

        goTo: function(pageName){
            this.$router.push("/"+pageName);
        },

        post: function(url,data,success){
            this.$http.post(url, data)
                .then(success);
        },

        activateScrollUp: function(idChevronUp, idComponentToScroll){
            $(idChevronUp).click(function() {
                $(idComponentToScroll).animate({scrollTop: "-=100"}, 500);
            });
        },

        activeScrollDown: function(idChevronDown, idComponentToScroll){
            $(idChevronDown).click(function() {
                $(idComponentToScroll).animate({scrollTop: "+=100"}, 500);
            })
        },

        activateScrollWheel: function(idComponentToScroll){
            $(idComponentToScroll).bind('mousewheel DOMMouseScroll', function(event){
                if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                    $(idComponentToScroll).animate({scrollTop: "-=100"}, 80);
                }
                else{
                    $(idComponentToScroll).animate({scrollTop: "+=100"}, 80);
                }
            });
        }

    };
    result.__proto__ = prototype;
    return result;

}
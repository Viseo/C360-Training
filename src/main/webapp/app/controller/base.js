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
        }
    };
    result.__proto__ = prototype;
    return result;

}
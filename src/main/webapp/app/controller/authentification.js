/**
 * Created by XME3612 on 27/03/2017.
 */
new Vue({
    el: '#authentification',
    data:{
        user:{
            email:'',
            password:''
        },
        email:'',
        password:'',
        userToRegister:{},
        isErrorAuthentification:false
    },
    methods:{
        ResetUserForm(){

        },
        VerifyForm(){
            //à compléter
            this.userToRegister = JSON.parse(JSON.stringify(this.user));
            this.VerifyUserByDatabase();
        },

        VerifyUserByDatabase(){
            this.$http.post("api/user", this.userToRegister)
                .then(
                    function (response) {
                        this.ResetUserForm();
                }).then(function () {
                    window.location.pathname = '/pageblanche.html';
                }).catch(function () {
                    this.user.password = "";
                    this.isErrorAuthentification = true;
                });
        }
    }
});
Vue.use(VueResource);
Vue.use(VueRouter);

let wishToVoteComponent = Vue.component('wish-to-vote', {
    template: `<div class="row" >
                        <div class="row">
                            <div style="margin-left:30px;" class="col-lg-7 col-md-7 text-center">
                                <legend>Voter</legend>
                            </div>
                        </div>
                            <div style="margin-left:30px;height: 360px;width: 550px;border:1px solid #dcdcdc;border-radius: 10px;"> 
                                    <div class="col-lg-12" style="margin-bottom:30px">
                                         <span class="glyphicon glyphicon-remove-sign" style="cursor: pointer; color:darkred; position:absolute; margin-top:10px; left:95%;" @click="changePage()"></span>
                                    </div>
                                    <div class="col-lg-12" style="margin-bottom:30px">
                                        <img v-show="showChevrons" src="css/up.png" id="scroll-up-4" width="60" height="20" style="position: absolute; left:45%; margin-top:5px; z-index:1;">
                                    </div>
                                <div id="test1" style=" height: 260px; overflow-y:hidden; overflow-x:hidden;" class="col-lg-12 col-md-12 col-sm-12" >
                                    <table v-for = "wish in allWishes" style=" width: 100%;" >
                                        <tr>
                                            <td>
                                                <div > 
                                                    <b style="text-align: left">{{wish.label}}</b> 
                                                    <span @mouseover="userAlreadyVotedOk(wish)" @mouseleave="hideMessage()" @click="addVoteOk(wish)" style="cursor: pointer;"><img src="css/vote_ok.png" width="40" height="40" style="position: absolute; left:70%; z-index:1;"></span>
                                                    <span @mouseover="userAlreadyVotedKo(wish)" @mouseleave="hideMessage()" @click="addVoteKo(wish)" style="cursor: pointer;"><img src="css/vote_ko.png" width="40" height="40" style="position: absolute; left:80%; z-index:1;"></span>
                                                    <br><br>
                                                    <b><span @click="addVoteOk(wish)" style="position: absolute; left:73%; text-align: center;" class="color-green">{{wish.vote_ok.length}}</span><span @click="addVoteKo(wish)" style="position: absolute; left:83%;" class="color-red">{{wish.vote_ko.length}}</span> </b>
                                                    <span style="position: absolute; left:65%;" class = "sc-notification sc-info" v-show="collaboratorAlreadyVotedTheSameVote && wish_id == wish.id">Vous avez déjà voté.</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr><td colspan="2"><hr></td></tr>
                                    </table>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12" style="margin-top:10px">
                                        <img v-show="showChevrons" src="css/down.png" id="scroll-down-4" width="60" height="20" style="position: absolute; left:45%; margin-bottom: 10px; z-index:1;">
                                    </div>
                                </div>
                            </div>
                        </div>
            </div>
            `,

    data: function () {
        return {
            allWishes:[],
            collaborator_id:'',
            token:'',
            collaboratorAlreadyVotedTheSameVote:false,
            collaboratorAlreadyVotedTheOppositeVote:false,
            wish_id:'',
            changePageToTraining:false

        }
    },

    computed: {
        showChevrons(){
            return true;
        }
    },
    mounted:function () {
        this.getCookies();
        this.getAllWishes();
        $('#scroll-up-4').click(function() {
            $('#test1').animate({scrollTop: "-=100"}, 500);
        });
        $('#scroll-down-4').click(function() {
            $('#test1').animate({scrollTop: "+=100"}, 500);
        });
    },
    methods: {
        changePage(){
            this.$router.push('/registerTrainingCollaborator');
        },
        getCookies(){
            let regexCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
            if(regexCookieToken){
                if(!regexCookieToken[0].includes('undefined')) {
                    if (this.token != 'undefined'){
                        this.token = String(regexCookieToken.pop());
                        this.collaborator_id = jwt_decode(this.token).id;
                    }
                }
            }
        },
        hideMessage(){
            this.wish_id = '';
            this.collaboratorAlreadyVotedTheSameVote = false;
            this.collaboratorAlreadyVotedTheOppositeVote = false;
        },
        userAlreadyVotedOk(wish){
            this.wish_id = wish.id;
            this.collaboratorAlreadyVotedTheSameVote = false;
            this.collaboratorAlreadyVotedTheOppositeVote = false;
            for(var tmp1 in wish.vote_ok){
                if(this.collaborator_id == wish.vote_ok[tmp1].id){
                    this.collaboratorAlreadyVotedTheSameVote = true;
                }
            }
            for(var tmp2 in wish.vote_ko){
                if(this.collaborator_id == wish.vote_ko[tmp2].id){
                    this.collaboratorAlreadyVotedTheOppositeVote = true;
                }
            }
        },
        userAlreadyVotedKo(wish){
            this.wish_id = wish.id;
            this.collaboratorAlreadyVotedTheSameVote = false;
            this.collaboratorAlreadyVotedTheOppositeVote = false;
            for(var tmp1 in wish.vote_ko){
                if(this.collaborator_id == wish.vote_ko[tmp1].id){
                    this.collaboratorAlreadyVotedTheSameVote = true;
                }
            }
            for(var tmp2 in wish.vote_ok){
                if(this.collaborator_id == wish.vote_ok[tmp2].id){
                    this.collaboratorAlreadyVotedTheOppositeVote = true;
                }
            }
        },
        getAllWishes(){
            this.$http.get("api/allwishes").then(
                function (response) {
                    console.log("success to get all wishes");
                    this.allWishes = response.data;
                    this.allWishes.sort(function (a, b) {
                        return (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0);
                    });
                },
                function(response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        addVoteOk(wish){
            this.userAlreadyVotedOk(wish);
            if(!this.collaboratorAlreadyVotedTheSameVote && !this.collaboratorAlreadyVotedTheOppositeVote){
                this.$http.put("api/okwishtoupdate/"+this.collaborator_id,wish).then(
                    function (response) {
                        console.log("success to add ok wish");
                        this.getAllWishes();
                    },
                    function(response) {
                        console.log("Error: ", response);
                        console.error(response);
                    });
            }else if(!this.collaboratorAlreadyVotedTheSameVote && this.collaboratorAlreadyVotedTheOppositeVote) {
                this.$http.put("api/kowishtochange/"+this.collaborator_id,wish).then(
                    function (response) {
                        console.log("success to remove ko wish");
                        this.getAllWishes();
                    },
                    function(response) {
                        console.log("Error: ", response);
                        console.error(response);
                    });
            }
        },
        addVoteKo(wish){
            this.userAlreadyVotedKo(wish);
            if(!this.collaboratorAlreadyVotedTheSameVote && !this.collaboratorAlreadyVotedTheOppositeVote){
                this.$http.put("api/kowishtoupdate/"+this.collaborator_id,wish).then(
                    function (response) {
                        console.log("success to add ko wish");
                        this.getAllWishes();
                    },
                    function(response) {
                        console.log("Error: ", response);
                        console.error(response);
                    });
            }else if(!this.collaboratorAlreadyVotedTheSameVote && this.collaboratorAlreadyVotedTheOppositeVote) {
                this.$http.put("api/okwishtochange/"+this.collaborator_id,wish).then(
                    function (response) {
                        console.log("success to remove ok wish");
                        this.getAllWishes();
                    },
                    function(response) {
                        console.log("Error: ", response);
                        console.error(response);
                    });
            }
        }
    }
});

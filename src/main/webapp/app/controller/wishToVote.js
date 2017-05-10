Vue.use(VueResource);
Vue.use(VueRouter);

let wishToVoteComponent = Vue.component('wish-to-vote', {
    template: `<div class="row" >
                        <div class="row">
                            <div style="margin-left:30px;" class="col-lg-7 col-md-7 text-center">
                                <legend>Voter</legend>
                            </div>
                        </div>
                            <div style="margin-left:30px;width: 550px;border:1px solid #dcdcdc;border-radius: 10px;"> 
                                    <div class="col-lg-12" style="margin-bottom:30px">
                                        <img v-show="showChevrons" src="css/up.png" id="scroll-up-3" width="60" height="20" style="position: absolute; left:45%; margin-top:10px; z-index:1;">
                                    </div>
                                <div id="test" style=" height: 260px; overflow-y:hidden; overflow-x:hidden;" class="col-lg-12 col-md-12 col-sm-12" >
                                    <table v-for = "wish in allWishes" style=" width: 100%;" >
                                        <tr>
                                            <td>
                                                <div style="text-align: left"> <b>{{wish.label}} - <span @click="addVoteOk(wish)">{{wish.vote_ok.length}}</span> - <span @click="addVoteKo(wish)">{{wish.vote_ko.length}}</span> </b></div>
                                            </td>
                                        </tr>
                                        <tr><td colspan="2"><hr></td></tr>
                                    </table>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12" style="margin-top:10px">
                                        <img v-show="showChevrons" src="css/down.png" id="scroll-down-3" width="60" height="20" style="position: absolute; left:45%; margin-bottom: 20px; top:95%; z-index:1;">
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
            collaboratorAlreadyVotedTheOppositeVote:false

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
        $('#scroll-up-3').click(function() {
            $('#test').animate({scrollTop: "-=100"}, 500);
        });

        $('#scroll-down-3').click(function() {
            $('#test').animate({scrollTop: "+=100"}, 500);
        });
    },
    methods: {
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
            for(var tmp1 in wish.vote_ok){
                if(this.collaborator_id == wish.vote_ok[tmp1].id){
                    this.collaboratorAlreadyVotedTheSameVote = true;
                }
            }
            this.collaboratorAlreadyVotedTheSameVote = false;
            for(var tmp2 in wish.vote_ko){
                if(this.collaborator_id == wish.vote_ko[tmp2].id){
                    this.collaboratorAlreadyVotedTheOppositeVote = true;
                }
            }
            this.collaboratorAlreadyVotedTheOppositeVote = false;
            if(!this.collaboratorAlreadyVotedTheSameVote && !this.collaboratorAlreadyVotedTheOppositeVote){
                this.$http.put("api/okwishtoupdate/"+this.collaborator_id,wish).then(
                    function (response) {
                        console.log("success to add ok wish");
                    },
                    function(response) {
                        console.log("Error: ", response);
                        console.error(response);
                    });
            }else if(!this.collaboratorAlreadyVotedTheSameVote && this.collaboratorAlreadyVotedTheOppositeVote) {
                this.$http.put("api/kowishtoremove"+this.collaborator_id,wish).then(
                    function (response) {
                        console.log("success to remove ko wish");
                        this.$http.put("api/okwishtoupdate/"+this.collaborator_id,wish).then(
                            function (response) {
                                console.log("success to add ok wish");
                            });
                    },
                    function(response) {
                        console.log("Error: ", response);
                        console.error(response);
                    });
            }
        },
        addVoteKo(wish){
            for(var tmp1 in wish.vote_ko){
                if(this.collaborator_id == wish.vote_ko[tmp1].id){
                    this.collaboratorAlreadyVotedTheSameVote = true;
                }
            }
            this.collaboratorAlreadyVotedTheSameVote = false;
            for(var tmp2 in wish.vote_ok){
                if(this.collaborator_id == wish.vote_ok[tmp2].id){
                    this.collaboratorAlreadyVotedTheOppositeVote = true;
                }
            }
            this.collaboratorAlreadyVotedTheOppositeVote = false;
            if(!this.collaboratorAlreadyVotedTheSameVote && !this.collaboratorAlreadyVotedTheOppositeVote){
                //add KO
            }else if(!this.collaboratorAlreadyVotedTheSameVote && this.collaboratorAlreadyVotedTheOppositeVote) {
                //remove OK add KO
            }
        }
    }
});

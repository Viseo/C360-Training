/**
 * Created by BBA3616 on 15/05/2017.
 */
let collectWishes = Vue.component('collect-wishes', {
    props: [],

    data: function () {
        return {
            showChevrons : true,
            allWishes:[],
            listWishesToUpdate:[],
            confirmUpdateWishes: false
        }
    },

    template: `
<div class="container-fluid">
    <div class="row">
        <div class="col-sm-12 col-md-10 col-lg-12">
            <div class="row">
                <div class="col-lg-9 col-md-9 text-center">
                    <legend>Souhaits reçus</legend>
                </div>
            </div>
            <div class="row">
                <div id="collectWishes">
                    <div class="row">
                    <div class="col-sm-12 col-md-2 col-lg-2">
                        <img src="css/left-arrow.png" 
                             width="40" 
                             height="40"
                             @click="returnAssignCollabPanel"
                             style="cursor: pointer;">
                    </div>
                    <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                    <br/>
                        <img v-show="showChevrons" 
                             src="css/up.png" 
                             id="scroll-up-3" 
                             width="60" 
                             height="20" 
                             style="position: absolute; left:50%; z-index:1;">
                    </div>
                    </div>
                    <div id="scroll" style="width: 100%; height: 360px; overflow-y:hidden; overflow-x:hidden;">
                        <div class="row">
                            <ol style="list-style-type:none" class="rectangle-list">
                                <li v-for="wish in allWishes">
                                    <a :title="wish.label">
                                    <img v-if="wish.checked==true"
                                        :id="'validate'+wish.id"
                                        @click="addWishToListWishes(wish, true)"
                                       
                                        src="img/validate_icon.png" 
                                        width="25" 
                                        height="25"
                                        style="margin-left:20px; cursor:pointer;">
                                    <img
                                        v-else-if="wish.checked==null || wish.checked ==false"
                                        :id="'validate'+wish.id"
                                        @click="addWishToListWishes(wish, true)"
                                        
                                        src="img/validate_icon_init.png" 
                                        width="25" 
                                        height="25"
                                        style="margin-left:20px; cursor:pointer;">
                                    <img
                                        v-if="wish.checked==false"
                                        :id="'refuse'+wish.id"
                                        @click="addWishToListWishes(wish, false)"
                                        src="img/refuse_icon.png" 
                                        width="25" 
                                        height="25"
                                        style="margin-left:50px; cursor:pointer">
                                    <img
                                        v-else-if="wish.checked == null || wish.checked ==true"
                                        :id="'refuse'+wish.id"
                                        @click="addWishToListWishes(wish, false)"
                                        src="img/refuse_icon_init.png" 
                                        width="25" 
                                        height="25"
                                        style="margin-left:50px; cursor:pointer">
                                    <img
                                        src="img/thumbs_up.png" 
                                        width="25" 
                                        height="25"
                                        style="margin-left:50px;">
                                    <span style="color:#8c8c8c">{{ wish.vote_ok.length}} votes</span>   
                                        <img
                                        src="img/thumbs_down.png" 
                                        width="25" 
                                        height="25"
                                        style="margin-left:20px;">
                                       <span style="color:#8c8c8c">{{ wish.vote_ko.length }} votes</span> 
                                        <img v-show="true"
                                        src="img/icon-novote.png" 
                                        width="25" 
                                        height="25"
                                        style="margin-left:155px;">
                                       <span v-show="false" style="color:#8c8c8c">0 votes</span>
                                     </a>
                                </li> 
                                     </ol>
                        </div>
                    </div>
                    <div clas="row">
                    <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">
                        <img v-show="showChevrons" 
                             src="css/down.png" 
                             id="scroll-down-3" 
                             width="60" height="20" 
                             style="position: absolute; left:50%; top:95%; z-index:1;">
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-5 col-md-offset-5 col-lg-offset-5">
                        <br/>
                            <button class="btn btn-primary"  @click="updateWish()">Enregistrer</button>
                        </div>
                    </div>
                        <div style="width: 100%; height: 30px;">
                        <br/>
                                                <span v-show="confirmUpdateWishes" class="text-center color-green" style="margin-left:153px;margin-top:20px;" height="80px" width="250px">Vos modifications ont bien été enregistrées</span>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>`,

    mounted: function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.activateScrollUp('#scroll-up-3','#scroll');
        this.activeScrollDown('#scroll-down-3','#scroll');
        this.getAllWishes();
    },
    methods: {

        changeIconFromGreyToColor(idImage,colorIcon){
                document.getElementById(idImage).src = colorIcon;
        },

        changeIconFromColorToGrey(idImage,greyIcon){
                document.getElementById(idImage).src = greyIcon;
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
        addWishToListWishes(wish,valueChecked){
            this.wishAlreadyInList = false;
            if(valueChecked == true){
                this.changeIconFromGreyToColor('validate'+wish.id,'img/validate_icon.png');
                this.changeIconFromColorToGrey('refuse'+wish.id,'img/refuse_icon_init.png')
            }
            else if(valueChecked == false){
                this.changeIconFromGreyToColor('refuse'+wish.id,'img/refuse_icon.png');
                this.changeIconFromColorToGrey('validate'+wish.id,'img/validate_icon_init.png');
            }
            for(var tmp in this.listWishesToUpdate){
                if(this.listWishesToUpdate[tmp].id == wish.id){
                    this.listWishesToUpdate[tmp].checked = valueChecked;
                    this.wishAlreadyInList = true;
                }
            }
            if(!this.wishAlreadyInList){
                this.listWishesToUpdate.push(wish);
            }
        },
        updateWish(){
            this.$http.post("api/ischeckedwishestoupdate",this.listWishesToUpdate).then(
                function (response) {
                    console.log("success to update wishes");
                    this.confirmUpdateWishes = true;
                    setTimeout(function(){ this.confirmUpdateWishes = false; }.bind(this), 2000);
                    this.getAllWishes();
                },
                function(response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        returnAssignCollabPanel(){
            this.$router.push('/addTrainingTopic')
        }

    }
});
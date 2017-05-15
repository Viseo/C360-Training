/**
 * Created by BBA3616 on 15/05/2017.
 */
let collectWishes = Vue.component('collect-wishes', {
    props: [],

    data: function () {
        return {
            showChevrons : true,
            allWishes:[],
            listWishesToUpdate:[
                {"id":3,"version":1,"label":"BBB","collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"ncjxkze","firstName":"cnjzk","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},"vote_ok":[],"vote_ko":[],"checked":false},
                {"id":4,"version":1,"label":"FFF","collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"ncjxkze","firstName":"cnjzk","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},"vote_ok":[],"vote_ko":[],"checked":true}
                ]
        }
    },

    template: `
<div class="container-fluid">
<button @click="updateWish()">update wishes</button>
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
                    <br/>
                    <div class="col-sm-12 col-md-2 col-lg-2">
                        <img src="css/arrow_back.png" 
                             width="50" 
                             height="50">
                    </div>
                    <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                        <img v-show="showChevrons" 
                             src="css/up.png" 
                             id="scroll-up-2" 
                             width="60" 
                             height="20" 
                             style="position: absolute; left:50%; z-index:1;">
                    </div>
                    </div>
                    <div style="width: 100%; height: 360px; overflow-y:hidden; overflow-x:hidden;">
                        <div class="row">
                            <ol style="list-style-type:none" class="rectangle-list">
                                <li><a title="Vue.js" href="">
                                <img
                             src="css/validate_icon.png" 
                             width="25" 
                             height="25"
                             style="margin-left:20px; margin-right:20px;">
                                <span class="glyphicon glyphicon-remove">
                                </span></a></li>
                                <li><a title="COBOL" href="">List item</a></li>
                                <li><a title="Java" href="">List item</a></li>
                                <li><a title="Javascript" href="">List item</a></li>
                                <li><a title="HTML" href="">List item</a></li>
                                <li><a title="Angular" href="">List item</a></li>
                                <li><a title="Ruby" href="">List item</a></li>
                                <li><a title="PHP" href="">List item</a></li>
                                <li><a title="Vue.js" href="">List item</a></li>
                                <li><a title="COBOL" href="">List item</a></li>
                                <li><a title="Java" href="">List item</a></li>
                                <li><a title="Javascript" href="">List item</a></li>
                                <li><a title="HTML" href="">List item</a></li>
                                <li><a title="Angular" href="">List item</a></li>
                                <li><a title="Ruby" href="">List item</a></li>
                                <li><a title="PHP" href="">List item</a></li>
                            </ol>
                        </div>
                    </div>
                    <div clas="row">
                    <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">
                        <img v-show="showChevrons" 
                             src="css/down.png" 
                             id="scroll-down" 
                             width="60" height="20" 
                             style="position: absolute; left:50%; top:95%; z-index:1;">
                    </div>
                    <br/>
                    <div class="row">
                        <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-5 col-md-offset-5 col-lg-offset-5">
                            <button class="btn btn-primary"  @click="">Enregistrer</button>
                        </div>
                    </div>
                        <div style="width: 100%; height: 30px;">
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>`,

    mounted: function () {
        this.getAllWishes();
    },
    methods: {
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
                },
                function(response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        }
    }
});
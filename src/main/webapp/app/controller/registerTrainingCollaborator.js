/**
 * Created by CLH3623 on 10/04/2017.
 */
Vue.component('collaborator-formation', {
    data: function(){
        return {
            allTrainings: []
        }
    },
    template: `<div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12 col-lg-12 col-sm-12" style="padding:10px;" ></div>
                            <div class="col-sm-12 col-md-10 col-lg-7">
                                <div class="row">
                                    <div class="col-lg-7 col-md-7 text-center">
                                        <legend>Demande de formation</legend>
                                    </div>
                                </div>
                                <div class="row">
                                    <div id="trainingContainer">
                                        <div class="col-lg-4 col-md-4 col-sm-12">
                                            <select class="form-control">
                                                <option selected disabled>Formations disponibles</option>
                                                <option v-for="training in allTrainings" :value="training.trainingTitle">{{training.trainingTitle}}</option>s
                                            </select>
                                        </div>
                                        <div class="col-lg-2 col-md-2 col-sm-12">
                                            <input type = "submit" class="btn btn-primary" value="Valider"/>   
                                        </div>
                                        <div class="col-lg-4 col-lg-offset-2 col-md-offset-2 col-md-4 col-sm-12 searchField">
                                                <span class="glyphicon glyphicon-search"></span>
                                                <input type="search" class="form-control" placeholder="Entrer une formation">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    mounted: function(){
        this.gatherTrainingsFromDatabase();
    },
    methods: {
        gatherTrainingsFromDatabase(){
            this.$http.get("api/formations").then(
                function (response) {
                    this.allTrainings = response.data;
                    this.allTrainings.sort(function (a, b) {
                        return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                    });
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },

    }

})
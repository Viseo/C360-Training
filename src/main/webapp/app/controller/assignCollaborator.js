/**
 * Created by NBE3663 on 18/04/2017.
 */
Vue.use(VueResource);

let assignCollaborator = Vue.component('assign-collaborator', {
    props: [],
    data: function () {
        return {
            allSessions:[],
            sessionIdChosen:{},
            nomrequest:[],
            allCollaboratorsIdChosen:[10,12]
        }
    },
    methods : {

    },
    template: `
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12 col-md-10 col-lg-12"></div>
                    <div class="row">
                        <div class="col-lg-9 col-md-9 text-center">
                            <legend>Affecter un collaborateur</legend>
                        </div>
                    </div>
                    <div class="row">
                        <div id="assignCollaborator">
                        <input-text
                            width="20%"
                            label="Sélectionner session"
                            :value="sessionIdChosen"
                            @input="updateV1"
                            placeholder="Sélectionner session"
                            :collection="allSessions"
                            print-prop="id"
                            type="select">
                        </input-text>
                        <!--<select class="col-sm-10 col-md-10 col-lg-10">
                        </select>-->
                        </br>
                        </br>
                            <div class="col-sm-6 col-md-6 col-lg-6">
                                 <div class="row">
                                     <h4 class="col-sm-12 col-md-12 col-lg-12">Liste des collaborateurs</h4>
                                        <div class="checkbox col-sm-12 col-md-12 col-lg-12" >
                                             <label><input type="checkbox" value="">Afficher les demandes</label>
                                        </div> 
                                           
                                 </div>
                                 <div class="panel panel-default">
                                 <div class="panel-body">
                                   <div class=" col-sm-12 col-md-12 col-lg-12 searchField">
                                                <span class="glyphicon glyphicon-search" ></span>
                                                    <typeahead class="col-sm-12 col-dm-12 col-lg-12" placeholder="Nom ou prénom du collaborateur">
                                                    </typeahead> 
                                                                                      
                                        </div>
                                 
                                </div>
                                </div>
                                </div>
                                 
                                 
                                <div class="col-sm-6 col-md-6 col-lg-6">
                                    <div class="row">
                                     <h4 class="col-sm-12 col-md-12 col-lg-12">Collaborateurs ajoutés: </h4>
                                     <div class="checkbox col-sm-12 col-md-12 col-lg-12">
                                     <label>Nombre de places disponibles</label>
                                     </div>
                                    </div>
                                     <div class="panel panel-default">
                                
                                 <div class="panel-body">
                                 
                                </div>
                                </div>
                                 </div>
                            <button class="col-sm-offset-4 col-dm-offset-4 col-lg-offset-4 col-sm-4 col-md-4 col-lg-4 btn btn-primary">Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>
            

`,
    mounted: function () {
        this.GatherAllSessions();
    },
    methods:{
        updateV1 (v) {
            this.sessionIdChosen = v;
        },
        GatherAllSessions(){
            this.$http.get("api/sessions").then(
                function (response) {
                    console.log("success to get all sessions");
                    this.allSessions = response.data;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        GatherAllRequestsBySession(){
            this.$http.get("api/requests/session/"+ this.sessionIdChosen + "/collaborators").then(
                function (response) {
                    console.log("success to get all requests");
                    console.log(response.data);
                    this.nomrequest = response.data;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },
        AddCollaboratorsToTrainingSession(){
                this.$http.put("api/sessions/" + this.sessionIdChosen + "/" + this.allCollaboratorsIdChosen + "/collaborators").then(
                    function (response) {
                        console.log("success to modify");
                        console.log(response.data);
                    },
                    function (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    });
        },
    }
});
Vue.component('typeahead', VueStrap.typeahead);
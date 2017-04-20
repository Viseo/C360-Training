/**
 * Created by NBE3663 on 18/04/2017.
 */
Vue.use(VueResource);

let assignCollaborator = Vue.component('assign-collaborator', {
    props: [],
    data: function () {
        return {
            state: training_store.state,
            trainingStore: training_store}
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
                        <select class="col-sm-10 col-md-10 col-lg-10">
                        </select>
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
            

`
});
Vue.component('typeahead', VueStrap.typeahead);
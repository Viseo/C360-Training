/**
 * Created by NBE3663 on 18/04/2017.
 */
Vue.use(VueResource);

let assignCollaborator = Vue.component('assign-collaborator', {
    props: [],
    data: function () {
        return {}
    },
    template: `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12 col-lg-12 col-sm-12"></div>
                    <div class="row">
                        <div class="col-lg-9 col-md-9 text-center">
                            <legend>Affecter un collaborateur</legend>
                        </div>
                    </div>
                    <div class="row">
                        <div id="assignCollaborator">
                        <select class="col-sm-10 col-md-10 col-lg-10">Sélectionner session</select>
                        </br>
                        </br>
                            <div class="col-sm-6 col-md-6 col-lg-6">
                                 <div class="row">
                                     <h4 class="col-sm-12 col-md-12 col-lg-12">Liste des collaborateurs</h4>
                                        <div class="checkbox col-sm-12 col-md-12 col-lg-12" >
                                             <label><input type="checkbox" value="">Afficher les demandes</label>
                                        </div>
                                 </div>
                            </div>
                                <div class="col-sm-6 col-md-6 col-lg-6">
                                    <div class="row">
                                     <h4 class="col-sm-12 col-md-12 col-lg-12">Collaborateurs ajoutés: </h4>
                                    </div>
                                 </div>
                            </div>
                        
                    </div>
                </div>
            </div>
            

`
});
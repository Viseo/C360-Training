/**
 * Created by SJO3662 on 02/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

Vue.component('training-to-come', {
    template: `
        <div class="container-fluid">
            <div class="row">
                <div class="row">
                    <div class="col-lg-9 col-md-9 text-center">
                        <legend>Formation à venir</legend>
                    </div>
                </div>
                    <div class="row">                     
                        <div class="row">
                            <div id="training-to-come" style="border: 1px red solid;">
                            
                                <div>
                                    Coucou coucou
                                    <table >
                                        <tr>
                                            <!-- <td @click="moveCollabRight(collaborator)" >{{collaborator.lastName}} {{collaborator.firstName}} </td>  
                                            <td @click="moveCollabRight(collaborator)"><span  class="glyphicon glyphicon-circle-arrow-right green" style="top:2px"></span></td>
                                        -->
                                        </tr>
                                    </table>
                                </div>
                               
                            </div>
                        </div>
                    </div>                
            </div>
        </div>    

`
});
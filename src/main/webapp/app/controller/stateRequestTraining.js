/**
 * Created by NBE3663 on 02/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

let stateRequest = Vue.component('state-request', {
        props: [],
        data: function() {
            return {}

        },
        template: `
        <div class="fluid-container">
           
                <div class="col-sm-12 col-md-5 col-lg-5" style="padding:10px; "></div>
                   <div class="row">
                        <div class="col-lg-7 col-md-7 text-center">
                            <legend> Mes formations </legend>
                        </div>
                 </div>
                <div class="panel panel-default" style="margin-left:10px;">
                    <div class="panel-body">Panel Content</div>
                 </div>
              
            
        </div>

`
    }
)

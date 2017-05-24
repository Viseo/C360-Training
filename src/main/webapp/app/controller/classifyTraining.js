/**
 * Created by SJO3662 on 22/05/2017.
 */

let classifyTraining = Vue.component('classify-training', {
    props: [],
    data: function () {
        return {
            collaborator_id: '',
            //feedback
            //training dans feedback est sous la forme training au lieu de trianingdescription
            feedback:{
                "score":5,
                "comment":"HELLO WORLD",
                "training":{"id":3,"version":0,"trainingTitle":"FORMATION","numberHalfDays":3,"topic":{"id":2,"version":0,"name":"C"}}
            },
            allFeedbacks:[],
            allTrainingScore:[]
        }
    },
    mounted: function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
    },
    methods: {
        getAllFeedbacks(){
            this.$http.get("api/feedbacks").then(
                function (response) {
                    console.log("success to get all feedbacks");
                    this.allFeedbacks = response.data;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        getTrainingsScore(){
            this.$http.get("api/trainingscore").then(
                function (response) {
                    console.log("success to get all training score");
                    this.allTrainingScore = response.data;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        }
    }
});
Vue.component('typeahead', VueStrap.typeahead);

/**
 * Created by XME3612 on 24/02/2017.
 */
Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.use(VueRouter);

new Vue({
    el: '#TrainingTopic',
    data: {
        training:{
            trainingTitle:'',
            numberHalfDays:undefined,
            topicDescription:undefined
        },
        trainingToRegister:{},

        topic:{
            name:''
        },
        topicToRegister:{},

        /*optionsTopic: [
            { text:'A', value: 'A' },
            { text:'B', value: 'B' },
            { text:'C', value: 'C' }
        ],*/

        optionsTopic: [],
        isNewTrainingTitle:true,
        isNewTopic:true,
        msgtrainingTitle:false,
        msgtopic:false,
        msgnumberHalfDays:false,
        msgname:false,

    },
    methods: {
        messageTrainingTitle(){
            if(this.training.trainingTitle == ''){
                this.msgmtrainingTitle = true;
            }
        },
        messageNumberHalfDays(){
            if(this.training.numberhalfDays == ''){
                this.msgnumberHalfDays = true;
            }
        },
        messageTopic(){
            if(this.training.topicDescription == ''){
                this.msgtopic = true;
            }
        },
        messageName(){
            if(this.topic.name == ''){
                this.msgname = true;
            }
        },
        resetTrainingForm() {
            this.training.trainingTitle = '';
            this.training.numberHalfDays = '';
            this.training.topicDescription = '';
            this.trainingToRegister = {};
        },
        saveTrainingAction() {
            this.trainingToRegister.trainingTitle = this.training.trainingTitle.replace(" ", "").toUpperCase();  //delete useless spaces between words
            this.trainingToRegister.numberHalfDays = parseInt(this.training.numberHalfDays);
            //post the form to the server
            this.$http.post("api/formations", this.trainingToRegister)
                .then(
                    function (response) {
                        this.isNewTrainingTitle = true;
                        this.resetTrainingForm();
                        this.resetTopicForm(); //Reset the Form
                        //window.location.replace('addTrainingTopic.html');
                    },
                    function (response) {
                        console.log("Error: ",response);
                        if (response.data.message == "trainingTitle") {
                            this.isNewTrainingTitle = false;
                        }else{
                            console.error(response);
                        }
                    }
                );
        },
        verifyTrainingForm() {
            /*this.messageTrainingTitle(); this.messageTopic(); this.messageNumberHalfDays();
            if(!this.msgtrainingTitle && !this.msgtopic && !this.msgnumberHalfDays){
                this.isNewTrainingTitle = true;
                this.trainingToRegister = JSON.parse(JSON.stringify(this.training));
                this.saveTrainingAction();
            }*/
            this.isNewTrainingTitle = true;
            this.trainingToRegister = JSON.parse(JSON.stringify(this.training));
            this.saveTrainingAction();
        },
        updateTopics(){
            this.$http.get("api/themes").then(
                function(response){
                    this.optionsTopic = response.data;
                },
                function(response){
                    console.log("Error: ",response);
                    console.error(response);
                }
            );
        },
        resetTopicForm() {
            this.topic.name = '';
            this.topicToRegister = {};
        },
        saveTopicAction() {
            this.topicToRegister.name = this.topic.name.replace(" ", "").toUpperCase();  //delete useless spaces between words

            //post the form to the server
            this.$http.post("api/themes", this.topicToRegister)
                .then(
                    function (response) {
                        this.updateTopics();
                    },
                    function (response) {
                        console.log("Error: ",response);
                        if (response.data.message == "name") {
                            this.isNewTopic = false;
                        } else {
                            console.error(response);
                        }
                    }
                );
        },
        verifyTopicForm() {
            /*this.messageTopic();
            if( !this.msgtopic ){
                this.isNewTopic = true;
                this.topicToRegister = JSON.parse(JSON.stringify(this.topic));
                this.saveTopicAction();
            }*/
            this.isNewTopic = true;
            this.topicToRegister = JSON.parse(JSON.stringify(this.topic));
            this.saveTopicAction();
        }

    }
});
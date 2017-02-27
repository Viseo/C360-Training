/**
 * Created by BBA3616 on 24/02/2017.
 */
Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.use(VueRouter);

var TrainingTopic = new Vue({
    el: '#TrainingTopic',
    data: {
        training:{
            trainingTitle:'',
            numberHalfDays:'',
            topicDescription:''
        },
        trainingToRegister:{},

        topic:{
            name:''
        },
        topicToRegister:{},
        optionsTopic: [],
        isNewTrainingTitle:true,
        isNewTopic:true,
        confirmFormation:false,
        confirmTopic: false,

        msgtrainingTitle:false,
        msgnumberHalfDays:false,
        msgtopic:false,
        msgname:false,



    },
    methods: {
        messageTrainingTitle(){
            if(this.training.trainingTitle == ''){
                this.msgtrainingTitle = true;
            }
        },
        messageNumberHalfDays(){
            if(this.training.numberHalfDays == ''){
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
        resetFormTheme(){
            this.theme.nouveautheme = '';
        },
        saveTrainingAction() {
            this.trainingToRegister.trainingTitle = this.training.trainingTitle.replace(" ", "").toUpperCase();  //delete useless spaces between words
            this.trainingToRegister.numberHalfDays = parseInt(this.training.numberHalfDays);
            //post the form to the server
            this.$http.post("api/formations", this.trainingToRegister)
                .then(
                    function (response) {
                        this.isNewTrainingTitle = true;
                        this.confirmTopic = true;
                        this.resetTrainingForm();
                        this.resetTopicForm();

                        //Reset the Form
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
            this.messageTrainingTitle(); this.messageNumberHalfDays(); this.messageTopic();
            if(!this.msgtrainingTitle && !this.msgnumberHalfDays && !this.msgtopic) {
                this.trainingToRegister = JSON.parse(JSON.stringify(this.training));
                this.saveTrainingAction();
            }
        },

        updateTopics(){
            this.$http.get("api/themes").then(
                function(response){
                    this.optionsTopic = response.data;

                    this.resetTopicForm();
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
                        this.confirmTopic = true;
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

window.onload = TrainingTopic.updateTopics();
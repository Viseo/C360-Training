/**
 * Created by BBA3616 on 24/02/2017.
 */
Vue.use(VueResource);
Vue.use(VeeValidate);

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
        optionsTraining:[],
        trainingsChosen:[],
        topicsChosen:[],
        isNewTrainingTitle:true,
        isNewTopic:true,
        confirmFormation:false,
        confirmTopic: false,

        msgtrainingTitle:false,
        msgnumberHalfDays:false,
        msgtopic:false,
        msgname:false,
        test:undefined


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
        saveTrainingAction() {
            this.trainingToRegister.trainingTitle = this.training.trainingTitle.replace(" ", "").toUpperCase();  //delete useless spaces between words
            this.trainingToRegister.numberHalfDays = parseInt(this.training.numberHalfDays);
            //post the form to the server
            this.$http.post("api/formations", this.trainingToRegister)
                .then(
                    function (response) {
                        this.isNewTrainingTitle = true;
                        this.confirmFormation = true;
                        this.updateTrainings();
                        this.resetTrainingForm();
                        this.resetTopicForm();
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
            this.training.trainingTitle = this.training.trainingTitle.replace(/ +/g, "");
            this.messageTrainingTitle(); this.messageNumberHalfDays(); this.messageTopic();
            if(!this.msgtrainingTitle && !this.msgnumberHalfDays && !this.msgtopic) {
                this.trainingToRegister = JSON.parse(JSON.stringify(this.training));
                this.saveTrainingAction();
            }
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
            this.topic.name = this.topic.name.replace(/ +/g, "");
            this.messageName();
            if(!this.msgname) {
                this.isNewTopic = true;
                this.topicToRegister = JSON.parse(JSON.stringify(this.topic));
                this.saveTopicAction();
            }
        },

        updateTopics(){
            this.$http.get("api/themes").then(
                function(response){
                    this.optionsTopic = response.data;
                    this.optionsTopic.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );
                    this.resetTopicForm();
                },
                function(response){
                    console.log("Error: ",response);
                    console.error(response);
                }
            );
        },
        updateTrainings (){
            this.$http.get("api/formations").then(
                function(response){
                    this.optionsTraining = response.data;
                    this.optionsTraining.sort(function(a,b) {return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);} );
                    this.resetTrainingForm();
                },
                function(response){
                    console.log("Error: ",response);
                    console.error(response);
                }
            );
        },
        TrainingFilter(value){
            this.trainingsChosen = [];
            for (var tmp in this.optionsTraining) {
                if (this.optionsTraining[tmp].topicDescription.name == value) {
                    this.trainingsChosen.push(this.optionsTraining[tmp]);
                }
            }
            //return this.TrainingTraim(this.trainingsChosen);
            return this.trainingsChosen;
        },
        TrainingTraim(value){
            this.test = [];
            var tmp = [];
            var longueur = value.length;
            var compteur = 0;
            for (var element in value){
                longueur --;
                compteur ++;
                if(compteur >= 1 && compteur < 6){
                    tmp.push(value[element]);
                    if(longueur == 0){
                        this.test.push(tmp);
                    }
                }else if(compteur == 6) {
                    tmp.push(value[element]);
                    this.test.push(tmp);
                    tmp = [];
                    compteur = 0;
                }
            }
            return this.test;
        }
    }
});

window.onload = TrainingTopic.updateTopics();
window.onload = TrainingTopic.updateTrainings();
/**
 * Created by BBA3616 on 24/02/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

var TrainingTopic = new Vue({
    el: '#TrainingTopic',
    data: {
        training: {
            trainingTitle: '',
            numberHalfDays: '',
            topicDescription: ''
        },
        trainingTitle: '',
        numberHalfDays: '',
        topicDescription:'',
        trainingToRegister: {},
        topic: {
            name: ''
        },
        nameTheme: '',
        trainingTitleMsg: '',
        nameThemeMsg: '',
        topicToRegister: {},
        optionsTopic: [],
        isNewTrainingTitle: true,
        isNewTopic: true,
        confirmFormation: false,
        confirmTopic: false,
        msgtrainingTitle: false,
        msgnumberHalfDays: false,
        msgtopic: false,
        msgname: false,
        isTrainingTitleValid: true,
        isNameThemeValid:true,
    },
    watch: {
        trainingTitle: function (value) {
            this.VerifTrainingTitle(value, 'trainingTitleMsg');
        },


        trainingTitle: function (value) {
            this.VerifTrainingTitle(value, 'trainingTitleMsg');
        },


        nameTheme: function (value) {
            this.VerifnameTheme(value, 'nameThemeMsg');
        },
    },

    methods: {
        VerifTrainingTitle(trainingTitle, msg) {
            if (/^[a-zA-Z0-9-.'_@:+#%]*$/.test(trainingTitle)) {
                this[msg] = '';
                this.isTrainingTitleValid = true;
            } else {
                this[msg] = "Veuillez entrer un nom de formation valide (-.'_@:+#% autorisés)";
                this.isTrainingTitleValid = false;

            }
        },
        messageTrainingTitle(){
            this.isTrainingTitleValid = true;
            if (this.trainingTitle == '') {
                this.msgtrainingTitle = true;
            }
        },
        messageNumberHalfDays(){
            if (this.numberHalfDays == '') {
                this.msgnumberHalfDays = true;
            }
        },
        messageTopic(){
            if (this.topicDescription == '') {
                this.msgtopic = true;
            }
        },

        VerifnameTheme(nameTheme, msg) {
            if (/^[a-zA-Z0-9-.'_@:+#%]*$/.test(nameTheme)) {
                this[msg] = '';
                this.isNameThemeValid = true;
            } else {
                this[msg] = "Veuillez entrer un nom de topic valide (-.'_@:+#% autorisés)";
                this.isNameThemeValid = false;
            }
        },
        messageName(){
            this.isNameThemeValid = true;
            if (this.nameTheme == '') {
                this.msgname = true;
            }
        },
        resetTrainingForm() {
            this.trainingTitle = '';
            this.numberHalfDays = '';
            this.topicDescription = '';
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
                        this.confirmFormation = true;
                        this.resetTrainingForm();
                        this.resetTopicForm();
                    },
                    function (response) {
                        console.log("Error: ", response);
                        if (response.data.message == "trainingTitle") {
                            this.isNewTrainingTitle = false;
                        } else {
                            console.error(response);
                        }
                    }
                );
        },
        verifyTrainingForm() {
            this.trainingTitle = this.trainingTitle.replace(/ +/g, "");
            this.training.trainingTitle = this.trainingTitle;
            this.training.numberHalfDays = this.numberHalfDays;
            this.training.topicDescription = this.topicDescription;
            this.messageTrainingTitle();
            this.messageNumberHalfDays();
            this.messageTopic();
            if (!this.msgtrainingTitle && !this.msgnumberHalfDays && !this.msgtopic) {
                this.trainingToRegister = JSON.parse(JSON.stringify(this.training));
                this.saveTrainingAction();
            }
        },

        updateTopics(){
            this.$http.get("api/themes").then(
                function (response) {
                    this.optionsTopic = response.data;

                    this.resetTopicForm();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        resetTopicForm() {
            this.nameTheme = '';
            this.topicToRegister = {};
        },
        saveTopicAction() {
            this.topicToRegister.name = this.nameTheme.replace(" ", "").toUpperCase();  //delete useless spaces between words

            //post the form to the server
            this.$http.post("api/themes", this.topicToRegister)
                .then(
                    function (response) {
                        this.confirmTopic = true;
                        this.updateTopics();
                    },
                    function (response) {
                        console.log("Error: ", response);
                        if (response.data.message == "name") {
                            this.isNewTopic = false;
                        } else {
                            console.error(response);
                        }
                    }
                );
        },
        verifyTopicForm() {
            this.nameTheme = this.nameTheme.replace(/ +/g, "");
            this.topic.name = this.nameTheme;
            this.messageName();
            if (!this.msgname) {
                this.isNewTopic = true;
                this.topicToRegister = JSON.parse(JSON.stringify(this.topic));
                this.saveTopicAction();
            }
        }
    }
});
window.onload = TrainingTopic.updateTopics();
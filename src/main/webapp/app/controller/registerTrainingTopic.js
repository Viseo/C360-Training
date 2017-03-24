/**
 * Created by BBA3616 on 24/02/2017.
 */
Vue.use(VueResource);

Vue.component('blue-header',{
    template:'<div style="padding:40px; background-color:#428bca; margin-bottom:30px;"></div>',
});

Vue.component('add-formation-panel', {
    data: function(){
        return {
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
            newTopic: '',
            topicToRegister: {},
            trainingTitleRegexErrorMessage: '',
            newTopicRegexErrorMessage: '',
            isNewTrainingTitle: true,
            isNewTopic: true,
            confirmFormation: false,
            confirmTopic: false,
            trainingTitleErrorMessage: false,
            numberHalfDaysErrorMessage: false,
            topicErrorMessage: false,
            newTopicErrorMessage: false,
            isTrainingTitleValid: true,
            isNameTopicValid:true,


            optionsTraining:[],
            optionsTopic: [],
            trainingsChosen:[],
            topicsChosen:[],
            test:undefined,
            trainingsOfTopic:[],
            allTopicTraining:[]
        }
    },
    watch: {
        trainingTitle: function (trainingTitleValue) {
            this.verifyTrainingField(trainingTitleValue, 'trainingTitleRegexErrorMessage');
        },

        newTopic: function (newTopicValue) {
            this.verifyNewTopicField(newTopicValue, 'newTopicRegexErrorMessage');
        },
    },

    mounted: function(){
        this.gatherTopicsFromDatabase();
        this.gatherTrainingsFromDatabase();
    },

    methods: {
        verifyTrainingField(trainingTitle, errorMessage) {
            if (/^[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]*$/.test(trainingTitle)) {
                this[errorMessage] = '';
                this.isTrainingTitleValid = true;
            } else {
                this[errorMessage] = "Veuillez entrer un nom de formation valide (-.'_@:+#% autorisés)";
                this.isTrainingTitleValid = false;
            }
        },

        verifyNewTopicField(newTopic, errorMessage) {
            if (/^[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]*$/.test(newTopic)) {
                this[errorMessage] = '';
                this.isNameTopicValid = true;
            } else {
                this[errorMessage] = "Veuillez entrer un nom de topic valide (-.'_@:+#% autorisés)";
                this.isNameTopicValid = false;

            }
        },

        isTrainingTitleEmpty(){
            if (this.trainingTitle == '' || this.trainingTitle == undefined) {
                this.trainingTitleErrorMessage = true;
            }
        },

        isNumberHalfDaysEmpty(){
            if (this.numberHalfDays == '' || this.numberHalfDays == undefined) {
                this.numberHalfDaysErrorMessage = true;
            }
        },

        isTopicEmpty(){
            if (this.topicDescription == '' || this.topicDescription == undefined) {
                this.topicErrorMessage = true;
            }
        },


        isNewTopicEmpty(){
            if (this.newTopic == '' || this.newTopic == undefined) {
                this.newTopicErrorMessage = true;

            }
        },

        verifyTrainingFormBeforeSubmit() {
            this.trainingTitle = this.trainingTitle.replace(/ +/g, "");
            this.training.trainingTitle = this.trainingTitle;
            this.training.numberHalfDays = this.numberHalfDays;
            this.training.topicDescription = this.topicDescription;
            this.isTrainingTitleEmpty();
            this.isNumberHalfDaysEmpty();
            this.isTopicEmpty();
            this.newTopicErrorMessage=false;
            if (!this.trainingTitleErrorMessage && !this.numberHalfDaysErrorMessage && !this.topicErrorMessage) {
                this.trainingToRegister = JSON.parse(JSON.stringify(this.training));
                this.saveTrainingIntoDatabase();
            }
        },

        verifyTopicFormBeforeSubmit() {
            this.newTopic = this.newTopic.replace(/ +/g, "");
            this.topic.name = this.newTopic;
            this.isNewTopicEmpty();
            this.trainingTitleErrorMessage = false;
            this.numberHalfDaysErrorMessage = false;
            this.topicErrorMessage = false;
            if (!this.newTopicErrorMessage) {
                this.isNewTopic = true;
                this.topicToRegister = JSON.parse(JSON.stringify(this.topic));
                this.saveTopicIntoDatabase();
            }
        },

        resetTrainingForm() {
            this.trainingTitle = '';
            this.numberHalfDays = '';
            this.topicDescription = '';
            this.trainingToRegister = {};

        },

        resetTopicForm() {
            this.newTopic = '';
            this.topicToRegister = {};
        },

        saveTrainingIntoDatabase() {
            this.trainingToRegister.trainingTitle = this.training.trainingTitle.replace(" ", "").toUpperCase();  //delete useless spaces between words
            this.trainingToRegister.numberHalfDays = parseInt(this.training.numberHalfDays);
            //post the form to the server
            this.$http.post("api/formations", this.trainingToRegister)
                .then(
                    function (response) {
                        this.isNewTrainingTitle = true;
                        this.confirmFormation = true;
                        this.gatherTrainingsFromDatabase();
                        this.resetTrainingForm();
                        setTimeout(function(){ this.confirmFormation = false; }.bind(this), 2000);
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

        saveTopicIntoDatabase() {
            this.topicToRegister.name = this.newTopic.replace(" ", "").toUpperCase();  //delete useless spaces between words

            //post the form to the server
            this.$http.post("api/themes", this.topicToRegister)
                .then(
                    function (response) {
                        this.confirmTopic = true;
                        this.gatherTopicsFromDatabase();
                        setTimeout(function(){ this.confirmTopic = false; }.bind(this), 2000);
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

        gatherTopicsFromDatabase(){
            this.$http.get("api/themes").then(
                function (response) {
                    this.optionsTopic = response.data;
                    this.optionsTopic.sort(function (a, b) {
                        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                    });
                    this.resetTopicForm();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },

        gatherTrainingsFromDatabase(){
            this.$http.get("api/formations").then(
                function (response) {
                    this.optionsTraining = response.data;
                    this.optionsTraining.sort(function (a, b) {
                        return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                    });
                    this.resetTrainingForm();
                    this.TopicwithTraining();
                    this.TopicTrainingTraim();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },

        TopicwithTraining(){
            this.trainingsChosen = [];
            for (var tmp in this.optionsTraining) {
                this.trainingsChosen.push(this.optionsTraining[tmp].topicDescription);
            }
            this.trainingsChosen = this.removeDuplicates(this.trainingsChosen, "id");
            this.trainingsChosen.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
        },
        removeDuplicates(arr, prop) {
            var new_arr = [];
            var lookup = {};

            for (var i in arr) {
                lookup[arr[i][prop]] = arr[i];
            }

            for (i in lookup) {
                new_arr.push(lookup[i]);
            }

            return new_arr;
        },
        TrainingTraim(value){
            this.test = [];
            var tmp = [];
            var longueur = value.length;
            var compteur = 0;
            for (var element in value) {
                longueur--;
                compteur++;
                if (compteur >= 1 && compteur < 4) {
                    tmp.push(value[element]);
                    if (longueur == 0) {
                        this.test.push(tmp);
                    }
                } else if (compteur == 4) {
                    tmp.push(value[element]);
                    this.test.push(tmp);
                    tmp = [];
                    compteur = 0;
                }
            }
            return this.test;
        },
        TrainingFilter(value){
            this.trainingsOfTopic = [];
            for (var tmp in this.optionsTraining) {
                if (this.optionsTraining[tmp].topicDescription.name == value) {
                    this.trainingsOfTopic.push(this.optionsTraining[tmp]);
                }
            }
            return this.trainingsOfTopic;
        },
        TopicTrainingTraim(){
            this.allTopicTraining = [];
            for (var tmp in this.trainingsChosen) {
                this.allTopicTraining.push(this.TrainingTraim(this.TrainingFilter(this.trainingsChosen[tmp].name)));
            }
        },

        showChevrons(){
            if (this.trainingsChosen.length > 0) {
                return false;
            }
            else {
                return true;
            }
        }

    },
template:`
 <div class="container-fluid">
        <div class="row"><!-- row 1-->
            <div class="col-sm-12 col-md-10 col-lg-7">
                <form class="" @submit.prevent="verifyTrainingForm">
                    <div class="row">
                        <div class="col-lg-7 col-md-7 text-center">
                            <legend>Ajouter une formation</legend>
                        </div>
                    </div>
                    <table>
                        <td width="20%">
                            <div class="form-group" :class="{'has-error':!isTrainingTitleValid }">
                                <label for="formation" class="label-control">Formation</label><br/><br/>
                                <input type="text" class="form-control" id="formation" name="formation" v-model="trainingTitle"
                                       @focus="msgtrainingTitle = false; confirmFormation = false; isNewTrainingTitle = true;msgname=false;"
                                        placeholder="Formation" maxlength="20">
                            </div>
                        </td>
                        <td width="15%">
                            <div class="form-group">
                                <label>1/2 journées</label><br/><br/>
                                <select class="form-control" v-model="numberHalfDays"
                                        @focus="numberHalfDaysErrorMessage = false; confirmFormation = false; isNewTrainingTitle = true;newTopicErrorMessage=false;">
                                    <option v-for="n in 200">{{n}}</option>
                                </select>
                            </div>
                        </td>
                        <td width="20%">
                            <div class="form-group">
                                <label>Thèmes</label><br/><br/>
                                <select class="form-control" v-model="topicDescription"
                                        @focus="topicErrorMessage = false; confirmFormation = false; isNewTrainingTitle = true;newTopicErrorMessage=false;">
                                    <option v-for="option in optionsTopic" :value="option">{{ option.name }}
                                    </option>
                                </select>
                            </div>
                        </td>
                        <td class="text-center" width="20%">
                            <div class="form-group">
                                <label></label><br/><br/>
                                <input type="submit" class="btn btn-default" value="Valider" style="width:80%"/>
                            </div>
                        </td>
                        <td width="30%" class="td-right">
                            <form>
                                <div class=" form-group has-feedback" :class="{'has-error':  !isNameThemeValid  } ">
                                    <label class="label-control" for="topic">Nouveau thème</label><br/><br/>
                                    <input type="text" class="form-control" id="topic" name="topic" v-model="nameTheme"
                                           @focus="msgname = false; confirmTopic = false; isNewTopic = true;msgtrainingTitle = false;msgnumberHalfDays = false;msgtopic = false;"
                                            placeholder="Thème" maxlength="50">
                                    <span class="glyphicon glyphicon-plus form-control-feedback" @click="verifyTopicForm"style="margin-top: 20px;"></span>
                                </div>
                            </form>
                        </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-center">
                                <div>
                                    <span v-show="!isNewTrainingTitle" class="text-center color-red ">Une formation identique existe déjà.</span>
                                    <span v-show="(msgtrainingTitle || msgnumberHalfDays || msgtopic)"
                                          class="text-center color-red ">Veuillez remplir tous les champs.</span>
                                    <span v-show="confirmFormation && isNewTrainingTitle && !(msgtrainingTitle || msgnumberHalfDays || msgtopic)"
                                          class="text-center color-green " >La formation a été créée avec succès.</span>
                                    <span v-show=" !isTrainingTitleValid && !(msgtrainingTitle || msgnumberHalfDays || msgtopic)"  class="color-red">{{trainingTitleMsg}}</span>
                                </div>
                            </td>
                            <td class="text-center td-right" style="height: 60px;">
                                <div>
                                    <span v-show="msgname" class="text-center color-red ">Veuillez remplir le champ.</span>
                                    <span v-show="!isNewTopic" class="text-center color-red ">Un thème identique existe déjà.</span>
                                    <span v-show="confirmTopic && isNewTopic && !msgname"class="text-center color-green ">Le nouveau thème a été ajouté avec succès.</span>
                                    <span v-show="!isNameThemeValid" class="color-red">{{ nameThemeMsg }}</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div><!--Fin row 1-->
    </div>
`
});

new Vue({
    el: '#TrainingTopic'
});

/**
 * Created by BBA3616 on 24/02/2017.
 */

Vue.use(VueResource);

Vue.component('blue-header',{
    template:`<div style="padding:40px; background-color:#428bca; margin-bottom:30px;">
                   <p style="float:right;">Bienvenue {{email}}</p> 
              </div>`,
    data: function(){
        return {
            email:''
        }
    },
    mounted: function(){
        this.getCookieEmail();
    },
    methods: {
        getCookieEmail() {
            let regexCookie = document.cookie.match('(^|;)\\s*' + "mail" + '\\s*=\\s*([^;]+)');
            this.email = regexCookie ? regexCookie.pop() : '';
        },
    }
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
            email:'',
            optionsTraining:[],
            optionsTopic: [],
            topicsChosen:[],
            test:undefined,
            trainingsOfTopic:[],
            state: training_store.state
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
            this.state.trainingsChosen = [];
            for (var tmp in this.optionsTraining) {
                this.state.trainingsChosen.push(this.optionsTraining[tmp].topicDescription);
            }
            this.state.trainingsChosen = this.removeDuplicates(this.state.trainingsChosen, "id");
            this.state.trainingsChosen.sort(function (a, b) {
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
            this.state.allTopicTraining = [];
            for (var tmp in this.state.trainingsChosen) {
                this.state.allTopicTraining.push(this.TrainingTraim(this.TrainingFilter(this.state.trainingsChosen[tmp].name)));
            }
        },

    },
template:`
 <div class="container-fluid">
        <div class="row"><!-- row 1-->
            <div class="col-sm-12 col-md-10 col-lg-7">
                <form class="" @submit.prevent="verifyTrainingFormBeforeSubmit">
                    <div class="row">
                        <div class="col-lg-7 col-md-7 text-center">
                            <legend>Ajouter une formation</legend>
                        </div>
                    </div>
                    <table>
                        <td width="20%">
                            <div class="form-group" :class="{'has-error':!isTrainingTitleValid }">
                                <label for="formation" class="label-control">Formation</label><br/><br/>
                                <input type="text" class="form-control" v-model="trainingTitle"
                                       @focus="trainingTitleErrorMessage = false; confirmFormation = false; isNewTrainingTitle = true; newTopicErrorMessage=false;"
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
                                <label>&nbsp</label><br/><br/>
                                <input type="submit" class="btn btn-default" value="Valider" style="width:80%"/>
                            </div>
                        </td>
                        <td width="30%" class="td-right">
                            <form>
                                <div class=" form-group has-feedback" :class="{'has-error':  !isNameTopicValid  } ">
                                    <label class="label-control" for="topic">Nouveau thème</label><br/><br/>
                                    <input type="text" class="form-control" v-model="newTopic"
                                           @focus="newTopicErrorMessage = false; confirmTopic = false; isNewTopic = true; trainingTitleErrorMessage = false;numberHalfDaysErrorMessage = false;topicErrorMessage = false;"
                                            placeholder="Thème" maxlength="50">
                                    <span class="glyphicon glyphicon-plus form-control-feedback" @click="verifyTopicFormBeforeSubmit"style="margin-top: 20px;"></span>
                                </div>
                            </form>
                        </td>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-center">
                                <div>
                                    <span v-show="!isNewTrainingTitle" class="text-center color-red ">Une formation identique existe déjà.</span>
                                    <span v-show="(trainingTitleErrorMessage || numberHalfDaysErrorMessage || topicErrorMessage)"
                                          class="text-center color-red ">Veuillez remplir tous les champs.</span>
                                    <span v-show="confirmFormation && isNewTrainingTitle && !(trainingTitleErrorMessage || numberHalfDaysErrorMessage || topicErrorMessage)"
                                          class="text-center color-green " >La formation a été créée avec succès.</span>
                                    <span v-show=" !isTrainingTitleValid && !(trainingTitleErrorMessage || numberHalfDaysErrorMessage || topicErrorMessage)"  class="color-red">{{trainingTitleRegexErrorMessage}}</span>
                                </div>
                            </td>
                            <td class="text-center td-right" style="height: 60px;">
                                <div>
                                    <span v-show="newTopicErrorMessage" class="text-center color-red ">Veuillez remplir le champ.</span>
                                    <span v-show="!isNewTopic" class="text-center color-red ">Un thème identique existe déjà.</span>
                                    <span v-show="confirmTopic && isNewTopic && !newTopicErrorMessage"class="text-center color-green ">Le nouveau thème a été ajouté avec succès.</span>
                                    <span v-show="!isNameTopicValid" class="color-red">{{ newTopicRegexErrorMessage }}</span>
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

Vue.component('show-formation-panel', {
    data: function() {
        return {
            state: training_store.state,

        }
    },
    computed: {
        showChevrons(){
            if (this.state.trainingsChosen.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    template: ` <div class="container-fluid" id="addFormation">
           <div class="row" >
               <div class="col-md-12 col-lg-12 col-sm-12" style="padding:10px;"></div>
               <div class="col-sm-12 col-md-10 col-lg-7">

                   <div class="row">

                       <div class="col-lg-7 col-md-7 text-center">
                           <legend>Formation ajoutées</legend>
                       </div>
                   </div>

                <div style="width: 100%; height: 360px; overflow-y:hidden; overflow-x:hidden;" id="test" class="roundedCorner">
                       <img v-show="showChevrons" src="css/up.png" id="scroll-up" width="60" height="20" style="position: absolute; left:50%; z-index:1;">
                       <table class="fix tabnonborder" >
                           <tbody>
                           <tr>
                               <td v-show="!showChevrons" >Aucune formation n'a été créé.</td>
                               <td>
                                   <template v-for="topicTraining in state.allTopicTraining">
                                       <table class="table table-borderless tabnonborder fix">
                                          
                                              
            <thead>
            <tr>
                <th width="25%">{{topicTraining[0][0].topicDescription.name}}</th>
                <th width="25%"></th>
                <th width="25%"></th>
                <th class="deletetopic" width="25%"><a href="#" class="changecolor"><span class="glyphicon glyphicon-trash"></span> Supprimer ce thème</a></th>
            </tr>
            </thead>
                                           

               <tbody>
            <tr v-for="trainings in topicTraining">
                <td  v-for="training in trainings" width="25%">
                    <button class="btn btn-toolbar btn-group" style="z-index:-1">{{training.trainingTitle}}</button>
                </td>
            </tr>
            </tbody>
                                           </tr>
                                       </table>
                                   </template>
                               </td>
                           </tr>
                           </tbody>
                       </table>
                       <img v-show="showChevrons" src="css/down.png" id="scroll-down" width="60" height="20" style="position: absolute; left:50%; top:95%; z-index:1;">
                   </div>
               </div>
           </div>
       </div>`







});

class trainingStore {
    constructor () {
        this.state = {
            trainingsChosen:[],
            allTopicTraining:[],
        }
    }
}

let training_store = new trainingStore();

new Vue({
    el: '#TrainingTopic'
});

/**
 * Created by BBA3616 on 24/02/2017.
 */
Vue.component('error-messages',{
    props:['height','colspan','identicalErrorMessage','fillFieldErrorMessage','failureModification','successMessage','successSupressionMessage','successModificationMessage','failureMessage','regexErrorMessage',
           'emptyIdenticalError','emptyFillError','emptySuccess','emptyfailureModification','emptySuccessSupression','emptyRegexError','emptyFailure','emptySuccessModification','width'],
    data: function(){
        return {
            styleTd: {
                'height': this.height + 'px',
                'width':this.width + 'px'
            },
        }
    },
    template: `            <td class="text-center col-lg-12" :style="styleTd" :colspan="colspan" :width="width">
                                <div class="errorMessageComponent">
                                    <span v-show="emptyIdenticalError" 
                                          class="text-center color-red">{{ identicalErrorMessage }}
                                    </span>
                                    <span v-show="emptyFillError" 
                                          class="text-center color-red">{{ fillFieldErrorMessage }}
                                    </span>
                                    <span v-show="emptySuccess" 
                                          class="text-center color-green"> {{ successMessage }}
                                    </span>
                                    <span v-show="emptySuccessModification" 
                                          class="text-center color-green"> {{ successModificationMessage }}
                                    </span>
                                    <span v-show="emptySuccessSupression" 
                                          class="text-center color-green"> {{ successSupressionMessage }}
                                    </span>
                                    <span v-show="emptyFailure" 
                                          class="text-center color-red"> {{ failureMessage }}
                                    </span>
                                    <span v-show="emptyfailureModification" 
                                          class="text-center color-red"> {{ failureModification }}
                                    </span>
                                    <span v-show="emptyRegexError" 
                                          class="color-red">{{ regexErrorMessage }}
                                    </span>
                                </div>
                           </td>`
});

let InputText = Vue.component('input-text',{
    props:['width', 'label', 'value', 'placeholder','maxlength', 'isValid','type', 'icon', 'collection', 'printProp','disabled'],
    methods:{
        updateValue(value){
          this.$emit('input',value);
        },
        handleFocus(){
            this.$emit('focus');
        },
        handleClick(){
            this.$emit('click');
        },
        handleBlur(){
            this.$emit('blur');
        }
    },
   template: `        <td :width="width">
                            <div class="form-group has-feedback " 
                                 :class="{'has-error':  !isValid && typeof isValid != 'undefined' } ">
                                <label class="label-control">{{ label }}</label><br/>
                                <input v-if="type ==='input'" 
                                       type="text" 
                                       class="form-control"
                                       :value="value" 
                                       @input="updateValue($event.target.value)"
                                       :placeholder="placeholder" 
                                       :maxlength="maxlength"
                                       @focus="handleFocus"
                                       @blur="handleBlur"
                                       :disabled="disabled"/>
                                <span v-if="typeof icon != 'undefined'" 
                                      class="glyphicon form-control-feedback" 
                                      :class="icon"
                                      @click="handleClick">
                                </span>
                                <select v-else-if="type==='select'"
                                        class="form-control" 
                                        :value="value" 
                                        @input="updateValue($event.target.value)"
                                        @focus="handleFocus">
                                        <option disabled selected value></option>
                                        <option v-for="item in collection" >{{printProp ? item[printProp] : item }}</option>
                                </select>
                            </div>
                        </td>`
});

let AddFormationPanel = Vue.component('add-formation-panel', {
    data: function(){
        return {
            training: {
                trainingTitle: '',
                numberHalfDays: '',
                topicDescription: '',
                topicSkill:''
            },
            trainingTitle: '',
            numberHalfDays: "",
            topicDescription: "",
            topicSkill: "",
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
            isNewTopicValid:true,
            selectOptionsOfTraining:[],
            topicsChosen:[],
            arrangeTrainings:undefined,
            allTrainingsOfATopicChosen:[],
            state: training_store.state,
            trainingStore: training_store
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
        this.gatherSkillsFromDatabase();
        this.gatherTrainingsFromDatabase();
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.activateScrollUp('#scroll-up','#adminTrainingContainer');
        this.activeScrollDown('#scroll-down','#adminTrainingContainer');
        this.activateScrollWheel('#adminTrainingContainer');
    },
    methods: {
        updateV1 (v) {
            this.trainingTitle = v
        },
        updateV2 (v) {
            this.numberHalfDays = v
        },
        updateV3 (v) {
            this.topicDescription = v
        },
        updateV4 (v) {
            this.newTopic = v
        },
        verifyTrainingField(trainingTitle, errorMessage) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]*)*$/.test(trainingTitle)) {
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
                this.isNewTopicValid = true;
            } else {
                this[errorMessage] = "Veuillez entrer un nom de thème valide (-.'_@:+#% autorisés)";
                this.isNewTopicValid = false;

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
            this.trainingTitle = this.trainingTitle.replace(/ +/g, " ").replace(/ +$/, "");
            this.training.trainingTitle = this.trainingTitle;
            this.training.numberHalfDays = this.numberHalfDays;
            for (let tmp in this.state.selectOptionsOfTopic){
                if(this.topicDescription == this.state.selectOptionsOfTopic[tmp].name){
                    this.training.topicDescription = this.state.selectOptionsOfTopic[tmp];
                }
            }
            this.isTrainingTitleEmpty();
            this.isNumberHalfDaysEmpty();
            this.isTopicEmpty();
            this.newTopicErrorMessage = false;
            if (!this.trainingTitleErrorMessage && !this.numberHalfDaysErrorMessage && !this.topicErrorMessage) {
                this.trainingToRegister = JSON.parse(JSON.stringify(this.training));
                this.saveTrainingIntoDatabase();
            }
        },

        verifyTrainingOrTopicBeforeSubmit(){
            if(this.newTopic != '' && this.trainingTitle == ''){
                this.verifyTopicFormBeforeSubmit();
            }else{
                this.verifyTrainingFormBeforeSubmit();
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
            this.topicSkill = '';
            this.trainingToRegister = {};
        },
        resetTopicForm() {
            this.newTopic = '';
            this.topicToRegister = {};
        },

        saveTrainingIntoDatabase() {
            this.trainingToRegister.trainingTitle = this.correct(this.trainingToRegister.trainingTitle);  //delete useless spaces between words
            this.trainingToRegister.numberHalfDays = parseInt(this.training.numberHalfDays);
            let saveTrainingSuccess = () => {
                this.isNewTrainingTitle = true;
                this.confirmFormation = true;
                this.gatherTrainingsFromDatabase();
                this.resetTrainingForm();
                setTimeout(function(){ this.confirmFormation = false; }.bind(this), 2000);
            };

            let saveTrainingError = (response) => {
                console.log("Error: ", response);
                if (response.data.message == "trainingTitle") {
                    this.isNewTrainingTitle = false;
                } else {
                    console.error(response);
                }
            };

            this.post("api/formations", this.trainingToRegister, saveTrainingSuccess, saveTrainingError);
        },

        saveTopicIntoDatabase() {
            this.topicToRegister.name = this.newTopic.replace(" ", "");
            this.topicToRegister.name = this.correct(this.topicToRegister.name);
            let saveTopicSuccess = () => {
                this.confirmTopic = true;
                this.gatherTopicsFromDatabase();
                setTimeout(function () {
                    this.confirmTopic = false;
                }.bind(this), 2000);
            };

            let saveTopicError = (response) => {
                if (response.data.message == "name") {
                    console.log("Error: ", response);
                    this.isNewTopic = false;
                } else {
                    console.error("Error: ", response);
                }
            };

            this.post("api/themes", this.topicToRegister, saveTopicSuccess, saveTopicError);
        },

        gatherTopicsFromDatabase(){
            this.$http.get("api/themes").then(
                function (response) {
                    this.state.selectOptionsOfTopic = response.data;
                    this.state.selectOptionsOfTopic.sort(function (a, b) {
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

        gatherSkillsFromDatabase(){
            this.$http.get("api/skills").then(
                function (response) {
                    console.log("received skills : " + response);
                },
                function (response) {
                    console.error(resposne);
                }
            )
            this.state.skills = [{id:0, version:0, label: "C1"},{id:1, version:0, label: "C2"}];
        },

        gatherTrainingsFromDatabase(){
            this.$http.get("api/formations").then(
                function (response) {
                    this.selectOptionsOfTraining = response.data;
                    this.selectOptionsOfTraining.sort(function (a, b) {
                        return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                    });
                    this.state.allTrainings = this.selectOptionsOfTraining;
                    this.resetTrainingForm();
                    this.trainingStore.topicwithTraining();
                    this.trainingStore.reorganizeAllTopicsAndTrainings();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            ).then(
                function(){
                    console.log("showchevrons : " + this.checkForChevrons("adminTrainingContainer"));
                    this.state.showChevrons = this.checkForChevrons("adminTrainingContainer");
                }
            );
        },

        resetVarialbesByInputTrainingTitle(){
            this.trainingTitleErrorMessage = false;
            this.confirmFormation = false;
            this.isNewTrainingTitle = true;
            this.newTopicErrorMessage = false;
        },

        resetVariablesByInputNumberHalfDays(){
            this.numberHalfDaysErrorMessage = false;
            this.confirmFormation = false;
            this.isNewTrainingTitle = true;
            this.newTopicErrorMessage = false;
        },

        resetVariablesByInputTopic(){
            this.topicErrorMessage = false;
            this.confirmFormation = false;
            this.isNewTrainingTitle = true;
            this.newTopicErrorMessage=false;
        },

        resetVariablesByInputNameTopic(){
            this.newTopicErrorMessage = false;
            this.confirmTopic = false;
            this.isNewTopic = true;
            this.trainingTitleErrorMessage = false;
            this.numberHalfDaysErrorMessage = false;
            this.topicErrorMessage = false;
        },

        showSuccessMessageForTrainingForm(){
            return this.confirmFormation && this.isNewTrainingTitle && !(this.trainingTitleErrorMessage || this.numberHalfDaysErrorMessage || this.topicErrorMessage);
        },

        showSuccessMessageForTopicForm(){
            return this.confirmTopic && this.isNewTopic && !this.newTopicErrorMessage;
        },

        showEmptyInputMessageForTrainingForm(){
            return (this.trainingTitleErrorMessage || this.numberHalfDaysErrorMessage || this.topicErrorMessage);
        },

        showEmptyInputMessageForTopicForm(){
            return this.newTopicErrorMessage;
        },

        showInvalidateInputMessageForTrainingForm(){
            return !this.isTrainingTitleValid && !(this.trainingTitleErrorMessage || this.numberHalfDaysErrorMessage || this.topicErrorMessage);
        },

        showInvalidateInputMessageForTopicForm(){
            return !this.isNewTopicValid;
        },

        showExistInputMessageForTrainingForm(){
            return !this.isNewTrainingTitle;
        },

        showExistInputMessageForTopicForm(){
            return !this.isNewTopic;
        },

        correct(stringToCorrect) {
            let correctedString = stringToCorrect.toUpperCase();
            correctedString = correctedString.replace(/[ÁÀÄÂ]/g, "A");
            correctedString = correctedString.replace(/[ÉÈËÊ]/g, "E");
            correctedString = correctedString.replace(/[ÍÌÏÎ]/g, "I");
            correctedString = correctedString.replace(/[ÓÒÖÔ]/g, "O");
            correctedString = correctedString.replace(/[ÚÙÜÛ]/g, "U");
            return correctedString;
        }
    },
// language=HTML
    template:`
                  <div id="addNewFormation" class="trainingBlock">
                        <div class="row">
                             <div class="col-lg-12 col-md-12 text-center">
                                  <legend class="dark">Ajouter une formation</legend>
                             </div>
                        </div>
                        <form id="newFormation" @submit.prevent="verifyTrainingOrTopicBeforeSubmit">
                            <table class="borderRadius">
                                <tr id="testtt">
                                    <input-text 
                                        width="15%"
                                        :value="trainingTitle" 
                                        @input="updateV1"
                                        placeholder="Formation"
                                        maxlength="20"
                                        @focus="resetVarialbesByInputTrainingTitle()"
                                        :isValid="isTrainingTitleValid"
                                        type='input'>
                                    </input-text>
                                    <td width="15%">
                                        <div class="form-group has-feedback ">
                                            <br/>
                                            <select class="form-control" v-model="numberHalfDays"  
                                                    @focus="resetVariablesByInputNumberHalfDays()" required>
                                                <option value="" disabled selected hidden>1/2 journées</option>
                                                <option v-for="n in 200">{{n}}</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td width="15%">
                                        <div class="form-group has-feedback ">
                                            <br/>
                                            <select class="form-control" v-model="topicDescription"
                                                @focus="resetVariablesByInputTopic()" required>
                                                <option value="" disabled selected hidden>Thèmes</option>
                                                <option v-for="option in state.selectOptionsOfTopic">{{ option.name }}</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td width="15%" v-if="state.skills.length > 0">
                                        <div class="form-group has-feedback ">
                                            <br/>
                                            <select class="form-control" v-model="topicSkill"
                                                    @focus="resetVariablesByInputTopic()" required>
                                                <option value="" disabled selected hidden>Compétence</option>
                                                <option v-for="option in state.skills">{{ option.label }}</option>
                                            </select>
                                        </div>
                                    </td>
                                    
                                    <td class="text-center" width="20%">
                                        <div class="form-group">
                                             <br/>
                                             <input type="button"  
                                                   @click="verifyTrainingFormBeforeSubmit"
                                                   class="btn btn-primary buttonForm" 
                                                   value="Valider" 
                                                   />
                                             <input v-show="false" type="submit">
                                        </div>
                                    </td>
                                    <input-text width="30%" 
                                                    :value="newTopic"
                                                    @input="updateV4"
                                                    placeholder="Nouveau thème"
                                                    maxlength="50"
                                                    @focus="resetVariablesByInputNameTopic()"
                                                    :isValid="isNewTopicValid"
                                                    type='input'
                                                    class="td-right"
                                                    @click="verifyTopicFormBeforeSubmit">
                                    </input-text>
                                     <img id="plusImage" src="/img/other_icon/iconPlus.png" @click="verifyTopicFormBeforeSubmit">
                                </tr>
                                <tr>
                                    <error-messages :colspan="4"
                                                    :height="45"
                                                    identicalErrorMessage="Une formation identique existe déjà." 
                                                    fillFieldErrorMessage="Veuillez remplir tous les champs." 
                                                    successMessage="La formation a été créée avec succès." 
                                                    :regexErrorMessage="trainingTitleRegexErrorMessage"
                                                    :emptyIdenticalError="showExistInputMessageForTrainingForm()"
                                                    :emptyFillError="showEmptyInputMessageForTrainingForm()"
                                                    :emptySuccess="showSuccessMessageForTrainingForm()"
                                                    :emptyRegexError="showInvalidateInputMessageForTrainingForm()">
                                    </error-messages>
                                    <error-messages class="td-right"
                                                    :height="45"
                                                    :width="250"
                                                    identicalErrorMessage="Un thème identique existe déjà." 
                                                    fillFieldErrorMessage="Veuillez remplir le champ." 
                                                    successMessage="Le nouveau thème a été ajouté avec succès." 
                                                    :regexErrorMessage="newTopicRegexErrorMessage"
                                                    :emptyIdenticalError="showExistInputMessageForTopicForm()"
                                                    :emptyFillError="showEmptyInputMessageForTopicForm()"
                                                    :emptySuccess="showSuccessMessageForTopicForm()"
                                                    :emptyRegexError="showInvalidateInputMessageForTopicForm()">
                                    </error-messages>
                                </tr>
                            </table>
                        </form>
                   </div>`
});

let ShowFormation = Vue.component('show-formation-panel', {
    data: function() {
        return {
            state: training_store.state,
            trainingStore: training_store,
            upHere: false,
            trainingIdSelected:'',
            allTrainings: [],
        }
    },
    mounted: function() {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
    },
    computed: {
        noFormation(){
            return this.state.allTopicTraining.length == 0
        }
    },
    methods:{
        gatherTopicsFromDatabase(){
            this.$http.get("api/themes").then(
                function (response) {
                    this.state.selectOptionsOfTopic = response.data;
                    this.state.selectOptionsOfTopic.sort(function (a, b) {
                        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                    });
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
                    this.allTrainings = response.data;
                    this.allTrainings.sort(function (a, b) {
                        return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                    });
                    this.state.allTrainings = this.allTrainings;
                    this.trainingStore.topicwithTraining();
                    this.trainingStore.reorganizeAllTopicsAndTrainings();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            ).then(
                function(){
                    this.state.showChevrons = this.checkForChevrons("adminTrainingContainer");
                }
            );
        },

        removeTopic(topicToRemove){
            let removeTopicSuccess = () => {
                this.gatherTrainingsFromDatabase();
                this.gatherAllSessions();
                this.gatherTopicsFromDatabase();
            };
            this.post("api/removetopic", topicToRemove, removeTopicSuccess)
        },

        removeTraining(trainingToRemove){
            let removeTopicSuccess = () => {
                this.gatherTrainingsFromDatabase();
                this.gatherAllSessions();
            };

            this.post("api/removetraining", trainingToRemove, removeTopicSuccess);
        },

        createSession(id){
            this.state.idTraining = id;
            this.state.idSession = '';
            this.trainingStore.collectInformationOfTrainingChosen();
            this.gatherSessionsByTrainingFromDatabase();
        },

        gatherSessionsByTrainingFromDatabase(){
            this.$http.get("api/formations/" + this.state.idTraining + "/sessions").then(
                function (response) {
                    this.state.listTrainingSession = response.data;
                    if (this.state.listTrainingSession.length === 0) {
                        this.state.isNoSession = true;
                    }
                    else{
                        this.state.isNoSession = false;
                    }
                },function (error) {
                    console.log('error:');
                });
        },

        showCloseButton(trainingId){
            this.upHere = true;
            this.trainingIdSelected = trainingId;
        },

        hideCloseButton(){
            this.upHere = false;
            this.trainingIdSelected = null;
        },

        verifyShowButtonOrNot(trainingId){
            if(this.upHere == true && this.trainingIdSelected == trainingId)
                return true;

                return false;
        },

        gatherAllSessions(){
            this.$http.get("api/sessions").then(
                function (response) {
                    console.log("success to get all sessions from database");
                    this.state.allSessions = response.data;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                });
        },

        addNewSkill(){
            alert("Hello");
        }
    },
    // language=HTML
    template: `
                <div>
                    <saveModal v-if="state.showSkillSetting" @close="state.showSkillSetting = false">
                        <!--
                        you can use custom content here to overwrite
                        default content
                        -->
                        <h3 slot="header">Lier la formation avec des compétences</h3>
                        <div slot="body">
                            <div>
                                <div class="col-sm-12 col-md-6 col-lg-6">
                                    <h4>
                                        Compétences
                                    </h4>
                                    <button type="button" class="btn btn-info">Test Compétence5</button>
                                    <button type="button" class="btn btn-info">Test Compétence5</button>
                                    <button type="button" class="btn btn-info">Test Compétence5</button>
                                </div>  
                                <div class="col-sm-12 col-md-6 col-lg-6">
                                    <h4>
                                        Compétence Liées
                                    </h4>
                                    <button type="button" class="btn btn-success">Test Compétence5</button>
                                    <button type="button" class="btn btn-success">Test Compétence5</button>
                                </div>  
                            </div>
                        </div>
                        <div slot="body2" class="col-sm-12 col-md-12 col-lg-12" style="margin-top:20px;">
                            <input size="35" type="text" placeholder="Ajouter une nouvelle compétence">
                            <span class="glyphicon glyphicon-plus" @click="addNewSkill()" style="cursor: pointer;"></span>
                        </div>   
                        
                    </saveModal>
                    <div id="addFormation" class="trainingBlock">
    
                        <div class="row">
                            <div style="z-index:10;" class="col-lg-12 col-md-12 text-center">
                                 <legend class="blueLegend">Formations ajoutées</legend>
                            </div>
                        </div>
                        <div style="width: 100%; height: 31em; overflow-y:hidden; overflow-x:hidden;" id="adminTrainingContainer" >
                              <img v-show="state.showChevrons" id="scroll-up" src="img/other_icon/scroll_up.png" width="70" height="50" 
                    style="position: absolute; left:41%; z-index:1; top: 33px; cursor: pointer;">
                                    <p v-show="noFormation" style="text-align: center; margin-top:70px;">Aucune formation n'a été créée.</p>
                                    <table class="fix tabnonborder" >
                                        <tbody>
                                              <tr>
                                                  
                                                  <td>
                                                       <template v-for="topicTraining in state.allTopicTraining">
                                                            <table class="table table-borderless tabnonborder fix">                               
                                                                <thead>
                                                                    <tr>
                                                                        <th width="25%">{{topicTraining[0][0].topicDescription.name}}</th>
                                                                        <th width="25%"></th>
                                                                        <th width="15%"></th>
                                                                        <th class="deletetopic" width="20%"><a style="cursor: pointer;" class="changecolor" @click="state.showSkillSetting = true"><span class="glyphicon glyphicon-plus"></span> Compétences</a></th>
                                                                        <th class="deletetopic" width="15%"><a style="cursor: pointer;" @click="removeTopic(topicTraining[0][0].topicDescription)" class="changecolor"><span @click="removeTopic(topicTraining[0][0].topicDescription)" class="glyphicon glyphicon-trash"></span> Supprimer</a></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr v-for="trainings in topicTraining" >
                                                                        <td  v-for="training in trainings" width="25%" style="position: relative">
                                                                           <a  @click="removeTraining(training)"@mouseover="showCloseButton(training.id)" @mouseleave="hideCloseButton()" class="boxclose" id="boxclose" v-show="verifyShowButtonOrNot(training.id)"></a>
                                                                           <router-link :to="{name: 'addSession'}"><button @mouseover="showCloseButton(training.id)" @mouseleave="hideCloseButton()"   class="btnTraining btn btn-toolbar btn-group"   @click="createSession(training.id)">{{training.trainingTitle}}</button></router-link>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                       </template>
                                                  </td>
                                              </tr>
                                        </tbody>
                                    </table>
                              <img v-show="state.showChevrons" src="img/other_icon/scroll_down.png" id="scroll-down" width="70" height="50" style="position: absolute; left:41%; top:95%; z-index:1; margin-top: -15px;">
                        </div>
                     </div>
                
                </div>`
});

class trainingStore {
    constructor () {
        this.state = {
            showSkillSetting: false,
            showChevrons:false,
            trainingsChosen:[],
            allTopicTraining:[],
            changePageToTraining:true,
            changePageToSession:false,
            idTraining:'',
            trainingChosen:{},
            allTrainings:[],
            trainingTitle:'',
            arrangeTrainings:[],
            allTrainingsOfATopicChosen:[],
            listTrainingSession:[],
            isNoSession:true,
            idSession:'',
            nomUser:'',
            prenomUser:'',
            allSessions: [],
            selectOptionsOfTopic: [],
            skills: []
        }
    }
    collectInformationOfTrainingChosen(){
        this.state.trainingChosen = {};
        for (var tmp in this.state.allTrainings) {
            if (this.state.allTrainings[tmp].id == this.state.idTraining) {
                this.state.trainingChosen = this.state.allTrainings[tmp];
            }
        }
        this.state.trainingTitle = this.state.trainingChosen.trainingTitle;
    }
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
    }
    topicwithTraining(){
        this.state.trainingsChosen = [];
        for (var tmp in this.state.allTrainings) {
            this.state.trainingsChosen.push(this.state.allTrainings[tmp].topicDescription);
        }
        this.state.trainingsChosen = this.removeDuplicates(this.state.trainingsChosen, "id");
        this.state.trainingsChosen.sort(function (a, b) {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });

    }
    reorganizeTrainings(value){
        this.state.arrangeTrainings = [];
        var tmp = [];
        var longueur = value.length;
        var compteur = 0;
        for (var element in value) {
            longueur--;
            compteur++;
            if (compteur >= 1 && compteur < 4) {
                tmp.push(value[element]);
                if (longueur == 0) {
                    this.state.arrangeTrainings.push(tmp);
                }
            } else if (compteur == 4) {
                tmp.push(value[element]);
                this.state.arrangeTrainings.push(tmp);
                tmp = [];
                compteur = 0;
            }
        }
        return this.state.arrangeTrainings;
    }
    chooseAllTrainingsOfATopic(value){
        this.state.allTrainingsOfATopicChosen = [];
        for (var tmp in this.state.allTrainings) {
            if (this.state.allTrainings[tmp].topicDescription.name == value) {
                this.state.allTrainingsOfATopicChosen.push(this.state.allTrainings[tmp]);
            }
        }
        return this.state.allTrainingsOfATopicChosen;
    }
    reorganizeAllTopicsAndTrainings(){
        this.state.allTopicTraining = [];
        for (var tmp in this.state.trainingsChosen) {
            this.state.allTopicTraining.push(this.reorganizeTrainings(this.chooseAllTrainingsOfATopic(this.state.trainingsChosen[tmp].name)));
        }
    }
}

let training_store = new trainingStore();
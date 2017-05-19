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
    template: `            <td class="text-center" :style="styleTd" :colspan="colspan" :width="width">
                                <div>
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
            if(this.newTopic != ''){
                this.verifyTopicFormBeforeSubmit();
            }else{
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
            this.trainingToRegister.trainingTitle = this.training.trainingTitle.toUpperCase();  //delete useless spaces between words
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
            this.topicToRegister.name = this.newTopic.replace(" ", "").toUpperCase();

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
        }
    },
template:`
         <div class="container-fluid">
                        <div class="row">
                             <div class="col-lg-7 col-md-7 text-center">
                                  <legend>Ajouter une formation</legend>
                             </div>
                        </div>
                        <form @submit.prevent="verifyTrainingFormBeforeSubmit">
                            <table class="borderRadius">
                                <tr>
                                    <input-text 
                                        width="20%"
                                        label="Formation" 
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
                                            <label class="label-control">1/2 journées</label>
                                            <br/>
                                            <select class="form-control" v-model="numberHalfDays"  
                                                    @focus="resetVariablesByInputNumberHalfDays()">
                                                <option v-for="n in 200">{{n}}</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td width="20%">
                                        <div class="form-group has-feedback ">
                                            <label class="label-control">Thèmes</label>
                                            <br/>
                                            <select class="form-control" v-model="topicDescription"
                                                @focus="resetVariablesByInputTopic()">
                                                <option v-for="option in state.selectOptionsOfTopic">{{ option.name }}</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td class="text-center" width="20%">
                                        <div class="form-group">
                                             <label>&nbsp</label><br/>
                                             <input type="submit" 
                                                   class="btn btn-primary" 
                                                   value="Valider" 
                                                   style="width:80%"/>
                                        </div>
                                    </td>
                                    <input-text width="30%" 
                                                    label="Nouveau thème" 
                                                    :value="newTopic"
                                                    @input="updateV4"
                                                    placeholder="Thème"
                                                    maxlength="50"
                                                    @focus="resetVariablesByInputNameTopic()"
                                                    :isValid="isNewTopicValid"
                                                    icon="glyphicon-plus btn btn-primary"
                                                    type='input'
                                                    class="td-right"
                                                    @click="verifyTopicFormBeforeSubmit">
                                    </input-text>
                                </tr>
                                <tr>
                                    <error-messages :colspan="4"
                                                    :height="80"
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
                                                    :height="80"
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
         </div>
        `
});

let ShowFormation = Vue.component('show-formation-panel', {
    data: function() {
        return {
            state: training_store.state,
            trainingStore: training_store,
            upHere: false,
            trainingIdSelected:'',
            allTrainings: []
        }
    },
    mounted: function() {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
    },
    computed: {
        showChevrons(){
            if (this.state.allTopicTraining.length > 0) {
                return true;
            }
            else {
                return false;
            }
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
            this.state.changePageToSession = true;
            this.state.changePageToTraining = false;
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
    },
    template: `
             <div v-show="state.changePageToTraining" class="container-fluid" id="addFormation"  style="margin-top: 10px;">
                            <div class="row">
                                <div class="col-lg-7 col-md-7 text-center">
                                     <legend>Formation ajoutées</legend>
                                </div>
                            </div>
                            <div style="width: 100%; height: 360px; overflow-y:hidden; overflow-x:hidden;" id="adminTrainingContainer" class="roundedCorner">
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
                                                                            <th class="deletetopic" width="25%"><a style="cursor: pointer;" @click="removeTopic(topicTraining[0][0].topicDescription)" class="changecolor"><span @click="removeTopic(topicTraining[0][0].topicDescription)" class="glyphicon glyphicon-trash"></span> Supprimer ce thème</a></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr v-for="trainings in topicTraining" >
                                                                            <td  v-for="training in trainings" width="25%" style="position: relative">
                                                                               <a  @click="removeTraining(training)"@mouseover="showCloseButton(training.id)" @mouseleave="hideCloseButton()" class="boxclose" id="boxclose" v-show="verifyShowButtonOrNot(training.id)"></a>
                                                                               <button  @mouseover="showCloseButton(training.id)" @mouseleave="hideCloseButton()"   class="btn btn-toolbar btn-group"   @click="createSession(training.id)">{{training.trainingTitle}}</button>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                           </template>
                                                      </td>
                                                  </tr>
                                            </tbody>
                                        </table>
                                  <img v-show="showChevrons" src="css/down.png" id="scroll-down" width="60" height="20" style="position: absolute; left:50%; top:95%; z-index:1;">
             </div>`
});

let AddSessionPanel = Vue.component('add-session-panel', {
    data: function() {
        return {
            session:{
                trainingDescription:{},
                beginning: '',
                ending: '',
                beginningTime: '',
                endingTime: '',
                location: ''
            },
            sessionToRegister:{},
            sessionToModify:{
                id:'',
                trainingDescription:{},
                beginning: '',
                ending: '',
                beginningTime: '',
                endingTime: '',
                location: ''
            },
            beginningDate:'',
            endingDate:'',
            beginningTime:'09:00',
            endingTime:'18:00',
            location:'',
            isSessionAlreadyPlanned:false,
            isDisabledTrainingTitle:true,
            sessionToRemove:{},
            AllSalles:['Salle Bali','Salle de la Fontaine','Salle Bora Bora','Salle Bastille','Salle Saint-Germain','Salle Escale','Salle Cafet-Terrasse'],
            isDisabledSupprimer:true,
            numberOfSessionSelected:0,
            canNotRegisterForm: false,
            listTrainingSessionSelected:[],
            allTrainings: [],
            trainingTitleInAddSession:'',
            isTrainingTitleInAddSessionValid:true,
            isBeginningDateValid:true,
            trainingTitleInAddSessionRegexErrorMessage:'',
            beginningDateRegexErrorMessage:'',
            locationRegexErrorMessage:'',
            trainingTitleInAddSessionErrorMessage:false,
            beginningDateErrorMessage:false,
            locationErrorMessage:false,
            confirmSession:false,
            modifySessionButton: false,
            valueButtonSaveModify: "Ajouter",
            state: training_store.state,
            trainingStore: training_store,
            beginningDateForTest:'',
            confirmModification:false,
            confirmSupression:false,
            failureModification:false,
            beginningDateForTest:'',
            toDay:''
        }
    },
    mounted: function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.getDate();
    },
    watch:{
        trainingTitleInAddSession: function (trainingTitleValue) {
            this.verifyTrainingTitleInAddSession(trainingTitleValue, 'trainingTitleInAddSessionRegexErrorMessage');
        },

        beginningDateForTest: function (beginningDateValue) {
            this.verifyBeginningDate(beginningDateValue, 'beginningDateRegexErrorMessage');
        },
    },
    methods: {
        verifyTrainingTitleInAddSession(trainingTitle, errorMessage) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]*)*$/.test(trainingTitle)) {
                this[errorMessage] = '';
                this.isTrainingTitleInAddSessionValid = true;
            } else {
                this[errorMessage] = "Veuillez entrer un nom de formation valide (-.'_@:+#% autorisés)";
                this.isTrainingTitleInAddSessionValid = false;
            }
        },

        isTrainingTitleInAddSessionEmpty(){
            if (this.state.trainingTitle == '' || this.state.trainingTitle == undefined) {
                this.trainingTitleInAddSessionErrorMessage = true;
            }
        },

        verifyBeginningDate(beginningDate, errorMessage) {
            if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(beginningDate)) {
                if(this.testDate(beginningDate)){
                    this[errorMessage] = '';
                    this.isBeginningDateValid = true;
                    this.calculateEndingDate();
                }else{
                    this[errorMessage] = "La date est déjà passée!";
                    this.isBeginningDateValid = false;
                }
            } else {
                this[errorMessage] = "Veuillez entrer une date valide (JJ / mm / AAAA)";
                this.isBeginningDateValid = false;
            }
        },

        isBeginningDateEmpty(){
            if (this.beginningDate == '' || this.beginningDate == undefined) {
                this.beginningDateErrorMessage = true;
            }
        },

        isLocationEmpty(){
            if (this.location == '' || this.location == undefined) {
                this.locationErrorMessage = true;
            }
        },

        activeFieldTrainingTitle(){
            if (this.isDisabledTrainingTitle == true) {
                this.trainingTitleInAddSession = this.state.trainingTitle;
                this.isDisabledTrainingTitle = false;
            } else if ((this.isDisabledTrainingTitle == false) && (this.isTrainingTitleInAddSessionValid == true)) {
                this.isDisabledTrainingTitle = true;
                if (this.trainingTitleInAddSession != this.state.trainingTitle) {
                    this.trainingTitleInAddSession = this.state.trainingTitle;
                    this.failureModification = true;
                    setTimeout(function () {
                        this.failureModification = false;
                    }.bind(this), 2000);
                }
                this.trainingTitleInAddSession = this.state.trainingTitle;
            }
        },

        updateV1 (v) {
            this.trainingTitleInAddSession = v;
        },
        updateV2 (v) {
            this.beginningDate = v;
            this.beginningDateForTest = v;
        },
        updateV3 (v) {
            this.location = v;
        },
        updateV4 (v) {
            this.endingDate = v;
        },

        returnToPageTraining(){
            this.isDisabledTrainingTitle = true;
            this.state.changePageToTraining = true;
            this.state.changePageToSession = false;
            this.state.idTraining = '';
            this.state.trainingChosen = {};
            this.state.trainingTitle = '';
            this.confirmSession = false;
            this.trainingTitleInAddSessionErrorMessage = false;
            this.beginningDateErrorMessage = false;
            this.locationErrorMessage = false;
            this.isBeginningDateValid = true;
            this.isSessionAlreadyPlanned = false;
            this.resetSessionForm();
            this.gatherTrainingsFromDatabase();
        },

        resetSessionForm(){
            this.beginningDate = '';
            this.endingDate = '';
            this.location = '';
            this.modifySessionButton = false;
            this.isDisabledSupprimer = true;
            this.valueButtonSaveModify = 'Ajouter';
            this.state.idSession='';
        },

        verifyFormBeforeSaveSession(){
            if(this.modifySessionButton){
                this.modifyTrainingSession();
            }
            else {
                this.session.trainingDescription = this.state.trainingChosen;
                this.session.trainingDescription.trainingTitle = this.state.trainingTitle;
                this.session.beginning = this.beginningDate;
                this.session.ending = this.endingDate;
                this.session.beginningTime = this.beginningTime;
                this.session.endingTime = this.endingTime;
                this.session.location = this.location;
                this.isTrainingTitleInAddSessionEmpty();
                this.isBeginningDateEmpty();
                this.isLocationEmpty();
                if (!this.trainingTitleInAddSessionErrorMessage && !this.beginningDateErrorMessage && !this.locationErrorMessage) {
                    this.sessionToRegister = JSON.parse(JSON.stringify(this.session));
                    this.saveSessionIntoDatabase();
                }
            }
        },

        modifyTrainingTopic(){
            if (this.isDisabledTrainingTitle == false) {
                this.trainingTitleInAddSession = this.trainingTitleInAddSession.replace(" ", "").toUpperCase();
                this.state.trainingTitle = this.trainingTitleInAddSession;
                this.$http.put("api/formations/" + this.state.trainingTitle + "/formationid/" + this.state.idTraining);
                this.confirmModification = true;
                setTimeout(function () {
                    this.confirmModification = false;
                }.bind(this), 1500);
            }
        },

        saveSessionIntoDatabase(){
            let saveSessionSuccess = () => {
                this.isSessionAlreadyPlanned = false;
                this.confirmSession = true;
                setTimeout(function(){ this.confirmSession = false; }.bind(this), 1500);
                this.state.changePageToSession = false;
                this.state.changePageToTraining = true;
                this.resetSessionForm();
                this.gatherSessionsByTrainingFromDatabase();
                this.gatherAllSessions();
            };

            let saveSessionError = (response) => {
                if (response.data.message === "TrainingSession already planned") {
                    this.isSessionAlreadyPlanned = true;
                } else {
                    console.error(response);
                }
            };

            this.post("api/sessions", this.sessionToRegister, saveSessionSuccess, saveSessionError);
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
            );
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
                });
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

        modifyTrainingSession(){
            this.sessionToModify.id = this.state.idSession;
            this.sessionToModify.trainingDescription = this.state.trainingChosen;
            this.sessionToModify.trainingDescription.trainingTitle = this.state.trainingTitle;
            this.sessionToModify.beginning = this.beginningDate;
            this.sessionToModify.ending = this.endingDate;
            this.sessionToModify.beginningTime = this.beginningTime;
            this.sessionToModify.endingTime = this.endingTime;
            this.sessionToModify.location = this.location;
            this.sessionToModify = JSON.parse(JSON.stringify(this.sessionToModify));
            this.$http.put("api/sessions", this.sessionToModify).then(
                function (response) {
                    this.isSessionAlreadyPlanned = false;
                    this.confirmModification = true;
                    setTimeout(function(){ this.confirmModification = false; }.bind(this), 1500);
                    document.getElementById('circle' + this.sessionToModify.id).className = 'circle';
                    this.listTrainingSessionSelected.splice(0,this.listTrainingSessionSelected.length);
                    this.numberOfSessionSelected--;
                    this.resetSessionForm();
                    this.gatherSessionsByTrainingFromDatabase();
                    this.gatherAllSessions();
                },
                function (response) {
                    this.confirmModification = false;
                    if (response.data.message === "TrainingSession already planned") {
                        this.isSessionAlreadyPlanned = true;
                    } else {
                        console.error(response);
                    }
                });
        },

        chooseSessionsToRemove(){
                for (var indexOfListTrainingSessionSelected in this.listTrainingSessionSelected) {
                    this.removeSession(this.listTrainingSessionSelected[indexOfListTrainingSessionSelected]);
                    document.getElementById('circle' + this.listTrainingSessionSelected[indexOfListTrainingSessionSelected].id).className = 'circle';
                    this.numberOfSessionSelected--;
                }
            this.listTrainingSessionSelected.splice(0,this.listTrainingSessionSelected.length);
            this.confirmSupression = true;
            setTimeout(function(){ this.confirmSupression = false; }.bind(this), 1500);
        },

        removeSession(sessionToRemove){
            let removeSessionSuccess = () => {
                this.canNotRegisterForm = false;
                this.resetSessionForm();
                this.gatherSessionsByTrainingFromDatabase();
                this.gatherAllSessions();
            };

            this.post("api/sessionstoremove", sessionToRemove, removeSessionSuccess);
        },

        showSession(session){
            let sessionUnselected = document.getElementById('circle' + session.id).className === 'circle';

            let initializeParameters = () => {
                this.trainingTitleInAddSessionErrorMessage = false;
                this.beginningDateErrorMessage = false;
                this.locationErrorMessage = false;
                this.isTrainingTitleInAddSessionValid = true;
                this.isBeginningDateValid = true;
                this.isSessionAlreadyPlanned = false;
            };

            let addToSelectedSessions = () => {
                document.getElementById('circle' + session.id).className = 'full-circle';
                this.numberOfSessionSelected++;
                this.listTrainingSessionSelected.push(session);
            };

            let removeFromSelectedSessions = () => {
                document.getElementById('circle' + session.id).className = 'circle';
                this.numberOfSessionSelected--;
                for (var indexOfListTrainingSessionSelected in this.listTrainingSessionSelected) {
                    if (this.listTrainingSessionSelected[indexOfListTrainingSessionSelected].id === session.id) {
                        this.listTrainingSessionSelected.splice(indexOfListTrainingSessionSelected, 1);
                    }
                }
            };

            let setModifiedSession = () => {
                let sessionModified = this.listTrainingSessionSelected[0];
                this.valueButtonSaveModify = "Modifier";
                this.modifySessionButton = true;
                this.beginningDate = sessionModified.beginning;
                this.endingDate = sessionModified.ending;
                this.location = sessionModified.location;
                this.state.idSession = sessionModified.id;
            };

            initializeParameters();
            if (sessionUnselected) {
                addToSelectedSessions();
            }
            else {
                removeFromSelectedSessions();
            }
            this.canNotRegisterForm = this.numberOfSessionSelected >= 2;
            if (this.numberOfSessionSelected === 1) {
                setModifiedSession();
            }
            else {
                this.resetSessionForm();
            }
        },

        canNotUseButtonSupprimer(){
            if(this.numberOfSessionSelected>=1){
                return false;
            }else{
                return true;
            }
        },

        setHolidays (an){
            var JourAn = new Date(an, "00", "01")
            var FeteTravail = new Date(an, "04", "01")
            var Victoire1945 = new Date(an, "04", "08")
            var FeteNationale = new Date(an, "06", "14")
            var Assomption = new Date(an, "07", "15")
            var Toussaint = new Date(an, "10", "01")
            var Armistice = new Date(an, "10", "11")
            var Noel = new Date(an, "11", "25")
            var SaintEtienne = new Date(an, "11", "26")

            var G = an % 19
            var C = Math.floor(an / 100)
            var H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30
            var I = H - Math.floor(H / 28) * (1 - Math.floor(H / 28) * Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11))
            var J = (an * 1 + Math.floor(an / 4) + I + 2 - C + Math.floor(C / 4)) % 7
            var L = I - J
            var MoisPaques = 3 + Math.floor((L + 40) / 44)
            var JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4)
            var Paques = new Date(an, MoisPaques - 1, JourPaques)
            var VendrediSaint = new Date(an, MoisPaques - 1, JourPaques - 2)
            var LundiPaques = new Date(an, MoisPaques - 1, JourPaques + 1)
            var Ascension = new Date(an, MoisPaques - 1, JourPaques + 39)
            var Pentecote = new Date(an, MoisPaques - 1, JourPaques + 49)
            var LundiPentecote = new Date(an, MoisPaques - 1, JourPaques + 50)

            return new Array(JourAn, LundiPaques, FeteTravail, Victoire1945, Ascension, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel, SaintEtienne)
        },

        calculateEndingDate(){
            if (/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(this.beginningDate)) {
                if(this.state.trainingChosen.numberHalfDays !=1)
                var nbDays = Math.ceil(this.state.trainingChosen.numberHalfDays / 2)-1;
                else
                    nbDays = 0;
                var beginningDate = this.beginningDate;
                var dateParts = beginningDate.split("/");
                var dateObject = new Date(dateParts[1] + "/"+dateParts[0]+"/"+dateParts[2]);
                var debut = new Date(dateParts[1] + "/"+dateParts[0]+"/"+dateParts[2]);
                var dayOfMonth = dateObject.getDate();
                var fin = dateObject;
                fin.setDate(dayOfMonth+nbDays)
                for (var d = debut; d <= fin; d.setDate(d.getDate() + 1)) {
                    if(d.getDay() == 6 || d.getDay() == 0 || this.setHolidays(d.getFullYear()).filter(function(e) { return e.getTime() === d.getTime(); }).length > 0){
                        nbDays++;
                        fin.setDate(fin.getDate() + 1);
                    }
                }
                dateObject.setDate(dayOfMonth + nbDays);
                function pad(s) { return (s < 10) ? '0' + s : s; }
                this.endingDate = [pad(dateObject.getDate()), pad(dateObject.getMonth()+1), dateObject.getFullYear()].join('/');

            }else{
                this.endingDate = '';
            }
        },

        testDate(beginningDate){
            var d = new Date();
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var today = [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
            var todayParts = today.split("/");
            var dateParts = beginningDate.split("/");
            if(dateParts[2]<todayParts[2]){
                return false;
            }else if((dateParts[2] == todayParts[2]) && (dateParts[1] < todayParts[1])){
                return false;
            }else if((dateParts[2] == todayParts[2]) && (dateParts[1] == todayParts[1]) && (dateParts[0]<todayParts[0])){
                return false;
            }else{
                return true;
            }
        },

        getDate(){
            var now = new Date();
            var day = now.getDate();
            var month = now.getMonth() + 1;
            var year = now.getFullYear();
            this.toDay = (year + "-" + month + "-" + day);
        },

        resetVarialbesByDate(){
            this.confirmSession = false;
            this.trainingTitleInAddSessionErrorMessage = false;
            this.beginningDateErrorMessage = false;
            this.locationErrorMessage = false;
        },

        resetVariablesBySalle(){
            this.confirmSession = false;
            this.trainingTitleInAddSessionErrorMessage = false;
            this.beginningDateErrorMessage = false;
            this.locationErrorMessage = false;
        },

        showSuccessToCreateMessage(){
            return this.confirmSession && !(this.trainingTitleInAddSessionErrorMessage || this.beginningDateErrorMessage || this.locationErrorMessage);
        },
        showSuccessToModifyMessage(){
            return this.confirmModification && !this.confirmSession && !(this.trainingTitleInAddSessionErrorMessage || this.beginningDateErrorMessage || this.locationErrorMessage);
        },
        showSuccessToDeleteMessage(){
            return this.confirmSupression && !this.confirmModification && !this.confirmSession && !(this.trainingTitleInAddSessionErrorMessage || this.beginningDateErrorMessage || this.locationErrorMessage);
        },
        showEmptyInputMessage(){
            return (this.trainingTitleInAddSessionErrorMessage || this.beginningDateErrorMessage || this.locationErrorMessage);
        },
        showInvalidateInputMessage(){
            return !this.isBeginningDateValid && !this.beginningDateErrorMessage;
        },
        showExistInputMessage(){
            return this.isSessionAlreadyPlanned && !(this.trainingTitleInAddSessionErrorMessage || this.beginningDateErrorMessage || this.locationErrorMessage);
        },
        showFailToModifySessionMessage(){
            return this.failureModification && !this.confirmSupression && !this.confirmModification && !this.confirmSession && !(this.trainingTitleInAddSessionErrorMessage || this.beginningDateErrorMessage || this.locationErrorMessage);
        },

    },
    template: `
    <div v-show="state.changePageToSession" class="container-fluid" id="addSession ">
                    <div class="row" style="margin-top: 10px;">
                        <div class="col-lg-7 col-md-7 text-center">
                            <legend>Gérer une session</legend>
                        </div>
                    </div>
                    <div style = "width: 100%; height: 360px; overflow-y:visible; overflow-x:visible;" id="test" class="roundedCorner">        
                        <img @click="returnToPageTraining()" src="css/arrow_back.png" width="50" height="50" style="position: absolute; left:5%; top:45%; z-index:1;">
                        <div class = "row" style="margin-bottom: 10px; margin-top: 10px;">
                            <div id="glyphiconpencil" class = "col-xs-3 col-xs-offset-4 col-sm-3 col-sm-offset-4 col-md-3 col-md-offset-4 col-lg-3 col-lg-offset-4"> 
                                  <form id = "registr-form" @submit.prevent="modifyTrainingTopic()">
                                        <span class = "glyphicon glyphicon-pencil icon"  @click = "activeFieldTrainingTitle()"></span>                                                                                                                               
                                        <input-text 
                                            :value = "state.trainingTitle" 
                                            @input = "updateV1"
                                            :isValid = "isTrainingTitleInAddSessionValid" 
                                            placeholder = "Formation"
                                            maxlength = "20"
                                            icon = "glyphicon glyphicon-floppy-disk"
                                            type = 'input'
                                            :disabled = "isDisabledTrainingTitle" 
                                            @click="modifyTrainingTopic()">
                                        </input-text>
                                  </form>                                      
                            </div>
                            <div class = "col-xs-4 col-sm-4 col-md-4 col-lg-4" style = "margin-top: 25px;">
                                <p><span class="glyphicon glyphicon-info-sign"></span> Cette formation dure {{state.trainingChosen.numberHalfDays}} demies journées</p>
                            </div>
                        </div>
                        <hr>
                        <div class = "row">
                            <div class = "col-xs-4 col-sm-4  col-md-4 col-lg-4">
                                <nav>
                                    <ul>
                                        <li id="dropdown"><a id="sessionavailable" href="#">Sessions disponibles<div id="down-triangle"></div></a>
                                            <ul class="scrollbar" id="style-5">
                                                <li v-show="state.isNoSession"><a>Aucune session</a></li>
                                                <li v-show="!state.isNoSession" v-for="session in state.listTrainingSession"><a @click="showSession(session)">{{session.beginning}} - {{session.ending}} - {{session.location}}<div :id="'circle'+session.id" class="circle"></div></a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </nav>
                            </div>     
                            <form id="registr-form" @submit.prevent="verifyFormBeforeSaveSession()" class = "col-xs-8 col-sm-8 col-md-8 col-lg-8">                               
                                <div class = "row" style="margin-bottom: 20px;">
                                    <div class = "col-xs-4 col-sm-4 col-md-4 col-lg-4">    
                                        <datepicker  
                                            v-model = "beginningDate"
                                            :isValid = "isBeginningDateValid" 
                                            :disabled = "canNotRegisterForm"
                                            @blur = "calculateEndingDate()"
                                            @focus="resetVarialbesByDate()"
                                            @input = "updateV2"
                                            :min = "toDay">                                                                                       
                                        </datepicker>
                                    </div>
                                    <div class = "col-xs-4 col-xs-offset-2 col-sm-4 col-sm-offset-2 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-2">                                
                                        <td width="15%">
                                            <div class="form-group has-feedback ">
                                                <label class="label-control">Salles</label><br/>
                                                <select class="form-control" 
                                                    maxlength = "10" 
                                                    :disabled = "canNotRegisterForm" 
                                                    placeholder = "Salle" 
                                                    v-model="location"  
                                                    @focus="resetVariablesBySalle()">
                                                        <option v-for="n in AllSalles">{{n}}</option>
                                                </select>
                                            </div>
                                        </td>
                                    </div>
                                </div> 
                                <div class = "row" style="margin-bottom: 30px;">
                                    <div class = "col-xs-4 col-sm-4 col-md-4 col-lg-4 ">                                
                                        <input-text 
                                            label = "Date de fin" 
                                            :value = "endingDate" 
                                            @input = "updateV4"
                                            placeholder = "--/--/----"
                                            maxlength = "10"
                                            :isValid = "true"
                                            icon = "glyphicon glyphicon-calendar"
                                            :disabled = "true" 
                                            type = 'input'>
                                        </input-text>
                                    </div>
                                    <div class = "col-xs-4 col-xs-offset-2 col-sm-4 col-sm-offset-2 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-2">                                                                        
                                        <table class = "errorMessageAddSession">
                                            <tr>
                                                <error-messages  
                                                        fillFieldErrorMessage =" Veuillez remplir tous les champs." 
                                                        successMessage =" La session a été créée avec succès."
                                                        failureModification =" La modification n'est pas enregistrée."
                                                        successModificationMessage = "La modification est bien enregistrée."
                                                        successSupressionMessage = "Vous avez bien supprimé cette session."
                                                        failureMessage ="Ce créneau horaire est déjà occupé par une autre session."
                                                        :regexErrorMessage = "beginningDateRegexErrorMessage"
                                                        :emptyRegexError = "showInvalidateInputMessage()"
                                                        :emptyFailure = "showExistInputMessage()"
                                                        :emptySuccess = "showSuccessToCreateMessage()"
                                                        :emptySuccessModification = "showSuccessToModifyMessage()"
                                                        :emptySuccessSupression = "showSuccessToDeleteMessage()"
                                                        :emptyfailureModification = "showFailToModifySessionMessage()"
                                                        :emptyFillError = "showEmptyInputMessage()">                                                                       
                                                <error-messages>
                                            </tr>
                                        </table> 
                                    </div> 
                                </div> 
                                <div class = "row " style = "margin-bottom: 30px;">
                                    <div class = "col-xs-4 col-xs-pull-1 col-sm-4 col-sm-pull-1 col-md-4 col-md-pull-1 col-lg-4 col-lg-pull-1">                                
                                        <input type = "submit" 
                                                   class = "btn btn-primary" 
                                                   :value = "valueButtonSaveModify" 
                                                   :disabled = "canNotRegisterForm" 
                                                   style = "width:100%"/>                                                                         
                                    </div>
                                    <div class = "col-xs-4 col-xs-pull-1 col-sm-4 col-sm-pull-1 col-md-4 col-md-pull-1 col-lg-4 col-lg-pull-1">                                
                                        <input type = "button" 
                                                   class = "btn btn-danger" 
                                                   value = "Supprimer" 
                                                   @click = "chooseSessionsToRemove()" 
                                                   :disabled = "canNotUseButtonSupprimer()" 
                                                   style = "width:100%"/>                                                                        
                                    </div>
                                </div>                                                     
                            </form>
                        </div>
    </div>`,
});

let DatePicker = Vue.component('datepicker', {
    template: `
         <div class="date-picker">
            <div class = "form-group has-feedback" @click="togglePanel"
                 :class="{'has-error':  !isValid && typeof isValid != 'undefined' } ">
                <label class = "label-control">Date de début</label>
                <input class="form-control"
                       placeholder="--/--/----"
                       :value="range ? value[0] + ' -- ' + value[1] : value" 
                       @mouseenter="showCancel = true" 
                       @mouseleave="showCancel = false"
                       @input="updateValue($event.target.value)"
                       @focus="handleFocus"
                       @blur="handleBlur"/>                     
                <span class ="glyphicon form-control-feedback glyphicon-calendar"></span>
            </div>            
            <transition name="toggle">
                <div class="date-panel" v-show="panelState" :style="coordinates">
                    <div class="panel-header" v-show="panelType !== 'year'">
                        <div class="arrow-left" @click="prevMonthPreview()">&lt;</div>
                        <div class="year-month-box">
                            <div class="year-box" @click="chType('year')" v-text="tmpYear"></div>
                            <div class="month-box" @click="chType('month')">{{tmpMonth + 1 | month(language)}}</div>
                        </div>
                        <div class="arrow-right" @click="nextMonthPreview()">&gt;</div>
                    </div>
                    <div class="panel-header" v-show="panelType === 'year'">
                        <div class="arrow-left" @click="chYearRange(0)">&lt;</div>
                        <div class="year-range">
                            <span v-text="yearList[0]"></span> - <span v-text="yearList[yearList.length - 1]"></span>
                        </div>
                        <div class="arrow-right" @click="chYearRange(1)">&gt;</div>
                    </div>
                    <div class="type-year" v-show="panelType === 'year'">
                        <ul class="year-list">
                            <li v-for="item in yearList"
                                v-text="item"
                                :class="{selected: isSelected('year', item), invalid: validateYear(item)}" 
                                @click="selectYear(item)">
                            </li>
                        </ul>
                    </div>
                    <div class="type-month" v-show="panelType === 'month'">
                        <ul class="month-list">
                            <li v-for="(item, index) in monthList"
                                :class="{selected: isSelected('month', index), invalid: validateMonth(index)}" 
                                @click="selectMonth(index)">
                                {{item | month(language)}}
                            </li>
                        </ul>
                    </div>
                    <div class="type-date" v-show="panelType === 'date'">
                        <ul class="weeks">
                            <li v-for="item in weekList">{{item | week(language)}}</li>
                        </ul>
                        <ul class="date-list">
                            <li v-for="(item, index) in dateList"
                                :class="{preMonth: item.previousMonth, nextMonth: item.nextMonth,
                                         invalid: validateDate(item) || item.weekend || item.publicholiday, firstItem: (index % 7) === 0}"
                                @click="selectDate(item)">
                                <div class="message" :class="{selected: isSelected('date', item)}">
                                    <div class="bg"></div><span v-text="item.value"></span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
         </div>`,

    data () {
        let now = new Date();
        return {
            showCancel: false,
            panelState: false,
            panelType: 'date',
            coordinates: {},
            year: now.getFullYear(),
            month: now.getMonth(),
            date: now.getDate(),
            tmpYear: now.getFullYear(),
            tmpMonth: now.getMonth(),
            tmpStartYear: now.getFullYear(),
            tmpStartMonth: now.getMonth(),
            tmpStartDate: now.getDate(),
            tmpEndYear: now.getFullYear(),
            tmpEndMonth: now.getMonth(),
            tmpEndDate: now.getDate(),
            minYear: Number,
            minMonth: Number,
            minDate: Number,
            maxYear: Number,
            maxMonth: Number,
            maxDate: Number,
            yearList: Array.from({length: 12}, (value, index) => new Date().getFullYear() + index),
            monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            weekList: [0, 1, 2, 3, 4, 5, 6],
            rangeStart: false,
            toDay:'',
            arrayJoursFeries:[],
            arrayJoursFeriersMonth:[]
        }
    },

    props: {
        language: {default: 'fr'},
        min: {default: '2017-04-10'},
        max: {default: '2020-01-01'},
        value: {
            type: [String, Array],
            default: ''
        },
        range: {
            type: Boolean,
            default: false
        },
        isValid: {
            type: Boolean,
            default: true
        }
    },

    methods: {

        handleFocus(){
            this.$emit('focus');
        },

        handleBlur(){
            this.$emit('blur');
        },

        updateValue(value){
            this.$emit('input',value);
        },

        togglePanel () {
            this.panelState = !this.panelState
            this.rangeStart = false
        },

        isSelected (type, item) {
            switch (type) {
                case 'year':
                    if (!this.range)
                        return item === this.tmpYear
                   return (new Date(item, 0).getTime() >= new Date(this.tmpStartYear, 0).getTime()
                    && new Date(item, 0).getTime() <= new Date(this.tmpEndYear, 0).getTime())
                case 'month':
                    if (!this.range) return item === this.tmpMonth && this.year === this.tmpYear
                    return (new Date(this.tmpYear, item).getTime() >= new Date(this.tmpStartYear, this.tmpStartMonth).getTime()
                    && new Date(this.tmpYear, item).getTime() <= new Date(this.tmpEndYear, this.tmpEndMonth).getTime())
                case 'date':
                    if (!this.range) return this.date === item.value && this.month === this.tmpMonth && item.currentMonth
                    let month = this.tmpMonth
                    item.previousMonth && month--
                    item.nextMonth && month++
                    return (new Date(this.tmpYear, month, item.value).getTime() >= new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime()
                    && new Date(this.tmpYear, month, item.value).getTime() <= new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime())
            }
        },

        setHolidays (an){
            var JourAn = new Date(an, "00", "01")
            var FeteTravail = new Date(an, "04", "01")
            var Victoire1945 = new Date(an, "04", "08")
            var FeteNationale = new Date(an, "06", "14")
            var Assomption = new Date(an, "07", "15")
            var Toussaint = new Date(an, "10", "01")
            var Armistice = new Date(an, "10", "11")
            var Noel = new Date(an, "11", "25")
            var SaintEtienne = new Date(an, "11", "26")

            var G = an % 19
            var C = Math.floor(an / 100)
            var H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30
            var I = H - Math.floor(H / 28) * (1 - Math.floor(H / 28) * Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11))
            var J = (an * 1 + Math.floor(an / 4) + I + 2 - C + Math.floor(C / 4)) % 7
            var L = I - J
            var MoisPaques = 3 + Math.floor((L + 40) / 44)
            var JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4)
            var Paques = new Date(an, MoisPaques - 1, JourPaques)
            var VendrediSaint = new Date(an, MoisPaques - 1, JourPaques - 2)
            var LundiPaques = new Date(an, MoisPaques - 1, JourPaques + 1)
            var Ascension = new Date(an, MoisPaques - 1, JourPaques + 39)
            var Pentecote = new Date(an, MoisPaques - 1, JourPaques + 49)
            var LundiPentecote = new Date(an, MoisPaques - 1, JourPaques + 50)

            return new Array(JourAn, LundiPaques, FeteTravail, Victoire1945, Ascension, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel, SaintEtienne)
        },

        chType (type) {
            this.panelType = type
        },

        chYearRange (next) {
            if (next) {
                this.yearList = this.yearList.map((i) => i + 2)
            } else {
                this.yearList = this.yearList.map((i) => i - 2)
            }
        },

        prevMonthPreview () {
            this.tmpMonth = this.tmpMonth === 0 ? 0 : this.tmpMonth - 1
        },

        nextMonthPreview () {
            this.tmpMonth = this.tmpMonth === 11 ? 11 : this.tmpMonth + 1
        },

        selectYear (year) {
            if (this.validateYear(year)) return
            this.tmpYear = year
            this.panelType = 'month'
        },

        selectMonth (month) {
            if (this.validateMonth(month)) return
            this.tmpMonth = month
            this.panelType = 'date'
        },

        selectDate (date) {
            setTimeout(() => {
                if (this.validateDate(date)) return
                if (date.previousMonth) {
                    if (this.tmpMonth === 0) {
                        this.year -= 1
                        this.tmpYear -= 1
                        this.month = this.tmpMonth = 11
                    } else {
                        this.month = this.tmpMonth - 1
                        this.tmpMonth -= 1
                    }
                } else if (date.nextMonth) {
                    if (this.tmpMonth === 11) {
                        this.year += 1
                        this.tmpYear += 1
                        this.month = this.tmpMonth = 0
                    } else {
                        this.month = this.tmpMonth + 1
                        this.tmpMonth += 1
                    }
                }
                if (!this.range) {
                    this.year = this.tmpYear
                    this.month = this.tmpMonth
                    this.date = date.value
                    let value = `${('0' + this.date).slice(-2)}/${('0' + (this.month + 1)).slice(-2)}/${this.tmpYear}`
                    this.$emit('input', value)
                    this.panelState = false
                } else if (this.range && !this.rangeStart) {
                    this.tmpEndYear = this.tmpStartYear = this.tmpYear
                    this.tmpEndMonth = this.tmpStartMonth = this.tmpMonth
                    this.tmpEndDate = this.tmpStartDate = date.value
                    this.rangeStart = true
                } else if (this.range && this.rangeStart) {

                    this.tmpEndYear = this.tmpYear
                    this.tmpEndMonth = this.tmpMonth
                    this.tmpEndDate = date.value
                    let d1 = new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime(),
                        d2 = new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime()
                    if (d1 > d2) {
                        let tmpY, tmpM, tmpD
                        tmpY = this.tmpEndYear
                        tmpM = this.tmpEndMonth
                        tmpD = this.tmpEndDate
                        this.tmpEndYear = this.tmpStartYear
                        this.tmpEndMonth = this.tmpStartMonth
                        this.tmpEndDate = this.tmpStartDate
                        this.tmpStartYear = tmpY
                        this.tmpStartMonth = tmpM
                        this.tmpStartDate = tmpD
                    }
                    let RangeStart = `${this.tmpStartYear}-${('0' + (this.tmpStartMonth + 1)).slice(-2)}-${('0' + this.tmpStartDate).slice(-2)}`
                    let RangeEnd = `${this.tmpEndYear}-${('0' + (this.tmpEndMonth + 1)).slice(-2)}-${('0' + this.tmpEndDate).slice(-2)}`
                    let value = [RangeStart, RangeEnd]
                    this.$emit('input', value)
                    this.rangeStart = false
                    this.panelState = false
                }
            }, 0)
        },

        validateYear (year) {
            return (year > this.maxYear || year < this.minYear) ? true : false
        },

        validateMonth (month) {
            if (new Date(this.tmpYear, month).getTime() >= new Date(this.minYear, this.minMonth - 1).getTime()
                && new Date(this.tmpYear, month).getTime() <= new Date(this.maxYear, this.maxMonth - 1).getTime()) {
                return false
            }
            return true
        },

        validateDate (date) {
            let mon = this.tmpMonth
            if (date.previousMonth) {
                mon -= 1
            } else if (date.nextMonth) {
                mon += 1
            }
            if(date.weekend)
                return true
            if(date.publicholiday)
                return true

            if (new Date(this.tmpYear, mon, date.value).getTime() >= new Date(this.minYear, this.minMonth - 1, this.minDate).getTime()
                && new Date(this.tmpYear, mon, date.value).getTime() <= new Date(this.maxYear, this.maxMonth - 1, this.maxDate).getTime()) {
                return false
            }
            return true
        },

        close (e) {
            if (!this.$el.contains(e.target)) {
                this.panelState = false
                this.rangeStart = false
            }
        },

        clear() {
            this.$emit('input', this.range ? ['', ''] : '')
        }
    },

    watch: {
        min (v) {
            let minArr = v.split('/')
            this.minYear = Number(minArr[0])
            this.minMonth = Number(minArr[1])
            this.minDate = Number(minArr[2])
        },

        max (v) {
            let maxArr = v.split('/')
            this.maxYear = Number(maxArr[0])
            this.maxMonth = Number(maxArr[1])
            this.maxDate = Number(maxArr[2])
        },

        range (newVal, oldVal) {
            if (newVal === oldVal) return
            if (newVal && Object.prototype.toString.call(this.value).slice(8, -1) === 'String') {
                this.$emit('input', ['', ''])
            }
            if (!newVal && Object.prototype.toString.call(this.value).slice(8, -1) === 'Array') {
                this.$emit('input', '')
            }
        }
    },

    computed: {
        dateList () {
            this.arrayJoursFeriersMonth.splice(0,this.arrayJoursFeriersMonth.length)
            let currentMonthLength = new Date(this.tmpYear, this.tmpMonth + 1, 0).getDate()
            let dateList = Array.from({length: currentMonthLength}, (val, index) => {
                return {
                    currentMonth: true,
                    value: index + 1
                }
            })
            let startDay = new Date(this.tmpYear, this.tmpMonth, 1).getDay()

            let previousMongthLength = new Date(this.tmpYear, this.tmpMonth, 0).getDate()
            for (let i = 0, len = startDay; i < len-1; i++) {
                dateList = [{previousMonth: true, value: previousMongthLength - i}].concat(dateList)
            }
            for (let i = dateList.length, item = 1; i < 2; i++, item++) {
                dateList[dateList.length] = {nextMonth: true, value: item}
            }
            this.arrayJoursFeries = this.setHolidays (this.tmpYear);
            for (let i = 0; i < this.arrayJoursFeries.length; i++){
                if((this.arrayJoursFeries[i].getMonth())==this.tmpMonth)
                    this.arrayJoursFeriersMonth.push(this.arrayJoursFeries[i])
            }

            for (let i = 5; i < dateList.length; i += 7) {
                if (dateList[i]) {
                    dateList[i].weekend = true;
                }
                if (dateList[i + 1]) {
                    dateList[i + 1].weekend = true;
                }
            }
            for (let i = 0; i < dateList.length; i++) {
                for (let j = 0; j < this.arrayJoursFeriersMonth.length; j++) {
                    if (dateList[i].value == this.arrayJoursFeriersMonth[j].getDate()) {
                        dateList[i].publicholiday = true;
                    }
                }
            }

            return dateList
        }
    },

    filters: {
        week: (item, lang) => {
            switch (lang) {
                case 'en':
                    return {0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa'}[item]
                case 'fr':
                    return {0: 'Lun', 1: 'Mar', 2: 'Mer', 3: 'Jeu', 4: 'Ven', 5: 'Sam', 6: 'Dim'}[item]
                default:
                    return item
            }
        },

        month: (item, lang) => {
            switch (lang) {
                case 'en':
                    return {
                        1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
                        7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
                    }[item]
                case 'fr':
                    return {
                        1: 'Janvier', 2: 'Fevrier', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin',
                        7: 'Juillet', 8: 'Août', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Decembre'
                    }[item]
                default:
                    return item
            }
        }
    },

    mounted () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.$nextTick(() => {
            if(this.$el.parentNode != null) {
                if (this.$el.parentNode.offsetWidth + this.$el.parentNode.offsetLeft - this.$el.offsetLeft <= 300) {
                    this.coordinates = {
                        right: '0',
                        top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`
                    }
                } else {
                    this.coordinates = {
                        left: '0',
                        top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`
                    }
                }
            }
            else {
                this.coordinates = {
                    left: '0',
                    top: '0'
                }
            }
            let minArr = this.min.split('-')
            this.minYear = Number(minArr[0])
            this.minMonth = Number(minArr[1])
            this.minDate = Number(minArr[2])
            let maxArr = this.max.split('-')
            this.maxYear = Number(maxArr[0])
            this.maxMonth = Number(maxArr[1])
            this.maxDate = Number(maxArr[2])
            if (this.range) {
                if (Object.prototype.toString.call(this.value).slice(8, -1) !== 'Array') {
                    throw new Error('Binding value must be an array in range mode.')
                }
                if (this.value.length) {
                    let rangeStart = this.value[0].split('-')
                    let rangeEnd = this.value[1].split('-')
                    this.tmpStartYear = Number(rangeStart[0])
                    this.tmpStartMonth = Number(rangeStart[1]) - 1
                    this.tmpStartDate = Number(rangeStart[2])
                    this.tmpEndYear = Number(rangeEnd[0])
                    this.tmpEndMonth = Number(rangeEnd[1]) - 1
                    this.tmpEndDate = Number(rangeEnd[2])
                } else {
                    this.$emit('input', ['', ''])
                }

            }
            if (!this.value) {
                this.$emit('input', '')
            }
            window.addEventListener('click', this.close)
        })
    },

    beforeDestroy () {
        window.removeEventListener('click', this.close)
    }
});

class trainingStore {
    constructor () {
        this.state = {
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
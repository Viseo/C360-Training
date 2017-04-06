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

Vue.component('error-messages',{
    props:['height','colspan',
           'identicalErrorMessage','fillFieldErrorMessage','successMessage','regexErrorMessage',
           'emptyIdenticalError','emptyFillError','emptySuccess','emptyRegexError','width'],
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
                                    <span v-show="emptyRegexError" 
                                          class="color-red">{{ regexErrorMessage }}
                                    </span>
                                </div>
                           </td>`
});

Vue.component('input-text',{
    props:['width', 'label', 'value', 'placeholder','maxlength', 'isValid','type', 'icon', 'collection', 'printProp'],
    methods:{
        updateValue(value){
          this.$emit('input',value);
        },
        handleFocus(){
            this.$emit('focus');
        },
        handleClick(){
            this.$emit('click');
        }
    },
   template: `<td :width="width">
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
                                       @focus="handleFocus"/>
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
                                        <option selected disabled hidden style='display: none' value=''></option>
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
            selectOptionsOfTopic: [],
            topicsChosen:[],
            arrangeTrainings:undefined,
            allTrainingsOfATopicChosen:[],

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
            this.trainingTitle = this.trainingTitle.replace(/ +/g, "");
            this.training.trainingTitle = this.trainingTitle;
            this.training.numberHalfDays = this.numberHalfDays;
            for (var tmp in this.selectOptionsOfTopic){
                if(this.topicDescription == this.selectOptionsOfTopic[tmp].name){
                    this.training.topicDescription = this.selectOptionsOfTopic[tmp];
                }
            }
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
                    this.selectOptionsOfTopic = response.data;
                    this.selectOptionsOfTopic.sort(function (a, b) {
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
                    this.TopicwithTraining();
                    this.reorganizeAllTopicsAndTrainings();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },

        TopicwithTraining(){
            this.state.trainingsChosen = [];
            for (var tmp in this.selectOptionsOfTraining) {
                this.state.trainingsChosen.push(this.selectOptionsOfTraining[tmp].topicDescription);
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
        reorganizeTrainings(value){
            this.arrangeTrainings = [];
            var tmp = [];
            var longueur = value.length;
            var compteur = 0;
            for (var element in value) {
                longueur--;
                compteur++;
                if (compteur >= 1 && compteur < 4) {
                    tmp.push(value[element]);
                    if (longueur == 0) {
                        this.arrangeTrainings.push(tmp);
                    }
                } else if (compteur == 4) {
                    tmp.push(value[element]);
                    this.arrangeTrainings.push(tmp);
                    tmp = [];
                    compteur = 0;
                }
            }
            return this.arrangeTrainings;
        },
        chooseAllTrainingsOfATopic(value){
            this.allTrainingsOfATopicChosen = [];
            for (var tmp in this.selectOptionsOfTraining) {
                if (this.selectOptionsOfTraining[tmp].topicDescription.name == value) {
                    this.allTrainingsOfATopicChosen.push(this.selectOptionsOfTraining[tmp]);
                }
            }
            return this.allTrainingsOfATopicChosen;
        },
        reorganizeAllTopicsAndTrainings(){
            this.state.allTopicTraining = [];
            for (var tmp in this.state.trainingsChosen) {
                this.state.allTopicTraining.push(this.reorganizeTrainings(this.chooseAllTrainingsOfATopic(this.state.trainingsChosen[tmp].name)));
            }
        },

    },
template:`
 <div class="container-fluid">
        <div class="row">
            <div class="col-sm-12 col-md-10 col-lg-7">
                    <div class="row">
                        <div class="col-lg-7 col-md-7 text-center">
                            <legend>Ajouter une formation</legend>
                        </div>
                    </div>
                    <table>
                    <tr>
                    <form id="registr-form" @submit.prevent="verifyTrainingFormBeforeSubmit"">
                        <input-text 
                            width="20%" 
                            label="Formation" 
                            :value="trainingTitle" 
                            @input="updateV1"
                            placeholder="Formation"
                            maxlength="20"
                            @focus="trainingTitleErrorMessage = false; confirmFormation = false; isNewTrainingTitle = true; newTopicErrorMessage=false;"
                            :isValid="isTrainingTitleValid"
                            type='input'>
                        </input-text>
                        <input-text
                            width="15%"
                            label="1/2 journées"
                            :value="numberHalfDays"
                            @input="updateV2"
                            @focus="numberHalfDaysErrorMessage = false; confirmFormation = false; isNewTrainingTitle = true;newTopicErrorMessage=false;"
                            :collection="200"
                            type="select">
                         </input-text>
                        <input-text
                            width="20%"
                            label="Thèmes"
                            :value="topicDescription"
                            @input="updateV3"
                            @focus="topicErrorMessage = false; confirmFormation = false; isNewTrainingTitle = true;newTopicErrorMessage=false;"
                            :collection="selectOptionsOfTopic"
                            print-prop="name"
                            type="select">
                        </input-text>
                        </form>
                        <td class="text-center" 
                            width="20%">
                            <div class="form-group">
                                 <label>&nbsp</label><br/>
                                 <input type="submit" 
                                       class="btn btn-primary" 
                                       value="Valider" 
                                       @click="verifyTrainingFormBeforeSubmit" 
                                       style="width:80%"/>
                            </div>
                        </td>
                        <form id="registr-form" @submit.prevent="verifyTopicFormBeforeSubmit"">
                            <input-text width="30%" 
                                        label="Nouveau thème" 
                                        :value="newTopic"
                                         @input="updateV4"
                                        placeholder="Thème"
                                        maxlength="50"
                                        @focus="newTopicErrorMessage = false; confirmTopic = false; isNewTopic = true; trainingTitleErrorMessage = false;numberHalfDaysErrorMessage = false;topicErrorMessage = false;"
                                        :isValid="isNewTopicValid"
                                        icon="glyphicon-plus btn btn-link"
                                        type='input'
                                        class="td-right"
                                        @click="verifyTopicFormBeforeSubmit">
                            </input-text>
                        </form>
                        </tr>
                        <tr>
                            <error-messages :colspan="2" 
                                            identicalErrorMessage="Une formation identique existe déjà." 
                                            fillFieldErrorMessage="Veuillez remplir tous les champs." 
                                            successMessage="La formation a été créée avec succès." 
                                            :regexErrorMessage="trainingTitleRegexErrorMessage"
                                            :emptyIdenticalError="!isNewTrainingTitle"
                                            :emptyFillError="(trainingTitleErrorMessage || numberHalfDaysErrorMessage || topicErrorMessage)"
                                            :emptySuccess="confirmFormation && isNewTrainingTitle && !(trainingTitleErrorMessage || numberHalfDaysErrorMessage || topicErrorMessage)"
                                            :emptyRegexError=" !isTrainingTitleValid && !(trainingTitleErrorMessage || numberHalfDaysErrorMessage || topicErrorMessage)">
                            </error-messages>
                            <error-messages class="td-right"
                                            :height="80" 
                                            :width="250"
                                            identicalErrorMessage="Un thème identique existe déjà." 
                                            fillFieldErrorMessage="Veuillez remplir le champ." 
                                            successMessage="Le nouveau thème a été ajouté avec succès." 
                                            :regexErrorMessage="newTopicRegexErrorMessage"
                                            :emptyIdenticalError="!isNewTopic"
                                            :emptyFillError="newTopicErrorMessage"
                                            :emptySuccess="confirmTopic && isNewTopic && !newTopicErrorMessage"
                                            :emptyRegexError=" !isNewTopicValid">
                            </error-messages>
                        </tr>
                    </table>
            </div>
        </div>
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
    methods:{
        CreateSession(id){
            this.state.changePageToSession = true;
            this.state.changePageToTraining = false;
            this.state.idTraining = id;
            training_store.CollectInformationOfTrainingChosen();
        }
    },
    template: `
             <div v-show="state.changePageToTraining" class="container-fluid" id="addFormation">
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
                                                                        <button class="btn btn-toolbar btn-group" style="z-index:0" @click="CreateSession(training.id)">{{training.trainingTitle}}</button>
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

Vue.component('add-session-panel', {
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
            beginningDate:'',
            endingDate:'',
            beginningTime:'09:00',
            endingTime:'18:00',
            location:'',
            isSessionAlreadyPlanned:false,

            state: training_store.state,
        }
    },
    methods: {
        updateV1 (v) {
            this.state.trainingTitle = v
        },
        updateV2 (v) {
            this.beginningDate = v
        },
        updateV3 (v) {
            this.location = v
        },
        updateV4 (v) {
            this.endingDate = v
        },
        ReturnToPageTraining(){
            this.state.changePageToTraining = true;
            this.state.changePageToSession = false;
            this.state.idTraining = '';
            this.state.trainingChosen = {};
            this.state.trainingTitle = '';
        },
        VerifyFormBeforeSaveSession(){
            /*this.isEmailEmpty(); this.isPasswordEmpty();
             if(!this.emailEmpty && !this.passwordEmpty){
             this.user.email=this.email;
             this.user.password=this.password;
             this.userToRegister = JSON.parse(JSON.stringify(this.user));
             this.VerifyUserByDatabase();
             }*/
            this.session.trainingDescription = this.state.trainingChosen;
            this.session.trainingDescription.trainingTitle = this.state.trainingTitle;
            this.session.beginning = this.beginningDate;
            this.session.ending = this.endingDate;
            this.session.beginningTime = this.beginningTime;
            this.session.endingTime = this.endingTime;
            this.session.location = this.location;
            this.sessionToRegister = JSON.parse(JSON.stringify(this.session));
            this.SaveSessionIntoDatabase();
        },
        ModifyTrainingTopic(){
            this.$http.put("api/formations/"+ this.state.trainingTitle +"/formationid/"+ this.state.idTraining);
        },
        SaveSessionIntoDatabase(){
            this.$http.post("api/sessions", this.sessionToRegister)
                .then(
                    function (response) {
                        this.isSessionAlreadyPlanned = false;
                    },
                    function (response) {
                        console.log("Error: ",response);
                        if (response.data.message === "TrainingSession already planned") {
                            this.isSessionAlreadyPlanned = true;
                        } else {
                            console.error(response);
                        }
                    }
                );
        }
    },
    template: `
        <div v-show="state.changePageToSession" class="container-fluid" id="addSession">
            <div class="row">
                <div class="col-md-12 col-lg-12 col-sm-12" style="padding:10px;"></div>
                <div class="col-sm-12 col-md-10 col-lg-7">
                    <div class="row">
                        <div class="col-lg-7 col-md-7 text-center">
                            <legend>Gérer une session</legend>
                        </div>
                    </div>
                    <div style = "width: 100%; height: 360px; overflow-y:hidden; overflow-x:hidden;" id="test" class="roundedCorner">
                        <!--<button @click="ReturnToPageTraining()">Retour</button>-->
                        <img @click="ReturnToPageTraining()" src="css/arrow_back.png" width="50" height="50" style="position: absolute; left:2%; top:10%; z-index:1;">
                        <div class = "row" style="margin-bottom: 30px; margin-top: 20px;">
                            <div class = "col-xs-3 col-xs-offset-4 col-sm-3 col-sm-offset-4 col-md-3 col-md-offset-4 col-lg-3 col-lg-offset-4"> 
                                 <form id = "registr-form" @submit.prevent="ModifyTrainingTopic()">
                                    <span class = "glyphicon glyphicon-pencil icon" onclick = "activer()"></span>                                                                                            
                                    <input-text 
                                        :value = "state.trainingTitle" 
                                        @input = "updateV1"
                                        placeholder = "formation"
                                        maxlength = "20"
                                        :isValid = "true"
                                        icon = "glyphicon glyphicon-floppy-disk"
                                        type = 'input'
                                        @click="ModifyTrainingTopic()">
                                    </input-text> 
                                 </form>
                            </div>
                            <div class = "col-xs-4 col-sm-4 col-md-4 col-lg-4" style = "margin-top: 25px;">
                                <p><span class="glyphicon glyphicon-info-sign"></span> Cette formation dure {{state.trainingChosen.numberHalfDays}} demies journées</p>
                            </div>
                        </div>
                        
                        <div class = "row">
                            <div class = "col-xs-4 col-sm-4  col-md-4 col-lg-4">
 		<nav>
			<ul>
				<li><a href="#">Sessions disponibles<div id="down-triangle"></div></a>
					<ul>
						<li><a href="#">Make it simple but significant.<div class="circle"></div></a></li>
						<li><a href="#">Stay focused and keep shipping.<div class="circle"></div></a></li>
						<li><a href="#">Done is better than perfect.<div class="circle"></div></a></li>
						<li><a href="#">Design is how it works.<div class="circle"></div></a></li>
						<li><a href="#">Think big, start small, learn fast.<div class="circle"></div></a></li>
					</ul>
				</li>
			</ul>
		</nav>
                            </div>                            
                            <form id="registr-form" @submit.prevent="VerifyFormBeforeSaveSession()" class = "col-xs-8 col-sm-8 col-md-8 col-lg-8">
                                <div class = "row" style="margin-bottom: 30px;">
                                    <div class = "col-xs-4 col-sm-4 col-md-4 col-lg-4">                                
                                        <input-text 
                                            label = "Date de début" 
                                            :value = "beginningDate" 
                                            @input = "updateV2"
                                            placeholder = "--/--/----"
                                            maxlength = "10"
                                            :isValid = "true"
                                            icon = "glyphicon glyphicon-calendar"
                                            type = 'input'>
                                        </input-text>
                                    </div>
                                    <div class = "col-xs-4 col-xs-offset-2 col-sm-4 col-sm-offset-2 col-md-4 col-md-offset-2 col-lg-4 col-lg-offset-2">                                
                                        <input-text 
                                            label = "Salles" 
                                            :value = "location" 
                                            @input = "updateV3"
                                            placeholder = "Salle"
                                            maxlength = "10"
                                            :isValid = "true"
                                            :collection="4"
                                            type = 'select'>
                                        </input-text> 
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
                                            type = 'input'>
                                        </input-text>
                                    </div>
                                </div> 
                                <div class = "row " style = "margin-bottom: 30px;">
                                    <div class = "col-xs-4 col-xs-pull-1 col-sm-4 col-sm-pull-1 col-md-4 col-md-pull-1 col-lg-4 col-lg-pull-1">                                
                                        <input type = "submit" 
                                               class = "btn btn-primary" 
                                               value = "Enregistrer" 
                                               style = "width:100%"/>                                                                         
                                    </div>
                                    <div class = "col-xs-4 col-xs-pull-1 col-sm-4 col-sm-pull-1 col-md-4 col-md-pull-1 col-lg-4 col-lg-pull-1">                                
                                        <input type = "submit" 
                                               class = "btn btn-danger" 
                                               value = "Supprimer" 
                                               @click = "VerifyFormBeforeSaveSession()" 
                                               style = "width:100%"/>                                                                        
                                    </div>
                                </div>                                                     
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>`,
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
            trainingTitle:''
        }
    }

    CollectInformationOfTrainingChosen(){
        this.state.trainingChosen = {};
        for (var tmp in this.state.allTrainings) {
            if (this.state.allTrainings[tmp].id == this.state.idTraining) {
                this.state.trainingChosen = this.state.allTrainings[tmp];
            }
        }
        this.state.trainingTitle = this.state.trainingChosen.trainingTitle;
    }
}

let training_store = new trainingStore();
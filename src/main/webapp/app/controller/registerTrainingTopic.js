/**
 * Created by BBA3616 on 24/02/2017.
 */
Vue.use(VueResource);

Vue.component('bandeau',{
    template:'<div style="padding:40px; background-color:#428bca; margin-bottom:30px;"></div>',
});

Vue.component('addformation', {
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
            nameTheme: '',
            trainingTitleMsg: '',
            nameThemeMsg: '',
            topicToRegister: {},
            optionsTopic: [],
            isNewTrainingTitle: true,
            isNewTopic: true,
            confirmFormation: false,
            optionsTraining:[],
            trainingsChosen:[],
            topicsChosen:[],
            confirmTopic: false,
            msgtrainingTitle: false,
            msgnumberHalfDays: false,
            msgtopic: false,
            msgname: false,
            isTrainingTitleValid: true,
            isNameThemeValid:true,
            test:undefined,
            trainingsOfTopic:[],
            allTopicTraining:[]
        }
    },
    watch: {
        trainingTitle: function (value) {
            this.VerifTrainingTitle(value, 'trainingTitleMsg');
        },

        nameTheme: function (value) {
            this.VerifnameTheme(value, 'nameThemeMsg');
        },
    },
    mounted: function(){
        this.updateTopics();
        this.updateTrainings();

    },
    methods: {
        VerifTrainingTitle(trainingTitle, msg) {
            if (/^[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]*$/.test(trainingTitle)) {
                this[msg] = '';
                this.isTrainingTitleValid = true;
            } else {
                this[msg] = "Veuillez entrer un nom de formation valide (-.'_@:+#% autorisés)";
                this.isTrainingTitleValid = false;
            }
        },
        messageTrainingTitle(){
            if (this.trainingTitle == '' || this.trainingTitle == undefined) {
                this.msgtrainingTitle = true;
            }
        },
        messageNumberHalfDays(){
            if (this.numberHalfDays == '' || this.numberHalfDays == undefined) {
                this.msgnumberHalfDays = true;
            }
        },
        messageTopic(){
            if (this.topicDescription == '' || this.topicDescription == undefined) {
                this.msgtopic = true;
            }
        },
        VerifnameTheme(nameTheme, msg) {
            if (/^[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ0-9-.'_@:+#%]*$/.test(nameTheme)) {
                this[msg] = '';
                this.isNameThemeValid = true;
            } else {
                this[msg] = "Veuillez entrer un nom de topic valide (-.'_@:+#% autorisés)";
                this.isNameThemeValid = false;

            }
        },
        messageName(){
            if (this.nameTheme == '' || this.nameTheme == undefined) {
                this.msgname = true;

            }
        },
        resetTrainingForm() {
            this.trainingTitle = '';
            this.numberHalfDays = '';
            this.topicDescription = '';
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
        verifyTrainingForm() {
            this.trainingTitle = this.trainingTitle.replace(/ +/g, "");
            this.training.trainingTitle = this.trainingTitle;
            this.training.numberHalfDays = this.numberHalfDays;
            this.training.topicDescription = this.topicDescription;
            this.messageTrainingTitle();
            this.messageNumberHalfDays();
            this.messageTopic();
            this.msgname=false;
            if (!this.msgtrainingTitle && !this.msgnumberHalfDays && !this.msgtopic) {
                this.trainingToRegister = JSON.parse(JSON.stringify(this.training));
                this.saveTrainingAction();
            }
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
        verifyTopicForm() {
            this.nameTheme = this.nameTheme.replace(/ +/g, "");
            this.topic.name = this.nameTheme;
            this.messageName();
            this.msgtrainingTitle = false;
            this.msgnumberHalfDays = false;
            this.msgtopic = false;
            if (!this.msgname) {
                this.isNewTopic = true;
                this.topicToRegister = JSON.parse(JSON.stringify(this.topic));
                this.saveTopicAction();
            }
        },

        updateTopics(){
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
        updateTrainings (){
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
        isEmptyFormation(){
            if (this.trainingsChosen.length > 0) {
                return false;
            }
            else {
                return true;
            }
        }

    },
template:`<div class="container-fluid">
    <div class="row">
    <div class="col-sm-12 col-md-10 col-lg-7">
    <div class="row">
    <div class="col-lg-7 col-md-7 text-center">
    <legend>Ajouter une formation</legend>
    </div>
    </div>
    <div class="panel panel-default">
    <div class="panel-body" style="max-height: 100%; ">
    
    <div class="col-md-3 col-lg-3">
    <div class="form-group" :class="{'has-error':!isTrainingTitleValid }">
    <label class="label-control">Formation</label>
        <div>
        
        <input type="text" class="form-control"  placeholder="Formation" maxlength="20" v-model="trainingTitle"
                                       @focus="msgtrainingTitle = false; confirmFormation = false; isNewTrainingTitle = true;msgname=false;"></input>
        
        </div>
        </div>
        </div>
        
        <div class="col-md-2 col-lg-2">
    <div class="form-group">
    <label class="label-control">1/2 journées</label>
        <div>
        
                    <select class="form-control" v-model="numberHalfDays"  @focus="msgnumberHalfDays = false; confirmFormation = false; isNewTrainingTitle = true; msgname=false;"
                       >
                        <option v-for="n in 200">{{n}}</option>
                    </select>
        </div>
        </div>
        </div>
        
        <div class="col-md-2 col-lg-2">
    <div class="form-group">
    <label class="label-control">Thèmes</label>
        <div>
                            <select class="form-control" v-model="topicDescription"
                            @focus="msgtopic = false; confirmFormation = false; isNewTrainingTitle = true; msgname=false;"
                            >
                        <option v-for="option in optionsTopic">{{ option.name }}
                        </option>
                    </select>
        
        </div>
        </div>
        </div>
        
        <div class="col-md-2 col-lg-2">
    <div class="form-group">
    <label class="label-control">&nbsp</label>
        <div class="row">
        <button  @click="verifyTrainingForm" class="btn btn-default col-lg-10 col-md-10 col-sm-12" >Valider</button >
        </div>
        </div>
        </div>
        
        <div class="col-md-3 col-lg-3">
    <div class="form-group">
    <label class="label-control">Nouveau thème</label>
        <div>
        
<div class="form-group has-feedback" :class="{'has-error':  !isNameThemeValid  } ">
    <input type="text" class="form-control" v-model="nameTheme" 
    @focus="msgname = false; confirmTopic = false; isNewTopic = true;msgtrainingTitle = false;msgnumberHalfDays = false;msgtopic = false;"
placeholder="Thème">
    <span class="glyphicon glyphicon-plus form-control-feedback" @click="verifyTopicForm"></span></div>
                        
        </div>
        </div>
        </div>
        
        <div class="row"><div  style="margin-top: 5px;"class="col-lg-5 col-md-5 col-lg-offset-3 col-md-offset-3">
    <span v-show="!isNewTrainingTitle" class="text-center color-red ">Une formation identique existe déjà.</span>
    <span v-show="(msgtrainingTitle || msgnumberHalfDays || msgtopic)"
    class="text-center color-red ">Veuillez remplir tous les champs.</span>
    <span v-show="confirmFormation && isNewTrainingTitle && !(msgtrainingTitle || msgnumberHalfDays || msgtopic)"
    class="text-center color-green ">La formation a été créée avec succès.</span>
    <span v-show=" !isTrainingTitleValid && !(msgtrainingTitle || msgnumberHalfDays || msgtopic)" class="color-red">{{trainingTitleMsg}}</span>

</div>
<div style="margin-top: 5px;" class="col-lg-3 col-md-3 col-lg-offset-1 col-md-offset-1">
    <span v-show="msgname" class="text-center color-red ">Veuillez remplir le champ.</span>
<span v-show="!isNewTopic" class="text-center color-red ">Un thème identique existe déjà.</span>
<span v-show="confirmTopic && isNewTopic && !msgname" class="text-center color-green ">Le nouveau thème a été ajouté avec succès.</span>
<span v-show="!isNameThemeValid" class="color-red">{{ nameThemeMsg }}</span>
</div></div>
    </div>
    </div>
    </div>
    </div>
    </div>`
});


Vue.component('table-container-title', {
    props: ['title'],
    template: '<div class="container-fluid">' +
    '<div class="row">' +
    '<div class="col-sm-12 col-md-10 col-lg-7">' +
    '<div class="row">' +
    '<div class="col-lg-7 col-md-7 text-center">' +
    '<legend>{{ title }}</legend>' +
    '</div>' +
    '</div>' +
    '<div class="panel panel-default">'+
    '<div class="panel-body" style="max-height: 100%; "><slot></slot></div>' +
    '</div>'+
    '</div>' +
    '</div>' +
    '</div>'
});

Vue.component('drop-down-menu-number', {
    props: {number:{type: Number} , focus:{type: String} , blur :{type: String}, value:{default:''} },
    template: '<select v-model="value" class="form-control"' +
    '@focus="focus"' +
    '@blur="blur">' +
    '<option v-for="n in number"> {{ n }}' +
    '</option>' +
    '</select>'
});

Vue.component('drop-down-menu-topic', {
    props: {focus:{type: String} , blur :{type: String}, value:{default:''} },
    template: '<select v-model="value" class="form-control"' +
    '@focus="focus"' +
    '@blur="blur">' +
    '<option v-for="option in optionsTopic">{{ option.name }}' +
    '</option>' +
    '</select>'
});

Vue.component('table-field',{
    props: ['fieldsize','fieldname'],
    data(){
        return {

        };
    },
    template:'<div :width="fieldsize">'+
    '<div class="form-group">'+
    '<label v-if="fieldname" class="label-control">{{ fieldname }}</label>'+
    '<label v-if="!fieldname" class="label-control">&nbsp</label>'+
        '<div><slot></slot><div>'+
        '</div>'+
        '</div>'


});
Vue.component('message-erreur', {
   template: `<div class="row"><div  style="margin-top: 5px;"class="col-lg-5 col-md-5 col-lg-offset-3 col-md-offset-3">
                        <span v-show="!isNewTrainingTitle" class="text-center color-red ">Une formation identique existe déjà.</span>
                        <span v-show="(msgtrainingTitle || msgnumberHalfDays || msgtopic)"
                              class="text-center color-red ">Veuillez remplir tous les champs.</span>
                        <span v-show="confirmFormation && isNewTrainingTitle && !(msgtrainingTitle || msgnumberHalfDays || msgtopic)"
                              class="text-center color-green ">La formation a été créée avec succès.</span>
                        <span v-show=" !isTrainingTitleValid && !(msgtrainingTitle || msgnumberHalfDays || msgtopic)" class="color-red">{{trainingTitleMsg}}</span>

                </div>
                <div style="margin-top: 5px;" class="col-lg-3 col-md-3 col-lg-offset-1 col-md-offset-1">
                        <span v-show="msgname" class="text-center color-red ">Veuillez remplir le champ.</span>
                        <span v-show="!isNewTopic" class="text-center color-red ">Un thème identique existe déjà.</span>
                        <span v-show="confirmTopic && isNewTopic && !msgname" class="text-center color-green ">Le nouveau thème a été ajouté avec succès.</span>
                        <span v-show="!isNameThemeValid" class="color-red">{{ nameThemeMsg }}</span>
                </div></div>`
});
Vue.component('input-text',{
    props: ['value','focus','blur', 'insidename', 'maxletter'],
    data(){
        return {

        };
    },
    template:'<input type="text" class="form-control" v-model="value" :placeholder="insidename"'+
'@focus="focus"'+
'@blur="blur"'+
':maxlength="maxletter"></input>'

});

Vue.component('input-form-text-icon',{
    props: ['icon','insidename'],
    data: function(){
        return {
            classGlyphicon: this.icon + ' form-control-feedback'
        }
    },
   template:`<div class=" form-group has-feedback" >
                        <input type="text" class="form-control" v-model="nameTheme"
                               :placeholder="insidename">
                        <span :class="classGlyphicon" @click="verifyTopicForm"></span></div>`

});


Vue.component('custom-button',{
    props: ['typeofbutton','click','size', 'buttonname'],
    data(){
        return {
                stylebutton:{
                    'width': this.size
                }
        };
    },
    template:'<button  :class="typeofbutton" :style="stylebutton" @click="click">{{ buttonname }}</button >'

});

new Vue({
    el: '#TrainingTopic'
});

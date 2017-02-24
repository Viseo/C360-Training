/**
 * Created by BBA3616 on 24/02/2017.
 */
Vue.use(VueResource);
Vue.use(VeeValidate);
Vue.use(VueRouter);

new Vue({
    el: '#app',
    data: {
        formation:{
            nomformation:'',
            demijournee:'',
            theme:''
        },
        theme:{
            nouveautheme:''
        },
        isNewFormationName:true,
        isNewTheme:true,
        confirmFormation:false,

        msgformation:false,
        msgdemijournee:false,
        msgtheme:false,
        msgnouveautheme:false,


        border: 'color-red',
        color_inscription: 'color-blue',
        color_connexion: 'color-blue'
    },
    methods: {
        messageFormationName(){
            if(this.formation.nomformation == ''){
                this.msgformation = true;
            }

        },
        messageDemiJournee(){
            if(this.formation.demijournee == ''){
                this.msgdemijournee = true;
            }

        },
        messageTheme(){
            if(this.formation.theme == ''){
                this.msgtheme = true;
            }

        },
        messageNouveauTheme(){
            if(this.theme.nouveautheme == ''){
                this.msgnouveautheme = true;
            }
        },
        resetFormFormation() {
            this.formation.nomformation = '';
            this.formation.demijournee = '';
            this.formation.theme = '';
        },
        resetFormTheme(){
            this.theme.nouveautheme = '';
        },
        saveAction() {
            this.confirmFormation = true;
            this.resetFormFormation();

        },
        verifyFormation() {
            this.messageTheme(); this.messageDemiJournee(); this.messageFormationName();
            if(!this.msgformation && !this.msgdemijournee && !this.msgtheme){
                this.isNewFormationName = true;
                this.saveAction();
            }
        }

    }
});
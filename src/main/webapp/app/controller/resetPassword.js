let resetPassword = Vue.component('form-reset-password', {
    template: `
             <form id="registr-form" @submit.prevent="verifyForm">
                <!-- MOT DE PASSE -->
                <div class="form-group" :class="{'has-error': !isPasswordValid || passwordEmpty }">
                    <label for="mdp">Nouveau mot de passe</label>
                    <div class="password" :class="{ 'control': true }">
                        <i class="glyphicon glyphicon-lock"></i>
                        <span @click="showPass = !showPass" v-show="!showPass && password" class="glyphicon glyphicon-eye-open"> </span>
                        <span @click="showPass = false" v-show="showPass && password" class="glyphicon glyphicon-eye-close"> </span>
                        <input type="password" v-model="password" v-show="!showPass" name="mdp" id="mdp" tabindex="2" class="form-control"
                               placeholder="••••••" onfocus="this.placeholder = ''" onblur="this.placeholder = '••••••'" @focus="passwordEmpty = false"
                               @blur="isPasswordEmpty">
                        <input type="text" v-model="password" v-show="showPass"  name="mdp" id="mdp2" tabindex="2" class="form-control"
                               @focus="passwordEmpty = false" @blur="isPasswordEmpty">
                        <span v-show="passwordEmpty"  class="color-red ">Mot de passe est obligatoire.</span>
                        <span v-show="!isPasswordValid && !passwordEmpty" class="color-red">{{ errorMessagePassword }}</span>
                    </div>
                </div>
                <!-- CONFIRMATION MOT DE PASSE -->
                <div class="form-group"   :class="{'has-error': !isConfirmPasswordValid|| confirmPasswordEmpty }">
                    <label for="mdpc">Confirmation mot de passe</label>
                    <div class="password" :class="{ 'control': true }">
                        <i class="glyphicon glyphicon-lock "></i>
                        <span @click="showPassConf = !showPassConf" v-show="!showPassConf && confirmPassword" class="glyphicon glyphicon-eye-open "> </span>
                        <span @click="showPassConf = false"  v-show="showPassConf && confirmPassword" class="glyphicon glyphicon-eye-close "> </span>
                        <input type="password" v-model="confirmPassword"  v-show="!showPassConf" name="mdpc" id="mdpc" tabindex="2" class="form-control"
                               placeholder="••••••"  onfocus="this.placeholder = ''" onblur="this.placeholder = '••••••'" @focus="confirmPasswordEmpty = false"
                               @blur="isConfirmPasswordEmpty">
                        <input type="text" v-model="confirmPassword" v-show="showPassConf" name="mdpc" id="mdpc2" tabindex="2" class="form-control"
                               @focus="confirmPasswordEmpty = false"  @blur="isConfirmPasswordEmpty">
                        <span v-show="confirmPasswordEmpty" class="color-red ">Confirmation est obligatoire.</span>
                        <span v-show="!isConfirmPasswordValid && !confirmPasswordEmpty" class="color-red">{{ errorMessageConfirmPassword }}</span>
                    </div>
                </div>
                <br/>
                <div class="form-group">
                    <div class="row">
                        <div class="col-xs-12 col-xm-12 col-md-12 cold-lg-12 ">
                            <button type="submit" name="register-submit" id="register-submit"
                                    tabindex="4" class="form-control btn btn-primary">Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            </form>          
            `,
    data: function () {
        return {
            collaborator:{
                personnalIdNumber:'',
                password:'',
                confirmPassword:'',
            },
            password:'',
            confirmPassword:'',
            errorMessagePassword:'',
            errorMessageConfirmPassword:'',
            passwordEmpty:false,
            confirmPasswordEmpty:false,
            showPass:false,
            showPassConf:false,
            border: 'color-red',
            isPasswordValid:true,
            isConfirmPasswordValid:true,
            idParameter:''
        }
    },

    mounted: function(){
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.getParameterFromUrl();
    },

    watch: {
        password: function(value) {
            this.verifyPassword(value, 'errorMessagePassword');
            if(this.confirmPassword!='')
                this.verifyConfirmPassword(value, 'errorMessageConfirmPassword');
        },
        confirmPassword: function(value) {
            this.verifyConfirmPassword(value, 'errorMessageConfirmPassword');
        }
    },

    methods: {
        verifyPassword(password, errorMessagePassword) {
            if (/^(.){6,125}$/.test(password)) {
                this[errorMessagePassword] = '';
                this.isPasswordValid=true;
            } else {
                this[errorMessagePassword] = 'Le mot de passe doit avoir au minimum 6 caractères';
                this.isPasswordValid=false;
            }
        },

        isPasswordEmpty(){
            if(this.password == ''){
                this.passwordEmpty = true;
            }
        },
        verifyConfirmPassword(confirmPassword, errorMessageConfirmPassword) {
            if (this.confirmPassword === this.password) {
                this[errorMessageConfirmPassword] = '';
                this.isConfirmPasswordValid=true;
            } else {
                this[errorMessageConfirmPassword] = 'La confirmation du mot de passe n\'est pas valide';
                this.isConfirmPasswordValid=false;
            }
        },

        isConfirmPasswordEmpty(){
            if(this.confirmPassword == ''){
                this.confirmPasswordEmpty = true;
            }
        },

        verifyForm (){
            this.isPasswordEmpty(); this.isConfirmPasswordEmpty();
            if( !this.passwordEmpty && !this.confirmPasswordEmpty && this.isConfirmPasswordValid){
                this.$http.put("api/collaborateurs/"+ this.password +"/collaborateursid/"+this.idParameter);
                this.goTo('login');
            }
        },

        getParameterFromUrl(){
            var str = this.$route.params.id;
            this.idParameter = str;
        }
    }
});
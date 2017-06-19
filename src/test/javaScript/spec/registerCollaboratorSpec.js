
describe('test registerCollaborator.js', function () {
let args;

    beforeEach(function () {
        vmNavigationMenu = new NavigationMenu().$mount();
        vmFormulaire = new Formulaire().$mount();
        vmConnexionForm = new ConnexionForm().$mount();
        vmCustomInput = new CustomInput().$mount();
        vmCustomPasswordInput = new customPasswordInput().$mount();

        let token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
        document = {
            value_: '',

            get cookie() {
                return this.value_;
            },

            set cookie(value) {
                this.value_ += value + ';';
            }
        };
        vmFormulaire.handleCookie(token);
        vmConnexionForm.stayConnected = true;
        vmConnexionForm.handleCookie(token);
        vmConnexionForm.stayConnected = false;
        vmConnexionForm.handleCookie(token);

    });

    afterEach(function () {

    });

    describe('Test navigation between connexion and inscription forms', function() {

        it('should check variable initialization from navigation-menu component', function () {
            expect(vmNavigationMenu.color_connexion).toBe('color-blue');
            expect(vmNavigationMenu.color_inscription).toBe('color-blue');
            expect(vmNavigationMenu.tabconnexion).toBe('tab active');
            expect(vmNavigationMenu.tabinscription).toBe('tab');
        });

        it('should go to inscription form', function() {
            vmNavigationMenu.$refs.inscriptionButton.click();
            expect(vmNavigationMenu.tabconnexion).toBe('tab');
            expect(vmNavigationMenu.tabinscription).toBe('tab active');
            expect(vmNavigationMenu.newCollab).toBe(true);
        });

        it('should go to inscription form', function() {
            vmNavigationMenu.$refs.connexionButton.click();
            expect(vmNavigationMenu.tabconnexion).toBe('tab active');
            expect(vmNavigationMenu.tabinscription).toBe('tab');
            expect(vmNavigationMenu.newCollab).toBe(false);
        })
    });





   describe('Test registration of a collaborator', function() {

        beforeEach(function () {
           regex = {
               PERSONNAL_ID_NUMBER:"^[A-Z]{3}[0-9]{4}$",
               LAST_NAME:"^[a-zA-Z-'. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$",
               EMAIL:"^[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})+$",
               FIRST_NAME:"^[a-zA-Z-'. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$"
           }
        });

        it('Test personnalIdNumber', function () {
            vmFormulaire.personnalIdNumber = "AZE1234";
            vmFormulaire.collaborator.personnalIdNumber = 'AZE1234';
            expect(vmFormulaire.collaborator.personnalIdNumber).toMatch(regex.PERSONNAL_ID_NUMBER);
            vmFormulaire.verifyLogin('AZE1234');
            expect(vmFormulaire.isLoginValid).toBe(true);
            expect(vmFormulaire.errorMessageLogin).toBe('');
            vmFormulaire.verifyLogin('aZE1234');
            expect(vmFormulaire.isLoginValid).toBe(false);
            expect(vmFormulaire.errorMessageLogin).toBe('Veuillez entrer un code de login valide');
            vmFormulaire.personnalIdNumber = '';
            vmFormulaire.isLoginEmpty();
            expect(vmFormulaire.loginEmpty).toBe(true);
            vmFormulaire.setLoginEmptyToFalse();
            expect(vmFormulaire.loginEmpty).toBe(false);
        });

        it('Test lastName', function () {
            vmFormulaire.verifyLastName('eric');
            expect(vmFormulaire.isLastNameValid).toBe(true);
            expect(vmFormulaire.errorMessageLastName).toBe('');
            vmFormulaire.verifyLastName('7474efef');
            expect(vmFormulaire.isLastNameValid).toBe(false);
            expect(vmFormulaire.errorMessageLastName).toBe('Veuillez entrer un nom valide');
            vmFormulaire.lastName = '';
            vmFormulaire.isLastNameEmpty();
            expect(vmFormulaire.lastNameEmpty).toBe(true);
            vmFormulaire.setLastNameEmptyToFalse();
            expect(vmFormulaire.lastNameEmpty).toBe(false);
        });

        it('Test firstName', function () {
            vmFormulaire.verifyFirstName('caroline');
            expect(vmFormulaire.isFirstNameValid).toBe(true);
            expect(vmFormulaire.errorMessageFirstName).toBe('');
            vmFormulaire.verifyFirstName('8547caroline');
            expect(vmFormulaire.isFirstNameValid).toBe(false);
            expect(vmFormulaire.errorMessageFirstName).toBe('Veuillez entrer un prénom valide');
            vmFormulaire.firstName = '';
            vmFormulaire.isFirstNameEmpty();
            expect(vmFormulaire.firstNameEmpty).toBe(true);
            vmFormulaire.setFirstNameEmptyToFalse();
            expect(vmFormulaire.firstNameEmpty).toBe(false);
        });

        it('Test email', function () {
            vmFormulaire.verifyEmail('ouahib@gmail.com');
            expect(vmFormulaire.isEmailValid).toBe(true);
            expect(vmFormulaire.errorMessageEmail).toBe('');
            vmFormulaire.verifyEmail('Abc.@example.com');
            expect(vmFormulaire.isEmailValid).toBe(false);
            expect(vmFormulaire.errorMessageEmail).toBe('Veuillez entrer un email valide');
            vmFormulaire.email = '';
            vmFormulaire.isEmailEmpty();
            expect(vmFormulaire.emailEmpty).toBe(true);
            vmFormulaire.setEmailAlreadyExistToFalse();
            expect(vmFormulaire.emailEmpty).toBe(false);
            expect(vmFormulaire.emailAlreadyExist).toBe(false);
        });

        it('Test password',function () {
            vmFormulaire.verifyPassword('123456');
            expect(vmFormulaire.isPasswordValid).toBe(true);
            expect(vmFormulaire.errorMessagePassword).toBe('');
            vmFormulaire.verifyPassword('12345');
            vmFormulaire.showPass = false;
            vmFormulaire.toggleShowPassword();
            vmFormulaire.showPass = true;
            expect(vmFormulaire.isPasswordValid).toBe(false);
            expect(vmFormulaire.errorMessagePassword).toBe('Le mot de passe doit avoir au minimum 6 caractères');
            vmFormulaire.password = '';
            vmFormulaire.isPasswordEmpty();
            expect(vmFormulaire.passwordEmpty).toBe(true);
            vmFormulaire.setPasswordEmptyToFalse();
            expect(vmFormulaire.passwordEmpty).toBe(false);

        });

        it('Test confirmPassword',function () {
            vmFormulaire.password = '123456';
            vmFormulaire.confirmPassword = '123456';
            vmFormulaire.verifyConfirmPassword();
            expect(vmFormulaire.isConfirmPasswordValid).toBe(true);
            expect(vmFormulaire.errorMessageConfirmPassword).toBe('');
            vmFormulaire.password = '123456';
            vmFormulaire.confirmPassword = '12345';
            vmFormulaire.showPassConf = false;
            vmFormulaire.toggleShowPasswordConfirmation();
            vmFormulaire.showPassConf = true;
            vmFormulaire.verifyConfirmPassword();
            expect(vmFormulaire.isConfirmPasswordValid).toBe(false);
            expect(vmFormulaire.errorMessageConfirmPassword).toBe('La confirmation du mot de passe n\'est pas valide');
            vmFormulaire.confirmPassword = '';
            vmFormulaire.isConfirmPasswordEmpty();
            expect(vmFormulaire.confirmPasswordEmpty).toBe(true);
            vmFormulaire.confirmPassword = '123456';
            vmFormulaire.setConfirmPasswordEmptyToFalse();
            vmFormulaire.confirmPassword = false;
        });

        it('Check registration process', function(done) {
            vmFormulaire.personnalIdNumber = "AZE1234";
            vmFormulaire.firstName = "Eric";
            vmFormulaire.lastName = "Dupont";
            vmFormulaire.email = "eric.dupont@viseo.com";
            vmFormulaire.password = "123456";
            vmFormulaire.confirmPassword = "123456";
            vmFormulaire.verifyForm();
            setTimeout(function (){
                expect(JSON.stringify(vmFormulaire.collaborator)).toEqual(JSON.stringify({"personnalIdNumber":"AZE1234","lastName":"Dupont","firstName":"Eric","email":"eric.dupont@viseo.com","password":"123456","confirmPassword":"123456"}));
                expect(vmFormulaire.collaboratorToRegister['confirmPassword']).toBe(undefined);
                done();
            });

        });

        it('Test verifyForm',function () {
         vmFormulaire.personnalIdNumber = 'AZE1234';
         vmFormulaire.lastName = 'dupon';
         vmFormulaire.firstName = 'erica';
         vmFormulaire.email = 'dupon@gmail.com';
         vmFormulaire.password = '123456';
         vmFormulaire.confirmPassword = '123456';
         vmFormulaire.verifyForm ();
         });


       it('should check registration collaborator into data bases',function(){


       });
    });




   describe("Test connexion of a collaborator", function() {

        it('Check empty fields', function() {
            vmConnexionForm.email = "";
            var mailInput = vmConnexionForm.$refs.inputMail;
            mailInput.dispatchEvent(new Event("blur")); //Use this to trigger an event for DOM
            expect(vmConnexionForm.emailEmpty).toBe(true);

            vmConnexionForm.password = "";
            var passwordInput = vmConnexionForm.$refs.inputPassword;
            passwordInput.dispatchEvent(new Event("blur"));
            expect(vmConnexionForm.passwordEmpty).toBe(true);
        });

        it('should check fields and stay connected', function() {
            vmConnexionForm.email = 'eric.dupont@viseo.com';
            vmConnexionForm.password = '123456';
            vmConnexionForm.VerifyForm();
            expect(JSON.stringify(vmConnexionForm.userToRegister)).toEqual(JSON.stringify({"email":"eric.dupont@viseo.com","password":"123456"}));
        });

        it('should connect without staying connected', function() {
            vmConnexionForm.email = 'eric.dupont@viseo.com';
            vmConnexionForm.password = '123456';
            vmConnexionForm.stayConnected = false;
            vmConnexionForm.VerifyForm();
        });

        it('should display popup for forgotten password', function() {
            vmConnexionForm.$refs.forgotPassword.click();
            expect(vmConnexionForm.emailEmpty).toBe(true);
            vmConnexionForm.email = 'eric.dupont@viseo.com';
            vmConnexionForm.showPopupFn();
        });

        it('should function sendInformationToCookie', function() {
            vmConnexionForm.email = 'eric.dupont@viseo.com';
            vmConnexionForm.sendInformationToCookie();
        });

       it('should check function gatherUsersFromDatabaseToVerify with success response of server',function(){
            var response = [{
                "id": 4,
                "version": 0,
                "personnalIdNumber": "HBB1234",
                "businessunit": "VISEO DIGITAL",
                "email": "mzsdef@163.com",
                "lastName": "nrek",
                "firstName": "rnejk",
                "password": "123486",
                "isAdmin": false,
                "defaultPicture": true
            }]
            prepareRequest('GET', 'api/collaborateurs', 200, response);
            vmConnexionForm.gatherUsersFromDatabaseToVerify();
            setTimeout(function () {
                expect(vmConnexionForm.allUsers).toEqual(response);
            },0);

           prepareRequest('POST', 'api/sendemail/1', 200, response);
           vmConnexionForm.gatherUsersFromDatabaseToVerify();
           setTimeout(function () {
               expect(vmConnexionForm.showPopup).toBe(true);
           },0);


       });

       it('should check function sendInformationIntoCokkie with success response of server', function (done) {
           var response = [{
               "id": 5,
               "version": 0,
               "personnalIdNumber": "BBB1234",
               "businessunit": "VISEO DIGITAL",
               "email": "mxzsdef@163.com",
               "lastName": "nrjek",
               "firstName": "rnrejk",
               "password": "123456",
               "isAdmin": false,
               "defaultPicture": true
           }, {
               "id": 6,
               "version": 0,
               "personnalIdNumber": "hBB1234",
               "businessunit": "VISEO DIGITAL",
               "email": "xzsdef@163.com",
               "lastName": "rjek",
               "firstName": "nrejk",
               "password": "103456",
               "isAdmin": false,
               "defaultPicture": true
           }]
           prepareRequest('GET', 'api/collaborateurs', 200, response);
           vmConnexionForm.sendInformationToCookie();
           setTimeout(function () {
               expect(vmConnexionForm.allUsers).toEqual(response);
               done();
           }, 0);
       });

        it('should check function sendInformationIntoCokkie with error response of server',function(){
            var response = []
            prepareRequest('GET', 'api/collaborateurs', 200, response);
            vmConnexionForm.sendInformationToCookie();
            setTimeout(function () {
                expect(response.isNotNewEmail).toEqual(true);
            },0);
        });

/*
       it('should check if informations of user exists in database',function () {
        var allUsers = [{
            "id": 0,
            "firstName": "dupont",
            "lastName": "dupont",
            "email": "user@vsieo.com",
            "password": 123456,
        }];

        vmConnexionForm.isNotNewEmail = false;
        vmConnexionForm.email = 'user@vsieo.com';
        vmConnexionForm.allUsers.email = 'user@vsieo.com'
        vmConnexionForm.email = 'user@vsieo.com'
        vmConnexionForm.VerifyEmailFromDatabase();
        expect(vmConnexionForm.emailToSend).toBe('user@vsieo.com');
        expect(vmConnexionForm.passwordToSend).toBe(vmConnexionForm.allUsers.password);
        expect(vmConnexionForm.idToSend).toBe(vmConnexionForm.allUsers.id);
        expect(vmConnexionForm.lastNameToSend).toBe(vmConnexionForm.lastName);
        expect(vmConnexionForm.firstNameToSend).toBe(vmConnexionForm.firstName);
        expect(vmConnexionForm.isNotNewEmail).toBe(true);
        });
       */

    })

    describe("Test customInput", function() {
        it('should check function updateValue', function() {
            vmCustomInput.updateValue('HELLO');
            expect(vmCustomInput.textValue).toBe('HELLO');
        });

        it('should check function handleFocus', function() {
            vmCustomInput.handleFocus();
        });

        it('should check function handleBlur', function() {
            vmCustomInput.handleBlur();
        });
    });

    describe("Test CustomPasswordInput", function() {
        it('should check function updateValue', function() {
            vmCustomPasswordInput.updateValue('HELLO');
            expect(vmCustomPasswordInput.textValue).toBe('HELLO');
        });

        it('should check function handleFocus', function() {
            vmCustomPasswordInput.handleFocus();
        });

        it('should check function handleBlur', function() {
            vmCustomPasswordInput.handleBlur();
        });

        it('should check function handleClick', function() {
            vmCustomPasswordInput.handleClick();
        });
    })
});

describe('test registerCollaborator.js', function () {
    let args;

    beforeEach(function () {
        var response = [
            {status: "200"}
        ];
        prepareRequest('POST', 'api/sendtoken', 200, response);
        vmNavigationMenu = new NavigationMenu().$mount();
    });

    afterEach(function () { });

    describe('Test navigation between connexion and inscription forms', function () {
        beforeEach(function () {
            /*var response = [
                {status: "200"}
            ];
            prepareRequest('POST', 'api/sendtoken', 200, response);*/
            vmNavigationMenu = new NavigationMenu().$mount();
        });

        afterEach(function () {
            clearRequests();
        });

        it('should check variable initialization from navigation-menu component', function () {
            expect(vmNavigationMenu.color_connexion).toBe('color-blue');
            expect(vmNavigationMenu.color_inscription).toBe('color-blue');
            expect(vmNavigationMenu.tabconnexion).toBe('tab active');
            expect(vmNavigationMenu.tabinscription).toBe('tab');
        });

        it('should go to inscription form', function () {
            vmNavigationMenu.$refs.inscriptionButton.click();
            expect(vmNavigationMenu.tabconnexion).toBe('tab');
            expect(vmNavigationMenu.tabinscription).toBe('tab active');
            expect(vmNavigationMenu.newCollab).toBe(true);
        });

        it('should go to inscription form', function () {
            vmNavigationMenu.$refs.connexionButton.click();
            expect(vmNavigationMenu.tabconnexion).toBe('tab active');
            expect(vmNavigationMenu.tabinscription).toBe('tab');
            expect(vmNavigationMenu.newCollab).toBe(false);
        })
    });

    describe('Test registration of a collaborator', function () {

        beforeEach(function () {
            regex = {
                PERSONNAL_ID_NUMBER: "^[A-Z]{3}[0-9]{4}$",
                LAST_NAME: "^[a-zA-Z-'. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$",
                EMAIL: "^[_a-z0-9]+(\\.[_a-z0-9]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,4})+$",
                FIRST_NAME: "^[a-zA-Z-'. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$"
            };
            vmFormulaire = new Formulaire().$mount();
            vmFormulaire.handleCookie(collaboratorToken);

        });

        afterEach(function () {
            clearRequests();
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

        it('Test password', function () {
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

        it('Test confirmPassword', function () {
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

        it('Check registration process with response success of server', function (done) {
            var response = [
                {
                    id: 1,
                    version: 0,
                    personnalIdNumber: "AAA1234",
                    lastName: "DUPONT",
                    firstName: "ERIC",
                    email: "eric.dupont@viseo.com",
                    password: "123456"
                },
                {
                    id: 2,
                    version: 0,
                    personnalIdNumber: "BBB1234",
                    lastName: "COT",
                    firstName: "Harry",
                    email: "harry.cot@viseo.com",
                    password: "123456"
                }
            ];
            prepareRequest('POST', 'api/collaborateurs', 200, response);
            vmFormulaire.personnalIdNumber = "AZE1234";
            vmFormulaire.firstName = "Eric";
            vmFormulaire.lastName = "Dupont";
            vmFormulaire.email = "eric.dupont@viseo.com";
            vmFormulaire.password = "123456";
            vmFormulaire.confirmPassword = "123456";

            vmFormulaire.verifyForm();
            setTimeout(function () {
                expect(JSON.stringify(vmFormulaire.collaborator)).toEqual(JSON.stringify({
                    "personnalIdNumber": "AZE1234",
                    "lastName": "Dupont",
                    "firstName": "Eric",
                    "email": "eric.dupont@viseo.com",
                    "password": "123456",
                    "confirmPassword": "123456"
                }));
                expect(vmFormulaire.collaboratorToRegister['confirmPassword']).toBe(undefined);
                done();
            });

        });

        it('Check registration process with response error of server with a PID already exist', function (done) {
            var response = {message:'personnalIdNumber'};

            prepareRequest('POST', 'api/collaborateurs', 500, response);
            vmFormulaire.personnalIdNumber = "AZE1234";
            vmFormulaire.firstName = "Eric";
            vmFormulaire.lastName = "Dupont";
            vmFormulaire.email = "eric.dupont@viseo.com";
            vmFormulaire.password = "123456";
            vmFormulaire.confirmPassword = "123456";

            vmFormulaire.verifyForm();
            setTimeout(function () {
                expect(vmFormulaire.personalIdNumberAlreadyExist).toBe(true);
                expect(vmFormulaire.emailAlreadyExist).toBe(false);
                done();
            });

        });

        it('Check registration process with response error of server with the email already exist', function (done) {
            var response = {message:'email'};

            prepareRequest('POST', 'api/collaborateurs', 500, response);
            vmFormulaire.personnalIdNumber = "AZE1234";
            vmFormulaire.firstName = "Eric";
            vmFormulaire.lastName = "Dupont";
            vmFormulaire.email = "eric.dupont@viseo.com";
            vmFormulaire.password = "123456";
            vmFormulaire.confirmPassword = "123456";

            vmFormulaire.verifyForm();
            setTimeout(function () {
                expect(vmFormulaire.personalIdNumberAlreadyExist).toBe(false);
                expect(vmFormulaire.emailAlreadyExist).toBe(true);
                done();
            });

        });

        it('Check registration process with response error of server', function (done) {
            var response = [];

            prepareRequest('POST', 'api/collaborateurs', 500, response);
            vmFormulaire.personnalIdNumber = "AZE1234";
            vmFormulaire.firstName = "Eric";
            vmFormulaire.lastName = "Dupont";
            vmFormulaire.email = "eric.dupont@viseo.com";
            vmFormulaire.password = "123456";
            vmFormulaire.confirmPassword = "123456";

            vmFormulaire.verifyForm();
            setTimeout(function () {
                done();
            });

        });

        it('Test verify user to connect by database is a collaborator', function (done) {
            var response = {userConnected: collaboratorToken};

            prepareRequest('POST', 'api/user', 200, response);

            vmFormulaire.verifyUserToConnectByDatabase();
            setTimeout(function () {
                done();
            });
        });

        it('Test verify user to connect by database is a admin', function (done) {
            var response = {userConnected: adminToken};

            prepareRequest('POST', 'api/user', 200, response);

            vmFormulaire.verifyUserToConnectByDatabase();
            setTimeout(function () {
                done();
            });
        });

    });

    describe("Test connexion of a collaborator", function () {

        beforeEach(function () {
            // originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

            vmConnexionForm = new ConnexionForm().$mount();

            let token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";

            vmConnexionForm.stayConnected = true;
            vmConnexionForm.handleCookie(token);
            vmConnexionForm.stayConnected = false;
            vmConnexionForm.handleCookie(token);

        });

        afterEach(function () {
            clearRequests();
            Object.assign(vmConnexionForm.$data, vmConnexionForm.$options.data());
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('Check empty fields', function () {
            vmConnexionForm.email = "";
            var mailInput = vmConnexionForm.$refs.inputMail;
            mailInput.dispatchEvent(new Event("blur")); //Use this to trigger an event for DOM
            expect(vmConnexionForm.emailEmpty).toBe(true);

            vmConnexionForm.password = "";
            var passwordInput = vmConnexionForm.$refs.inputPassword;
            passwordInput.dispatchEvent(new Event("blur"));
            expect(vmConnexionForm.passwordEmpty).toBe(true);
        });

        it('should check fields and stay connected and user is collaborator', function (done) {
            var response = {userConnected: collaboratorToken};

            prepareRequest('POST', 'api/user', 200, response);
            vmConnexionForm.email = 'eric.dupont@viseo.com';
            vmConnexionForm.password = '123456';
            vmConnexionForm.userToRegister = JSON.parse(JSON.stringify(vmConnexionForm.user));
            vmConnexionForm.VerifyForm();

            setTimeout(function () {
                expect(JSON.stringify(vmConnexionForm.userToRegister)).toEqual(JSON.stringify({
                    "email": "eric.dupont@viseo.com",
                    "password": "123456"
                }));
                done();
            });
        });

        it('should check fields and stay connected and user is admin', function (done) {
            var response = {userConnected: adminToken};

            prepareRequest('POST', 'api/user', 200, response);
            vmConnexionForm.email = 'eric.dupont@viseo.com';
            vmConnexionForm.password = '123456';
            vmConnexionForm.userToRegister = JSON.parse(JSON.stringify(vmConnexionForm.user));
            vmConnexionForm.VerifyForm();

            setTimeout(function () {
                expect(JSON.stringify(vmConnexionForm.userToRegister)).toEqual(JSON.stringify({
                    "email": "eric.dupont@viseo.com",
                    "password": "123456"
                }));
                done();
            });
        });

        it('should check fields and stay connected with error response of server', function (done) {
            var response = [];

            prepareRequest('POST', 'api/user', 500, response);
            vmConnexionForm.email = 'eric.dupont@viseo.com';
            vmConnexionForm.password = '123456';
            vmConnexionForm.userToRegister = JSON.parse(JSON.stringify(vmConnexionForm.user));
            vmConnexionForm.VerifyForm();

            setTimeout(function () {
                expect(vmConnexionForm.password).toEqual("");
                expect(vmConnexionForm.user.password).toEqual("");
                expect(vmConnexionForm.isErrorAuthentification).toBe(true);
                done();
            });
        });

        it('should display popup for forgotten password', function () {
            vmConnexionForm.$refs.forgotPassword.click();
            expect(vmConnexionForm.emailEmpty).toBe(true);
            vmConnexionForm.email = 'eric.dupont@viseo.com';
            vmConnexionForm.showPopupFn();
        });

        it('should check function gatherUsersFromDatabaseToVerify with success response of server', function (done) {

            //console.log("jasmine.DEFAULT_TIMEOUT_INTERVAL: " +jasmine.DEFAULT_TIMEOUT_INTERVAL);
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
            }];
            prepareRequest('GET', 'api/collaborateurs', 200, response);
            vmConnexionForm.email = "mzsdef@163.com";
            vmConnexionForm.gatherUsersFromDatabaseToVerify();
            setTimeout(function () {
                expect(vmConnexionForm.allUsers).toEqual(response);
                expect(vmConnexionForm.isErrorAuthentification).toBe(false);
                done();
            }, 100);
        });

        it('should check function gatherUsersFromDatabaseToVerify with error response of server', function (done) {
            var response = [];
            prepareRequest('GET', 'api/collaborateurs', 500, response);
            vmConnexionForm.email = "mzsdef@163.com";
            vmConnexionForm.gatherUsersFromDatabaseToVerify();
            setTimeout(function () {
                done();
            }, 0);
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
            }];
            prepareRequest('GET', 'api/collaborateurs', 200, response);

            vmConnexionForm.email = "mxzsdef@163.com";
            vmConnexionForm.sendInformationToCookie();

            setTimeout(function () {
                expect(vmConnexionForm.allUsers).toEqual(response);
                done();
            }, 10);
        });

        it('should check function sendInformationIntoCokkie with error response of server', function (done) {
            var response = [];
            prepareRequest('GET', 'api/collaborateurs', 500, response);
            vmConnexionForm.sendInformationToCookie();
            setTimeout(function () {
                done();
            }, 0);
        });

    });

    describe("Test customInput", function () {

        beforeEach(function () {
            vmCustomInput = new CustomInput().$mount();
        });

        afterEach(function () {

        });

        it('should check function updateValue', function () {
            vmCustomInput.updateValue('HELLO');
            expect(vmCustomInput.textValue).toBe('HELLO');
        });

        it('should check function handleFocus', function () {
            vmCustomInput.handleFocus();
        });

        it('should check function handleBlur', function () {
            vmCustomInput.handleBlur();
        });
    });

    describe("Test CustomPasswordInput", function () {
        beforeEach(function () {
            vmCustomPasswordInput = new customPasswordInput().$mount();

        });

        afterEach(function () {

        });


        it('should check function updateValue', function () {
            vmCustomPasswordInput.updateValue('HELLO');
            expect(vmCustomPasswordInput.textValue).toBe('HELLO');
        });

        it('should check function handleFocus', function () {
            vmCustomPasswordInput.handleFocus();
        });

        it('should check function handleBlur', function () {
            vmCustomPasswordInput.handleBlur();
        });

        it('should check function handleClick', function () {
            vmCustomPasswordInput.handleClick();
        });
    })
});

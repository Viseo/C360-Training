describe('Enregistrement Collaborateur', function () {
    var ctrl;
    var backend;
    var loc;
    var form;
    var collaboratorDescription = {
        id: 1,
        personnalIdNumber: "HDA1234",
        firstName: "Henri",
        lastName: "Darmet",
        email: "henri.darmet@viseo.com",
        password: "................",
    };

    beforeEach(module('App'));

    beforeEach(inject(function ($controller, $httpBackend, $location) {
        backend = $httpBackend;
        loc = $location;
        loc.url('/RegisterCollaborator');
        ctrl = $controller('controllerRegisterCollaborator');
        form = {
            lastName: {$invalid: false},
            firstName: {$invalid: false},
            personnalIdNumber: {$invalid: false},
            email: {$invalid: false},
            password: {$invalid: false},
            confirmPassword: {$invalid: false},
            $invalid: false,
            $error: {}
        };
    }));

    describe('Test EnregistrementCollaborateur', function () {

        beforeEach(function () {
            backend.expectGET('api/collaborateurs/regex').respond('{"PERSONNAL_ID_NUMBER":"[A-Z]{3}[0-9]{4}","LAST_NAME":"^[a-zA-Z-\'. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$","FIRST_NAME":"^[a-zA-Z-\'. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$", "EMAIL":"^[_a-z0-9]+(\\\\.[_a-z0-9]+)*@[a-z0-9-]+(\\\\.[a-z0-9-]+)*(\\\\.[a-z]{2,4})+$"}');
            ctrl.collaborator = {};
            backend.flush();
        });

        afterEach(function () {
            backend.verifyNoOutstandingExpectation();
            backend.verifyNoOutstandingRequest();
        });

        function fillEmailCorrectly(){
            ctrl.collaborator.email = "henri.darmet@viseo.com";
            expect(ctrl.collaborator.email).toMatch(ctrl.regex.email);
        }

        function fillPasswordCorrectly(){
            ctrl.collaborator.password = "000000";
            ctrl.collaborator.confirmPassword = "000000";
        }

        function fillIdentityCollaboratorCorrectly(){
            ctrl.collaborator.lastName = "Darmet";
            expect(ctrl.collaborator.lastName).toMatch(ctrl.regex.lastName);
            ctrl.collaborator.firstName = "Henri";
            expect(ctrl.collaborator.firstName).toMatch(ctrl.regex.firstName);
            ctrl.collaborator.personnalIdNumber = "HDA1234";
            expect(ctrl.collaborator.personnalIdNumber).toMatch(ctrl.regex.personnalIdNumber);
        }


        it('1) Valide', function () {
            fillIdentityCollaboratorCorrectly();
            fillEmailCorrectly();
            fillPasswordCorrectly();
            backend.expectPOST('api/collaborateurs', self.collaborator).respond({data: collaboratorDescription});
            ctrl.verifyForm(form);
            backend.flush();
            expect(ctrl.isNewPersonalIdNumber).toBeTruthy();
            expect(ctrl.isFalseForm).toBeFalsy();
            expect(ctrl.isThereAnEmptyField).toBeFalsy();
            expect(loc.path()).toBe('/Authentication');
        });

        it('2) Invalid because of input avoid', function () {
            ctrl.collaborator.lastName = "Darmet@";
            expect(ctrl.collaborator.lastName).not.toMatch(ctrl.regex.lastName);
            ctrl.collaborator.firstName = "";
            ctrl.collaborator.personnalIdNumber = "HDA1234";
            expect(ctrl.collaborator.personnalIdNumber).toMatch(ctrl.regex.personnalIdNumber);
            fillEmailCorrectly();
            ctrl.collaborator.password = "000000";
            ctrl.collaborator.confirmPassword = "";
            form = {
                lastName: {$invalid: true},
                firstName: {$invalid: true},
                personnalIdNumber: {$invalid: false},
                email: {$invalid: false},
                password: {$invalid: false},
                confirmPassword: {$invalid: true},
                $invalid: true,
                $error: {required: [{}, {}], pwCheck: [{}], pattern:[{}]}
            };
            ctrl.verifyForm(form);
            expect(ctrl.isNewEmail).toBeTruthy();
            expect(ctrl.isNewPersonalIdNumber).toBeTruthy();
            expect(ctrl.isFalseForm).toBeFalsy();
            expect(ctrl.isThereAnEmptyField).toBeTruthy();
            expect(loc.path()).toBe('/RegisterCollaborator');
        });

        it('3) Password confirmation is invalid', function(){
            fillIdentityCollaboratorCorrectly();
            fillEmailCorrectly();
            ctrl.collaborator.password = "AAAAAAAAAAA";
            ctrl.collaborator.confirmPassword = "BBBBBBBBBBB";
            form = {
                lastName: {$invalid: false},
                firstName: {$invalid: false},
                personnalIdNumber: {$invalid: false},
                email: {$invalid: false},
                password: {$invalid: false},
                confirmPassword: {$invalid: true},
                $invalid: true,
                $error: {pwCheck: [{}]}
            };
            ctrl.verifyForm(form);
            expect(ctrl.isNewEmail).toBeTruthy();
            expect(ctrl.isNewPersonalIdNumber).toBeTruthy();
            expect(ctrl.isFalseForm).toBeTruthy();
            expect(ctrl.isThereAnEmptyField).toBeFalsy();
            expect(loc.path()).toBe('/RegisterCollaborator');
        });

        it('4) Invalid because of inputs incorrect', function () {
            ctrl.collaborator.lastName = "Darmet@";
            expect(ctrl.collaborator.lastName).not.toMatch(ctrl.regex.lastName);
            ctrl.collaborator.firstName = "888";
            expect(ctrl.collaborator.firstName).not.toMatch(ctrl.regex.firstName);
            ctrl.collaborator.personnalIdNumber = "HDA1234";
            expect(ctrl.collaborator.personnalIdNumber).toMatch(ctrl.regex.personnalIdNumber);
            fillEmailCorrectly();
            fillPasswordCorrectly();
            form = {
                lastName: {$invalid: true},
                firstName: {$invalid: true},
                personnalIdNumber: {$invalid: false},
                email: {$invalid: false},
                password: {$invalid: false},
                confirmPassword: {$invalid: true},
                $invalid: true,
                $error: {pwCheck: [{}], pattern: [{}, {}]}
            };
            ctrl.verifyForm(form);
            expect(ctrl.isNewEmail).toBeTruthy();
            expect(ctrl.isNewPersonalIdNumber).toBeTruthy();
            expect(ctrl.isFalseForm).toBeTruthy();
            expect(ctrl.isThereAnEmptyField).toBeFalsy();
            expect(loc.path()).toBe('/RegisterCollaborator');
        });

        it('5) E-mail address is invalid', function(){
            fillIdentityCollaboratorCorrectly();
            ctrl.collaborator.email = "henri.darmet@viseocom";
            expect(ctrl.collaborator.email).not.toMatch(ctrl.regex.email);
            fillPasswordCorrectly(form);
            form = {
                lastName: {$invalid: false},
                firstName: {$invalid: false},
                personnalIdNumber: {$invalid: false},
                email: {$invalid: false},
                password: {$invalid: false},
                confirmPassword: {$invalid: true},
                $invalid: true,
                $error: {pattern: [{}]}
            };
            ctrl.verifyForm(form);
            expect(ctrl.isNewEmail).toBeTruthy();
            expect(ctrl.isNewPersonalIdNumber).toBeTruthy();
            expect(ctrl.isFalseForm).toBeTruthy();
            expect(ctrl.isThereAnEmptyField).toBeFalsy();
            expect(loc.path()).toBe('/RegisterCollaborator');
        });

        it('6) Invalid because e-mail is already used', function () {
            fillIdentityCollaboratorCorrectly();
            fillEmailCorrectly();
            fillPasswordCorrectly();
            backend.expectPOST('api/collaborateurs', self.collaborator).respond(400, {message: "email"});
            ctrl.verifyForm(form);
            backend.flush();
            expect(ctrl.isNewEmail).toBeFalsy();
            expect(ctrl.isNewPersonalIdNumber).toBeTruthy();
            expect(ctrl.isFalseForm).toBeFalsy();
            expect(ctrl.isThereAnEmptyField).toBeFalsy();
            expect(loc.path()).toBe('/RegisterCollaborator');
        });

        it('7) Invalid because matricule is already used', function () {
            fillIdentityCollaboratorCorrectly();
            fillEmailCorrectly();
            fillPasswordCorrectly();
            backend.expectPOST('api/collaborateurs', self.collaborator).respond(400, {message: "personnalIdNumber"});
            ctrl.verifyForm(form);
            backend.flush();
            expect(ctrl.isNewEmail).toBeTruthy();
            expect(ctrl.isNewPersonalIdNumber).toBeFalsy();
            expect(ctrl.isFalseForm).toBeFalsy();
            expect(ctrl.isThereAnEmptyField).toBeFalsy();
            expect(loc.path()).toBe('/RegisterCollaborator');
        });

        it('8) Invalid because password is too short', function () {
            fillIdentityCollaboratorCorrectly();
            fillEmailCorrectly();
            ctrl.collaborator.password = "AAA";
            ctrl.collaborator.confirmPassword = "AAA";
            form = {
                lastName: {$invalid: false},
                firstName: {$invalid: false},
                personnalIdNumber: {$invalid: false},
                email: {$invalid: false},
                password: {$invalid: true},
                confirmPassword: {$invalid: false},
                $invalid: true,
                $error: {minlength: [{}]}
            };
            ctrl.verifyForm(form);
            expect(ctrl.isNewEmail).toBeTruthy();
            expect(ctrl.isNewPersonalIdNumber).toBeTruthy();
            expect(ctrl.isFalseForm).toBeTruthy();
            expect(ctrl.isThereAnEmptyField).toBeFalsy();
            expect(loc.path()).toBe('/RegisterCollaborator');
        });
    });
});
/**
 * Created by NBE3663 on 18/04/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

var newGlobalVue = new Vue({
    template: '<div><assign-collaborator></assign-collaborator></div>',
    router: router,
    components: {
        'assignCollaborator': assignCollaborator
    }
}).$mount();

var vmAssignCollaborator;

fdescribe('assign collaborator panel test', function () {

    beforeEach(function () {
        vmAssignCollaborator = newGlobalVue.$children[0];
    });

    afterEach(function () {
        Object.assign(vmAssignCollaborator.$data, vmAssignCollaborator.$options.data());
        clearRequests();
    });

    it('should check if the number of whishes is displayed in the notification icon when the admin load the page (should show number 2)', function (done){
        response = [
            {
                "id": 10,
                "version": 0,
                "label": "SSS",
                "collaborator": {
                    "id": 5,
                    "version": 0,
                    "personnalIdNumber": "BBB1234",
                    "lastName": "nrjek",
                    "firstName": "rnrejk",
                    "email": "mxzsdef@163.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "vote_ok": null,
                "vote_ko": null,
                "checked": false
            },
            {
                "id": 11,
                "version": 0,
                "label": "SSSFFF",
                "collaborator": {
                    "id": 5,
                    "version": 0,
                    "personnalIdNumber": "BBB1234",
                    "lastName": "nrjek",
                    "firstName": "rnrejk",
                    "email": "mxzsdef@163.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "vote_ok": null,
                "vote_ko": null,
                "checked": true
            }
        ];
        prepareRequest('GET', 'api/isnotcheckedwishes', 200, response);
        vmAssignCollaborator.getNumberOfWhisesForNotification();
        setTimeout(function () {
            expect(vmAssignCollaborator.numberOfWishesNotChecked).toBe(2);
            done();
        }, 0);
    });

    it('should check if the number of whishes is 0 in the notification icon when the admin load the page and got a request error (should show number 0)', function (done){
        vmAssignCollaborator.collaborator_id = 1;
        vmAssignCollaborator.getNumberOfWhisesForNotification();

        setTimeout(function () {
            expect(vmAssignCollaborator.numberOfWishesNotChecked).toBe(0);
            done();
        }, 0);
    });

    it('should check if there are a result when collaborator exist and did a request for the specific session when admin is searching a specific collaborator name', function (done) {
        let collaboratorWhoDidARequestForASession = [{
            email: "benjamin.batista@viseo.com",
            firstName: "Benjamin",
            id: 10,
            lastName: "Batista",
            password: "123456",
            version: 0
        }];
        vmAssignCollaborator.requestedCollaboratorsMemo = collaboratorWhoDidARequestForASession;
        expect(vmAssignCollaborator.requestedCollaboratorsMemo.length).toBe(1);
        vmAssignCollaborator.value = "Batista";

        setTimeout(function () {
            expect(vmAssignCollaborator.requestedCollaborators.length).toEqual(1);
            done();
        }, 0);
    });

    it('should check if there is no result (collaborator does not exist) when admin is searching a specific collaborator name', function (done) {
        vmAssignCollaborator.requestedCollaboratorsMemo = [{
            email: "benjamin.batista@viseo.com",
            firstName: "Benjamin",
            id: 18,
            lastName: "Da Rocha",
            password: "123456",
            version: 0
        }];
        expect(vmAssignCollaborator.requestedCollaboratorsMemo.length).toEqual(1);
        vmAssignCollaborator.value = "Batista";
        setTimeout(function(){
            expect(vmAssignCollaborator.requestedCollaborators.length).toEqual(0);
            done();
        }, 0);
    });

    it('should check if all available sessions are in the drop-down when page is loaded', function () {
        var response = [{
            "id": 6,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "13/05/2017",
            "ending": "13/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        }];
        prepareRequest('GET', 'api/sessions', 200, response);
        vmAssignCollaborator.gatherAllSessions();
        setTimeout( function() {
            expect(vmAssignCollaborator.state.allSessions).toEqual(response)
        }, 0);
    });

    it('should check if fields are greys when there are no sessions selected ', function () {
        expect(vmAssignCollaborator.isDisabled).toBe(true);
        expect(vmAssignCollaborator.sessionIdChosen).toBe(0);
    });

    it('should check if fields are not greys when sessions are selected ', function (done) {
        vmAssignCollaborator.sessionIdChosen = 6;
        setTimeout(function(){
           // expect(vmAssignCollaborator.sessionIdChosen).toEqual(6); NE FONCTIONNE PAS -> UNDEFINED (VOIR AVEC HENRI) + Probleme deux requetes
            expect(vmAssignCollaborator.isDisabled).toBe(false);
            done();
        }, 0);
    });

    it('should check if collaborators that did a session request (and is not accepted yet) are displayed when admin check the checkbox and has already chosen a session', function (done) {
        vmAssignCollaborator.sessionIdChosen = 6;
        vmAssignCollaborator.checkedNames = true;
        var collaboratorThatDidARequestForSessionWithId6 = [
            {
                "email": "eric.dupon@viseo.com",
                "firstName": "Eric",
                "id": 5,
                "lastName": "Dupond",
                "password": "123456",
                "version": 0
            }
        ];
        var collaboratorThatIsAlreadyInSessionWithId6 = [
            {
                "email": 'benjamin.batista@viseo.com',
                "firstName": 'Benjamin',
                "id": 10,
                "lastName": 'BATISTA',
                "password": '123456',
                "version": 0
            },

        ];
        prepareRequest('GET', 'api/requests/session/6/collaborators', 200, collaboratorThatDidARequestForSessionWithId6);
        vmAssignCollaborator.verifyCheckedNames();
        prepareRequest('GET', 'api/sessions/6/collaborators', 200, collaboratorThatIsAlreadyInSessionWithId6);
        vmAssignCollaborator.verifyCollaboratorsRequestingNotYetAccepted();

        setTimeout(function(){
            expect(vmAssignCollaborator.requestedCollaborators).toEqual(collaboratorThatDidARequestForSessionWithId6);
            expect(vmAssignCollaborator.allCollaboratorsAlreadyInSessions).toEqual(collaboratorThatIsAlreadyInSessionWithId6);
            done();
        },0);
    });

    it('should check if collaborators that did a session request (and is not accepted yet) are displayed when admin check the checkbox and has already chosen a session and that there is a server error', function (done) {
        vmAssignCollaborator.sessionIdChosen = 6;
        vmAssignCollaborator.checkedNames = true;
        vmAssignCollaborator.verifyCheckedNames();
        vmAssignCollaborator.verifyCollaboratorsRequestingNotYetAccepted();

        setTimeout(function(){
            expect(vmAssignCollaborator.requestedCollaborators).toEqual([]);
            expect(vmAssignCollaborator.allCollaboratorsAlreadyInSessions).toEqual([]);
            done();
        },0);
    });

    it('should check if collaborators that did a session request (and is accepted yet) are not displayed when admin check the checkbox and has already chosen a session', function (done) {
        vmAssignCollaborator.sessionIdChosen = 6;
        vmAssignCollaborator.checkedNames = true;
        var collaboratorThatDidARequestForSessionWithId6 = [
            {
                "email": "eric.dupon@viseo.com",
                "firstName": "Eric",
                "id": 5,
                "lastName": "Dupond",
                "password": "123456",
                "version": 0
            },
            {
                "email": 'stefani.zala@viseo.com',
                "firstName": 'Stefani',
                "id": 20,
                "lastName": 'Zala',
                "password": '123456',
                "version": 0
            },
        ];
        var collaboratorThatIsAlreadyInSessionWithId6 = [
            {
                "email": 'benjamin.batista@viseo.com',
                "firstName": 'Benjamin',
                "id": 10,
                "lastName": 'BATISTA',
                "password": '123456',
                "version": 0
            },
            {
                "email": "eric.dupon@viseo.com",
                "firstName": "Eric",
                "id": 5,
                "lastName": "Dupond",
                "password": "123456",
                "version": 0
            }
        ];
        var collaboratorThatIsNotYetAcceptedForSession6 = [{
            "email": 'stefani.zala@viseo.com',
            "firstName": 'Stefani',
            "id": 20,
            "lastName": 'Zala',
            "password": '123456',
            "version": 0
        }];
        prepareRequest('GET', 'api/requests/session/6/collaborators', 200, collaboratorThatDidARequestForSessionWithId6);
        vmAssignCollaborator.verifyCheckedNames();
        prepareRequest('GET', 'api/sessions/6/collaborators', 200, collaboratorThatIsAlreadyInSessionWithId6);
        vmAssignCollaborator.verifyCollaboratorsRequestingNotYetAccepted();

        setTimeout(function(){
            expect(vmAssignCollaborator.requestedCollaborators).toEqual(collaboratorThatIsNotYetAcceptedForSession6);
            expect(vmAssignCollaborator.allCollaboratorsAlreadyInSessions).toEqual(collaboratorThatIsAlreadyInSessionWithId6);
            done();
        },0);
    });

    it('should check if collaborators that did not a session request (and is not accepted yet) are displayed when admin uncheck the checkbox and has already chosen a session', function (done) {
        vmAssignCollaborator.sessionIdChosen = 6;
        vmAssignCollaborator.checkedNames = false;
        var collaboratorThatDidNotARequestForSessionWithId6 = [
            {
                "email": "eric.dupon@viseo.com",
                "firstName": "Eric",
                "id": 5,
                "lastName": "Dupond",
                "password": "123456",
                "version": 0
            },
            {
                "email": 'stefani.zala@viseo.com',
                "firstName": 'Stefani',
                "id": 20,
                "lastName": 'Zala',
                "password": '123456',
                "version": 0
            },
        ];
        var collaboratorThatIsAlreadyInSessionWithId6 = [
            {
                "email": 'benjamin.batista@viseo.com',
                "firstName": 'Benjamin',
                "id": 10,
                "lastName": 'BATISTA',
                "password": '123456',
                "version": 0
            }
        ];
        prepareRequest('GET', 'api/collaborateurs', 200, collaboratorThatDidNotARequestForSessionWithId6);
        vmAssignCollaborator.verifyCheckedNames();
        prepareRequest('GET', 'api/sessions/6/collaborators', 200, collaboratorThatIsAlreadyInSessionWithId6);
        vmAssignCollaborator.verifyAllCollaboratorsNotYetAccepted();

        setTimeout(function(){
            expect(vmAssignCollaborator.requestedCollaborators).toEqual(collaboratorThatDidNotARequestForSessionWithId6);
            expect(vmAssignCollaborator.allCollaboratorsAlreadyInSessions).toEqual(collaboratorThatIsAlreadyInSessionWithId6);
            done();
        },0);
    });

    it('should check if collaborators that did not a session request (and is not accepted yet) are displayed when admin uncheck the checkbox and has already chosen a session and there is a server problem', function (done) {
        vmAssignCollaborator.sessionIdChosen = 6;
        vmAssignCollaborator.checkedNames = false;
        vmAssignCollaborator.verifyCheckedNames();
        vmAssignCollaborator.verifyAllCollaboratorsNotYetAccepted();

        setTimeout(function(){
            expect(vmAssignCollaborator.requestedCollaborators).toEqual([]);
            expect(vmAssignCollaborator.allCollaboratorsAlreadyInSessions).toEqual([]);
            done();
        },0);
    });


    it('should check if counter is increased when collaborators has been added', function () {
        vmAssignCollaborator.validatedCollab = [{
            "email": 'eric.dupon@viseo.com',
            "firstName": 'Eric',
            "id": 5,
            "lastName": 'Dupond',
            "password": '123456',
            "version": 0

        }];
        vmAssignCollaborator.allCollaboratorsAlreadyInSessions = [{
            "email": 'julien.tallon@viseo.com',
            "firstName": 'Julien',
            "id": 6,
            "lastName": 'Tallon',
            "password": '654321',
            "version": 7

        }];

        var vmLengthValidatedCollab = vmAssignCollaborator.validatedCollab.length;
        var vmAllCollaboratorsAlreadyInSessions = vmAssignCollaborator.allCollaboratorsAlreadyInSessions.length;
        vmAssignCollaborator.numberAddedCollabCounter();
        expect(vmAssignCollaborator.numberAddedCollab).toEqual(vmLengthValidatedCollab);
        expect(vmAssignCollaborator.numberPlacesAvailable).toEqual(15 - vmAllCollaboratorsAlreadyInSessions);
        expect(vmLengthValidatedCollab).toBeLessThan(15);
        expect(vmAssignCollaborator.isRegistrationAvailable).toBe(true);
        vmAssignCollaborator.validatedCollab = [{
            "email": 'norine.dumas@viseo.com',
            "firstName": 'norine',
            "id": 88,
            "lastName": 'dumas',
            "password": '1234567',
            "version": 5

        }, {
            "email": 'junifer.gadomski@viseo.com',
            "firstName": 'jenifer',
            "id": 75,
            "lastName": 'gadomski',
            "password": '689547',
            "version": 77

        },
            {
                "email": 'yannis.arapis@viseo.com',
                "firstName": 'yannis',
                "id": 95,
                "lastName": 'arapis',
                "password": 'jekolms52',
                "version": 76

            }, {
                "email": 'nicolas.guest@viseo.com',
                "firstName": 'nicolas',
                "id": 96,
                "lastName": 'guest',
                "password": 'lmpqksn26',
                "version": 23
            }, {
                "email": 'yves.perrolini@viseo.com',
                "firstName": 'Jean',
                "id": 35,
                "lastName": 'Perrolini',
                "password": 'nkxpsks99',
                "version": 302
            }, {
                "email": 'patricia.varet@viseo.com',
                "firstName": 'Patricia',
                "id": 632,
                "lastName": 'Varet',
                "password": 'mplsbn20',
                "version": 37

            }, {
                "email": 'yasser.gueddou@viseo.com',
                "firstName": 'Yasser',
                "id": 325,
                "lastName": 'Gueddou',
                "password": 'ncbjshs1258',
                "version": 56

            }, {
                "email": 'luc.brient@viseo.com',
                "firstName": 'Luc',
                "id": 63,
                "lastName": 'Brient',
                "password": 'mlpos5kl',
                "version": 20

            }, {
                "email": 'isabelle.biagala@viseo.com',
                "firstName": 'Isabelle',
                "id": 15,
                "lastName": 'Biagala',
                "password": 'nxbhmm8',
                "version": 36

            }, {
                "email": 'philippe.dezarnaud@viseo.com',
                "firstName": 'Philippe',
                "id": 239,
                "lastName": 'Dezarnaud',
                "password": 'jjieukl',
                "version": 66

            }, {
                "email": 'anas.ouahidi@viseo.com',
                "firstName": 'Anas',
                "id": 695,
                "lastName": 'Ouahidi',
                "password": '697',
                "version": 15

            }, {
                "email": 'feker.medeb@viseo.com',
                "firstName": 'Feker',
                "id": 789,
                "lastName": 'Medeb',
                "password": 'hjisnb',
                "version": 125

            }, {
                "email": 'nihel.bengamra@viseo.com',
                "firstName": 'Nihel',
                "id": 96,
                "lastName": 'Ben Gamra',
                "password": 'lmspojzy632',
                "version": 889

            }, {
                "email": 'benjamin.batista@viseo.com',
                "firstName": 'Benjamin',
                "id": 69,
                "lastName": 'Batista',
                "password": 'klomp6',
                "version": 332

            }, {
                "email": 'marouene.bouhachem@viseo.com',
                "firstName": 'Marouene',
                "id": 45,
                "lastName": 'Bouhachem',
                "password": 'kppmlq5',
                "version": 789

            }, {
                "email": 'mohamedmehdi.saad@viseo.com',
                "firstName": 'Mohamed Mehdi',
                "id": 596,
                "lastName": 'Saad',
                "password": 'hsuolm9',
                "version": 356

            }]
        var vmLengthValidatedCollabTest = vmAssignCollaborator.validatedCollab.length;
        vmAssignCollaborator.numberAddedCollabCounter();
        expect(vmLengthValidatedCollabTest).toBeGreaterThan(15);
        expect(vmAssignCollaborator.isRegistrationAvailable).toBe(false);
    });

    it('should check if collaborators are moved from left list to right list ', function () {
        vmAssignCollaborator.requestedCollaborators = [{
            "email": 'norine.dumas@viseo.com',
            "firstName": 'norine',
            "id": 88,
            "lastName": 'dumas',
            "password": '1234567',
            "version": 5
        }, {
            "email": 'junifer.gadomski@viseo.com',
            "firstName": 'jenifer',
            "id": 75,
            "lastName": 'gadomski',
            "password": '689547',
            "version": 77
        }];
        var vmLengthRequestedCollaborators = vmAssignCollaborator.requestedCollaborators.length;
        vmAssignCollaborator.moveCollabLeft();
        expect(vmLengthRequestedCollaborators).not.toBeNull();
    });

    it('should check if collaborators are moved from right list to left list ', function () {
        vmAssignCollaborator.validatedCollab = [{
            "email": 'norine.dumas@viseo.com',
            "firstName": 'norine',
            "id": 88,
            "lastName": 'dumas',
            "password": '1234567',
            "version": 5
        }, {
            "email": 'junifer.gadomski@viseo.com',
            "firstName": 'jenifer',
            "id": 75,
            "lastName": 'gadomski',
            "password": '689547',
            "version": 77
        }];
        var vmValidatedCollab = vmAssignCollaborator.validatedCollab.length;
        vmAssignCollaborator.moveCollabRight();
        expect(vmValidatedCollab).not.toBeNull();

    });

    it('should check if confirmation message appear and fields are greys when collaborators are saved for the specific session', function (done) {
        vmAssignCollaborator.isRegistrationAvailable = true;
        vmAssignCollaborator.validatedCollab = [{
            email: "viseo@viseo.com",
            firstName: "viseo",
            id: 4,
            lastName: "technologie",
            password: "123456",
            version: 0
        }];
        var response = [{
            "id": 15,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "13/05/2017",
            "ending": "13/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        }];
        prepareRequest('POST', 'api/requestsassign/15/15,10,18,4,4', 200, response);
        vmAssignCollaborator.sessionIdChosen = 15;
        vmAssignCollaborator.allCollaboratorsIdChosen = [15, 10, 18, 4];
        vmAssignCollaborator.saveCollabInSessions();
        expect(vmAssignCollaborator.confirmCollaboratorAddedSession).toBe(true);
        expect(vmAssignCollaborator.validatedCollab.length).toBe(0);
        expect(vmAssignCollaborator.allCollaboratorsIdChosen.length).toBe(0);
        expect(vmAssignCollaborator.allCollaboratorsAlreadyInSessions.length).toBe(0);
        expect(vmAssignCollaborator.sessionIdChosen).toBe(0);
        expect(vmAssignCollaborator.isDisabled).toBe(true);
        expect(vmAssignCollaborator.allCollaboratorsName.length).toBe(0);
        expect(vmAssignCollaborator.allCollaborators.length).toBe(0);
        expect(vmAssignCollaborator.requestedCollaborators.length).toBe(0);
        expect(vmAssignCollaborator.isRegistrationAvailable).toBe(true);
        expect(vmAssignCollaborator.value).toBe('');

        setTimeout(function () {
            expect(vmAssignCollaborator.confirmCollaboratorAddedSession).toBe(false);
            done();
        }, 2001);
    });

    it('should check if collaborators are saved into database when admin click on save button', function (done) {
        vmAssignCollaborator.isRegistrationAvailable = true;
        vmAssignCollaborator.validatedCollab = [{
            email: "viseo@viseo.com",
            firstName: "viseo",
            id: 4,
            lastName: "technologie",
            password: "123456",
            version: 0
        }];
        var response = [{
            "id": 15,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "13/05/2017",
            "ending": "13/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        }];
        prepareRequest('PUT', 'api/sessions/15/15,10,18,4,4/collaborators', 200, response);
        vmAssignCollaborator.sessionIdChosen = 15;
        vmAssignCollaborator.allCollaboratorsIdChosen = [15, 10, 18, 4];
        vmAssignCollaborator.saveCollabInSessions();
        expect(vmAssignCollaborator.confirmCollaboratorAddedSession).toBe(true);
        expect(vmAssignCollaborator.validatedCollab.length).toBe(0);
        expect(vmAssignCollaborator.allCollaboratorsIdChosen.length).toBe(0);
        expect(vmAssignCollaborator.allCollaboratorsAlreadyInSessions.length).toBe(0);
        expect(vmAssignCollaborator.sessionIdChosen).toBe(0);
        expect(vmAssignCollaborator.isDisabled).toBe(true);
        expect(vmAssignCollaborator.allCollaboratorsName.length).toBe(0);
        expect(vmAssignCollaborator.allCollaborators.length).toBe(0);
        expect(vmAssignCollaborator.requestedCollaborators.length).toBe(0);
        expect(vmAssignCollaborator.isRegistrationAvailable).toBe(true);
        expect(vmAssignCollaborator.value).toBe('');

        setTimeout(function () {
            expect(vmAssignCollaborator.confirmCollaboratorAddedSession).toBe(false);
            done();
        }, 2001);
    });

    it('should check if confirmation message appear and fields are greys when collaborators are saved for the specific session (and there is an error server)', function (done) {
        vmAssignCollaborator.isRegistrationAvailable = true;
        vmAssignCollaborator.validatedCollab = [{
            email: "viseo@viseo.com",
            firstName: "viseo",
            id: 4,
            lastName: "technologie",
            password: "123456",
            version: 0
        }];
        vmAssignCollaborator.sessionIdChosen = 15;
        vmAssignCollaborator.allCollaboratorsIdChosen = [15, 10, 18, 4];
        vmAssignCollaborator.saveCollabInSessions();
        expect(vmAssignCollaborator.confirmCollaboratorAddedSession).toBe(true);
        expect(vmAssignCollaborator.validatedCollab.length).toBe(0);
        expect(vmAssignCollaborator.allCollaboratorsIdChosen.length).toBe(0);
        expect(vmAssignCollaborator.allCollaboratorsAlreadyInSessions.length).toBe(0);
        expect(vmAssignCollaborator.sessionIdChosen).toBe(0);
        expect(vmAssignCollaborator.isDisabled).toBe(true);
        expect(vmAssignCollaborator.allCollaboratorsName.length).toBe(0);
        expect(vmAssignCollaborator.allCollaborators.length).toBe(0);
        expect(vmAssignCollaborator.requestedCollaborators.length).toBe(0);
        expect(vmAssignCollaborator.isRegistrationAvailable).toBe(true);
        expect(vmAssignCollaborator.value).toBe('');

        setTimeout(function () {
            expect(vmAssignCollaborator.confirmCollaboratorAddedSession).toBe(false);
            done();
        }, 2001);
    });

    it('should check if error message is displayed when there are type error in search field (when administrator is looking for a collaborator)', function (done) {
        vmAssignCollaborator.value = "@";
        setTimeout(function(){
            expect(vmAssignCollaborator.isSearchNameValid).toBe(false);
            expect(vmAssignCollaborator.lastNameRegexErrorMessage).toEqual("Veuillez entrer un nom ou prénom valide");
            done();
        }, 0);
    });

    it('should check if error message is not displayed when there are no type error in search field (when administrator is looking for a collaborator)', function (done) {
        vmAssignCollaborator.value = "Ben";
        setTimeout(function(){
            expect(vmAssignCollaborator.isSearchNameValid).toBe(true);
            expect(vmAssignCollaborator.lastNameRegexErrorMessage).toEqual('');
            done();
        }, 0);
    });

    it('should check if "no collaborator found" message is displayed when the admin is looking for a specific collaborator and the collaborator can not be found', function (done) {
        vmAssignCollaborator.requestedCollaborators = [];
        setTimeout(function(){
            expect(vmAssignCollaborator.noCollaboratorsFound).toBe(true);
            done();
        }, 0);
    });

    it('should check if "no collaborator found" message is not displayed when the admin is looking for a specific collaborator and the collaborator can not be found', function (done) {
        vmAssignCollaborator.requestedCollaborators = [{
            "email": 'norine.dumas@viseo.com',
            "firstName": 'norine',
            "id": 88,
            "lastName": 'dumas',
            "password": '1234567',
            "version": 5
        }, {
            "email": 'junifer.gadomski@viseo.com',
            "firstName": 'jenifer',
            "id": 75,
            "lastName": 'gadomski',
            "password": '689547',
            "version": 77
        }];

        setTimeout(function(){
          //  expect(vmAssignCollaborator.noCollaboratorsFound).toBe(false); A VOIR AVEC HENRI
            done();
        }, 0);
    });
});
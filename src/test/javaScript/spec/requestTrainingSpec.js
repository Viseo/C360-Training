describe('Demande de Formation', function() {
    var ctrl;
    var backend;
    var loc;
    var trainings = JSON.parse('[{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},{"id":6,"version":0,"trainingTitle":"Hibernate","numberHalfDays":5}]');
    var sessionsSelected = JSON.parse('[{"id":4,"trainingDescription":{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},"beginning":"04/05/2016","ending":"06/05/2016","beginningTime":"08:00","endingTime":"08:00","location":"Salle Phuket"}]');
    var sessionsFromTraining = JSON.parse('[{"id":4,"trainingDescription":{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},"beginning":"04/05/2016","ending":"06/05/2016","beginningTime":"08:00","endingTime":"08:00","location":"Salle Phuket"},{"id":5,"trainingDescription":{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},"beginning":"07/05/2016","ending":"10/05/2016","beginningTime":"08:00","endingTime":"08:00","location":"Salle Phuket"}]');
    var collabortorThomas = JSON.parse('{"id":2,"version":0,"lastName":"Lecomte","firstName":"Thomas"}');
    var currentUser = JSON.parse('{"id":2,"firstName":"Thomas", "lastName":"Lecomte"}');
    var requestTrainingDescriptionWithoutSessions = {id: 8, trainingDescription: trainings[0], collaboratorIdentity: collabortorThomas, trainingSessionsDescriptions:[]};
    var requestTrainingDescription = {id: 8, trainingDescription: trainings[0], collaboratorIdentity: collabortorThomas, trainingSessionsDescriptions:sessionsSelected};

    beforeEach(module('App'));

    beforeEach(inject(function ($controller, $httpBackend, $location, currentUserService) {
        backend = $httpBackend;
        loc = $location;
        loc.url('/RequestTraining');
        ctrl = $controller('controllerRequestTraining');
        currentUserService.setUserData("token", collabortorThomas.firstName, collabortorThomas.lastName, "roles", 2);
        backend.expectGET('api/formations').respond(trainings);
        backend.flush();
        expect(ctrl.noneSessionSelected).toBeFalsy();
        expect(ctrl.hasToChooseOneTraining).toBeFalsy();
        expect(ctrl.isListEmpty).toBeFalsy();
    }));

    afterEach(function () {
        backend.verifyNoOutstandingExpectation();
        backend.verifyNoOutstandingRequest();
    });

    it('1)liste de formation initialisée ', function () {
        expect(ctrl.trainings).toEqual(trainings);
        expect(loc.path()).toBe('/RequestTraining');
    });

    it('2) Demande de formation sans sessions planifiées', function(){
        ctrl.requestedTraining = trainings[1];
        backend.expectGET('api/formations/6/sessions').respond([]);
        ctrl.loadTrainingSessions();
        backend.flush();
        expect(ctrl.isListEmpty).toBeTruthy();
        backend.expectPOST('api/requests', {trainingDescription: ctrl.requestedTraining, collaboratorIdentity: currentUser, trainingSessionsDescriptions:[]}).respond(requestTrainingDescriptionWithoutSessions);
        ctrl.verifyForm();
        backend.flush();
        expect(loc.path()).toBe('/pageblanche');
    });

    it('3) Demande de formation avec sessions sélectionnées', function () {
        ctrl.requestedTraining = trainings[0];
        ctrl.loadTrainingSessions();
        backend.expectGET('api/formations/1/sessions').respond(sessionsFromTraining);
        backend.flush();
        expect(ctrl.isListEmpty).toBeFalsy();
        ctrl.listTrainingSession[0].isChecked = true;
        backend.expectPOST('api/requests', {trainingDescription: ctrl.requestedTraining, collaboratorIdentity: currentUser, trainingSessionsDescriptions:sessionsSelected}).respond(requestTrainingDescription);
        ctrl.verifyForm();
        backend.flush();
        expect(loc.path()).toBe('/pageblanche');
    });

    it('4) Demande de formation sans selection au préalable', function() {
        expect(ctrl.requestedTraining).toBeUndefined();
        expect(ctrl.listTrainingSession).toBeUndefined();
        ctrl.verifyForm();
        expect(ctrl.hasToChooseOneTraining).toBeTruthy();
        expect(loc.path()).toBe('/RequestTraining');
    });

    it('5) Demande de formation sans sessions sélectionnées', function () {
        ctrl.requestedTraining = {id: 1};
        backend.expectGET('api/formations/1/sessions').respond(sessionsFromTraining);
        ctrl.loadTrainingSessions();
        backend.flush();
        expect(ctrl.isListEmpty).toBeFalsy();
        ctrl.verifyForm();
        expect(ctrl.noneSessionSelected).toBeTruthy();
        expect(loc.path()).toBe('/RequestTraining');
    });
});
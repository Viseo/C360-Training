describe('Gérer les sessions', function () {
    var ctrl;
    var httpBackend;
    var loc;
    var selectTrainingService;
    var selectSessionService;
    var TRAINING = JSON.parse('{"id":3,"trainingTitle":"AngularJS","numberHalfDays":1,"topicDescription":{"id":1,"name":"Développement Web"}}');
    var SESSIONS=JSON.parse('[{"id":6,"trainingDescription":{"id":3,"trainingTitle":"AngularJS","numberHalfDays":1,"topicDescription":{"id":1,"name":"Développement Web"}},"beginning":"13/07/2016","ending":"13/07/2016","beginningTime":"08:00","endingTime":"18:00","location":"Salle Phuket"}]');

    beforeEach(module('App'));

    beforeEach(inject(function ($controller, $httpBackend, $location, SelectTrainingService, SelectSessionService) {
        httpBackend = $httpBackend;
        loc = $location;
        selectSessionService = SelectSessionService;
        selectTrainingService = SelectTrainingService;
        selectTrainingService.select(TRAINING);
        loc.url('/ManageSession');
        httpBackend.expectGET("api/formations/" + TRAINING.id + "/sessions").respond(SESSIONS);
        ctrl = $controller('ctrlManageSession');
        httpBackend.flush();
    }));
    
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
    it('2)click ajouter une session',function () {
       ctrl.redirectRegisterTrainingSession();
        expect(loc.path()).toBe('/RegisterTrainingSession');
    });
    it('3)click modifier une session',function () {
        ctrl.redirectToSession(SESSIONS[0]);
        expect(loc.path()).toBe('/ChangeRegisterTrainingSession');
        expect(selectSessionService.get()).toBe(SESSIONS[0]);
    });
    it('5)click retour',function () {
        ctrl.returnToRegisterTraining();
        expect(loc.path()).toBe('/RegisterTraining');
    });
});
describe('Declaration Formation', function () {
    var ctrl;
    var backend;
    var loc;
    var regex = JSON.parse('{"TRAINING_TITLE":"^[a-zA-Z0-9+#\'-. áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]+$","NUMBER_HALF_DAYS":"^[0-9]+$"}');
    var topic1 = JSON.parse('{"id":1,"name":"Développement Web"}');
    var topic2 = JSON.parse('{"id":2,"name":"Développement Mobile"}');
    var topicList = [topic1, topic2];
    var trainingList = JSON.parse('[{"id":3,"trainingTitle":"AngularJS","numberHalfDays":1,"topicDescription":{"id":1,"name":"Développement Web"}},{"id":4,"trainingTitle":"AAA","numberHalfDays":5,"topicDescription":{"id":1,"name":"Développement Web"}}]');
    var trainingDescription = JSON.parse('{"id":4,"trainingTitle":"Hibernate","numberHalfDays":1,"topicDescription":{"id":1,"name":"Développement Web"}}');

    beforeEach(module('App'));

    beforeEach(inject(function ($controller, $httpBackend, $location) {
        backend = $httpBackend;
        loc = $location;
        loc.url('/RegisterTraining');
        backend.expectGET('api/formations/regex').respond(regex);
        backend.expectGET('api/themes').respond(topicList);
        backend.expectGET('api/formations').respond(trainingList);
        ctrl = $controller('controllerRegisterTraining');
        backend.flush();
        ctrl.training = {};
    }));

    afterEach(function () {
        backend.verifyNoOutstandingExpectation();
        backend.verifyNoOutstandingRequest();
    });

    function scenarioOfFormCorrectlyFilled() {
        ctrl.training.trainingTitle = "Hibernate";
        expect(ctrl.training.trainingTitle).toMatch(ctrl.regex.trainingTitle);
        ctrl.training.topicDescription = topic1;
        ctrl.training.numberHalfDays = 4;
        expect(ctrl.training.numberHalfDays).toMatch(ctrl.regex.numberHalfDays);
    }

    it('Valide', function () {
        scenarioOfFormCorrectlyFilled();
        backend.expectPOST('api/formations').respond(trainingDescription);
        ctrl.verifyForm({$invalid: false, $error : {}});
        backend.flush();
        expect(ctrl.isNewTrainingTitle).toBeTruthy();
        expect(ctrl.isFalseForm).toBeFalsy();
        expect(ctrl.isThereAnEmptyField).toBeFalsy();
        expect(ctrl.isTrainingSaved).toBeTruthy();
        expect(loc.path()).toBe('/RegisterTraining');
    });

    it('Invalid because of training title already exists', function () {
        scenarioOfFormCorrectlyFilled();
        backend.expectPOST('api/formations').respond(400, {message: "trainingTitle"});
        ctrl.verifyForm({$invalid: false, $error : {}});
        backend.flush();
        expect(ctrl.isNewTrainingTitle).toBeFalsy();
        expect(ctrl.isFalseForm).toBeFalsy();
        expect(ctrl.isThereAnEmptyField).toBeFalsy();
        expect(ctrl.isTrainingSaved).toBeFalsy();
        expect(loc.path()).toBe('/RegisterTraining');
    });

    it('Invalid because of input avoid', function () {
        ctrl.training.trainingTitle = "";
        ctrl.training.topicDescription = topic1;
        ctrl.training.numberHalfDays = null;
        expect(ctrl.training.numberHalfDays).not.toMatch(ctrl.regex.numberHalfDays);
        ctrl.verifyForm({$invalid: true, $error: {required: [{}, {}]}});
        expect(ctrl.isNewTrainingTitle).toBeTruthy();
        expect(ctrl.isFalseForm).toBeFalsy();
        expect(ctrl.isThereAnEmptyField).toBeTruthy();
        expect(ctrl.isTrainingSaved).toBeFalsy();
        expect(loc.path()).toBe('/RegisterTraining');
    });

    it('Invalid because of inputs incorrect', function () {
        ctrl.training.trainingTitle = "AngularJS@";
        expect(ctrl.training.trainingTitle).not.toMatch(ctrl.regex.trainingTitle);
        ctrl.training.topicDescription = topic1;
        ctrl.training.numberHalfDays = "@";
        expect(ctrl.training.numberHalfDays).not.toMatch(ctrl.regex.numberHalfDays);
        ctrl.verifyForm({$invalid: true, $error:{pattern: [{}, {}]}});
        expect(ctrl.isNewTrainingTitle).toBeTruthy();
        expect(ctrl.isFalseForm).toBeTruthy();
        expect(ctrl.isThereAnEmptyField).toBeFalsy();
        expect(ctrl.isTrainingSaved).toBeFalsy();
        expect(loc.path()).toBe('/RegisterTraining');
    });

    it('Au clic sur une formation, on est redirigé vers la page de gestion des sessions', function () {
        ctrl.manageSession();
        expect(loc.path()).toEqual("/ManageSession");
    });
});


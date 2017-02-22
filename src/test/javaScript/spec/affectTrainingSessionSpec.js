describe('Affectation session', function () {
    var ctrl;
    var backend;
    var sessionsList = JSON.parse('[{"id":4,"trainingDescription":{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},"beginning":"04/05/2016","ending":"06/05/2016","beginningTime":"08:00","endingTime":"08:00","location":"Salle Phuket"},{"id":5,"trainingDescription":{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},"beginning":"07/05/2016","ending":"10/05/2016","beginningTime":"08:00","endingTime":"17:00","location":"Salle Bali"},{"id":6,"trainingDescription":{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},"beginning":"31/05/2016","ending":"31/05/2016","beginningTime":"08:00","endingTime":"08:30","location":"Salle Phuket"}]');
    var collaboratorThomas = JSON.parse('{"id":2,"version":0,"lastName":"Lecomte","firstName":"Thomas"}');
    var collaboratorNada = JSON.parse('{"id":3,"version":0,"lastName":"Kalmouni","firstName":"Nada"}');
    var collaboratorBayrek = JSON.parse('{"id":7,"version":0,"lastName":"MOKNI","firstName":"Bayrek"}');
    var availableCollaboratorList = [collaboratorThomas, collaboratorBayrek];
    var affectedCollaboratorList = [collaboratorNada];
    var affectedCollaboratorListToBeSaved = JSON.parse(JSON.stringify(affectedCollaboratorList));
    affectedCollaboratorListToBeSaved.push(collaboratorThomas, collaboratorBayrek);


    beforeEach(module('App'));

    beforeEach(inject(function ($controller, $httpBackend, $filter) {
        ctrl = $controller('controllerAffectTraining');
        backend = $httpBackend;
        filter = $filter('searchByString');
        backend.expectGET('api/sessions').respond(sessionsList);
        backend.flush();
    }));

    afterEach(function () {
        backend.verifyNoOutstandingExpectation();
        backend.verifyNoOutstandingRequest();
    });

    it('1) Selectionner une session + Associer un ou des collaborateur + Enregistrer --', function () {
        ctrl.selectedSession = "AngularJS - 31/05/2016 à 31/05/2016 - Salle Phuket";
        backend.expectGET("api/requests/session/6/collaborators").respond(availableCollaboratorList);
        backend.expectGET("api/sessions/6/collaboratorsaffected").respond(affectedCollaboratorList);
        ctrl.loadNotAffectedAndAffectedCollaboratorsList();
        backend.flush();
        ctrl.moveItem(collaboratorThomas, ctrl.availableCollaboratorList, ctrl.selectedCollaboratorList);
        ctrl.moveItem(collaboratorBayrek, ctrl.availableCollaboratorList, ctrl.selectedCollaboratorList);
        backend.expectPUT("api/sessions/6/collaborators", affectedCollaboratorListToBeSaved).respond(sessionsList[3]);
        ctrl.verifyForm();
        backend.flush();
        expect(ctrl.isCollabaratorListUpdated).toBeTruthy();
    });

    it('2) Enregister sans selectionner une session --', function () {
        ctrl.selectedSession = "";
        ctrl.loadNotAffectedAndAffectedCollaboratorsList();
        expect(ctrl.sessionSelected).toBeUndefined();
        ctrl.verifyForm();
        expect(ctrl.boolErrNoSessionSelected).toBeTruthy();
    });

    it('3) Test - Sélectionner une session et aucun collaborateur n\'est associé, puis qu\'on clique sur le bouton « Enregistrer», l\'affectation est prise en compte et un message de confirmation apparaît', function () {
        ctrl.selectedSession = "AngularJS - 31/05/2016 à 31/05/2016 - Salle Phuket";
        backend.expectGET("api/requests/session/6/collaborators").respond(availableCollaboratorList);
        backend.expectGET("api/sessions/6/collaboratorsaffected").respond(affectedCollaboratorList);
        ctrl.loadNotAffectedAndAffectedCollaboratorsList();
        backend.flush();
        ctrl.moveItem(collaboratorNada, ctrl.selectedCollaboratorList, ctrl.availableCollaboratorList);
        backend.expectPUT("api/sessions/6/collaborators", []).respond(sessionsList[3]);
        ctrl.verifyForm();
        backend.flush();
        expect(ctrl.isCollabaratorListUpdated).toBeTruthy();
    });

    it('4) Rechercher un collaborateur dans la liste des Collaborateurs disponibles alors qu\'il a été dèjà ajouté à la session', function () {
        ctrl.selectedSession = "AngularJS - 31/05/2016 à 31/05/2016 - Salle Phuket";
        backend.expectGET("api/requests/session/6/collaborators").respond(availableCollaboratorList);
        backend.expectGET("api/sessions/6/collaboratorsaffected").respond(affectedCollaboratorList);
        ctrl.loadNotAffectedAndAffectedCollaboratorsList();
        backend.flush();
        ctrl.moveItem(collaboratorThomas, availableCollaboratorList, affectedCollaboratorList);
        expect(availableCollaboratorList).not.toContain(collaboratorThomas);
    });

    it('5) Test - Si la recherche ne donne aucun résultat, un message doit s‘afficher', function () {
        ctrl.selectedSession = "AngularJS - 31/05/2016 à 31/05/2016 - Salle Phuket";
        availableCollaboratorList = [collaboratorThomas, collaboratorBayrek];
        backend.expectGET("api/requests/session/6/collaborators").respond(availableCollaboratorList);
        backend.expectGET("api/sessions/6/collaboratorsaffected").respond(affectedCollaboratorList);
        ctrl.loadNotAffectedAndAffectedCollaboratorsList();
        backend.flush();
        expect(filter(availableCollaboratorList,"X")).toEqual([]);
    });
});


describe('update Affectation session', function () {
    var ctrl;
    var backend;
    var sessionsList = JSON.parse('[{"id":4,"trainingDescription":{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},"beginning":"04/05/2016","ending":"06/05/2016","beginningTime":"08:00","endingTime":"08:00","location":"Salle Phuket"},{"id":5,"trainingDescription":{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},"beginning":"07/05/2016","ending":"10/05/2016","beginningTime":"08:00","endingTime":"17:00","location":"Salle Bali"},{"id":6,"trainingDescription":{"id":1,"version":0,"trainingTitle":"AngularJS","numberHalfDays":1},"beginning":"31/05/2016","ending":"31/05/2016","beginningTime":"08:00","endingTime":"08:30","location":"Salle Phuket"}]');

    var collabortorThomas = JSON.parse('{"id":2,"version":0,"personnalIdNumber":"TLE1234","lastName":"Lecomte","firstName":"Thomas"}');
    var collabortorNada = JSON.parse('{"id":3,"version":0,"personnalIdNumber":"NKA1234","lastName":"Kalmouni","firstName":"Nada"}');
    var collaboratorBayrek = JSON.parse('{"id":7,"version":0,"personnalIdNumber":"MBO1234","lastName":"MOKNI","firstName":"Bayrek"}');
    var collaboratorJihad = JSON.parse('{"id":10,"version":0,"personnalIdNumber":"JEL1234","lastName":"ELKADIR","firstName":"Jihad"}');
    var collaboratorRiheb = JSON.parse('{"id":11,"version":0,"personnalIdNumber":"RHA1234","lastName":"HAFI","firstName":"Riheb"}');
    var availableRequestingCollaboratorList=[collabortorThomas,collaboratorBayrek];
    var allAvailableCollaboratorList = [collabortorThomas, collaboratorBayrek,collaboratorJihad,collaboratorRiheb];
    var affectedCollaboratorList = [collabortorNada];
    var affectedCollaboratorListToBeSaved = JSON.parse(JSON.stringify(affectedCollaboratorList));
    affectedCollaboratorListToBeSaved.push(collabortorThomas, collabortorNada);

    beforeEach(module('App'));

    beforeEach(inject(function ($controller, $httpBackend, $filter) {
        ctrl = $controller('controllerAffectTraining');
        backend = $httpBackend;
        filter = $filter('searchByString');
        backend.expectGET('api/sessions').respond(sessionsList);
        backend.flush();
    }));

    afterEach(function () {
        backend.verifyNoOutstandingExpectation();
        backend.verifyNoOutstandingRequest();
    });

    it('1) l\'affichage des deux cadres avec la selection d\'une session', function(){
        ctrl.selectedSession = "AngularJS - 31/05/2016 à 31/05/2016 - Salle Phuket";
        backend.expectGET("api/requests/session/6/collaborators").respond(availableRequestingCollaboratorList);
        backend.expectGET("api/sessions/6/collaboratorsaffected").respond(affectedCollaboratorList);
        ctrl.loadNotAffectedAndAffectedCollaboratorsList();
        backend.flush();
        expect(ctrl.sessionSelected).toBeTruthy();
    });

    it("2)Test liste collaborateur quand la case est cochée",function () {
        ctrl.selectedSession = "AngularJS - 31/05/2016 à 31/05/2016 - Salle Phuket";
        backend.expectGET("api/requests/session/6/collaborators").respond(availableRequestingCollaboratorList);
        backend.expectGET("api/sessions/6/collaboratorsaffected").respond(affectedCollaboratorList);
        ctrl.loadNotAffectedAndAffectedCollaboratorsList();
        backend.flush();
        expect(JSON.stringify(ctrl.availableCollaboratorList)).toEqual(JSON.stringify(availableRequestingCollaboratorList));
    });

    it("3)Test liste collaborateur quand la case est décochée",function () {
        ctrl.selectedSession = "AngularJS - 31/05/2016 à 31/05/2016 - Salle Phuket";
        backend.expectGET("api/requests/session/6/collaborators").respond(availableRequestingCollaboratorList);
        backend.expectGET("api/sessions/6/collaboratorsaffected").respond(affectedCollaboratorList);
        ctrl.loadNotAffectedAndAffectedCollaboratorsList();
        backend.flush();
        backend.expectGET("api/sessions/6/collaboratorsnotaffected").respond(allAvailableCollaboratorList);
        ctrl.showRequests=false;
        ctrl.showRequestChanged();
        backend.flush();
        expect(JSON.stringify(ctrl.availableCollaboratorList)).toEqual(JSON.stringify(allAvailableCollaboratorList));
    });
});

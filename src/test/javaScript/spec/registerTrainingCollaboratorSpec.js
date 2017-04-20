/**
 * Created by CLH3623 on 18/04/2017.
 */
beforeEach(function () {
    vmCollaboratorFormation = new CollaboratorFormation().$mount();
    vmCollaboratorFormation.collaboratorIdentity = {
        id: 2,
        lastName: 'Dupont',
        firstName: 'Eric'
    };
    vmCollaboratorFormation.idTraining = 5;

});

describe('test registerTrainingCollaborator', function () {
    var trainingSelected = {
        "id": 5,
        "version": 0,
        "trainingTitle": "FORMATION1",
        "numberHalfDays": 1,
        "topicDescription": {"id": 3, "version": 0, "name": "C"}
    };
    var trainingSelectedWithoutSessions = {

        "id": 6,
        "version": 0,
        "trainingTitle": "FORMATION2",
        "numberHalfDays": 2,
        "topicDescription": {"id": 3, "version": 0, "name": "C"}

    }

    it('should transform text to uppercase', function () {
        vmCollaboratorFormation.value = 'programmation';
        expect(vmCollaboratorFormation.searchFormatted).toBe('PROGRAMMATION');
        vmCollaboratorFormation.value = '';
        expect(vmCollaboratorFormation.searchFormatted).toBe('');
    });

    /*    it('should display a formation if it exists', function() {
     vmCollaboratorFormation.selectedTraining = null;
     /!*        expect(vmCollaboratorFormation.emptyTraining).toBe(false);
     vmCollaboratorFormation.$refs.btnValidateSearch.click();
     expect(vmCollaboratorFormation.emptyTraining).toBe(true);*!/
     vmCollaboratorFormation.selectedTraining = 5;
     vmCollaboratorFormation.displayTrainingsFn();
     })*/

    it('should find no trainings', function (done) {
        vmCollaboratorFormation.value = 'gezrg5z5';
        vmCollaboratorFormation.$refs.btnLoadTrainings.click();
        setTimeout(function () {
            expect(vmCollaboratorFormation.noTrainingFound).toBe(true);
            expect(vmCollaboratorFormation.trainingsFound.length).toBe(0);

            done();
        }, 501);

    })
    it('should find and load all trainings', function (done) {
        vmCollaboratorFormation.value = '';
        vmCollaboratorFormation.$refs.btnLoadTrainings.click();
        setTimeout(function () {
            expect(vmCollaboratorFormation.noTrainingFound).toBe(false);
            expect(vmCollaboratorFormation.trainingsFound.length).toBe(3);
            done();
        }, 1000)
    })
    it('should find trainings having inserted value', function (done) {
        vmCollaboratorFormation.value = 'FOR';
        vmCollaboratorFormation.$refs.btnLoadTrainings.click();
        setTimeout(function () {
            expect(vmCollaboratorFormation.noTrainingFound).toBe(false);
            expect(vmCollaboratorFormation.trainingsFound.length).toBe(3);
            expect(vmCollaboratorFormation.trainingsFound[0].trainingTitle).toBe("FORMATION1");
            done();
        }, 1000);

    })
    it('should find sessions that are booked by collab', function (done) {
        vmCollaboratorFormation.renitialize(trainingSelected);
        expect(vmCollaboratorFormation.trainingSelected).toBe(trainingSelected);
        setTimeout(function () {
            expect(vmCollaboratorFormation.listTrainingSession.length).toBe(2);
            expect(vmCollaboratorFormation.isNoSession).toBe(false);
            expect(vmCollaboratorFormation.sessionsByCollab.length).toBe(1);
            done();
        }, 1000);
    })
    it('should not find any session booked', function (done) {
        vmCollaboratorFormation.renitialize(trainingSelectedWithoutSessions);
        expect(vmCollaboratorFormation.trainingSelected).toBe(trainingSelectedWithoutSessions);
        setTimeout(function () {
            expect(vmCollaboratorFormation.listTrainingSession.length).toBe(0);
            expect(vmCollaboratorFormation.isNoSession).toBe(true);
            expect(vmCollaboratorFormation.sessionsByCollab.length).toBe(0);
            done();
        }, 1000);
    });
    it('should verify and save training request', function (done) {
        vmCollaboratorFormation.trainingSelected = trainingSelected;
        vmCollaboratorFormation.isNoSession = true;
        vmCollaboratorFormation.VerifyTrainingSessionCollaborator();
        expect(JSON.stringify(vmCollaboratorFormation.RequestToRegister)).toEqual(JSON.stringify({
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "collaboratorIdentity": {"id": 2, "lastName": "Dupont", "firstName": "Eric"},
            "trainingSessionsDescriptions": []
        }));
        setTimeout(function () {
            expect(vmCollaboratorFormation.addingRequestSucceeded).toBe(true);
            done();
        }, 1000);
    });
    it('should check when no session selected', function (done) {
        vmCollaboratorFormation.trainingSelected = trainingSelected;
        vmCollaboratorFormation.isNoSession = false;
        vmCollaboratorFormation.VerifyTrainingSessionCollaborator();
        setTimeout(function () {
            expect(vmCollaboratorFormation.noSessionsSelectedError).toBe(true);
            done();
        }, 1000);
    });
    it('should disable all sessions when indifferent is checked', function () {
        vmCollaboratorFormation.check = false;
        vmCollaboratorFormation.disabling(trainingSelected.id);
        console.log(vmCollaboratorFormation.checkedSessions);
        expect(vmCollaboratorFormation.checkedSessions.length).not.toBe(0);
            expect(vmCollaboratorFormation.isNoSession).toBe(false);

    })
});
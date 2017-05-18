/**
 * Created by CLH3623 on 18/04/2017.
 */
let runtime = "test";

afterEach(function () {
});

describe('test registerTrainingCollaborator', function () {

    beforeEach(function (done) {
        vmCollaboratorFormation = new CollaboratorFormation().$mount();
        vmCollaboratorFormation.collaboratorIdentity = {
            id: 2,
            lastName: 'Dupont',
            firstName: 'Eric'
        };
        vmCollaboratorFormation.idTraining = 5;
        vmCollaboratorFormation.$parent = new Vue();
        setTimeout(function() {
            done();
        }, 1);

    });
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
    };

    it('should transform text to uppercase', function () {
        vmCollaboratorFormation.value = 'programmation';
        expect(vmCollaboratorFormation.searchFormatted).toBe('PROGRAMMATION');
        vmCollaboratorFormation.value = '';
        expect(vmCollaboratorFormation.searchFormatted).toBe(null);
    });

    it('should display the selected formation with sessions', function(done) {
        vmCollaboratorFormation.selectedTraining = trainingSelected.id;
        vmCollaboratorFormation.$refs.btnValidateSearch.click();
        setTimeout(function() {
            expect(vmCollaboratorFormation.trainingsFound.length).toBe(1);
            expect(vmCollaboratorFormation.trainingsFound[0].trainingTitle).toBe("FORMATION1");
            expect(vmCollaboratorFormation.displayTrainings).toBe(true);
            expect(vmCollaboratorFormation.isNoSession).toBe(false);
            done();
        }, 0);
    });

    it('should display the selected formation with no sessions', function(done) {
        vmCollaboratorFormation.selectedTraining = trainingSelectedWithoutSessions.id;
        vmCollaboratorFormation.$refs.btnValidateSearch.click();
        setTimeout(function() {
            expect(vmCollaboratorFormation.trainingsFound.length).toBe(1);
            expect(vmCollaboratorFormation.displayTrainings).toBe(true);
            expect(vmCollaboratorFormation.isNoSession).toBe(true);
            done();
        }, 0);
    });

    it('should find trainings having inserted value', function () {
        vmCollaboratorFormation.value = 'FOR';
        setTimeout(function () {
            expect(vmCollaboratorFormation.noTrainingFound).toBe(false);
            expect(vmCollaboratorFormation.trainingsFound.length).toBe(3);
            expect(vmCollaboratorFormation.trainingsFound[0].trainingTitle).toBe("FORMATION1");

        }, 0);

    });

    it('should find sessions that are booked by collab', function () {
        vmCollaboratorFormation.renitialize(trainingSelectedWithoutSessions);
        setTimeout(function () {
            expect(vmCollaboratorFormation.trainingrequested).toBe(false);
            expect(vmCollaboratorFormation.listTrainingSession.length).toBe(0);
            expect(vmCollaboratorFormation.displayTrainings).toBe(true);
            expect(vmCollaboratorFormation.isNoSession).toBe(true);
        }, 0);
    });

    it('should find sessions that are booked by collab', function () {

    });

    it('should verify and save training request', function () {
        vmCollaboratorFormation.trainingSelected = trainingSelected;
        //vmCollaboratorFormation.isNoSession = true;
        vmCollaboratorFormation.verifyTrainingSessionCollaborator();
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
            expect(vmCollaboratorFormation.addingRequestSucceeded).toBe(false);
        }, 0);
    });

    it('should check when no session selected', function () {
        vmCollaboratorFormation.trainingSelected = trainingSelected;
        vmCollaboratorFormation.isNoSession = false;
        vmCollaboratorFormation.verifyTrainingSessionCollaborator();
        expect(vmCollaboratorFormation.noSessionsSelectedError).toBe(true);
    });

    it('should disable all session when indiferent is checked', function () {
        vmCollaboratorFormation.check = false;
        vmCollaboratorFormation.disabling(trainingSelected.id, runtime);
        setTimeout(function() {
            expect(vmCollaboratorFormation.checkedSessions.length).not.toBe(0);
            expect(vmCollaboratorFormation.isNoSession).toBe(false);

        },0);
    });
});
/**
 * Created by CLH3623 on 18/04/2017.
 */
let runtime = "test";

beforeEach(function () {
    vmCollaboratorFormation = new CollaboratorFormation().$mount();
    vmCollaboratorFormation.collaboratorIdentity = {
        id: 2,
        lastName: 'Dupont',
        firstName: 'Eric'
    };
    vmCollaboratorFormation.idTraining = 5;
    vmCollaboratorFormation.$parent = new Vue();
    //vmCollaboratorFormation.$parent.$children[2] = new Vue();
    //vmCollaboratorFormation.$parent.$children[2] = vmTrainingToCome;
});
afterEach(function () {
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
    };

    it('should transform text to uppercase', function () {
        vmCollaboratorFormation.value = 'programmation';
        expect(vmCollaboratorFormation.searchFormatted).toBe('PROGRAMMATION');
        vmCollaboratorFormation.value = '';
        expect(vmCollaboratorFormation.searchFormatted).toBe('');
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
        vmCollaboratorFormation.renitialize(trainingSelected);
        expect(vmCollaboratorFormation.trainingSelected).toBe(trainingSelected);
        setTimeout(function () {
            expect(vmCollaboratorFormation.listTrainingSession.length).toBe(0);
            expect(vmCollaboratorFormation.isNoSession).toBe(false);
            expect(vmCollaboratorFormation.sessionsByCollab.length).toBe(1);

        }, 0);
    });

    it('should not find any session booked', function () {
        vmCollaboratorFormation.renitialize(trainingSelectedWithoutSessions);
        expect(vmCollaboratorFormation.trainingSelected).toBe(trainingSelectedWithoutSessions);
        expect(vmCollaboratorFormation.listTrainingSession.length).toBe(0);
        expect(vmCollaboratorFormation.isNoSession).toBe(true);
        expect(vmCollaboratorFormation.sessionsByCollab.length).toBe(0);
    });

    it('should verify and save training request', function () {
        vmCollaboratorFormation.trainingSelected = trainingSelected;
        vmCollaboratorFormation.isNoSession = true;
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
            expect(vmCollaboratorFormation.addingRequestSucceeded).toBe(true);

        }, 0);
    });

    it('should check when no session selected', function () {
        vmCollaboratorFormation.trainingSelected = trainingSelected;
        vmCollaboratorFormation.isNoSession = false;
        vmCollaboratorFormation.verifyTrainingSessionCollaborator();
        setTimeout(function () {
            expect(vmCollaboratorFormation.noSessionsSelectedError).toBe(true);
        }, 0);
    });

    it('should disable all session when indiferent is checked', function (done) {
        vmCollaboratorFormation.check = false;
        vmCollaboratorFormation.disabling(trainingSelected.id, runtime);
        setTimeout(function() {
            expect(vmCollaboratorFormation.checkedSessions.length).not.toBe(0);
            expect(vmCollaboratorFormation.isNoSession).toBe(false);
            done();
        },0);
    });
});
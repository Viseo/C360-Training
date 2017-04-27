/**
 * Created by NBE3663 on 18/04/2017.
 */
Vue.use(VueResource);

Vue.http.interceptors.unshift((request, next) => {
    let route = routes.find((item) => {
        return (request.method === item.method && request.url === item.url);
    });
    if (!route) {
        // we're just going to return a 404 here, since we don't want our test suite making a real HTTP request
        next(request.respondWith({status: 404, statusText: 'Oh no! Not found!'}));
    }else {
        next(
            request.respondWith(
                route.response,
                {status: 200}
            )
        );
    }
});

describe('assign collaborator test', function () {

    beforeEach(function () {
        vmAssignCollaborator = new assignCollaborator().$mount();
    });

    afterEach(function () {

    });

    it('should check if all available sessions are in the drop-down ', function () {
       vmAssignCollaborator.GatherAllSessions();
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
       expect(vmAssignCollaborator.state.allSessions).toEqual(response);

    });

    it('should check if fields are greys when there are no sessions selected ', function () {

        expect(vmAssignCollaborator.isDisabled).toBe(true);
        expect(vmAssignCollaborator.sessionIdChosen).toBe(0);

    });

    it('should check if fields are not greys when sessions are selected ', function () {
        vmAssignCollaborator.sessionIdChosen = 15;
        expect(vmAssignCollaborator.sessionIdChosen).toBe(15);

        vmAssignCollaborator.clearGreyPanel();
        expect(vmAssignCollaborator.isDisabled).toBe(false);

    });

    it('should check if collaborators are displayed when checkbox is checked ', function () {
        vmAssignCollaborator.allCollaboratorsName = [{
            "email": 'eric.dupon@viseo.com',
            "firstName": 'Eric',
            "id" : 5,
            "lastName": 'Dupond',
            "password": '123456',
            "version": 0
        }],
            vmAssignCollaborator.verifyCheckedNames();
        expect(vmAssignCollaborator.checkedNames).toBe(true);
        vmAssignCollaborator.gatherCollaboratorsRequestingBySession();
        vmAssignCollaborator.checkedNames= false;
        vmAssignCollaborator.verifyCheckedNames();
        expect(vmAssignCollaborator.checkedNames).toBe(false);
        vmAssignCollaborator.gatherCollaboratorsFromDatabase()
    });
    it('should check if counter is increased when collaborators has been added', function () {
        vmAssignCollaborator.validatedCollab = [{
            "email": 'eric.dupon@viseo.com',
            "firstName": 'Eric',
            "id" : 5,
            "lastName": 'Dupond',
            "password": '123456',
            "version": 0

        }],
            vmAssignCollaborator.allCollaboratorsAlreadyInSessions = [{
                "email": 'julien.tallon@viseo.com',
                "firstName": 'Julien',
                "id" : 6,
                "lastName": 'Tallon',
                "password": '654321',
                "version": 7

            }]

        var vmLengthValidatedCollab = vmAssignCollaborator.validatedCollab.length;
        var vmAllCollaboratorsAlreadyInSessions = vmAssignCollaborator.allCollaboratorsAlreadyInSessions.length;
        vmAssignCollaborator.numberAddedCollabCounter();
        expect(vmAssignCollaborator.numberAddedCollab).toEqual(vmLengthValidatedCollab);
        expect(vmAssignCollaborator.numberPlacesAvailable).toEqual(15-vmAllCollaboratorsAlreadyInSessions);
        expect(vmLengthValidatedCollab).toBeLessThan(15);
        expect(vmAssignCollaborator.isRegistrationAvailable).toBe(true);
        vmAssignCollaborator.validatedCollab = [{
            "email": 'norine.dumas@viseo.com',
            "firstName": 'norine',
            "id" : 88,
            "lastName": 'dumas',
            "password": '1234567',
            "version": 5

        },{
            "email": 'junifer.gadomski@viseo.com',
            "firstName": 'jenifer',
            "id" : 75,
            "lastName": 'gadomski',
            "password": '689547',
            "version": 77

        },
            {
                "email": 'yannis.arapis@viseo.com',
                "firstName": 'yannis',
                "id" : 95,
                "lastName": 'arapis',
                "password": 'jekolms52',
                "version": 76

            },{
                "email": 'nicolas.guest@viseo.com',
                "firstName": 'nicolas',
                "id" : 96,
                "lastName": 'guest',
                "password": 'lmpqksn26',
                "version": 23
            },{
                "email": 'yves.perrolini@viseo.com',
                "firstName": 'Jean',
                "id" : 35,
                "lastName": 'Perrolini',
                "password": 'nkxpsks99',
                "version": 302
            },{
                "email": 'patricia.varet@viseo.com',
                "firstName": 'Patricia',
                "id" : 632,
                "lastName": 'Varet',
                "password": 'mplsbn20',
                "version": 37

            },{
                "email": 'yasser.gueddou@viseo.com',
                "firstName": 'Yasser',
                "id" : 325,
                "lastName": 'Gueddou',
                "password": 'ncbjshs1258',
                "version": 56

            },{
                "email": 'luc.brient@viseo.com',
                "firstName": 'Luc',
                "id" : 63,
                "lastName": 'Brient',
                "password": 'mlpos5kl',
                "version": 20

            },{
                "email": 'isabelle.biagala@viseo.com',
                "firstName": 'Isabelle',
                "id" : 15,
                "lastName": 'Biagala',
                "password": 'nxbhmm8',
                "version": 36

            },{
                "email": 'philippe.dezarnaud@viseo.com',
                "firstName": 'Philippe',
                "id" : 239,
                "lastName": 'Dezarnaud',
                "password": 'jjieukl',
                "version": 66

            },{
                "email": 'anas.ouahidi@viseo.com',
                "firstName": 'Anas',
                "id" : 695,
                "lastName": 'Ouahidi',
                "password": '697',
                "version": 15

            },{
                "email": 'feker.medeb@viseo.com',
                "firstName": 'Feker',
                "id" : 789,
                "lastName": 'Medeb',
                "password": 'hjisnb',
                "version": 125

            },{
                "email": 'nihel.bengamra@viseo.com',
                "firstName": 'Nihel',
                "id" : 96,
                "lastName": 'Ben Gamra',
                "password": 'lmspojzy632',
                "version": 889

            },{
                "email": 'benjamin.batista@viseo.com',
                "firstName": 'Benjamin',
                "id" : 69,
                "lastName": 'Batista',
                "password": 'klomp6',
                "version": 332

            },{
                "email": 'marouene.bouhachem@viseo.com',
                "firstName": 'Marouene',
                "id" : 45,
                "lastName": 'Bouhachem',
                "password": 'kppmlq5',
                "version": 789

            },{
                "email": 'mohamedmehdi.saad@viseo.com',
                "firstName": 'Mohamed Mehdi',
                "id" : 596,
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
            "id" : 88,
            "lastName": 'dumas',
            "password": '1234567',
            "version": 5
        },{
            "email": 'junifer.gadomski@viseo.com',
            "firstName": 'jenifer',
            "id" : 75,
            "lastName": 'gadomski',
            "password": '689547',
            "version": 77
        }]
        var vmLengthRequestedCollaborators = vmAssignCollaborator.requestedCollaborators.length;
        vmAssignCollaborator.moveCollabLeft();
        expect(vmLengthRequestedCollaborators).not.toBeNull();
    });
    it('should check if collaborators are moved from right list to left list ', function () {
        vmAssignCollaborator.validatedCollab = [{
            "email": 'norine.dumas@viseo.com',
            "firstName": 'norine',
            "id" : 88,
            "lastName": 'dumas',
            "password": '1234567',
            "version": 5
        },{
            "email": 'junifer.gadomski@viseo.com',
            "firstName": 'jenifer',
            "id" : 75,
            "lastName": 'gadomski',
            "password": '689547',
            "version": 77
        }]
        var vmValidatedCollab = vmAssignCollaborator.validatedCollab.length;
        vmAssignCollaborator.moveCollabRight();
        expect(vmValidatedCollab).not.toBeNull();

    });
    it('should check if error message is displayed when there are  type error in search field ', function (done) {
        vmAssignCollaborator.value = "@";
        setTimeout(function() {
        expect(vmAssignCollaborator.isSearchNameValid).toBe(false);
        expect(vmAssignCollaborator.lastNameRegexErrorMessage).toEqual("Veuillez entrer un nom ou prénom valide");
            done();
        }, 600);


        });
    it('should check if there is no result when collaborator does not exist ', function (done) {
        vmAssignCollaborator.requestedCollaboratorsMemo = [{
            email:"benjamin.batista@viseo.com",
            firstName:"Benjamin",
            id:18,
            lastName:"B",
            password:"123456",
            version:0
        }];
        expect(vmAssignCollaborator.requestedCollaboratorsMemo.length).toBe(1);
        vmAssignCollaborator.value = "Batista";
        setTimeout(function() {

            expect(vmAssignCollaborator.requestedCollaborators.length).toEqual(0);
            done();
        }, 600);

    });
    it('should check if there are few results when collaborators exists ', function (done) {

        vmAssignCollaborator.requestedCollaboratorsMemo = [{
            email:"benjamin.batista@viseo.com",
            firstName:"Benjamin",
            id:10,
            lastName:"Batista",
            password:"123456",
            version:0
        }];
        expect(vmAssignCollaborator.requestedCollaboratorsMemo.length).toBe(1);
        vmAssignCollaborator.value = "Batista";
        setTimeout(function() {

        expect(vmAssignCollaborator.requestedCollaborators).toEqual([{
            email:"benjamin.batista@viseo.com",
            firstName:"Benjamin",
            id:10,
            lastName:"Batista",
            password:"123456",
            version:0
        }]);
        done();
        }, 600);

    });
    it('should check if confirmation message appear and fields are greys when collaborators are saved ', function (done) {
        vmAssignCollaborator.isRegistrationAvailable = true;
        vmAssignCollaborator.validatedCollab = [{
            email:"viseo@viseo.com",
            firstName:"viseo",
            id:4,
            lastName:"technologie",
            password:"123456",
            version:0
        }];
        setTimeout(function() {
            vmAssignCollaborator.sessionIdChosen = 15;
            vmAssignCollaborator.allCollaboratorsIdChosen = [15, 10, 18, 4];
            done();
        }, 600);
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
        setTimeout(function(){ expect(vmAssignCollaborator.confirmCollaboratorAddedSession).toBe(false); }, 2000);
    });


});
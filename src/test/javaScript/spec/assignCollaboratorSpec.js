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

    });

    it('should check if fields are greys when there are no sessions selected ', function () {

    });

    it('should check if fields are not greys when sessions are selected ', function () {

    });

    it('should check if collaborators are displayed when checkbox is checked ', function () {

    });
    it('should check if counter is increased when collaborators has been added', function () {

    });

    it('should check if collaborators are moved from left list to right list ', function () {

    });
    it('should check if collaborators are moved from right list to left list ', function (done) {

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
    it('should check if error message is displayed when there are  type error in search field ', function (done) {
        vmAssignCollaborator.value = "@";
        setTimeout(function() {
        expect(vmAssignCollaborator.isSearchNameValid).toBe(false);
        expect(vmAssignCollaborator.lastNameRegexErrorMessage).toEqual("Veuillez entrer un nom ou prénom valide");
            done();
        }, 600);


        });
    it('should check if there is no result when collaborator does not exist ', function () {


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
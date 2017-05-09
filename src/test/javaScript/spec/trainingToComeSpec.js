/**
 * Created by BBA3616 on 09/05/2017.
 */

describe('training to come Panel test', function () {

    beforeEach(function () {
        vmTrainingToCome = new trainingToComeComponent().$mount();
        vmTrainingToCome.$parent = new Vue();
        vmTrainingToCome.$parent.$children[1] = vmCollaboratorFormation;
    });

    afterEach(function () {

    });

    it('should check if all the next formations are displayed on the panel "Formation à venir" when page is loaded', function (done) {
        var allTrainingAndSessionsThatShouldBeDisplayedJSON = [[{"id":4,"version":0,"trainingDescription":{"id":3,"version":0,"trainingTitle":"SWIFT","numberHalfDays":4,"topicDescription":{"id":1,"version":0,"name":"MOBILE"}},"beginning":"19/05/2017","ending":"21/05/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Bora Bora","collaborators":[]},{"id":5,"version":0,"trainingDescription":{"id":3,"version":0,"trainingTitle":"SWIFT","numberHalfDays":4,"topicDescription":{"id":1,"version":0,"name":"MOBILE"}},"beginning":"26/05/2017","ending":"28/05/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Bastille","collaborators":[]}]]

        setTimeout(function () {
            expect(vmTrainingToCome.allTrainingsAndSessions).toEqual(allTrainingAndSessionsThatShouldBeDisplayedJSON);
            done();
        }, 0);
    });

    it('should check if session selected is open on the acordeon (left panel) when the collaborator click on the session (right panel)', function () {
        var trainingSelected = {
            id: 3,
            version: 0,
            trainingTitle: "SWIFT",
            numberHalfDays: 4,
            topicDescription: {id: 1, version: 0, name: "MOBILE"}
        };
            expect(vmCollaboratorFormation.openPanel).toBe(false);
        setTimeout(function () {
            vmTrainingToCome.showTrainingAndSessionsSelected(trainingSelected);
            expect(vmCollaboratorFormation.openPanel).toBe(true);
        }, 0);
    });

    it('should check if message "Désolé vous avez déjà effectué une demande" is displayed when collaborator put the mouse over a session and is already register in this session', function (){
        actualCollaboratorOnline = {id:1,version:0,lastName:"Wayne",firstName:"John",email:"John.Wayne@viseo.com",password:"123456"};
        var trainingSelected = {
            id: 3,
            version: 0,
            trainingTitle: "SWIFT",
            numberHalfDays: 4,
            topicDescription: {id: 1, version: 0, name: "MOBILE"}
        };
        vmTrainingToCome.collaborator_id = actualCollaboratorOnline.id;
        setTimeout(function () {
        vmTrainingToCome.VerifyCollaboratorRequestsExistence(trainingSelected.id);
        expect(vmTrainingToCome.existCollaboratorRequest).toBe(true);
        }, 0);
    });
});
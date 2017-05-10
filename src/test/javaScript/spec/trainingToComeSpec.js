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
    it('should check if collaborator requests training session', function(done){

        var trainingSession = {
            "beginning":"11/05/2017",
            "beginningTime":"09:00",
            "collaborators":[{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 5,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            }],
            "ending":"13/05/2017",
            "endingTime":"18:00",
            "id":6,
            "isCollaboratorDidRequest":true,
            "location":"Salle Bali",
            "trainingDescription":[{
                "id":6,
                "numberHalfDays":4,
                "topicDescription":[{
                    "id":4,
                    "name":"JAVA",
                    "version":0
                }],
                "trainingTitle":"JEE2",
                "version":0
            }],
            "version":1,
        };
        vmTrainingToCome.collaborator_id = 5;
        vmTrainingToCome.VerifyCollaboratorRequestsExistence(6,trainingSession);
        setTimeout(function () {

            expect(vmTrainingToCome.existCollaboratorRequest).toBe(true);
        done();
        }, 0);

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

    it('should check if seats available text is red when there is only or less than 3 seats available', function(){
        var numberSeatsAvailable = 3;
        expect(vmTrainingToCome.displayRedTextWhenOnly3SeatsAvailable(numberSeatsAvailable)).toBe(true);
    });

    it('should check if seats available text is green when there is more than 3 seats available', function(){
        var numberSeatsAvailable = 10;
        expect(vmTrainingToCome.displayRedTextWhenOnly3SeatsAvailable(numberSeatsAvailable)).toBe(false);
    });

    it('should check if message "Désolé vous avez déjà effectué une demande" is displayed when collaborator put the mouse over a session and is already register in this session', function (){
        var trainingSession = {
            "beginning":"11/05/2017",
            "beginningTime":"09:00",
            "collaborators":[{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 5,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            }],
            "ending":"13/05/2017",
            "endingTime":"18:00",
            "id":6,
            "isCollaboratorDidRequest":true,
            "location":"Salle Bali",
            "trainingDescription":[{
                "id":6,
                "numberHalfDays":4,
                "topicDescription":[{
                    "id":4,
                    "name":"JAVA",
                    "version":0
                }],
                "trainingTitle":"JEE2",
                "version":0
            }],
            "version":1,
        };
        vmTrainingToCome.showInformationsMessage(trainingSession);
        expect(vmTrainingToCome.MouseOverMessage).toEqual("Désolé! Vous avez déja effectué une demande");
    });

    it('should check if seats available text is green when there is more than 3 seats available', function(){
        var numberSeatsAvailable = 10;
        expect(vmTrainingToCome.displayRedTextWhenOnly3SeatsAvailable(numberSeatsAvailable)).toBe(false);
    });

    it('should check if message "Désolé! Vous ne pouvez pas effectuer de demande" is displayed when collaborator put the mouse over a session and there is no seat available', function (){
        var trainingSession = {
            "beginning":"11/05/2017",
            "beginningTime":"09:00",
            "collaborators":[{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 1,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 2,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 3,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 4,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 5,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 6,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 7,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 8,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 9,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 10,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 11,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 12,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 13,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 14,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 15,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            }],
            "ending":"13/05/2017",
            "endingTime":"18:00",
            "id":6,
            "isCollaboratorDidRequest":false,
            "location":"Salle Bali",
            "trainingDescription":[{
                "id":6,
                "numberHalfDays":4,
                "topicDescription":[{
                    "id":4,
                    "name":"JAVA",
                    "version":0
                }],
                "trainingTitle":"JEE2",
                "version":0
            }],
            "version":1,
        };
        vmTrainingToCome.showInformationsMessage(trainingSession);
        expect(vmTrainingToCome.MouseOverMessage).toEqual("Désolé! Vous ne pouvez pas effectuer de demande");
    });




});
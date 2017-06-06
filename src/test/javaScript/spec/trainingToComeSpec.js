/**
 * Created by BBA3616 on 09/05/2017.
 */

Vue.use(VueResource);
Vue.use(VueRouter);

var vm3 = new Vue({
    template: '<div><training-to-come></training-to-come></div>',
    router: router,
    components: {
        'trainingToCome': TrainingToComeComponent
    }
}).$mount();

var vmCollabFormation= new Vue({
    template: '<div><collaborator-formation></collaborator-formation></div>',
    router: router,
    components: {
        'collaboratorFormation': CollaboratorFormation
    }
}).$mount();
vmCollaboratorFormation = vmCollabFormation.$children[0];

describe('training to come Panel test', function () {

    beforeEach(function () {
        let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
        document = {
            value_: '',

            get cookie() {
                return this.value_;
            },

            set cookie(value) {
                this.value_ += value + ';';
            }
        };
        document.cookie = "token="+ collaboratorToken;
        vmTrainingToCome =  vm3.$children[0];
        vmTrainingToCome.$parent = new Vue();
        vmTrainingToCome.$parent.$children[1] = vmCollaboratorFormation;
        clearRequests();
        Object.assign(vmTrainingToCome.$data, vmTrainingToCome.$options.data());
    });

    afterEach(function () {

    });

    it('should check if collaborator requests training session', function(done){
        var response = [
            {
                "email": "eric.dupon@viseo.com",
                "firstName": "Eric",
                "id": 5,
                "lastName": "Dupond",
                "password": "123456",
                "version": 0
            }
        ];

        let trainingSession = {
            "beginning":"11/05/2017",
            "beginningTime":"09:00",
            "collaborators":{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 5,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },
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
        prepareRequest('GET', 'api/requests/session/6/collaborators', 200, response);
        vmTrainingToCome.VerifyCollaboratorRequestsExistence(6,trainingSession);

        setTimeout(function () {
            expect(trainingSession.isCollaboratorDidRequest).toBe(true);
            done();
        }, 0);

    });

    it('should check if collaborator requests training session is not success', function(done){
        var response = [
            {
                "email": "eric.dupon@viseo.com",
                "firstName": "Eric",
                "id": 5,
                "lastName": "Dupond",
                "password": "123456",
                "version": 0
            }
        ];

        let trainingSession = {
            "beginning":"11/05/2017",
            "beginningTime":"09:00",
            "collaborators":{
                "email": 'eric.dupon@viseo.com',
                "firstName": 'Eric',
                "id": 5,
                "lastName": 'Dupond',
                "password": '123456',
                "version": 0
            },
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
        prepareRequest('GET', 'api/requests/session/6/collaborators', 500, response);
        vmTrainingToCome.VerifyCollaboratorRequestsExistence(6,trainingSession);

        setTimeout(function () {
            expect(trainingSession.isCollaboratorDidRequest).toBe(true);
            done();
        }, 0);

    });

    it('should check if all the next formations are displayed on the panel "Formation à venir" when page is loaded', function (done) {
        var responseTrainingsAlreadyHaveSessionsFromDatabase = [
            {
                "id": 3,
                "version": 0,
                "trainingTitle": "SWIFT",
                "numberHalfDays": 4,
                "topicDescription": {"id": 1, "version": 0, "name": "MOBILE"}
            },
            {
                "id": 4,
                "version": 0,
                "trainingTitle": "HTML",
                "numberHalfDays": 4,
                "topicDescription": {"id": 2, "version": 0, "name": "PHP"}
            }
        ];

        let allTrainingAndSessionsThatShouldBeDisplayedJSON = [[{"id":4,"version":0,"trainingDescription":{"id":3,"version":0,"trainingTitle":"SWIFT","numberHalfDays":4,"topicDescription":{"id":1,"version":0,"name":"MOBILE"}},"beginning":"19/05/2017","ending":"21/05/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Bora Bora","collaborators":[]},{"id":5,"version":0,"trainingDescription":{"id":3,"version":0,"trainingTitle":"SWIFT","numberHalfDays":4,"topicDescription":{"id":1,"version":0,"name":"MOBILE"}},"beginning":"26/05/2017","ending":"28/05/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Bastille","collaborators":[]}]];
        prepareRequest('GET', 'api/formations/sessions', 200, responseTrainingsAlreadyHaveSessionsFromDatabase);
        vmTrainingToCome.gatherTrainingsAlreadyHaveSessionsFromDatabase();
        clearRequests();

        var responseAllSessionsAndCollaboratorsFromDatabase = [
            {
                "id": 4,
                "version": 0,
                "trainingDescription": {
                    "id": 3,
                    "version": 0,
                    "trainingTitle": "SWIFT",
                    "numberHalfDays": 4,
                    "topicDescription": {"id": 1, "version": 0, "name": "MOBILE"}
                },
                "beginning": "19/05/2017",
                "ending": "21/05/2017",
                "beginningTime": "09:00",
                "endingTime": "18:00",
                "location": "Salle Bora Bora",
                "collaborators": []
            },
            {
                "id": 5,
                "version": 0,
                "trainingDescription": {
                    "id": 3,
                    "version": 0,
                    "trainingTitle": "PHP",
                    "numberHalfDays": 4,
                    "topicDescription": {"id": 2, "version": 0, "name": "MOBILE"}
                },
                "beginning": "26/05/2017",
                "ending": "28/05/2017",
                "beginningTime": "09:00",
                "endingTime": "18:00",
                "location": "Salle Bastille",
                "collaborators": []
            }
        ];
        prepareRequest('GET', 'api/formations/sessions/collaborators', 200, responseAllSessionsAndCollaboratorsFromDatabase);
        vmTrainingToCome.gatherAllSessionsAndCollaboratorsFromDatabase();

        setTimeout(function () {
            //A approfondir
            //expect(vmTrainingToCome.allTrainingsAndSessions).toEqual(allTrainingAndSessionsThatShouldBeDisplayedJSON);
            expect(vmTrainingToCome.trainingAndSessions).toEqual(responseAllSessionsAndCollaboratorsFromDatabase);
            done();
        }, 0);
    });

    it('should check if all the next formations are displayed on the panel "Formation à venir" when page is loaded with error', function (done) {
        var responseTrainingsAlreadyHaveSessionsFromDatabase = [];

        let allTrainingAndSessionsThatShouldBeDisplayedJSON = [[{"id":4,"version":0,"trainingDescription":{"id":3,"version":0,"trainingTitle":"SWIFT","numberHalfDays":4,"topicDescription":{"id":1,"version":0,"name":"MOBILE"}},"beginning":"19/05/2017","ending":"21/05/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Bora Bora","collaborators":[]},{"id":5,"version":0,"trainingDescription":{"id":3,"version":0,"trainingTitle":"SWIFT","numberHalfDays":4,"topicDescription":{"id":1,"version":0,"name":"MOBILE"}},"beginning":"26/05/2017","ending":"28/05/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Bastille","collaborators":[]}]];
        prepareRequest('GET', 'api/formations/sessions', 500, responseTrainingsAlreadyHaveSessionsFromDatabase);
        vmTrainingToCome.gatherTrainingsAlreadyHaveSessionsFromDatabase();
        clearRequests();

        var responseAllSessionsAndCollaboratorsFromDatabase = [];
        prepareRequest('GET', 'api/formations/sessions/collaborators', 500, responseAllSessionsAndCollaboratorsFromDatabase);
        vmTrainingToCome.gatherAllSessionsAndCollaboratorsFromDatabase();
        setTimeout(function () {
            expect(vmTrainingToCome.allTrainingsAndSessions).toEqual([]);

            done();
        }, 100);
    });

    it('should check if session selected is open on the accordeon (left panel) when the collaborator click on the session (right panel)', function () {
        var trainingSelected = {
            "id": 3,
            "version": 0,
            "trainingTitle": "SWIFT",
            "numberHalfDays": 4,
            "topicDescription": {"id": 1, "version": 0, "name": "MOBILE"}
        };
            expect(vmCollaboratorFormation.openPanel).toBe(false);
            vmTrainingToCome.showTrainingAndSessionsSelected(trainingSelected);
            expect(vmCollaboratorFormation.openPanel).toBe(true);
    });

    it('should check if seats available text is red when there is only or less than 3 seats available', function(){
        var numberSeatsAvailable = 3;
        expect(vmTrainingToCome.displayRedTextWhenOnly3SeatsAvailable(numberSeatsAvailable)).toBe(true);
    });

    it('should check if seats available text is green when there is more than 3 seats available', function(){
        let numberSeatsAvailable = 10;
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

    it('should check if the application identify the collaborator id thanks to the token cookies', function(){
        let collaboratorId = 1;
        vmTrainingToCome.initializeInformationsFromCookie();
        expect(vmTrainingToCome.collaborator_id).toBe(collaboratorId);
    });

    it('should check if the message disappear when the collaborator mouseleave the session', function() {
        vmTrainingToCome.hideInformationsMessage();
        expect(vmTrainingToCome.showMouseOverMessage).toBe(false);
    });

    it('should check if the message should not appear when the collaborator mouseover a session', function() {
        expect(vmTrainingToCome.verifyShowMessageOrNot()).toBe(false);
    });

    it('should check if the message should not appear when the collaborator mouseover a session', function() {
        vmTrainingToCome.showMouseOverMessage = true;
        vmTrainingToCome.trainingSessionIdMouseOver = 6;
        let trainingSelected = {
            id: 6,
            version: 0,
            trainingTitle: "SWIFT",
            numberHalfDays: 4,
            topicDescription: {id: 1, version: 0, name: "MOBILE"}
        };
            expect(vmTrainingToCome.verifyShowMessageOrNot(trainingSelected)).toBe(true);
    });

    it('Should check sending wishes in the database', function (done) {
        var response = [
            {
                "id": 10,
                "version": 0,
                "label": "SSS",
                "collaborator": {
                    "id": 5,
                    "version": 0,
                    "personnalIdNumber": "BBB1234",
                    "lastName": "nrjek",
                    "firstName": "rnrejk",
                    "email": "mxzsdef@163.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "vote_ok": null,
                "vote_ko": null,
                "checked": false
            },
            {
                "id": 11,
                "version": 0,
                "label": "SSSFFF",
                "collaborator": {
                    "id": 5,
                    "version": 0,
                    "personnalIdNumber": "BBB1234",
                    "lastName": "nrjek",
                    "firstName": "rnrejk",
                    "email": "mxzsdef@163.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "vote_ok": null,
                "vote_ko": null,
                "checked": true
            }
        ];
        prepareRequest('POST', 'api/wish/1', 200, response);
        vmTrainingToCome.updateV1('PHP');
        vmTrainingToCome.collaborator_id = 1;
        vmTrainingToCome.sendWish();
        setTimeout(function () {
            expect(vmTrainingToCome.wishAlreadyExisted).toBe(false);
            expect(vmTrainingToCome.wishSuccess).toBe(false);
            done();
        }, 2005);
    });

    it('Should check sending wishes in the database is not success', function (done) {
        var response = [
            {
                "id": 10,
                "version": 0,
                "label": "SSS",
                "collaborator": {
                    "id": 5,
                    "version": 0,
                    "personnalIdNumber": "BBB1234",
                    "lastName": "nrjek",
                    "firstName": "rnrejk",
                    "email": "mxzsdef@163.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "vote_ok": null,
                "vote_ko": null,
                "checked": false
            },
            {
                "id": 11,
                "version": 0,
                "label": "SSSFFF",
                "collaborator": {
                    "id": 5,
                    "version": 0,
                    "personnalIdNumber": "BBB1234",
                    "lastName": "nrjek",
                    "firstName": "rnrejk",
                    "email": "mxzsdef@163.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "vote_ok": null,
                "vote_ko": null,
                "checked": true
            }
        ];
        prepareRequest('POST', 'api/wish/1', 500, response);
        vmTrainingToCome.wish = "PHP";
        vmTrainingToCome.collaborator_id = 1;
        vmTrainingToCome.sendWish();
        setTimeout(function () {
            expect(vmTrainingToCome.wishAlreadyExisted).toBe(true);
            //expect(vmTrainingToCome.wishSuccess).toBe(false);
            done();
        }, 2005);
    });
});
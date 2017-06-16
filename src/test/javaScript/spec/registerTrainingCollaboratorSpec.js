/**
 * Created by CLH3623 on 18/04/2017.
 */

var vmCollabFormation= new Vue({
    template: '<div><collaborator-formation></collaborator-formation></div>',
    router: router,
    components: {
        'collaboratorFormation': CollaboratorFormation
    }
}).$mount();

//var vmCollaboratorFormation;

var dummyElement2= document.createElement('div');
dummyElement2.setAttribute("id", "8");
document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement2);

describe('test registerTrainingCollaborator', function () {

    beforeEach(function () {
        vmCollaboratorFormation = vmCollabFormation.$children[0];
        vmCollaboratorFormation.collaboratorIdentity = {
            id: 2,
            lastName: 'Dupont',
            firstName: 'Eric'
        };
        vmCollaboratorFormation.idTraining = 5;
        vmCollaboratorFormation.$parent = new Vue();
    });

    afterEach(function () {
        clearRequests();
        Object.assign(vmCollaboratorFormation.$data, vmCollaboratorFormation.$options.data());
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
        expect(vmCollaboratorFormation.capitalizeSearch).toBe('PROGRAMMATION');
        vmCollaboratorFormation.value = '';
        expect(vmCollaboratorFormation.capitalizeSearch).toBe(null);
    });

    it('should display the selected formation with sessions', function(done) {
        var alltraining = [{
            "id": 5,
            "version": 0,
            "trainingTitle": "FORMATION1",
            "numberHalfDays": 1,
            "topicDescription": {"id": 3, "version": 0, "name": "C"}
        },{
            "id": 6,
            "version": 0,
            "trainingTitle": "FORMATION2",
            "numberHalfDays": 2,
            "topicDescription": {"id": 3, "version": 0, "name": "C"}
        }];
        var response = [
            {
                "id": 7,
                "version": 0,
                "trainingDescription": {
                    "id": 5,
                    "version": 0,
                    "trainingTitle": "FORMATION1",
                    "numberHalfDays": 1,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                },
                "beginning": "15/04/2017",
                "ending": "15/04/2017",
                "beginningTime": "09:00",
                "endingTime": "18:00",
                "location": "Salle Escale"
            }, {
                "id": 8,
                "version": 0,
                "trainingDescription": {
                    "id": 5,
                    "version": 0,
                    "trainingTitle": "FORMATION1",
                    "numberHalfDays": 1,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                },
                "beginning": "18/05/2017",
                "ending": "18/05/2017",
                "beginningTime": "09:00",
                "endingTime": "18:00",
                "location": "Salle Bali"
            }
        ];
        prepareRequest('GET', 'api/formations/5/sessions', 200, response);
        vmCollaboratorFormation.allTrainings = alltraining;
        vmCollaboratorFormation.selectedTraining = trainingSelected.id;
        vmCollaboratorFormation.$refs.btnValidateSearch.click();
        setTimeout(function() {
            expect(vmCollaboratorFormation.trainingsFound.length).toBe(1);
            expect(vmCollaboratorFormation.displayTrainings).toBe(true);
            expect(vmCollaboratorFormation.isNoSession).toBe(false);
            done();
        }, 0);
    });

    it('should display the selected formation with no sessions', function(done) {
        var response = [];
        prepareRequest('GET', 'api/formations/6/sessions', 200, response);
        vmCollaboratorFormation.selectedTraining = trainingSelectedWithoutSessions.id;
        vmCollaboratorFormation.$refs.btnValidateSearch.click();
        setTimeout(function() {
            expect(vmCollaboratorFormation.trainingsFound.length).toBe(0);
            expect(vmCollaboratorFormation.displayTrainings).toBe(true);
            expect(vmCollaboratorFormation.isNoSession).toBe(true);
            done();
        }, 0);
    });

    it('should display the selected formation with error response server', function(done) {
        var response = [];
        prepareRequest('GET', 'api/formations/5/sessions', 500, response);
        vmCollaboratorFormation.selectedTraining = trainingSelected.id;
        vmCollaboratorFormation.$refs.btnValidateSearch.click();
        setTimeout(function() {
            done();
        }, 0);
    });

    it('should verify if training having inserted in value is valide', function (done) {
        vmCollaboratorFormation.value = 'FOR';
        setTimeout(function () {
            expect(vmCollaboratorFormation.isSearchValid).toBe(true);
            done();
        }, 0);
    });

    it('should verify if training having inserted in value is no valide', function (done) {
        vmCollaboratorFormation.value = '*';
        setTimeout(function () {
            expect(vmCollaboratorFormation.isSearchValid).toBe(false);
            done();
        }, 0);

    });

    it('should find sessions that are booked by collaborator ', function (done) {
        var response = [
            {
                "id": 8,
                "version": 0,
                "trainingDescription": {
                    "id": 5,
                    "version": 0,
                    "trainingTitle": "FORMATION1",
                    "numberHalfDays": 1,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                },
                "beginning": "18/05/2017",
                "ending": "18/05/2017",
                "beginningTime": "09:00",
                "endingTime": "18:00",
                "location": "Salle Bali"

            }
        ];
        prepareRequest('GET', 'api/formations/5/alreadyrequestedsession/2', 200, response);
        vmCollaboratorFormation.storeSessionsByCollab(trainingSelected.id);
        setTimeout(function () {
            expect(vmCollaboratorFormation.sessionsByCollab).toEqual(response);
            done();
        }, 0);
    });

    it('should training already requested', function (done) {
        var response = [
            {
                "collaboratorIdentity": {
                    "email": "eric.dupont@viseo.com",
                    "firstName": "Eric",
                    "id": 2,
                    "lastName": "Dupont",
                    "password": "123456",
                    "version": 0
                },
                "doesNotMatter": false,
                "id": 7,
                "trainingDescription": {
                    "id": 3,
                    "numberHalfDays": 2,
                    "topicDescription": {
                        "id": 2,
                        "name": "WEB",
                        "version": 0
                    },
                    "trainingTitle": "PHP1",
                    "version": 0
                },
                "trainingSessionsDescriptions": [{
                    "beginning": "26/05/2017",
                    "beginningTime": "09:00",
                    "collaborators": [],
                    "ending": "26/05/2017",
                    "endingTime": "18:00",
                    "id": 4,
                    "location": "Salle Bora Bora",
                    "trainingDescription": {
                        "id": 3,
                        "numberHalfDays": 2,
                        "topicDescription": {
                            "id": 2,
                            "name": "WEB",
                            "version": 0
                        },
                        "trainingTitle": "PHP1",
                        "version": 0
                    }
                }],
                "version": 0
            }
        ];
        prepareRequest('GET','api/listrequests/6/2', 200, response);
        vmCollaboratorFormation.trainingalreadyrequested(6);
        setTimeout(function () {
            expect(vmCollaboratorFormation.trainingrequested).toBe(true);
            done();
        }, 0);
    });

    it('should store training without sessions', function (done) {
        var response = [];
        prepareRequest('GET','api/formations/6/sessions', 200, response);
        vmCollaboratorFormation.storeTrainingSessions(6);
        setTimeout(function () {
            expect(vmCollaboratorFormation.listTrainingSession).toEqual(response);
            expect(vmCollaboratorFormation.displayTrainings).toBe(true);
            expect(vmCollaboratorFormation.isNoSession).toBe(true);
            done();
        }, 0);
    });

    it('should store training with sessions', function (done) {
        var response = [ {
            "id": 7,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "15/04/2017",
            "ending": "15/04/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Escale"
        }, {
            "id": 8,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "18/05/2017",
            "ending": "18/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bali"
        } ];
        prepareRequest('GET','api/formations/5/sessions', 200, response);
        vmCollaboratorFormation.storeTrainingSessions(5);
        setTimeout(function () {
            expect(vmCollaboratorFormation.listTrainingSession).toEqual(response);
            expect(vmCollaboratorFormation.displayTrainings).toBe(true);
            expect(vmCollaboratorFormation.isNoSession).toBe(false);
            done();
        }, 0);
    });

    it('should verify and save training request', function (done) {
        var response = {status: "ok"};
        prepareRequest('POST', 'api/requests', 200, response);
        vmCollaboratorFormation.trainingSelected = trainingSelected;
        vmCollaboratorFormation.isNoSession = true;
        vmCollaboratorFormation.verifyTrainingSessionCollaborator();
        expect(JSON.stringify(vmCollaboratorFormation.requestToRegister)).toEqual(JSON.stringify({
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
        }, 0);
    });

    it('should check when no session selected', function () {
        vmCollaboratorFormation.trainingSelected = trainingSelected;
        vmCollaboratorFormation.isNoSession = false;
        vmCollaboratorFormation.verifyTrainingSessionCollaborator();
        expect(vmCollaboratorFormation.noSessionsSelectedError).toBe(true);
    });

    it('should disable all session when indiferent is checked and there is not sessions', function (done) {
        var response = [ {
            "id": 7,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "15/04/2017",
            "ending": "15/04/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Escale"
        }, {
            "id": 8,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "18/05/2017",
            "ending": "18/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bali"
        } ];
        prepareRequest('GET', 'api/formations/5/sessions', 200, response);
        var dummyElement1 = document.createElement('div');
        dummyElement1.setAttribute("id", "5");
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement1);

        vmCollaboratorFormation.check = false;
        vmCollaboratorFormation.disabling(trainingSelected.id);
        setTimeout(function() {
            expect(vmCollaboratorFormation.checkedSessions.length).not.toEqual(0);
            expect(vmCollaboratorFormation.isNoSession).toBe(false);
            done();
        },0);
    });

    it('should disable all session when indiferent is checked and there is sessions', function (done) {
        var response = [];
        prepareRequest('GET', 'api/formations/5/sessions', 200, response);
        var dummyElement1 = document.createElement('div');
        dummyElement1.setAttribute("id", "5");
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement1);

        vmCollaboratorFormation.check = false;
        vmCollaboratorFormation.disabling(trainingSelected.id);
        setTimeout(function() {
            expect(vmCollaboratorFormation.checkedSessions.length).toEqual(0);
            expect(vmCollaboratorFormation.isNoSession).toBe(true);
            done();
        },0);
    });

    it('should disable all session when indiferent is not checked', function (done) {
        var dummyElement1 = document.createElement('div');
        dummyElement1.setAttribute("id", "5");
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement1);

        vmCollaboratorFormation.check = true;
        vmCollaboratorFormation.disabling(trainingSelected.id);
        setTimeout(function() {
            expect(vmCollaboratorFormation.checkedSessions.length).toEqual(0);
            expect(vmCollaboratorFormation.isNoSession).toBe(true);
            done();
        },0);
    });

    it('it should get feedback comment by training with response success of server', function (done) {
        var response = [{
            "id":11,
            "version":0,
            "date":1496061070548,
            "score":3,
            "comment":"HHHHH",
            "likers":[],
            "collaborator":
                {"id":7,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false},
            "training":
                {"id":9,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":5,"topic":{"id":3,"version":0,"name":"JAVA"}}
        }];
        prepareRequest('GET', 'api/feedbackcomment/9', 200, response);
        vmCollaboratorFormation.getFeedbackCommentByTraining(9);
        setTimeout(function () {
            expect(vmCollaboratorFormation.feedbackComments).toEqual(response);
            done();
        },0);
    });

    it('it should get feedback comment by training with response error of server', function (done) {
        var response = [];
        prepareRequest('GET', 'api/feedbackcomment/9', 500, response);

        vmCollaboratorFormation.getFeedbackCommentByTraining(9);
        setTimeout(function () {
            expect(vmCollaboratorFormation.feedbackComments).toEqual(response);
            done();
        },0);
    });

    it('it should add liker to feedback with response success of server', function (done) {
        var feedbackToAdd = [{
            "id":11,
            "version":0,
            "date":1496061070548,
            "score":3,
            "comment":"HHHHH",
            "likers":[],
            "collaborator":
                {"id":7,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false},
            "training":
                {"id":9,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":5,"topic":{"id":3,"version":0,"name":"JAVA"}}
        }];
        prepareRequest('PUT', 'api/addfeedbacklikes/1', 200, feedbackToAdd);
        vmCollaboratorFormation.addLiker(feedbackToAdd,1);
        setTimeout(function () {
            done();
        },0);
    });

    it('it should add liker to feedback with response error of server', function (done) {
        var feedbackToAdd = [{
            "id":11,
            "version":0,
            "date":1496061070548,
            "score":3,
            "comment":"HHHHH",
            "likers":[],
            "collaborator":
                {"id":7,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false},
            "training":
                {"id":9,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":5,"topic":{"id":3,"version":0,"name":"JAVA"}}
        }];
        prepareRequest('PUT', 'api/addfeedbacklikes/1', 500, feedbackToAdd);
        vmCollaboratorFormation.addLiker(feedbackToAdd,1);
        setTimeout(function () {
            done();
        },0);
    });

    it('it should remove liker to feedback with response success of server', function (done) {
        var feedbackToRemove = [{
            "id":11,
            "version":0,
            "date":1496061070548,
            "score":3,
            "comment":"HHHHH",
            "likers":[
                {"id":7,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false},
            ],
            "collaborator":
                {"id":7,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false},
            "training":
                {"id":9,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":5,"topic":{"id":3,"version":0,"name":"JAVA"}}
        }];

        prepareRequest('PUT', 'api/removefeedbacklikes/1', 200, feedbackToRemove);
        vmCollaboratorFormation.removeLiker(feedbackToRemove,1);
        setTimeout(function () {
            done();
        },0);
    });

    it('it should remove liker to feedback with response error of server', function (done) {
        var feedbackToRemove = [{
            "id":11,
            "version":0,
            "date":1496061070548,
            "score":3,
            "comment":"HHHHH",
            "likers":[
                {"id":7,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false},
            ],
            "collaborator":
                {"id":7,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false},
            "training":
                {"id":9,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":5,"topic":{"id":3,"version":0,"name":"JAVA"}}
        }];
        prepareRequest('PUT', 'api/removefeedbacklikes/1', 500, feedbackToRemove);
        vmCollaboratorFormation.removeLiker(feedbackToRemove,1);
        setTimeout(function () {
            done();
        },0);
    });

    it('it should if collect all to feedback with response success of server', function (done) {
        var response = [
            {
                "collaborator": {
                    "id": 1,
                    "version": 0,
                    "personnalIdNumber": "AAA1234",
                    "lastName": "nckjzn",
                    "firstName": "ncdxkzn",
                    "email": "xiangzhe.meng@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "comment": "HELLO WORLD",
                "date": 1495460297678,
                "id": 6,
                "score": 5,
                "training": {
                    "id": 3,
                    "numberHalfDays": 2,
                    "topic": {
                        "id": 2,
                        "name": "WEB",
                        "version": 0,
                    },
                    "trainingTitle": "PHP",
                    "version": 0,
                },
                "version": 0
            },
            {
                "collaborator": {
                    "id": 2,
                    "version": 0,
                    "personnalIdNumber": "AAB1234",
                    "lastName": "DUPONT",
                    "firstName": "Eric",
                    "email": "eric.dupont@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "comment": "HELLO WORLD version 2",
                "date": 1495462097678,
                "id": 6,
                "score": 5,
                "training": {
                    "id": 3,
                    "numberHalfDays": 2,
                    "topic": {
                        "id": 2,
                        "name": "WEB",
                        "version": 0,
                    },
                    "trainingTitle": "PHP",
                    "version": 0,
                },
                "version": 0
            }
        ];
        prepareRequest('GET', 'api/feedbacks', 200, response);

        vmCollaboratorFormation.getAllFeedbacks();
        setTimeout(function () {
            expect(vmCollaboratorFormation.allFeedbacks).toEqual(response);
            done();
        },0);
    });

    it('it should if collect all to feedback with response error of server', function (done) {
        var response = [ ];
        prepareRequest('GET', 'api/feedbacks', 500, response);
        vmCollaboratorFormation.getAllFeedbacks();
        setTimeout(function () {
            done();
        },0);
    });

    it('it should collect all training in the database with response success of server', function (done) {
        var response = [ {
            "id": 5,
            "version": 0,
            "trainingTitle": "FORMATION1",
            "numberHalfDays": 1,
            "topicDescription": {"id": 3, "version": 0, "name": "C"}
        },
            {
                "id": 6,
                "version": 0,
                "trainingTitle": "FORMATION2",
                "numberHalfDays": 2,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            {
                "id": 7,
                "version": 0,
                "trainingTitle": "JAVA",
                "numberHalfDays": 3,
                "topicDescription": {"id": 4, "version": 0, "name": "C++"}
            }
        ];
        prepareRequest('GET', 'api/formations', 200, response);
        vmCollaboratorFormation.gatherTrainingsFromDatabase(vmCollaboratorFormation.storeTrainingsFound);
        setTimeout(function () {
            expect(vmCollaboratorFormation.allTrainings).toEqual(response);
            expect(vmCollaboratorFormation.test).toEqual(false);
            done();
        },0);
    });

    it('it should collect all training in the database with response error of server', function (done) {
        var response = [ ];
        prepareRequest('GET', 'api/formations', 500, response);
        vmCollaboratorFormation.gatherTrainingsFromDatabase(vmCollaboratorFormation.storeTrainingsFound);
        setTimeout(function () {
            done();
        },0);
    });

    it('it should hide comments div if training has no comments ', function () {
        vmCollaboratorFormation.allFeedbacks = [
            {
                "collaborator": {
                    "id": 1,
                    "version": 0,
                    "personnalIdNumber": "AAA1234",
                    "lastName": "nckjzn",
                    "firstName": "ncdxkzn",
                    "email": "xiangzhe.meng@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "comment": "HELLO WORLD",
                "date": 1495460297678,
                "id": 6,
                "score": 5,
                "training": {
                    "id": 3,
                    "numberHalfDays": 2,
                    "topic": {
                        "id": 2,
                        "name": "WEB",
                        "version": 0,
                    },
                    "trainingTitle": "PHP",
                    "version": 0,
                },
                "version": 0
            },
            {
                "collaborator": {
                    "id": 2,
                    "version": 0,
                    "personnalIdNumber": "AAB1234",
                    "lastName": "DUPONT",
                    "firstName": "Eric",
                    "email": "eric.dupont@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "comment": "HELLO WORLD version 2",
                "date": 1495462097678,
                "id": 6,
                "score": 5,
                "training": {
                    "id": 3,
                    "numberHalfDays": 2,
                    "topic": {
                        "id": 2,
                        "name": "WEB",
                        "version": 0,
                    },
                    "trainingTitle": "PHP",
                    "version": 0,
                },
                "version": 0
            }
        ];
        vmCollaboratorFormation.trainingSelected = trainingSelected;

        var dummyElement2 = document.createElement('div');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement2);
        vmCollaboratorFormation.$children[1].$children[0] = document.getElementById;
        vmCollaboratorFormation.$children[1].$children[0].open = true;

        vmCollaboratorFormation.fonction(0);

        expect(vmCollaboratorFormation.trainingOpened).toEqual('');
        expect(vmCollaboratorFormation.showComment).toBe(false);

    });

    it('it should hide comments div if training has a comments', function () {
        vmCollaboratorFormation.allFeedbacks = [
            {
                "collaborator": {
                    "id": 1,
                    "version": 0,
                    "personnalIdNumber": "AAA1234",
                    "lastName": "nckjzn",
                    "firstName": "ncdxkzn",
                    "email": "xiangzhe.meng@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "comment": "HELLO WORLD",
                "date": 1495460297678,
                "id": 6,
                "score": 5,
                "training": {
                    "id": 5,
                    "numberHalfDays": 2,
                    "topic": {
                        "id": 2,
                        "name": "WEB",
                        "version": 0,
                    },
                    "trainingTitle": "PHP",
                    "version": 0,
                },
                "version": 0
            },
            {
                "collaborator": {
                    "id": 2,
                    "version": 0,
                    "personnalIdNumber": "AAB1234",
                    "lastName": "DUPONT",
                    "firstName": "Eric",
                    "email": "eric.dupont@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "comment": "HELLO WORLD version 2",
                "date": 1495462097678,
                "id": 6,
                "score": 5,
                "training": {
                    "id": 3,
                    "numberHalfDays": 2,
                    "topic": {
                        "id": 2,
                        "name": "WEB",
                        "version": 0,
                    },
                    "trainingTitle": "PHP",
                    "version": 0,
                },
                "version": 0
            }
        ];
        vmCollaboratorFormation.trainingSelected = trainingSelected;

        var dummyElement2= document.createElement('div');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement2);
        vmCollaboratorFormation.$children[1].$children[0] = document.getElementById;
        vmCollaboratorFormation.$children[1].$children[0].open = false;

        vmCollaboratorFormation.fonction(0);
        expect(vmCollaboratorFormation.$children[1].$children[0].open).toBe(true);

    });

    it('it should convert a number in format date', function () {
        expect(vmCollaboratorFormation.getDate(1496061070548)).toEqual('29/05/2017 à 14h31');
    });

    it('it should verify if a collabborator is likes one feedback and the result is true', function () {
        var feedback =  {
            "id":11,
            "version":0,
            "date":1496061070548,
            "score":3,
            "comment":"HHHHH",
            "likers":[{"id":2,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false}],
            };

        expect(vmCollaboratorFormation.collaboratorLikesFeedback(feedback)).toBe(true);
    });

    it('it should verify if a collabborator is likes one feedback and the result is false', function () {
        var feedback =  {
            "id":11,
            "version":0,
            "date":1496061070548,
            "score":3,
            "comment":"HHHHH",
            "likers":[{"id":5,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false}],
        };

        expect(vmCollaboratorFormation.collaboratorLikesFeedback(feedback)).toBe(false);
    });
});
/**
 * Created by NBE3663 on 11/05/2017.
 */

const collaboratorTok = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
document = {
    value_: '',

    get cookie() {
        return this.value_;
    },

    set cookie(value) {
        this.value_ += value + ';';
    }
};
document.cookie = "token="+ collaboratorTok;
describe('state Request training test', function () {

    beforeEach(function() {

        vmStateRequestTraining = new stateRequest().$mount();

    });

    afterEach(function() {
        clearRequests();
        Object.assign(vmStateRequestTraining.$data, vmStateRequestTraining.$options.data());
    });

    it('it should check cookies!!! ', function() {
            expect (vmStateRequestTraining.token).not.toBe('undefined');
            expect (vmStateRequestTraining.collaboratorIdentity.id).not.toBe('');
            vmStateRequestTraining.collaboratorIdentity.lastName;
            console.log("vmStateRequestTraining.collaboratorIdentity.lastName: " +vmStateRequestTraining.collaboratorIdentity.lastName);
            expect (vmStateRequestTraining.collaboratorIdentity.lastName).not.toBe('');
            expect (vmStateRequestTraining.collaboratorIdentity.firstName).not.toBe('');

    });

    it('it should check if trainings titles and session are fetched and if the validated sessions are checked ', function(done) {
        var result = [
            {
                "requestTrainingList": [
                    {
                        "id": 13,
                        "version": 0,
                        "training": {
                            "id": 4,
                            "version": 0,
                            "trainingTitle": "SPRING",
                            "numberHalfDays": 3,
                            "topic": {
                                "id": 3,
                                "version": 0,
                                "name": "JAVA"
                            }
                        },
                        "beginning": 1496041200000,
                        "ending": 1496160000000,
                        "location": "Salle Bora Bora",
                        "collaborators": []
                    }
                ],
                "trainingSessions": [
                    {
                        "id": 11,
                        "version": 1,
                        "training": {
                            "id": 4,
                            "version": 0,
                            "trainingTitle": "SPRING",
                            "numberHalfDays": 3,
                            "topic": {
                                "id": 3,
                                "version": 0,
                                "name": "JAVA"
                            }
                        },
                        "beginning": 1494831600000,
                        "ending": 1494950400000,
                        "location": "Salle Bali",
                        "collaborators": [
                            {
                                "id": 6,
                                "version": 0,
                                "personnalIdNumber": "AAA1234",
                                "lastName": "AAA",
                                "firstName": "AAA",
                                "email": "aa@aa.com",
                                "password": "123456",
                                "isAdmin": false
                            }
                        ]
                    },
                ]

            },
            {
                "requestTrainingList": [
                    {
                        "id": 13,
                        "version": 0,
                        "training": {
                            "id": 4,
                            "version": 0,
                            "trainingTitle": "SPRING",
                            "numberHalfDays": 3,
                            "topic": {
                                "id": 3,
                                "version": 0,
                                "name": "JAVA"
                            }
                        },
                        "beginning": 1496047200000,
                        "ending": 1496160000000,
                        "location": "Salle Bora Bora",
                        "collaborators": []
                    }
                ],
                "trainingSessions": [
                    {
                        "id": 11,
                        "version": 1,
                        "training": {
                            "id": 4,
                            "version": 0,
                            "trainingTitle": "SPRING",
                            "numberHalfDays": 3,
                            "topic": {
                                "id": 3,
                                "version": 0,
                                "name": "JAVA"
                            }
                        },
                        "beginning": 1494831600000,
                        "ending": 1494950400000,
                        "location": "Salle Bali",
                        "collaborators": [
                            {
                                "id": 6,
                                "version": 0,
                                "personnalIdNumber": "AAA1234",
                                "lastName": "AAA",
                                "firstName": "AAA",
                                "email": "aa@aa.com",
                                "password": "123456",
                                "isAdmin": false
                            }
                        ]
                    },
                ]

            },
            {
                "requestTrainingList": [
                    {
                        "id": 13,
                        "version": 0,
                        "training": {
                            "id": 4,
                            "version": 0,
                            "trainingTitle": "SPRING",
                            "numberHalfDays": 3,
                            "topic": {
                                "id": 3,
                                "version": 0,
                                "name": "JAVA"
                            }
                        },
                        "beginning": 1496047200000,
                        "ending": 1496160000000,
                        "location": "Salle Bora Bora",
                        "collaborators": []
                    }
                ],
                "trainingSessions": [
                    {
                        "id": 11,
                        "version": 1,
                        "training": {
                            "id": 4,
                            "version": 0,
                            "trainingTitle": "SPRING",
                            "numberHalfDays": 3,
                            "topic": {
                                "id": 3,
                                "version": 0,
                                "name": "JAVA"
                            }
                        },
                        "beginning": 1494837600000,
                        "ending": 1494950400000,
                        "location": "Salle Bali",
                        "collaborators": [
                            {
                                "id": 6,
                                "version": 0,
                                "personnalIdNumber": "AAA1234",
                                "lastName": "AAA",
                                "firstName": "AAA",
                                "email": "aa@aa.com",
                                "password": "123456",
                                "isAdmin": false
                            }
                        ]
                    },
                ]

            }
        ];
        vmStateRequestTraining.collaboratorIdentity.id = 6;
        prepareRequest('GET', 'api/sessions/6/requestedSessions', 200, result);

        vmStateRequestTraining.fetchTrainingsSessions();

        setTimeout(function () {
            expect(vmStateRequestTraining.requestedTraining).toBe(result);
            done();
        }, 2);

    });

    it('it should check if we can add a feedback and popup open with success', function(done) {
        vmStateRequestTraining.collaboratorIdentity.id = 1;
        var result = [
            {   "id":11,
                "version":0,
                "trainingTitle":"FORMATION",
                "numberHalfDays":3,
                "topic":{"id":10,"version":0,"name":"JAVA"}
            },
            {   "id":12,
                "version":0,
                "trainingTitle":"FORMATION2",
                "numberHalfDays":3,
                "topic":{"id":11,"version":0,"name":"J2EE"}
            }
        ];
        prepareRequest('GET', 'api/trainingstogivefeedbacks/1', 200, result);
        vmStateRequestTraining.collectAllTrainingsToGiveFeedbacks();

        setTimeout(function () {
            expect (vmStateRequestTraining.allTrainingsToGiveFeedbacks).toEqual(result);
            done();
        }, 0);
    });

    it('it should check if we can add a feedback and popup no open with success', function(done) {
        vmStateRequestTraining.collaboratorIdentity.id = 1;
        var result = [];
        prepareRequest('GET', 'api/trainingstogivefeedbacks/1', 200, result);
        vmStateRequestTraining.collectAllTrainingsToGiveFeedbacks();

        setTimeout(function () {
            expect (vmStateRequestTraining.allTrainingsToGiveFeedbacks).toEqual(result);
            done();
        }, 0);
    });

    it('it should check if we can add a feedback whit error', function(done) {
        vmStateRequestTraining.collaboratorIdentity.id = 1;
        var result = [];
        prepareRequest('GET', 'api/trainingstogivefeedbacks/1', 500, result);
        vmStateRequestTraining.collectAllTrainingsToGiveFeedbacks();
        setTimeout(function () {
            done();
        }, 0);

    });

    it('it should check if the field comment and score their are empty after the feedback appended', function(done) {
        vmStateRequestTraining.collaboratorIdentity.id = 1;
        vmStateRequestTraining.score = 5;
        vmStateRequestTraining.comment = "HELLO WORLD";
        var training = {"id":3,"version":0,"trainingTitle":"FORMATION","numberHalfDays":3,"topic":{"id":2,"version":0,"name":"C"}};

        prepareRequest('POST', 'api/feedback/1', 200, training);
        vmStateRequestTraining.addFeedback(training);
        setTimeout(function () {
            expect (vmStateRequestTraining.comment).toEqual('');
            expect (vmStateRequestTraining.score).toEqual('');
            done();
        }, 0);
    });

    it('it should convert a number in format date', function () {
        expect(vmStateRequestTraining.getDate(1496061070548)).toEqual('29 Mai 2017');
    });

});

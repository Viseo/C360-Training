/**
 * Created by XME3612 on 29/05/2017.
 */
var trainingRankingComponent = new Vue({
    template: '<div><training-ranking></training-ranking></div>',
    router: router,
    components: {
        'trainingranking': trainingRanking
    }
}).$mount();

describe('training-ranking test', function () {
    beforeEach(function () {

        vmTrainingRanking = trainingRankingComponent.$children[0];
        clearRequests();
    });

    afterEach(function () {
        //Object.assign(vmTrainingRanking.$data, vmTrainingRanking.$options.data());

    });

    it('it should get all training score with success response of server', function (done) {
        var response = [
            [
                {
                    "id":4,
                    "version":0,
                    "trainingTitle":"FORMATION1",
                    "numberHalfDays":3,
                    "topic":{"id":2,"version":0,"name":"C"}
                },
                3.0
            ],
            [
                {
                    "id":14,
                    "version":0,
                    "trainingTitle":"FORMATION3",
                    "numberHalfDays":5,
                    "topic":{"id":13,"version":0,"name":"C++"}
                },
                4.0
            ],
            [
                {
                    "id":9,
                    "version":0,
                    "trainingTitle":"FORMATION2",
                    "numberHalfDays":5,
                    "topic":{"id":3,"version":0,"name":"JAVA"}
                },
                3.0
            ]
        ];
        prepareRequest('GET', 'api/trainingscore', 200, response);
        vmTrainingRanking.getTrainingsScore();

        setTimeout(function () {
            expect(vmTrainingRanking.allTrainingScore).toEqual(response);
            done();
        },0);

    });

    it('it should get all training score with error response of server', function () {
        var response = [];
        prepareRequest('GET', 'api/trainingscore', 500, response);
        vmTrainingRanking.getTrainingsScore();
    });

    it('it should delete feedback comment with success response of server', function () {
        var feedbackCommentToDelete = [{
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

        var response = [{
            "id":11,
            "version":0,
            "date":1496061070548,
            "score":3,
            "comment":"",
            "likers":[],
            "collaborator":
                {"id":7,"version":0,"personnalIdNumber":"BBB1234","lastName":"njcksdql","firstName":"cdjksndk","email":"mxzsdef@163.com","password":"123456","isAdmin":false,"function":null,"businessUnit":null,"admin":false},
            "training":
                {"id":9,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":5,"topic":{"id":3,"version":0,"name":"JAVA"}}
        }];

        prepareRequest('PUT', 'api/deletefeedbackcomment', 200, response);
        vmTrainingRanking.deleteFeedbackComment(feedbackCommentToDelete);

    });

    it('it should get feedback comment by training with success response of server', function (done) {
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
        },{
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
        vmTrainingRanking.getFeedbackCommentByTraining(9);
        setTimeout(function () {
            expect(vmTrainingRanking.feedbackComments).toEqual(response);
            done();
        },0);
    });

    it('it should get feedback comment by training with error response of server', function (done) {
        var response = [];
        prepareRequest('GET', 'api/feedbackcomment/9', 500, response);
        vmTrainingRanking.getFeedbackCommentByTraining(9);
        setTimeout(function () {
            done();
        },0);

    });

    it('it should add a feedback for a training with success response of server', function (done) {
        var response = [];
        var feedbackToAdd = [{
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
        prepareRequest('PUT', 'api/addfeedbacklikes/1', 200, response);
        vmTrainingRanking.addLiker(feedbackToAdd,1);
        setTimeout(function () {
            done();
        },0);

    });

    it('it should add a feedback for a training with error response of server', function (done) {
        var response = [];
        var feedbackToAdd = [{
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
        prepareRequest('PUT', 'api/addfeedbacklikes/1', 500, response);
        vmTrainingRanking.addLiker(feedbackToAdd,1);
        setTimeout(function () {
            done();
        },0);
    });

    it('it should remove a feedback for a training with success response of server', function (done) {
        var response = [];
        var feedbackToRemove = [{
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
        prepareRequest('PUT', 'api/removefeedbacklikes/1', 200, response);
        vmTrainingRanking.removeLiker(feedbackToRemove,1);
        setTimeout(function () {
            done();
        },0);
    });

    it('it should remove a feedback for a training with error response of server', function (done) {
        var response = [];
        var feedbackToRemove = [{
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
        prepareRequest('PUT', 'api/removefeedbacklikes/1', 500, response);
        vmTrainingRanking.removeLiker(feedbackToRemove,1);
        setTimeout(function () {
            done();
        },0);
    });

    it('it should convert a number in format date', function () {
        expect(vmTrainingRanking.getDate(1496061070548)).toEqual('29/05/2017 à 14h31');
    });

});
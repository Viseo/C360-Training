/**
 * Created by XME3612 on 29/05/2017.
 */
var vm8 = new Vue({
    template: '<div><training-ranking></training-ranking></div>',
    router: router,
    components: {
        'blueHeader': Header
    }
}).$mount();

describe('training-ranking test', function () {
    beforeEach(function () {

        vmTrainingRanking = vm8.$children[0];
        clearRequests();
    });

    afterEach(function () {
        Object.assign(vmTrainingRanking.$data, vmTrainingRanking.$options.data());

    });

    it('it should get all training score with success', function (done) {
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

    it('it should get all training score with error', function (done) {
        var response = [];
        prepareRequest('GET', 'api/trainingscore', 500, response);
        vmTrainingRanking.getTrainingsScore();

        setTimeout(function () {
            expect(vmTrainingRanking.allTrainingScore).toEqual(response);
            done();
        },0);

    });

    it('it should delete feedback comment with success', function (done) {
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
        setTimeout(function () {
           //expect(vmTrainingRanking.feedback).toEqual(response);
            done();
        },0);
    });

    it('it should get feedback comment by training', function (done) {
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
        vmTrainingRanking.getFeedbackCommentByTraining(9);
        setTimeout(function () {
            expect(vmTrainingRanking.feedbackComments).toEqual(response);
            done();
        },0);
    });

});
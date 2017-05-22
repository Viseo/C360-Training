/**
 * Created by SJO3662 on 22/05/2017.
 */

fdescribe('classify training test', function () {
    beforeEach(function () {

        vmClassifyTraining = new classifyTraining().$mount();
        vmClassifyTraining.collaborator_id = 1;

    });

    afterEach(function () {

    });

    it('it should collect all feedbacks', function (done) {
        var response = [
            {
                "collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},
                "comment":"HELLO WORLD",
                "date":1495460297678,
                "id":6,
                "score":5,
                "training":{
                    "id":3,
                    "numberHalfDays":2,
                    "topic":{
                        "id":2,
                        "name":"WEB",
                        "version":0,
                    },
                    "trainingTitle":"PHP",
                    "version":0,
                },
                "version":0
            }
        ];
        vmClassifyTraining.getAllFeedbacks();
        setTimeout(function () {
            expect(vmClassifyTraining.allFeedbacks).toEqual(response);
            done();
        },0);
    });

    it('it should collect all training with', function (done) {
        var response = [
            {
                "id":3,
                "numberHalfDays":2,
                "topic":{
                    "id":2,
                    "name":"WEB",
                    "version":0,
                },
                "trainingTitle":"PHP",
                "version":0,
            }
        ];
        vmClassifyTraining.getTrainingsScore();
        setTimeout(function () {
            expect(vmClassifyTraining.allTrainingScore).toEqual(response);
            done();
        },0);

    });
});
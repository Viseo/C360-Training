/**
 * Created by XME3612 on 28/03/2017.
 */
Vue.use(VueResource);

Vue.http.interceptors.unshift((request, next) => {
    let route = routes.find((item) => {
        return (request.method === item.method && request.url === item.url);
    });
    if (!route) {
        // we're just going to return a 404 here, since we don't want our test suite making a real HTTP request
        next(request.respondWith({status: 404, statusText: 'Oh no! Not found!'}));
    } else {

        //  getRoute(route,args);
        // console.log(route.response);
        next(
            // getRoute(route, args),
            // console.log(route.response),
            request.respondWith(
                route.response,
                {status: 200}
            )
        );
    }
});

describe('test-show-formation', function () {
    let TRAINING = '{"id":1,"version":0,"name":"PROGRAMMATION"}';
    let vm;
    beforeEach(function () {
        vmAddFormationPanel = new AddFormationPanel().$mount();
        vmShowFormation = new ShowFormation().$mount();
        vmAddSessionPanel = new addSessionPanel().$mount();
    });

    afterEach(function() {

    });

    it('should check variable initialization from AddFormationPanel component and ShowFormation component', function () {
        expect(vmAddFormationPanel.training).toEqual({trainingTitle: '', numberHalfDays: '', topicDescription: ''});
        expect(vmAddFormationPanel.trainingTitle).toBe('');
        expect(vmAddFormationPanel.numberHalfDays).toBe('');
        expect(vmAddFormationPanel.topicDescription).toBe('');
        expect(vmAddFormationPanel.trainingToRegister).toEqual({});
        expect(vmAddFormationPanel.topic).toEqual({name: ''});
        expect(vmAddFormationPanel.newTopic).toBe('');
        expect(vmAddFormationPanel.topicToRegister).toEqual({});
        expect(vmAddFormationPanel.trainingTitleRegexErrorMessage).toBe('');
        expect(vmAddFormationPanel.newTopicRegexErrorMessage).toBe('');
        expect(vmAddFormationPanel.isNewTrainingTitle).toBe(true);
        expect(vmAddFormationPanel.isNewTopic).toBe(true);
        expect(vmAddFormationPanel.confirmFormation).toBe(false);
        expect(vmAddFormationPanel.confirmTopic).toBe(false);
        expect(vmAddFormationPanel.trainingTitleErrorMessage).toBe(false);
        expect(vmAddFormationPanel.numberHalfDaysErrorMessage).toBe(false);
        expect(vmAddFormationPanel.topicErrorMessage).toBe(false);
        expect(vmAddFormationPanel.newTopicErrorMessage).toBe(false);
        expect(vmAddFormationPanel.isTrainingTitleValid).toBe(true);
        expect(vmAddFormationPanel.isNewTopicValid).toBe(true);
        expect(vmAddFormationPanel.selectOptionsOfTraining).toEqual([]);
        expect(vmAddFormationPanel.selectOptionsOfTopic).toEqual([]);
        expect(vmAddFormationPanel.topicsChosen).toEqual([]);
        expect(vmAddFormationPanel.arrangeTrainings).toBeUndefined();
        expect(vmAddFormationPanel.allTrainingsOfATopicChosen).toEqual([]);
        expect(vmAddFormationPanel.state.trainingsChosen).toEqual([]);
        expect(vmAddFormationPanel.state.allTopicTraining).toEqual([]);

        expect(vmShowFormation.state.trainingsChosen).toEqual([]);
        expect(vmShowFormation.state.allTopicTraining).toEqual([]);
    });

    //verifyTrainingField
    it('should check verify field Training', function () {
        vmAddFormationPanel.verifyTrainingField('Formation','trainingTitleRegexErrorMessage');
        expect(vmAddFormationPanel.isTrainingTitleValid).toBe(true);
        expect(vmAddFormationPanel.trainingTitleRegexErrorMessage).toBe('');
        vmAddFormationPanel.verifyTrainingField('/Formation','trainingTitleRegexErrorMessage');
        expect(vmAddFormationPanel.isTrainingTitleValid).toBe(false);
        expect(vmAddFormationPanel.trainingTitleRegexErrorMessage).toBe("Veuillez entrer un nom de formation valide (-.'_@:+#% autorisés)");
    });

    //verifyNewTopicField
    it('should check verify field new Topic', function () {
        vmAddFormationPanel.verifyNewTopicField('Java','newTopicRegexErrorMessage');
        expect(vmAddFormationPanel.isNewTopicValid).toBe(true);
        expect(vmAddFormationPanel.newTopicRegexErrorMessage).toBe('');
        vmAddFormationPanel.verifyNewTopicField('/Java','newTopicRegexErrorMessage');
        expect(vmAddFormationPanel.isNewTopicValid).toBe(false);
        expect(vmAddFormationPanel.newTopicRegexErrorMessage).toBe("Veuillez entrer un nom de thème valide (-.'_@:+#% autorisés)");
    });

    //isTrainingTitleEmpty
    it('should check whether the field training title is empty', function () {
        vmAddFormationPanel.trainingTitle = 'JAVA';
        vmAddFormationPanel.isTrainingTitleEmpty();
        expect(vmAddFormationPanel.trainingTitleErrorMessage).toBe(false);
        vmAddFormationPanel.trainingTitle = '';
        vmAddFormationPanel.isTrainingTitleEmpty();
        expect(vmAddFormationPanel.trainingTitleErrorMessage).toBe(true);
        vmAddFormationPanel.trainingTitle = undefined;
        vmAddFormationPanel.isTrainingTitleEmpty();
        expect(vmAddFormationPanel.trainingTitleErrorMessage).toBe(true);
    });

    //isNumberHalfDaysEmpty
    it('should check whether the field numberhalfdays is empty', function () {
        vmAddFormationPanel.numberHalfDays = 2;
        vmAddFormationPanel.isNumberHalfDaysEmpty();
        expect(vmAddFormationPanel.numberHalfDaysErrorMessage).toBe(false);
        vmAddFormationPanel.numberHalfDays = '';
        vmAddFormationPanel.isNumberHalfDaysEmpty();
        expect(vmAddFormationPanel.numberHalfDaysErrorMessage).toBe(true);
        vmAddFormationPanel.numberHalfDays = undefined;
        vmAddFormationPanel.isNumberHalfDaysEmpty();
        expect(vmAddFormationPanel.numberHalfDaysErrorMessage).toBe(true);
    });

    //isTopicEmpty
    it('should check whether the field topic is empty', function () {
        vmAddFormationPanel.topicDescription = 'WEB';
        vmAddFormationPanel.isTopicEmpty();
        expect(vmAddFormationPanel.topicErrorMessage).toBe(false);
        vmAddFormationPanel.topicDescription = '';
        vmAddFormationPanel.isTopicEmpty();
        expect(vmAddFormationPanel.topicErrorMessage).toBe(true);
        vmAddFormationPanel.topicDescription = undefined;
        vmAddFormationPanel.isTopicEmpty();
        expect(vmAddFormationPanel.topicErrorMessage).toBe(true);
    });

    //isNewTopicEmpty
    it('should check whether the field name of topic is empty', function () {
        vmAddFormationPanel.newTopic = 'WEB';
        vmAddFormationPanel.isNewTopicEmpty();
        expect(vmAddFormationPanel.newTopicErrorMessage).toBe(false);
        vmAddFormationPanel.newTopic = '';
        vmAddFormationPanel.isNewTopicEmpty();
        expect(vmAddFormationPanel.newTopicErrorMessage).toBe(true);
        vmAddFormationPanel.newTopic = undefined;
        vmAddFormationPanel.isNewTopicEmpty();
        expect(vmAddFormationPanel.newTopicErrorMessage).toBe(true);
    });

    //resetTrainingForm
    it('should check whether the training form is reset', function () {
        vmAddFormationPanel.resetTrainingForm();
        expect(vmAddFormationPanel.trainingTitle).toBe('');
        expect(vmAddFormationPanel.numberHalfDays).toBe('');
        expect(vmAddFormationPanel.topicDescription).toBe('');
        expect(vmAddFormationPanel.trainingToRegister).toEqual({});
    });

    //resetTopicForm
    it('should check whether the topic form is reset', function () {
        vmAddFormationPanel.resetTrainingForm();
        expect(vmAddFormationPanel.newTopic).toBe('');
        expect(vmAddFormationPanel.topicToRegister).toEqual({});
        vmAddFormationPanel.numberHalfDays=2;
    });

    it('should add a topic', function() {
        var sessionDescription = TRAINING;
        vmAddFormationPanel.newTopic = 'PROGRAMMATION';
        let resp = vmAddFormationPanel.saveTopicIntoDatabase();
    });

    //removeDuplicates
    it('should check whether the function removeDuplicates can remove those duplicates', function () {

        var arrayWithDuplicates = [
            {"id":"1","mame":"c"},
            {"id":"2","mame":"java"},
            {"id":"3","mame":"javascript"},
            {"id":"1","mame":"c++"},
            {"id":"1","mame":"c#"}
        ];

        var result = [{"id":"1","mame":"c#"},
                      {"id":"2","mame":"java"},
                      {"id":"3","mame":"javascript"},];

        expect(training_store.removeDuplicates(arrayWithDuplicates,"id")).toEqual(result);
    });

    //verifyTrainingFormBeforeSubmit
    //verifyTopicFormBeforeSubmit
    //saveTrainingIntoDatabase
    //saveTopicIntoDatabase
    //gatherTopicsFromDatabase
    //gatherTrainingsFromDatabase


    //TopicwithTraining
    it('should check whether the function TopicwithTraining can choose all the topics which have already got the trainings', function () {
        vmAddFormationPanel.state.allTrainings= [
            {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":7,"version":0,"trainingTitle":"FORMATION3","numberHalfDays":3,"topicDescription":{"id":4,"version":0,"name":"C++"}}
        ];

        var result = [
            {"id":3,"version":0,"name":"C"},
            {"id":4,"version":0,"name":"C++"}
        ];
        vmAddFormationPanel.trainingStore.TopicwithTraining();
        expect(vmAddFormationPanel.state.trainingsChosen).toEqual(result);
    });

    //reorganizeTrainings
    it('should check whether the function reorganizeTrainings can reorganize an array of trainings', function () {

        var arrayToTest = [1,2,3,4,5,6,7,8,9,10];
        var result = [
            [1,2,3,4],
            [5,6,7,8],
            [9,10]
        ];

        expect(vmAddFormationPanel.trainingStore.reorganizeTrainings(arrayToTest)).toEqual(result);
    });

    //chooseAllTrainingsOfATopic
    it('should check whether the function chooseAllTrainingsOfATopic can choose all the trainings attached to the topic chosen', function () {
        vmAddFormationPanel.state.allTrainings = [
            {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":7,"version":0,"trainingTitle":"FORMATION3","numberHalfDays":3,"topicDescription":{"id":4,"version":0,"name":"C++"}}
        ];

        var result = [
            {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}},
        ];

        expect(vmAddFormationPanel.trainingStore.chooseAllTrainingsOfATopic("C")).toEqual(result);
    });

    //reorganizeAllTopicsAndTrainings
    it('should check whether the function reorganizeAllTopicsAndTrainings can reorganize all topics and trainings into an array', function () {
        vmAddFormationPanel.state.allTrainings = [
            {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":7,"version":0,"trainingTitle":"FORMATION3","numberHalfDays":3,"topicDescription":{"id":4,"version":0,"name":"C++"}}
        ];

        vmAddFormationPanel.state.trainingsChosen = [
            {"id":3,"version":0,"name":"C"},
            {"id":4,"version":0,"name":"C++"}
        ];

        var result = [
            [
                [{"id": 5, "version": 0, "trainingTitle": "FORMATION1", "numberHalfDays": 1, "topicDescription": {"id": 3, "version": 0, "name": "C"}}, {"id": 6, "version": 0, "trainingTitle": "FORMATION2", "numberHalfDays": 2, "topicDescription": {"id": 3, "version": 0, "name": "C"}}]
            ],
            [
                [{"id": 7, "version": 0, "trainingTitle": "FORMATION3", "numberHalfDays": 3, "topicDescription": {"id": 4, "version": 0, "name": "C++"}}]
            ]
        ];

        vmAddFormationPanel.trainingStore.reorganizeAllTopicsAndTrainings();
        expect(vmAddFormationPanel.state.allTopicTraining).toEqual(result);
    });

    /*it('should check variable initialization from show-formation-panel component', function () {
        expect(vmShowFormation.state.trainingsChosen).not.toBeNull();
        expect(vmShowFormation.state.allTopicTraining).not.toBeNull();

    });*/

    //showChevrons
    it('should check whether the chevrons can be hidden', function () {
        vmAddFormationPanel.state.trainingsChosen=[];
        expect(vmShowFormation.showChevrons).toBe(false);
    });

    it('should check whether the chevrons can be showed when there is at least one training in the database', function () {
        vmAddFormationPanel.state.trainingsChosen = [
            {"id":3,"version":0,"name":"C"},
            {"id":4,"version":0,"name":"C++"}
        ];
        expect(vmShowFormation.showChevrons).toBe(true);
    });

    it('should check if the panel change from session panel to training panel when click on a training button', function () {

            vmAddSessionPanel.ReturnToPageTraining();

            expect(vmAddSessionPanel.isDisabledTrainingTitle).toBe(true);
            expect(vmAddSessionPanel.state.changePageToTraining).toBe(true);
            expect(vmAddSessionPanel.state.idTraining).toEqual('');
            expect(vmAddSessionPanel.state.trainingChosen).toEqual({});
            expect(vmAddSessionPanel.state.trainingTitle).toEqual('');
            expect(vmAddSessionPanel.beginningDate).toEqual('');
            expect(vmAddSessionPanel.endingDate).toEqual('');
            expect(vmAddSessionPanel.location).toEqual('');
            expect(vmAddSessionPanel.modifySessionButton).toBe(false);
            expect(vmAddSessionPanel.isDisabledSupprimer).toBe = true;
            expect(vmAddSessionPanel.valueButtonSaveModify).toEqual('Ajouter');
            expect(vmAddSessionPanel.state.idSession).toEqual('');
        console.log(vmAddSessionPanel.state.allTrainings)
            var resultApiFormations = [
                {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},
                {"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}},
                {"id":7,"version":0,"trainingTitle":"FORMATION3","numberHalfDays":3,"topicDescription":{"id":4,"version":0,"name":"C++"}}
            ];
            expect(vmAddSessionPanel.state.allTrainings).toEqual(resultApiFormations);
        
    });

    it('should check if the panel change from training panel to session panel when click on a training button', function () {

        vmAddFormationPanel.state.allTopicTraining = [
            [
                [{"id": 5, "version": 0, "trainingTitle": "FORMATION1", "numberHalfDays": 1, "topicDescription": {"id": 3, "version": 0, "name": "C"}}, {"id": 6, "version": 0, "trainingTitle": "FORMATION2", "numberHalfDays": 2, "topicDescription": {"id": 3, "version": 0, "name": "C"}}]
            ],
            [
                [{"id": 7, "version": 0, "trainingTitle": "FORMATION3", "numberHalfDays": 3, "topicDescription": {"id": 4, "version": 0, "name": "C++"}}]
            ]
        ];
        var reponseFormation1 =             [
            {"id":7,"version":0,"trainingDescription":
                {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":
                    {"id":3,"version":0,"name":"C"}
                },"beginning":"15/04/2017","ending":"15/04/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Escale"}
            ,
            {"id":8,"version":0,"trainingDescription":
                {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":
                    {"id":3,"version":0,"name":"C"}
                },"beginning":"18/05/2017","ending":"18/05/2017","beginningTime":"09:00","endingTime":"18:00","location":"Salle Bali"}

        ]
        //Click on FORMATION1 button (FORMATION1 got 2 sessions)
        vmShowFormation.CreateSession(vmAddFormationPanel.state.allTopicTraining[0][0][0].id);
        expect(vmShowFormation.state.changePageToSession).toBe(true);
        expect(vmShowFormation.state.changePageToTraining).toBe(false);
        expect(vmShowFormation.state.idTraining).toEqual(5);
        expect(vmShowFormation.state.trainingChosen).toEqual(vmAddFormationPanel.state.allTopicTraining[0][0][0]);
        expect(vmShowFormation.state.isNoSession).toBe(false);
        expect(vmShowFormation.state.listTrainingSession).toEqual(reponseFormation1);

    });


});

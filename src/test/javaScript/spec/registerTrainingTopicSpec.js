/**
 * Created by XME3612 on 28/03/2017.
 */

describe('test-show-formation', function () {

    let vm;

    beforeEach(function () {
        vmAddFormationPanel = new AddFormationPanel().$mount();
        vmShowFormation = new ShowFormation().$mount();
    });

    afterEach(function () {

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
        expect(vmAddFormationPanel.isNameTopicValid).toBe(true);
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
        expect(vmAddFormationPanel.isNameTopicValid).toBe(true);
        expect(vmAddFormationPanel.newTopicRegexErrorMessage).toBe('');
        vmAddFormationPanel.verifyNewTopicField('/Java','newTopicRegexErrorMessage');
        expect(vmAddFormationPanel.isNameTopicValid).toBe(false);
        expect(vmAddFormationPanel.newTopicRegexErrorMessage).toBe("Veuillez entrer un nom de topic valide (-.'_@:+#% autorisés)");
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

        expect(vmAddFormationPanel.removeDuplicates(arrayWithDuplicates,"id")).toEqual(result);
    });

    //verifyTrainingFormBeforeSubmit
    //verifyTopicFormBeforeSubmit
    //saveTrainingIntoDatabase
    //saveTopicIntoDatabase
    //gatherTopicsFromDatabase
    //gatherTrainingsFromDatabase


    //TopicwithTraining
    it('should check whether the function TopicwithTraining can choose all the topics which have already got the trainings', function () {
        vmAddFormationPanel.selectOptionsOfTraining = [
            {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":7,"version":0,"trainingTitle":"FORMATION3","numberHalfDays":3,"topicDescription":{"id":4,"version":0,"name":"C++"}}
        ];

        var result = [
            {"id":3,"version":0,"name":"C"},
            {"id":4,"version":0,"name":"C++"}
        ];
        vmAddFormationPanel.TopicwithTraining();
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

        expect(vmAddFormationPanel.reorganizeTrainings(arrayToTest)).toEqual(result);
    });

    //chooseAllTrainingsOfATopic
    it('should check whether the function chooseAllTrainingsOfATopic can choose all the trainings attached to the topic chosen', function () {
        vmAddFormationPanel.selectOptionsOfTraining = [
            {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":7,"version":0,"trainingTitle":"FORMATION3","numberHalfDays":3,"topicDescription":{"id":4,"version":0,"name":"C++"}}
        ];

        var result = [
            {"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},
            {"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}},
        ];

        expect(vmAddFormationPanel.chooseAllTrainingsOfATopic("C")).toEqual(result);
    });

    //reorganizeAllTopicsAndTrainings
    it('should check whether the function reorganizeAllTopicsAndTrainings can reorganize all topics and trainings into an array', function () {
        vmAddFormationPanel.selectOptionsOfTraining = [
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

        vmAddFormationPanel.reorganizeAllTopicsAndTrainings();
        expect(vmAddFormationPanel.state.allTopicTraining).toEqual(result);
    });

    /*it('should check variable initialization from show-formation-panel component', function () {
        expect(vmShowFormation.state.trainingsChosen).not.toBeNull();
        expect(vmShowFormation.state.allTopicTraining).not.toBeNull();

    });*/

    //showChevrons
    it('should check whether the chevrons can be hidden', function () {
        vmAddFormationPanel.state.trainingsChosen=[];
        expect(vmShowFormation.showChevrons()).toBe(false);
    });

    it('should check whether the chevrons can be showed when there is at least one training in the database', function () {
        vmAddFormationPanel.state.trainingsChosen = [
            {"id":3,"version":0,"name":"C"},
            {"id":4,"version":0,"name":"C++"}
        ];
        expect(vmShowFormation.showChevrons()).toBe(true);
    });

});

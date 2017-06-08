var vmAddSession = new Vue({
    template: '<div><add-session-panel></add-session-panel></div>',
    router: router,
    components: {
        'addSessionPanel': AddSessionPanel
    }
}).$mount();

var vmShowFormationPanel= new Vue({
    template: '<div><show-formation-panel></show-formation-panel></div>',
    router: router,
    components: {
        'showFormation': ShowFormation
    }
}).$mount();

beforeEach(function () {
    vmAddFormationPanel = new AddFormationPanel().$mount();
    vmShowFormation = vmShowFormationPanel.$children[0];
    vmAddSessionPanel = vmAddSession.$children[0];
    vmInputText = new InputText().$mount();
});

afterEach(function () {
    clearRequests();
    Object.assign(vmAddFormationPanel.$data, vmAddFormationPanel.$options.data());
});


describe('test registerTrainingTopic.js', function () {

    describe("Test customInput", function() {
        it('should check function updateValue', function() {
            vmInputText.updateValue('HELLO');
        });

        it('should check function handleFocus', function() {
            vmInputText.handleFocus();
        });

        it('should check function handleClick', function() {
            vmInputText.handleClick();
        });

        it('should check function handleBlur', function() {
            vmInputText.handleBlur();
        });
    });

    describe('vmAddFormationPanel', function () {
        let TRAINING = '{"id":1,"version":0,"name":"PROGRAMMATION"}';

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
            //(vmAddFormationPanel.selectOptionsOfTopic).toEqual([]);
            expect(vmAddFormationPanel.topicsChosen).toEqual([]);
            expect(vmAddFormationPanel.arrangeTrainings).toBeUndefined();
            expect(vmAddFormationPanel.allTrainingsOfATopicChosen).toEqual([]);
            expect(vmAddFormationPanel.state.trainingsChosen).toEqual([]);
            expect(vmAddFormationPanel.state.allTopicTraining).toEqual([]);
            expect(vmShowFormation.state.trainingsChosen).toEqual([]);
            expect(vmShowFormation.state.allTopicTraining).toEqual([]);
        });

        describe("Test customInput", function() {
            it('should check function updateV1', function() {
                vmAddFormationPanel.updateV1('HELLO');
                expect(vmAddFormationPanel.trainingTitle).toBe('HELLO');
            });
            it('should check function updateV2', function() {
                vmAddFormationPanel.updateV2('HELLO');
                expect(vmAddFormationPanel.numberHalfDays).toBe('HELLO');
            });
            it('should check function updateV3', function() {
                vmAddFormationPanel.updateV3('HELLO');
                expect(vmAddFormationPanel.topicDescription).toBe('HELLO');
            });
            it('should check function updateV4', function() {
                vmAddFormationPanel.updateV4('HELLO');
                expect(vmAddFormationPanel.newTopic).toBe('HELLO');
            });
        })

        //verifyTrainingField
        it('should check verify field Training', function () {
            vmAddFormationPanel.verifyTrainingField('Formation', 'trainingTitleRegexErrorMessage');
            expect(vmAddFormationPanel.isTrainingTitleValid).toBe(true);
            expect(vmAddFormationPanel.trainingTitleRegexErrorMessage).toBe('');
            vmAddFormationPanel.verifyTrainingField('/Formation', 'trainingTitleRegexErrorMessage');
            expect(vmAddFormationPanel.isTrainingTitleValid).toBe(false);
            expect(vmAddFormationPanel.trainingTitleRegexErrorMessage).toBe("Veuillez entrer un nom de formation valide (-.'_@:+#% autorisés)");
        });

        //verifyNewTopicField
        it('should check verify field new Topic', function () {
            vmAddFormationPanel.verifyNewTopicField('Java', 'newTopicRegexErrorMessage');
            expect(vmAddFormationPanel.isNewTopicValid).toBe(true);
            expect(vmAddFormationPanel.newTopicRegexErrorMessage).toBe('');
            vmAddFormationPanel.verifyNewTopicField('/Java', 'newTopicRegexErrorMessage');
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
            vmAddFormationPanel.numberHalfDays = 2;
        });

        it('should add a topic', function () {
            var sessionDescription = TRAINING;
            vmAddFormationPanel.newTopic = 'PROGRAMMATION';
            let resp = vmAddFormationPanel.verifyTrainingFormBeforeSubmit();
        });
        //removeDuplicates
        it('should check whether the function removeDuplicates can remove those duplicates', function () {
            var arrayWithDuplicates = [
                {"id": "1", "mame": "c"},
                {"id": "2", "mame": "java"},
                {"id": "3", "mame": "javascript"},
                {"id": "1", "mame": "c++"},
                {"id": "1", "mame": "c#"}
            ];

            var result = [{"id": "1", "mame": "c#"},
                {"id": "2", "mame": "java"},
                {"id": "3", "mame": "javascript"},];

            expect(training_store.removeDuplicates(arrayWithDuplicates, "id")).toEqual(result);
        });

        //TopicwithTraining
        it('should check whether the function TopicwithTraining can choose all the topics which have already got the trainings', function () {
            vmAddFormationPanel.state.allTrainings = [
                {
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
                    "trainingTitle": "FORMATION3",
                    "numberHalfDays": 3,
                    "topicDescription": {"id": 4, "version": 0, "name": "C++"}
                }
            ];

            var result = [
                {"id": 3, "version": 0, "name": "C"},
                {"id": 4, "version": 0, "name": "C++"}
            ];
            vmAddFormationPanel.trainingStore.topicwithTraining();
            expect(JSON.stringify(vmAddFormationPanel.state.trainingsChosen)).toEqual(JSON.stringify(result));
        });

        //reorganizeTrainings
        it('should check whether the function reorganizeTrainings can reorganize an array of trainings', function () {
            var arrayToTest = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var result = [
                [1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10]
            ];
            expect(vmAddFormationPanel.trainingStore.reorganizeTrainings(arrayToTest)).toEqual(result);
        });

        //chooseAllTrainingsOfATopic
        it('should check whether the function chooseAllTrainingsOfATopic can choose all the trainings attached to the topic chosen', function () {
            vmAddFormationPanel.state.allTrainings = [
                {
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
                    "trainingTitle": "FORMATION3",
                    "numberHalfDays": 3,
                    "topicDescription": {"id": 4, "version": 0, "name": "C++"}
                }
            ];
            var result = [
                {
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
            ];
            expect(vmAddFormationPanel.trainingStore.chooseAllTrainingsOfATopic("C")).toEqual(result);
        });

        //reorganizeAllTopicsAndTrainings
        it('should check whether the function reorganizeAllTopicsAndTrainings can reorganize all topics and trainings into an array', function () {
            vmAddFormationPanel.state.allTrainings = [
                {
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
                    "trainingTitle": "FORMATION3",
                    "numberHalfDays": 3,
                    "topicDescription": {"id": 4, "version": 0, "name": "C++"}
                }
            ];

            vmAddFormationPanel.state.trainingsChosen = [
                {"id": 3, "version": 0, "name": "C"},
                {"id": 4, "version": 0, "name": "C++"}
            ];

            var result = [
                [
                    [{
                        "id": 5,
                        "version": 0,
                        "trainingTitle": "FORMATION1",
                        "numberHalfDays": 1,
                        "topicDescription": {"id": 3, "version": 0, "name": "C"}
                    }, {
                        "id": 6,
                        "version": 0,
                        "trainingTitle": "FORMATION2",
                        "numberHalfDays": 2,
                        "topicDescription": {"id": 3, "version": 0, "name": "C"}
                    }]
                ],
                [
                    [{
                        "id": 7,
                        "version": 0,
                        "trainingTitle": "FORMATION3",
                        "numberHalfDays": 3,
                        "topicDescription": {"id": 4, "version": 0, "name": "C++"}
                    }]
                ]
            ];

            vmAddFormationPanel.trainingStore.reorganizeAllTopicsAndTrainings();
            expect(vmAddFormationPanel.state.allTopicTraining).toEqual(result);
        });
        it('should check if training is added into the database', function () {
            vmAddFormationPanel.trainingTitle = "FORMATION1";
            vmAddFormationPanel.numberHalfDays = 1;
            vmAddFormationPanel.topicDescription = "C";
            vmAddFormationPanel.verifyTrainingFormBeforeSubmit();
        });

        it('should check if variables are reset by Input trainingTopic', function () {
            vmAddFormationPanel.resetVarialbesByInputTrainingTitle();
            expect(vmAddFormationPanel.trainingTitleErrorMessage).toBe(false);
            expect(vmAddFormationPanel.confirmFormation).toBe(false);
            expect(vmAddFormationPanel.isNewTrainingTitle).toBe(true);
            expect(vmAddFormationPanel.newTopicErrorMessage).toBe(false);
        });

        it('should check if variables are reset by Input NumberHalfDays', function () {
            vmAddFormationPanel.resetVariablesByInputNumberHalfDays();
            expect(vmAddFormationPanel.numberHalfDaysErrorMessage).toBe(false);
            expect(vmAddFormationPanel.confirmFormation).toBe(false);
            expect(vmAddFormationPanel.isNewTrainingTitle).toBe(true);
            expect(vmAddFormationPanel.newTopicErrorMessage).toBe(false);
        });

        it('should check if variables are reset by Input Topic', function () {
            vmAddFormationPanel.resetVariablesByInputTopic();
            expect(vmAddFormationPanel.topicErrorMessage).toBe(false);
            expect(vmAddFormationPanel.confirmFormation).toBe(false);
            expect(vmAddFormationPanel.isNewTrainingTitle).toBe(true);
            expect(vmAddFormationPanel.newTopicErrorMessage).toBe(false);
        });

        it('should check if variables are reset by Input NameTopic', function () {
            vmAddFormationPanel.resetVariablesByInputNameTopic();
            expect(vmAddFormationPanel.newTopicErrorMessage).toBe(false);
            expect(vmAddFormationPanel.confirmTopic).toBe(false);
            expect(vmAddFormationPanel.isNewTopic).toBe(true);
            expect(vmAddFormationPanel.trainingTitleErrorMessage).toBe(false);
            expect(vmAddFormationPanel.numberHalfDaysErrorMessage).toBe(false);
            expect(vmAddFormationPanel.topicErrorMessage).toBe(false);
        });
    });

    describe('vmShowFormationPanel', function () {
        it('should delete topic and its trainings',function (){
            var topicToRemove = {id: "2", version: "0", name: "PROGRAMMATION"};
            vmShowFormation.removeTopic(topicToRemove);
        }),
            it('should delete training and its sessions',function (){
                var trainingToRemove = {"id": 3, "version": 0, "name": "C"};
                vmShowFormation.removeTraining(trainingToRemove);
            }),
        //showChevrons
        it('should check whether the chevrons can be hidden', function () {
            vmShowFormation.state.allTopicTraining = [];
            expect(vmShowFormation.showChevrons).toBe(false);
        });

        it('should check whether the chevrons can be showed when there is at least one training in the database', function () {
            vmShowFormation.state.allTopicTraining = [
                {"id": 3, "version": 0, "name": "C"},
                {"id": 4, "version": 0, "name": "C++"}
            ];
            expect(vmShowFormation.showChevrons).toBe(true);
        });
    });

    describe('vmShowFormation', function () {

        it('should check if the panel change from training panel to session panel when click on a training button', function (done) {
            vmShowFormation.state.allTrainings = [
                {
                    "id": 5,
                    "version": 0,
                    "trainingTitle": "FORMATION1",
                    "numberHalfDays": 1,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                }, {
                    "id": 6,
                    "version": 0,
                    "trainingTitle": "FORMATION2",
                    "numberHalfDays": 2,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                }
            ];
            vmShowFormation.state.allTopicTraining = [
                [
                    [{
                        "id": 5,
                        "version": 0,
                        "trainingTitle": "FORMATION1",
                        "numberHalfDays": 1,
                        "topicDescription": {"id": 3, "version": 0, "name": "C"}
                    }, {
                        "id": 6,
                        "version": 0,
                        "trainingTitle": "FORMATION2",
                        "numberHalfDays": 2,
                        "topicDescription": {"id": 3, "version": 0, "name": "C"}
                    }]
                ],
                [
                    [{
                        "id": 7,
                        "version": 0,
                        "trainingTitle": "FORMATION3",
                        "numberHalfDays": 3,
                        "topicDescription": {"id": 4, "version": 0, "name": "C++"}
                    }]
                ]
            ];
            var reponseFormation1 = [
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
                }
                ,
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
            //Click on FORMATION1 button (FORMATION1 got 2 sessions)
            vmShowFormation.createSession(vmAddFormationPanel.state.allTopicTraining[0][0][0].id);
            setTimeout(function () {
                expect(vmShowFormation.state.idTraining).toEqual(5);
                expect(vmShowFormation.state.trainingChosen).toEqual(vmAddFormationPanel.state.allTopicTraining[0][0][0]);
                expect(vmShowFormation.state.isNoSession).toBe(false);
                expect(vmShowFormation.state.listTrainingSession).toEqual(reponseFormation1);
                done();
            }, 0);
        });
    });

    /*describe('vmDatePicker', function () {

        it('Should check function handleFocus', function () {
            vmDatePicker.handleFocus();
        });

        it('Should check function handleBlur', function () {
            vmDatePicker.handleBlur();
        });

        it('should check update date filed ', function () {
            vmDatePicker.updateValue("01/06/2020");
        });

        it('Should check the initialization of variables of the event togglePanel() that allows to display the calendar', function () {
            vmDatePicker.togglePanel();
            expect(vmDatePicker.panelState).toBe(true);
            expect(vmDatePicker.rangeStart).toBe(false);
        });

        it('should check function isSelected', function () {
            let now = new Date();
            let d = now.getDate();
            let m = now.getMonth();
            let y = now.getFullYear();
            vmDatePicker.type = "year";
            vmDatePicker.item = y;
            vmDatePicker.range = false;
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.item).toEqual(y);
            expect(vmDatePicker.tmpYear).toEqual(y);
            vmDatePicker.range = true;
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.item).toEqual(y);
            expect(vmDatePicker.tmpEndYear).toEqual(y);
            vmDatePicker.type = "month";
            vmDatePicker.item = y;
            vmDatePicker.range = false;
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.item).toEqual(y);
            expect(vmDatePicker.tmpMonth).toEqual(5);
            expect(vmDatePicker.year).toEqual(y);
            expect(vmDatePicker.tmpYear).toEqual(y);
            vmDatePicker.range = true;
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.tmpYear).toEqual(y);
            expect(vmDatePicker.item).toEqual(y);
            expect(vmDatePicker.tmpStartYear).toEqual(y);
            expect(vmDatePicker.tmpStartMonth).toEqual(5);
            expect(vmDatePicker.tmpYear).toEqual(y);
            expect(vmDatePicker.item).toEqual(y);
            expect(vmDatePicker.tmpEndYear).toEqual(y);
            expect(vmDatePicker.tmpEndMonth).toEqual(5);
            vmDatePicker.type = "date";
            vmDatePicker.item = y;
            vmDatePicker.range = false;
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.date).toEqual(d);
            expect(vmDatePicker.month).toEqual(5);
            expect(vmDatePicker.tmpMonth).toEqual(5);
            vmDatePicker.type = "date";
            vmDatePicker.item = y;
            vmDatePicker.range = true;
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.tmpYear).toEqual(y);
            expect(vmDatePicker.tmpStartYear).toEqual(y);
            expect(vmDatePicker.tmpStartMonth).toEqual(5);
            expect(vmDatePicker.tmpStartDate).toEqual(d);
            expect(vmDatePicker.tmpYear).toEqual(y);
            expect(vmDatePicker.tmpEndYear).toEqual(y);
            expect(vmDatePicker.tmpEndMonth).toEqual(5);
            expect(vmDatePicker.tmpEndDate).toEqual(d);
        });

        it('Should check the selected component on the calendar', function () {
            vmDatePicker.chType('day')
            expect(vmDatePicker.panelType).toBe('day');
            vmDatePicker.chType('month');
            expect(vmDatePicker.panelType).toBe('month');
            vmDatePicker.chType('year');
            expect(vmDatePicker.panelType).toBe('year');
        });

        it('should check  range of date', function () {
            vmDatePicker.yearList = Array.from({length: 12}, (value, index) => new Date().getFullYear() + index);
            vmDatePicker.chYearRange(1);
            expect(vmDatePicker.yearList.map((i) => i + 2)).toEqual([ 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032 ]);

        });

        it('Should check function prevMonthPreview', function () {
            vmDatePicker.tmpMonth = 1;
            vmDatePicker.prevMonthPreview();
            expect(vmDatePicker.tmpMonth).toEqual(0);
            vmDatePicker.tmpMonth = 5;
            vmDatePicker.prevMonthPreview();
            expect(vmDatePicker.tmpMonth).toEqual(4);
        });

        it('Should check function nextMonthPreview', function () {
            vmDatePicker.tmpMonth = 1;
            vmDatePicker.nextMonthPreview();
            expect(vmDatePicker.tmpMonth).toEqual(2);
            vmDatePicker.tmpMonth = 5;
            vmDatePicker.nextMonthPreview();
            expect(vmDatePicker.tmpMonth).toEqual(6);
        });

        it('Should check function selectYear', function () {
            vmDatePicker.maxYear = 2018
            vmDatePicker.year = 2017;
            vmDatePicker.validateYear(vmDatePicker.year);
            vmDatePicker.selectYear(vmDatePicker.year);
            expect(vmDatePicker.tmpYear).toBe(vmDatePicker.year);
            expect(vmDatePicker.panelType).toBe('month');
        });

        it('Should check function selectMonth', function () {
            vmDatePicker.month = 5;
            vmDatePicker.selectMonth(vmDatePicker.month);
            vmDatePicker.validateMonth(vmDatePicker.month);
            expect(vmDatePicker.tmpMonth).toEqual(5);
            expect(vmDatePicker.panelType).toBe('date');
        });

        it('Should check function selectDate', function () {
            let now = new Date();
            let d = now.getDate();
            let m = now.getMonth();
            let y = now.getFullYear();
            vmDatePicker.selectDate(d);
            vmDatePicker.validateDate(d);
            vmDatePicker.range = false;
            expect(vmDatePicker.year).toEqual(y);
            expect(vmDatePicker.month).toEqual(5);
            expect(vmDatePicker.date).toEqual(d);
            expect(vmDatePicker.panelState).toBe(false);
        });

    });*/
});
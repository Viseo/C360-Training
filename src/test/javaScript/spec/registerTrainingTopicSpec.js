beforeEach(function () {
    vmAddFormationPanel = new AddFormationPanel().$mount();
    vmShowFormation = new ShowFormation().$mount();
    vmAddSessionPanel = new AddSessionPanel().$mount();
    vmDatePicker = new DatePicker().$mount();
});

afterEach(function () {
        vmAddFormationPanel.state.trainingsChosen=[];
        vmAddFormationPanel.state.allTopicTraining=[];
        vmAddFormationPanel.state.changePageToTraining=true;
        vmAddFormationPanel.state.changePageToSession=false;
        vmAddFormationPanel.state.idTraining='';
        vmAddFormationPanel.state.trainingChosen={};
        vmAddFormationPanel.state. allTrainings=[];
        vmAddFormationPanel.state.trainingTitle='';
        vmAddFormationPanel.state.arrangeTrainings=[];
        vmAddFormationPanel.state.allTrainingsOfATopicChosen=[];
        vmAddFormationPanel.state.listTrainingSession=[];
        vmAddFormationPanel.state.isNoSession=true;
        vmAddFormationPanel.state.idSession='';
        vmAddFormationPanel = undefined;
        vmShowFormation = undefined;
        vmAddFormationPanel = undefined;
        vmDatePicker = undefined;
});

describe('test registerTrainingTopic.js', function () {

    describe('vmAddSessionPanel', function () {

        it('should check if the panel change from session panel to training panel when click on a training button', function (done) {
            vmAddSessionPanel.ReturnToPageTraining();
            setTimeout(function () {
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
                var resultApiFormations = '[[[{"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},{"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}}]],[[{"id":7,"version":0,"trainingTitle":"FORMATION3","numberHalfDays":3,"topicDescription":{"id":4,"version":0,"name":"C++"}}]]]';
                expect(JSON.stringify(vmAddSessionPanel.state.allTopicTraining)).toEqual(resultApiFormations);
                done();
            }, 600);
        });

        it('should check if ending date is calculated when user choose beginning date', function () {
            vmAddSessionPanel.state.trainingChosen.numberHalfDays = '1';
            vmAddSessionPanel.beginningDate = '12/04/2017';
            vmAddSessionPanel.CalculateEndingDate();
            expect(vmAddSessionPanel.endingDate).toEqual('12/04/2017');
            vmAddSessionPanel.state.trainingChosen.numberHalfDays = '4';
            vmAddSessionPanel.beginningDate = '12/04/2017';
            vmAddSessionPanel.CalculateEndingDate();
            expect(vmAddSessionPanel.endingDate).toEqual('14/04/2017');
        });

        it('should check if selected session is display in the panel', function () {
            var dummyElement = document.createElement('div');
            dummyElement.setAttribute("id", "circle8");
            dummyElement.setAttribute("class", "circle");
            document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

            var sessionSelected = {
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
            };
            vmAddSessionPanel.showSession(sessionSelected);
            expect(vmAddSessionPanel.numberOfSessionSelected).toEqual(1);
            vmAddSessionPanel.showSession(sessionSelected);
            expect(vmAddSessionPanel.numberOfSessionSelected).toEqual(0);
        });

        it('should check if selected session to remove is deleted', function () {
            vmAddSessionPanel.listTrainingSessionSelected = [{
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
            }];
            vmAddSessionPanel.chooseSessionsToRemove();
            //expect(vmAddSessionPanel.listTrainingSessionSelected.length).toEqual(0);

        });

        it('should check if session is saved in Data Base', function (done) {
                vmAddSessionPanel.modifySessionButton = false;
                vmAddSessionPanel.state.trainingChosen = {
                    "id": 5,
                    "version": 0,
                    "trainingTitle": "FORMATION1",
                    "numberHalfDays": 1,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                };
                vmAddSessionPanel.state.trainingTitle = "FORMATION1";
                vmAddSessionPanel.beginningDate = "12/05/2017";
                vmAddSessionPanel.endingDate = "12/05/2017";
                vmAddSessionPanel.beginningTime = "09:00";
                vmAddSessionPanel.endingTime = "18:00";
                vmAddSessionPanel.location = "Salle Bora Bora";
                vmAddSessionPanel.VerifyFormBeforeSaveSession();
                setTimeout(function () {
                    expect(vmAddSessionPanel.isSessionAlreadyPlanned).toBe(false);
                    done();
                }, 600);
            }
        );

        it('should check whether we can modify a session', function (done) {
                vmAddSessionPanel.modifySessionButton = true;
                vmAddSessionPanel.state.idSession = 6;
                vmAddSessionPanel.state.trainingChosen = {
                    "id": 5,
                    "version": 0,
                    "trainingTitle": "FORMATION1",
                    "numberHalfDays": 1,
                    "topicDescription": {"id": 3, "version": 0, "name": "C"}
                };
                vmAddSessionPanel.state.trainingTitle = "FORMATION1";
                vmAddSessionPanel.beginningDate = "13/05/2017";
                vmAddSessionPanel.endingDate = "13/05/2017";
                vmAddSessionPanel.beginningTime = "09:00";
                vmAddSessionPanel.endingTime = "18:00";
                vmAddSessionPanel.location = "Salle Bora Bora";
                vmAddSessionPanel.VerifyFormBeforeSaveSession();
                setTimeout(function () {
                    expect(vmAddSessionPanel.isSessionAlreadyPlanned).toBe(false);
                    done();
                }, 600);
            }
        );

        it('should check if formation filed is true', function () {
                vmAddSessionPanel.isDisabledTrainingTitle = true;
                vmAddSessionPanel.activeFieldTrainingTitle();
                expect(vmAddSessionPanel.isDisabledTrainingTitle).toBe(false);
            }
        )
        it('should check if formation filed is false', function () {
                vmAddSessionPanel.isDisabledTrainingTitle = false;
                vmAddSessionPanel.activeFieldTrainingTitle();
                expect(vmAddSessionPanel.isDisabledTrainingTitle).toBe(true);
            }
        );

        it('should check training title is valid', function () {
                vmAddSessionPanel.verifyTrainingTitleInAddSession("formation", "errorMessage");
                expect(vmAddSessionPanel["errorMessage"]).toBe('');
                expect(vmAddSessionPanel.isTrainingTitleInAddSessionValid).toBe(true);
            }
        );

        it('should check training title is valid', function () {
                vmAddSessionPanel.verifyTrainingTitleInAddSession("formation", "errorMessage");
                expect(vmAddSessionPanel["errorMessage"]).toBe('');
                expect(vmAddSessionPanel.isTrainingTitleInAddSessionValid).toBe(true);
            }
        );

        it('should check training title is not valid', function () {
                vmAddSessionPanel.verifyTrainingTitleInAddSession("formation//", "errorMessage");
                expect(vmAddSessionPanel["errorMessage"]).toBe("Veuillez entrer un nom de formation valide (-.'_@:+#% autorisés)");
                expect(vmAddSessionPanel.isTrainingTitleInAddSessionValid).toBe(false);
            }
        );

        it('should check beginning date is valid', function () {
                vmAddSessionPanel.verifyBeginningDate("01/06/2020", "errorMessage");
                expect(vmAddSessionPanel["errorMessage"]).toBe('');
                expect(vmAddSessionPanel.isBeginningDateValid).toBe(true);
            }
        );

        it('should check beginning date has already passed', function () {
                vmAddSessionPanel.verifyBeginningDate("01/06/2015", "errorMessage");
                expect(vmAddSessionPanel["errorMessage"]).toBe('La date est déjà passée!');
                expect(vmAddSessionPanel.isBeginningDateValid).toBe(false);
                vmAddSessionPanel.verifyBeginningDate("01/03/2017", "errorMessage");
                expect(vmAddSessionPanel["errorMessage"]).toBe('La date est déjà passée!');
                expect(vmAddSessionPanel.isBeginningDateValid).toBe(false);
                vmAddSessionPanel.verifyBeginningDate("10/04/2017", "errorMessage");
                expect(vmAddSessionPanel["errorMessage"]).toBe('La date est déjà passée!');
                expect(vmAddSessionPanel.isBeginningDateValid).toBe(false);
            }
        );

        it('should check beginning date is not valid', function () {
                vmAddSessionPanel.verifyBeginningDate("02/", "errorMessage");
                expect(vmAddSessionPanel["errorMessage"]).toBe("Veuillez entrer une date valide (JJ / mm / AAAA)");
                expect(vmAddSessionPanel.isBeginningDateValid).toBe(false);
            }
        );

        it('should check update training topic filed ', function () {
                vmAddSessionPanel.updateV1("formation");
                expect(vmAddSessionPanel.trainingTitleInAddSession).toBe("formation");
            }
        );

        it('should check update beginning date filed ', function () {
                vmAddSessionPanel.updateV2("01/06/2020");
                expect(vmAddSessionPanel.beginningDate).toBe("01/06/2020");
                expect(vmAddSessionPanel.beginningDateForTest).toBe("01/06/2020");
            }
        );

        it('should check update location filed ', function () {
                vmAddSessionPanel.updateV3("salle de bali");
                expect(vmAddSessionPanel.location).toBe("salle de bali");
            }
        );

        it('should check update ending date filed ', function () {
                vmAddSessionPanel.updateV4("01/06/2020");
                expect(vmAddSessionPanel.endingDate).toBe("01/06/2020");
            }
        );

        it('should check whether we can use the button Supprimer ', function () {
                vmAddSessionPanel.numberOfSessionSelected = 1;
                expect(vmAddSessionPanel.CanNotUseButtonSupprimer()).toBe(false);
                vmAddSessionPanel.numberOfSessionSelected = 0;
                expect(vmAddSessionPanel.CanNotUseButtonSupprimer()).toBe(true);
            }
        );

        it('should check whether we can connect to the database in order to get all trainings', function () {
                vmAddSessionPanel.state.idTraining = 5;
                vmAddSessionPanel.gatherSessionsByTrainingFromDatabase();
            }
        );

        it('should check whether we can modify training topic', function () {
                vmAddSessionPanel.state.trainingTitle = "HELLO";
                vmAddSessionPanel.ModifyTrainingTopic();
            }
        );

        it('should check if variables are reset by Input Date', function () {
            vmAddSessionPanel.resetVarialbesByDate();
            expect(vmAddSessionPanel.confirmSession).toBe(false);
            expect(vmAddSessionPanel.trainingTitleInAddSessionErrorMessage).toBe(false);
            expect(vmAddSessionPanel.beginningDateErrorMessage).toBe(false);
            expect(vmAddSessionPanel.locationErrorMessage).toBe(false);
        });

        it('should check if variables are reset by Input Salle', function () {
            vmAddSessionPanel.resetVariablesBySalle();
            expect(vmAddSessionPanel.confirmSession).toBe(false);
            expect(vmAddSessionPanel.trainingTitleInAddSessionErrorMessage).toBe(false);
            expect(vmAddSessionPanel.beginningDateErrorMessage).toBe(false);
            expect(vmAddSessionPanel.locationErrorMessage).toBe(false);
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
            let resp = vmAddFormationPanel.saveTopicIntoDatabase();
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
        //showChevrons
        it('should check whether the chevrons can be hidden', function () {
            vmShowFormation.state.trainingsChosen = [];
            expect(vmShowFormation.showChevrons).toBe(false);
        });

        it('should check whether the chevrons can be showed when there is at least one training in the database', function () {
            vmShowFormation.state.trainingsChosen = [
                {"id": 3, "version": 0, "name": "C"},
                {"id": 4, "version": 0, "name": "C++"}
            ];
            expect(vmShowFormation.showChevrons).toBe(true);
        });
    });

    describe('vmShowFormation', function () {
        it('should check if the panel change from training panel to session panel when click on a training button', function () {
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
                expect(vmShowFormation.state.changePageToSession).toBe(true);
                expect(vmShowFormation.state.changePageToTraining).toBe(false);
                expect(vmShowFormation.state.idTraining).toEqual(5);
                expect(vmShowFormation.state.trainingChosen).toEqual(vmAddFormationPanel.state.allTopicTraining[0][0][0]);
                expect(vmShowFormation.state.isNoSession).toBe(false);
                expect(vmShowFormation.state.listTrainingSession).toEqual(reponseFormation1);
            }, 600);
        });
    });

    describe('vmDatePicker', function () {

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
            vmDatePicker.range = false
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.item).toEqual(y);
            expect(vmDatePicker.tmpMonth).toEqual(3);
            expect(vmDatePicker.year).toEqual(y);
            expect(vmDatePicker.tmpYear).toEqual(y);
            vmDatePicker.range = true;
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.tmpYear).toEqual(y);
            expect(vmDatePicker.item).toEqual(y);
            expect(vmDatePicker.tmpStartYear).toEqual(y);
            expect(vmDatePicker.tmpStartMonth).toEqual(3);
            expect(vmDatePicker.tmpYear).toEqual(y);
            expect(vmDatePicker.item).toEqual(y);
            expect(vmDatePicker.tmpEndYear).toEqual(y);
            expect(vmDatePicker.tmpEndMonth).toEqual(3);
            vmDatePicker.type = "date";
            vmDatePicker.item = y;
            vmDatePicker.range = false;
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.date).toEqual(d);
            expect(vmDatePicker.month).toEqual(3);
            expect(vmDatePicker.tmpMonth).toEqual(3);
            vmDatePicker.type = "date";
            vmDatePicker.item = y;
            vmDatePicker.range = true;
            vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
            expect(vmDatePicker.tmpYear).toEqual(y);
            expect(vmDatePicker.tmpStartYear).toEqual(y);
            expect(vmDatePicker.tmpStartMonth).toEqual(3);
            expect(vmDatePicker.tmpStartDate).toEqual(d);
            expect(vmDatePicker.tmpYear).toEqual(y);
            expect(vmDatePicker.tmpEndYear).toEqual(y);
            expect(vmDatePicker.tmpEndMonth).toEqual(3);
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
            vmDatePicker.month = 4;
            vmDatePicker.selectMonth(vmDatePicker.month);
            vmDatePicker.validateMonth(vmDatePicker.month);
            expect(vmDatePicker.tmpMonth).toEqual(3);
            expect(vmDatePicker.panelType).toBe('date');
        });

/*
        it('Should check  selectDate', function () {
            vmDatePicker.date.value = 25;
            vmDatePicker.previousMonth = 3;
            vmDatePicker.selectDate(25);
            vmDatePicker.validateDate(25);
            vmDatePicker.range = true;
            expect(vmDatePicker.year).toEqual(2017);
            expect(vmDatePicker.month).toEqual(3);
            expect(vmDatePicker.date).toEqual(25);
            expect(vmDatePicker.panelState).toBe(false);

            vmDatePicker.validateDate(vmDatePicker.date); // if (this.range && !this.rangeStart)
            vmDatePicker.range = false;
            vmDatePicker.rangeStart = false;
            expect(vmDatePicker.tmpEndYear).toEqual(2017);
            expect(vmDatePicker.tmpEndMonth).toEqual(3);
            expect(vmDatePicker.tmpEndDate).toEqual(25);
            expect(vmDatePicker.rangeStart).toBe(false);

            vmDatePicker.validateDate(vmDatePicker.date); //if (this.range && this.rangeStart)
            vmDatePicker.tmpEndYear = false;
            expect(vmDatePicker.tmpEndMonth).toEqual(3);
            expect(vmDatePicker.tmpEndDate).toBe(25);
            expect(vmDatePicker.tmpEndYear).toEqual(false);
            expect(vmDatePicker.tmpEndMonth).toEqual(3);
            expect(vmDatePicker.tmpEndDate).toEqual(25);
            expect(vmDatePicker.rangeStart).toBe(false);
            expect(vmDatePicker.panelState).toBe(false);
        });
*/

    });
});
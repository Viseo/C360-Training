/**
 * Created by SJO3662 on 07/06/2017.
 */
var vmAddSession = new Vue({
    template: '<div><add-session-panel></add-session-panel></div>',
    router: router,
    components: {
        'addSessionPanel': AddSessionPanel
    }
}).$mount();

describe('vmAddSessionPanel', function () {
    beforeEach(function () {
        vmAddSessionPanel = vmAddSession.$children[0];
        //vmDatePicker = new DatePicker().$mount();
        //vmInputText = new InputText().$mount();
    });

    afterEach(function () {
        /*vmAddFormationPanel.state.trainingsChosen=[];
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
         vmDatePicker = undefined;*/
        clearRequests();
        Object.assign(vmAddSessionPanel.$data, vmAddSessionPanel.$options.data());
    });

    it('should check if the panel change from session panel to training panel when click on a training button with success response of server', function (done) {
        var response = [
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
                "trainingTitle": "JAVA",
                "numberHalfDays": 3,
                "topicDescription": {"id": 4, "version": 0, "name": "C++"}
            }
        ];
        prepareRequest('GET', 'api/formations', 200, response);
        vmAddSessionPanel.returnToPageTraining();
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
            var resultApiFormations = '[[[{"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},{"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}}]],[[{"id":7,"version":0,"trainingTitle":"JAVA","numberHalfDays":3,"topicDescription":{"id":4,"version":0,"name":"C++"}}]]]';
            expect(JSON.stringify(vmAddSessionPanel.state.allTopicTraining)).toEqual(resultApiFormations);
            done();
        }, 0);
    });

    it('should check if the panel change from session panel to training panel when click on a training button with error response of server', function (done) {
        var response = [
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
                "trainingTitle": "JAVA",
                "numberHalfDays": 3,
                "topicDescription": {"id": 4, "version": 0, "name": "C++"}
            }
        ];
        prepareRequest('GET', 'api/formations', 500, response);
        vmAddSessionPanel.returnToPageTraining();
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
            var resultApiFormations = '[[[{"id":5,"version":0,"trainingTitle":"FORMATION1","numberHalfDays":1,"topicDescription":{"id":3,"version":0,"name":"C"}},{"id":6,"version":0,"trainingTitle":"FORMATION2","numberHalfDays":2,"topicDescription":{"id":3,"version":0,"name":"C"}}]],[[{"id":7,"version":0,"trainingTitle":"JAVA","numberHalfDays":3,"topicDescription":{"id":4,"version":0,"name":"C++"}}]]]';
            expect(JSON.stringify(vmAddSessionPanel.state.allTopicTraining)).toEqual(resultApiFormations);
            done();
        }, 0);
    });

    it('should check if ending date is calculated when user choose beginning date', function () {
        vmAddSessionPanel.state.trainingChosen.numberHalfDays = '1';
        vmAddSessionPanel.beginningDate = '12/04/2017';
        vmAddSessionPanel.calculateEndingDate();
        expect(vmAddSessionPanel.endingDate).toEqual('12/04/2017');
        vmAddSessionPanel.state.trainingChosen.numberHalfDays = '4';
        vmAddSessionPanel.beginningDate = '12/04/2017';
        vmAddSessionPanel.calculateEndingDate();
        expect(vmAddSessionPanel.endingDate).toEqual('13/04/2017');
        vmAddSessionPanel.beginningDate = 'x';
        vmAddSessionPanel.calculateEndingDate();
        expect(vmAddSessionPanel.endingDate).toEqual('');

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

    it('should check if selected session to remove is deleted', function (done) {
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
        setTimeout(function () {
            expect(vmAddSessionPanel.listTrainingSessionSelected.length).toEqual(0);
            expect(vmAddSessionPanel.confirmSupression).toBe(false);
            done();
        },1505)

    });

    it('should check if session is saved in Data Base with success response of server', function (done) {
        var response = {
            "id": 6,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "12/05/2017",
            "ending": "12/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        };
        prepareRequest('POST', 'api/sessions', 200, response);
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
        vmAddSessionPanel.verifyFormBeforeSaveSession();
        setTimeout(function () {
            expect(vmAddSessionPanel.isSessionAlreadyPlanned).toBe(false);
            expect(vmAddSessionPanel.confirmSupression).toBe(false);
            done();
        }, 1505);
    });

    it('should check if session is saved in Data Base with error response of server and the response have a message', function (done) {
        var response = {};
        response.message = "TrainingSession already planned";
        prepareRequest('POST', 'api/sessions', 500, response);
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
        vmAddSessionPanel.verifyFormBeforeSaveSession();
        setTimeout(function () {
            expect(vmAddSessionPanel.isSessionAlreadyPlanned).toBe(true);
            done();
        }, 0);

        setTimeout(function () {
            clearRequests();
            response.message = '';
            prepareRequest('POST', 'api/sessions', 500, response);
            vmAddSessionPanel.verifyFormBeforeSaveSession();
            done();
        }, 0);
    });

    it('should check if session is saved in Data Base with error response of server and the response have not a message', function (done) {
        var response = {};
        response.message = '';
        prepareRequest('POST', 'api/sessions', 500, response);
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
        vmAddSessionPanel.verifyFormBeforeSaveSession();
        setTimeout(function () {
            done();
        }, 0);
    });

    it('should check whether we can modify a session with success response of server', function (done) {
        var response = {
            "id": 6,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "13/05/2017",
            "ending": "13/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        };
        prepareRequest('PUT', 'api/sessions', 200, response);
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
        vmAddSessionPanel.verifyFormBeforeSaveSession();
        setTimeout(function () {
            expect(vmAddSessionPanel.isSessionAlreadyPlanned).toBe(false);
            done();
        }, 1505);
    });

    it('should check whether we can modify a session with error response of server and the response have a message', function (done) {
        var response = {};
        response.message = "TrainingSession already planned";
        prepareRequest('PUT', 'api/sessions', 500, response);
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
        vmAddSessionPanel.verifyFormBeforeSaveSession();
        setTimeout(function () {
            expect(vmAddSessionPanel.isSessionAlreadyPlanned).toBe(true);
            expect(vmAddSessionPanel.confirmModification).toBe(false);
            done();
        }, 0);
    });

    it('should check whether we can modify a session with error response of server and the response have not a message', function (done) {
        var response = {};
        response.message = '';
        prepareRequest('PUT', 'api/sessions', 500, response);
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
        vmAddSessionPanel.verifyFormBeforeSaveSession();
        setTimeout(function () {
            done();
        }, 0);
    });

    it('should check if formation filed is true', function () {
        vmAddSessionPanel.isDisabledTrainingTitle = true;
        vmAddSessionPanel.activeFieldTrainingTitle();
        expect(vmAddSessionPanel.isDisabledTrainingTitle).toBe(false);
    });

    it('should check if formation filed is false', function () {
        vmAddSessionPanel.isDisabledTrainingTitle = false;
        vmAddSessionPanel.activeFieldTrainingTitle();
        expect(vmAddSessionPanel.isDisabledTrainingTitle).toBe(true);
    });

    it('should check training title is valid', function () {
        vmAddSessionPanel.verifyTrainingTitleInAddSession("formation", "errorMessage");
        expect(vmAddSessionPanel["errorMessage"]).toBe('');
        expect(vmAddSessionPanel.isTrainingTitleInAddSessionValid).toBe(true);
    });

    it('should check training title is not valid', function () {
        vmAddSessionPanel.verifyTrainingTitleInAddSession("formation//", "errorMessage");
        expect(vmAddSessionPanel["errorMessage"]).toBe("Veuillez entrer un nom de formation valide (-.'_@:+#% autorisés)");
        expect(vmAddSessionPanel.isTrainingTitleInAddSessionValid).toBe(false);
    });

    it('should check beginning date is valid', function () {
        vmAddSessionPanel.verifyBeginningDate("01/06/2020", "errorMessage");
        expect(vmAddSessionPanel["errorMessage"]).toBe('');
        expect(vmAddSessionPanel.isBeginningDateValid).toBe(true);
    });

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
    });

    it('should check beginning date is not valid', function () {
        vmAddSessionPanel.verifyBeginningDate("02/", "errorMessage");
        expect(vmAddSessionPanel["errorMessage"]).toBe("Veuillez entrer une date valide (JJ / mm / AAAA)");
        expect(vmAddSessionPanel.isBeginningDateValid).toBe(false);
    });

    it('should check update training topic filed ', function () {
        vmAddSessionPanel.updateV1("formation");
        expect(vmAddSessionPanel.trainingTitleInAddSession).toBe("formation");
    });

    it('should check update beginning date filed ', function () {
        vmAddSessionPanel.updateV2("01/06/2020");
        expect(vmAddSessionPanel.beginningDate).toBe("01/06/2020");
        expect(vmAddSessionPanel.beginningDateForTest).toBe("01/06/2020");
    });

    it('should check update location filed ', function () {
        vmAddSessionPanel.updateV3("salle de bali");
        expect(vmAddSessionPanel.location).toBe("salle de bali");
    });

    it('should check update ending date filed ', function () {
        vmAddSessionPanel.updateV4("01/06/2020");
        expect(vmAddSessionPanel.endingDate).toBe("01/06/2020");
    });

    it('should check whether we can use the button Supprimer ', function () {
        vmAddSessionPanel.numberOfSessionSelected = 1;
        expect(vmAddSessionPanel.canNotUseButtonSupprimer()).toBe(false);
        vmAddSessionPanel.numberOfSessionSelected = 0;
        expect(vmAddSessionPanel.canNotUseButtonSupprimer()).toBe(true);
    });

    it('should check whether we can connect to the database in order to get all trainings is false with success response of server', function (done) {
        let response = [
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
        vmAddSessionPanel.state.idTraining = 5;
        vmAddSessionPanel.gatherSessionsByTrainingFromDatabase();
        setTimeout(() => {
            expect(vmAddSessionPanel.state.listTrainingSession).toEqual(response);
            expect(vmAddSessionPanel.state.isNoSession).toBe(false);
            done();
        }, 0);
    });

    it('should check whether we can connect to the database in order to get all trainings is true with success response of server', function (done) {
        let response = [];
        prepareRequest('GET', 'api/formations/5/sessions', 200, response);
        vmAddSessionPanel.state.idTraining = 5;
        vmAddSessionPanel.gatherSessionsByTrainingFromDatabase();
        setTimeout(() => {
            expect(vmAddSessionPanel.state.listTrainingSession).toEqual(response);
            expect(vmAddSessionPanel.state.isNoSession).toBe(true);
            done();
        }, 0);
    });

    it('should check whether we can connect to the database in order to get all trainings with error response of server', function (done) {
        let response = [];
        prepareRequest('GET', 'api/formations/5/sessions', 500, response);
        vmAddSessionPanel.state.idTraining = 5;
        vmAddSessionPanel.gatherSessionsByTrainingFromDatabase();
        setTimeout(() => {
            done();
        }, 0);
    });

    it('should check whether we can modify training topic', function (done) {
        var response = {
            "id": 5,
            "version": 0,
            "trainingTitle": "HELLO",
            "numberHalfDays": 1,
            "topicDescription": {"id": 3, "version": 0, "name": "C"}
        };
        prepareRequest('PUT', 'api/formations/HELLO/formationid/5', 200, response);
        vmAddSessionPanel.state.trainingTitle = "HELLO";
        vmAddSessionPanel.isDisabledTrainingTitle = false;
        vmAddSessionPanel.modifyTrainingTopic();
        expect(vmAddSessionPanel.confirmModification).toBe(true);
        setTimeout(function () {
            expect(vmAddSessionPanel.confirmModification).toBe(false);
            done();
        }, 1505);

    });

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

    it('should check collect all session with success response of server', function (done) {
        var response = [{
            "id": 6,
            "version": 0,
            "trainingDescription": {
                "id": 5,
                "version": 0,
                "trainingTitle": "FORMATION1",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "C"}
            },
            "beginning": "13/05/2017",
            "ending": "13/05/2017",
            "beginningTime": "09:00",
            "endingTime": "18:00",
            "location": "Salle Bora Bora"
        }];
        prepareRequest('GET', 'api/sessions', 200, response);
        vmAddSessionPanel.gatherAllSessions();
        setTimeout(function () {
            expect(vmAddSessionPanel.state.allSessions).toEqual(response);
            done();
        },0);
    });

    it('should check collect all session with error response of server', function (done) {
        var response = [];
        prepareRequest('GET', 'api/sessions', 500, response);
        vmAddSessionPanel.gatherAllSessions();
        setTimeout(function () {
            done();
        },0);
    });

});

var DatePickerPanel = new Vue({
    template: '<div><datepicker></datepicker></div>',
    router: router,
    components: {
        'DatePicker': DatePicker
    }
}).$mount();

describe('vmDatePicker', function () {
    beforeEach(function () {
        vmDatePicker = DatePickerPanel.$children[0];
    });

    afterEach(function () {
    });

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
        expect(vmDatePicker.tmpMonth).toEqual(6);
        expect(vmDatePicker.year).toEqual(y);
        expect(vmDatePicker.tmpYear).toEqual(y);
        vmDatePicker.range = true;
        vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
        expect(vmDatePicker.tmpYear).toEqual(y);
        expect(vmDatePicker.item).toEqual(y);
        expect(vmDatePicker.tmpStartYear).toEqual(y);
        expect(vmDatePicker.tmpStartMonth).toEqual(6);
        expect(vmDatePicker.tmpYear).toEqual(y);
        expect(vmDatePicker.item).toEqual(y);
        expect(vmDatePicker.tmpEndYear).toEqual(y);
        expect(vmDatePicker.tmpEndMonth).toEqual(6);
        vmDatePicker.type = "date";
        vmDatePicker.item = y;
        vmDatePicker.range = false;
        vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
        expect(vmDatePicker.date).toEqual(d);
        expect(vmDatePicker.month).toEqual(6);
        expect(vmDatePicker.tmpMonth).toEqual(6);
        vmDatePicker.type = "date";
        vmDatePicker.item = y;
        vmDatePicker.range = true;
        vmDatePicker.isSelected(vmDatePicker.type, vmDatePicker.item);
        expect(vmDatePicker.tmpYear).toEqual(y);
        expect(vmDatePicker.tmpStartYear).toEqual(y);
        expect(vmDatePicker.tmpStartMonth).toEqual(6);
        expect(vmDatePicker.tmpStartDate).toEqual(d);
        expect(vmDatePicker.tmpYear).toEqual(y);
        expect(vmDatePicker.tmpEndYear).toEqual(y);
        expect(vmDatePicker.tmpEndMonth).toEqual(6);
        expect(vmDatePicker.tmpEndDate).toEqual(d);
    });

    it('Should check the selected component on the calendar', function () {
        vmDatePicker.chType('day');
        expect(vmDatePicker.panelType).toBe('day');
        vmDatePicker.chType('month');
        expect(vmDatePicker.panelType).toBe('month');
        vmDatePicker.chType('year');
        expect(vmDatePicker.panelType).toBe('year');
    });

    it('should check range of date is true', function () {
        vmDatePicker.yearList = Array.from({length: 12}, (value, index) => new Date().getFullYear() + index);
        vmDatePicker.chYearRange(1);
        expect(vmDatePicker.yearList.map((i) => i + 2)).toEqual([ 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032 ]);

    });

    it('should check  range of date is false', function () {
        vmDatePicker.yearList = Array.from({length: 12}, (value, index) => new Date().getFullYear() + index);
        vmDatePicker.chYearRange(false);
        expect(vmDatePicker.yearList.map((i) => i - 2)).toEqual([ 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 ]);
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
        vmDatePicker.maxYear = 2018;
        vmDatePicker.year = 2017;
        vmDatePicker.selectYear(vmDatePicker.year);
        vmDatePicker.validateYear(vmDatePicker.year);
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

    it('Should check function selectDate', function (done) {
        let now = new Date();
        let d = now.getDate();
        let m = now.getMonth();
        let y = now.getFullYear();
        vmDatePicker.selectDate(d);
        setTimeout(function () {
            vmDatePicker.validateDate(d);
            vmDatePicker.range = false;
            expect(vmDatePicker.year).toEqual(y);
            expect(vmDatePicker.month).toEqual(5);
            expect(vmDatePicker.date).toEqual(d);
            //expect(vmDatePicker.panelState).toBe(false);
            done();
        },1);


    });

});
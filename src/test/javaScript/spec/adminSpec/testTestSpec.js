var vmShowFormationPanel= new Vue({
    template: '<div><show-formation-panel></show-formation-panel></div>',
    router: router,
    components: {
        'showFormation': ShowFormation
    }
}).$mount();

vmShowFormationPanel = vmShowFormationPanel.$children[0];

fdescribe('Test composant showFormation', function () {

    it("should check if trainings are displayed ", function(){
        var response = [
            {
                "id": 5,
                "version": 0,
                "trainingTitle": "SWIFT",
                "numberHalfDays": 1,
                "topicDescription": {"id": 3, "version": 0, "name": "MOBILE"}
            },
            {
                "id": 6,
                "version": 0,
                "trainingTitle": "JAVA",
                "numberHalfDays": 2,
                "topicDescription": {"id": 3, "version": 0, "name": "MOBILE"}
            },
            {
                "id": 7,
                "version": 0,
                "trainingTitle": "ANDROID",
                "numberHalfDays": 3,
                "topicDescription": {"id": 4, "version": 0, "name": "MOBILE"}
            }
        ];

        prepareRequest('GET','api/formations',404, null);
        vmShowFormationPanel.gatherTrainingsFromDatabase();
        console.log("TEST"+ vmShowFormationPanel.state.allTrainings);
        setTimeout(function () {
            expect(vmShowFormationPanel.state.allTrainings.length).toEqual(0);

        },0);
    });
});
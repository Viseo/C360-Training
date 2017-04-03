/**
 * Created by BBA3616 on 28/03/2017.
 */
describe('registerTraining test', function () {

   let vmNavigationMenu;

    beforeEach(function () {

        vmAddFormationPanel = new AddFormationPanel().$mount();
    });


    afterEach(function () {

    });

    it('should check variable initialization from add-formation-panel component', function () {


    });

    it('should check verify field Training', function () {
        vmAddFormationPanel.verifyTrainingField('Formation','trainingTitleRegexErrorMessage');
        expect(vmAddFormationPanel.isTrainingTitleValid).toBe(true);
        expect(vmAddFormationPanel.trainingTitleRegexErrorMessage).toBe('');
        vmAddFormationPanel.verifyTrainingField('/Formation','trainingTitleRegexErrorMessage');
        expect(vmAddFormationPanel.isTrainingTitleValid).toBe(false);
        expect(vmAddFormationPanel.trainingTitleRegexErrorMessage).toBe("Veuillez entrer un nom de formation valide (-.'_@:+#% autorisés)");
    });

    it('should check verify field new Topic', function () {
        vmAddFormationPanel.verifyNewTopicField('Java','newTopicRegexErrorMessage');
        expect(vmAddFormationPanel.isNewTopicValid).toBe(true);
        expect(vmAddFormationPanel.newTopicRegexErrorMessage).toBe('');
        vmAddFormationPanel.verifyNewTopicField('/Java','newTopicRegexErrorMessage');
        expect(vmAddFormationPanel.isNewTopicValid).toBe(false);
        expect(vmAddFormationPanel.newTopicRegexErrorMessage).toBe("Veuillez entrer un nom de thème valide (-.'_@:+#% autorisés)");
    });

    it('stest', function () {
        console.log(vmAddFormationPanel.selectOptionsOfTraining);
        });

});

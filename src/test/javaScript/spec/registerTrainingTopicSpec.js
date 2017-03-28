/**
 * Created by XME3612 on 28/03/2017.
 */

describe('test-show-formation', function () {

    let vm;

    beforeEach(function () {
        //vmAddFormation =  new AddFormationPanel().$mount();
        vmShowFormation = new ShowFormation().$mount();
    });

    afterEach(function () {

    });

    it('should check variable initialization from show-formation-panel component', function () {
        expect(vmShowFormation.state.trainingsChosen).not.toBeNull();
        expect(vmShowFormation.state.allTopicTraining).not.toBeNull();

    });

    it('should check whether the chevrons can be hidden', function () {
        expect(vmShowFormation.showChevrons()).toBe(false);
    });

    it('should check whether the chevrons can be showed when there is at least one training in the database', function () {

        vmShowFormation.showChevrons().toBe(true);
    });

});

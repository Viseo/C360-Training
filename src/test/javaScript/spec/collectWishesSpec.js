/**
 * Created by BBA3616 on 18/05/2017.
 */
describe('collect wishes panel test', function () {

    beforeEach(function () {
        vmCollectWishes = new collectWishes().$mount();

    });

    afterEach(function () {

    });

    it('should check if all wishes are gathered when administrator is in the wishes collected panel', function () {
        console.log(vmCollectWishes.allWishes);
        console.log(vmCollectWishes.disableSaveButton);
    });

    it('should check if wishes are updated when administrator click on the save button', function() {
        vmCollectWishes.updateWish();
    });

});


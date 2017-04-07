/**
 * Created by CLH3623 on 04/04/2017.
 */
describe('test main.js', function () {

    beforeEach(function () {
        vmHeader = new Header().$mount();
    });

    afterEach(function () {
    });

    it('should check variable initialization from header', function () {
        expect(vmHeader.disconnect).toBe(false);
        //console.log('text:'+vm.$el.textContent);
    });
});

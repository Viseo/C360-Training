/**
 * Created by SJO3662 on 20/06/2017.
 */

var newGlobalVueProfilToUpdate = new Vue({
    template: '<div><form-reset-password></form-reset-password></div>',
    router: router,
    components: {
        'resetPassword': resetPassword
    }
}).$mount();

//var vmResetPassword;

fdescribe('test registerCollaborator.js', function () {
    let args;

    beforeEach(function () {
        /*var response = [
            {status: "200"}
        ];
        prepareRequest('POST', 'api/sendtoken', 200, response);*/
        vmResetPassword = newGlobalVueProfilToUpdate.$children[0];
    });

    afterEach(function () {
        Object.assign(vmResetPassword.$data, vmResetPassword.$options.data());
        clearRequests();
    });

    it('it should verify if password is valide', function () {

    });
});
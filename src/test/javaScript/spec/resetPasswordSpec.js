/**
 * Created by SJO3662 on 20/06/2017.
 */

var newGlobalVueResetPassword;
var vmResetPassword;

describe('test resetPassword.js', function () {
    let args;

    beforeEach(function () {
        newGlobalVueResetPassword = new Vue({
            template: '<div><form-reset-password></form-reset-password></div>',
            router: router,
            components: {
                'resetPassword': resetPassword
            }
        }).$mount();

        vmResetPassword = newGlobalVueResetPassword.$children[0];
    });

    afterEach(function () {
        Object.assign(vmResetPassword.$data, vmResetPassword.$options.data());
        clearRequests();
    });

    it('it should verify if password with six character is valid', function (done) {
        vmResetPassword.password = '123456';
        setTimeout(function () {
            expect(vmResetPassword.errorMessagePassword).toEqual('');
            expect(vmResetPassword.isPasswordValid).toBe(true);
            done();
        }, 2);
    });

    it('it should verify if password without six character is not valid', function (done) {
        vmResetPassword.password = '123';
        setTimeout(function () {
            expect(vmResetPassword.errorMessagePassword).toEqual('Le mot de passe doit avoir au minimum 6 caractères');
            expect(vmResetPassword.isPasswordValid).toBe(false);
            done();
        }, 2);
    });

    it('it should verify if confirme password is equal of password', function (done) {
        vmResetPassword.password = '123456';
        vmResetPassword.confirmPassword = '123456';
        setTimeout(function () {
            expect(vmResetPassword.errorMessageConfirmPassword).toEqual('');
            expect(vmResetPassword.isConfirmPasswordValid).toBe(true);
            done();
        }, 2);
    });

    it('it should verify if confirme password is not equal of password', function (done) {
        vmResetPassword.password = '123456';
        vmResetPassword.confirmPassword = '13487';
        setTimeout(function () {
            expect(vmResetPassword.errorMessageConfirmPassword).toEqual('La confirmation du mot de passe n\'est pas valide');
            expect(vmResetPassword.isConfirmPasswordValid).toBe(false);
            done();
        }, 2);
    });

    it('it should check if fields form are not empty', function () {
        vmResetPassword.password = '123456';
        vmResetPassword.confirmPassword = '123456';
        vmResetPassword.verifyForm ();
        expect(vmResetPassword.passwordEmpty).toBe(false);
        expect(vmResetPassword.confirmPasswordEmpty).toBe(false);
        expect(vmResetPassword.isConfirmPasswordValid).toBe(true);
    });

    it('it should check if fields form are empty', function () {
        vmResetPassword.password = '';
        vmResetPassword.confirmPassword = '';
        vmResetPassword.verifyForm ();
        expect(vmResetPassword.passwordEmpty).toBe(true);
        expect(vmResetPassword.confirmPasswordEmpty).toBe(true);
        expect(vmResetPassword.isConfirmPasswordValid).toBe(true);
    });
});
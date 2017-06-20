/**
 * Created by SJO3662 on 19/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

/*var newGlobalVueProfilToUpdate = new Vue({
 template: '<div><profil-to-update></profil-to-update></div>',
 router: router,
 components: {
 'profilToUpdate': profilToUpdate
 }
 }).$mount();*/
var newGlobalVueProfilToUpdate;
var vmProfilToUpdate;

describe('profil to update test', function () {

    beforeEach(function () {

        newGlobalVueProfilToUpdate = new Vue({
            template: '<div><profil-to-update></profil-to-update></div>',
            router: router,
            components: {
                'profilToUpdate': profilToUpdate
            }
        }).$mount();

        let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
        /*document = {
         value_: '',

         get cookie() {
         return this.value_;
         },

         set cookie(value) {
         this.value_ += value + ';';
         }
         };*/
        document.cookie = "token=" + collaboratorToken;

        vmProfilToUpdate = newGlobalVueProfilToUpdate.$children[0];
    });

    afterEach(function () {
        Object.assign(vmProfilToUpdate.$data, vmProfilToUpdate.$options.data());
        clearRequests();
    });

    it('it should collect the information of le collaborator when the page profiltoupdate is loaded', function (done) {
        var collaboratorInformation = [{
            email: "eric.dupont@viseo.com",
            admin: false,
            businessUnit: null,
            firstName: "Eric",
            function: null,
            id: 1,
            isAdmin: false,
            lastName: "DUPONT",
            password: "123456",
            personnalIdNumber: "AAB1234",
            version: 0
        }];
        prepareRequest('GET', 'api/getcollaborator/1', 200, collaboratorInformation);
        vmProfilToUpdate.getInfoCollaborator();
        setTimeout(function () {
            expect(vmProfilToUpdate.infoCollab).toEqual(collaboratorInformation);
            expect(vmProfilToUpdate.firstName).toEqual(vmProfilToUpdate.infoCollab.firstName);
            expect(vmProfilToUpdate.lastName).toEqual(vmProfilToUpdate.infoCollab.lastName);
            expect(vmProfilToUpdate.email).toEqual(vmProfilToUpdate.infoCollab.email);
            expect(vmProfilToUpdate.fonction).toEqual(vmProfilToUpdate.infoCollab.fonction);
            expect(vmProfilToUpdate.businessUnit).toEqual(vmProfilToUpdate.infoCollab.businessUnit);
            done();
        }, 0);
    });

    it('it should check if the collaboraotr id from cookies is collected when the page profiltoupdate is loaded', function (done) {
        vmProfilToUpdate.initializeInformationsFromCookie();
        setTimeout(function () {
            expect(vmProfilToUpdate.collaborator_id).not.toBe('');
            done();
        }, 0);
    });

    it('it should verify if the first name is valid when collaborator is filling the first name field', function () {
        vmProfilToUpdate.verifyFirstName('Eric');
        expect(vmProfilToUpdate.isFirstNameValid).toBe(true);
        expect(vmProfilToUpdate.errorMessageFirstName).toBe('');

    });
    it('it should verify if the first name is not valid when collaborator is filling a wrong name in the first name field', function () {
        vmProfilToUpdate.verifyFirstName('Eric96');
        expect(vmProfilToUpdate.isFirstNameValid).toBe(false);
        expect(vmProfilToUpdate.errorMessageFirstName).toBe('Veuillez entrer un prénom valide');

    });

    it('it should verify if the last name is valid when collaborator is filling the last name field', function () {

        vmProfilToUpdate.verifyLastName('DUPONT');
            expect(vmProfilToUpdate.isLastNameValid).toBe(true);
            expect(vmProfilToUpdate.errorMessageLastName).toBe('');


        });
        it('it should verify if the last name is not valid when collaborator is filling a wrong name in the last name field', function () {
            vmProfilToUpdate.verifyLastName('DUPONT96');

            expect(vmProfilToUpdate.isLastNameValid).toBe(false);
            expect(vmProfilToUpdate.errorMessageLastName).toBe('Veuillez entrer un nom valide');

        });

        it('it should verify if email is valid when the collaborator is filling the email field', function () {
            vmProfilToUpdate.verifyEmail('eric@viseo.com');
            expect(vmProfilToUpdate.isEmailValid).toBe(true);
            expect(vmProfilToUpdate.errorMessageEmail).toBe('');

        });

        it('it should verify if email is nit valid when the collaborator is filling a wrong email in the email field', function () {
            vmProfilToUpdate.verifyEmail('eric@viseo');
            expect(vmProfilToUpdate.isEmailValid).toBe(false);
            expect(vmProfilToUpdate.errorMessageEmail).toBe('Veuillez entrer un email valide');

        });


        it('it should verify if the character number of old password is valid when collaborator is filling a 6 character password', function () {
            var password = '123456';
            vmProfilToUpdate.verifyOldPassword(password);
            expect(vmProfilToUpdate.errorMessageOldPassword).toBe('');
            expect(vmProfilToUpdate.isOldPasswordValid).toBe(true);
            expect(vmProfilToUpdate.isValidOldPassword).toBe(true);
            expect(vmProfilToUpdate.isNotValidOldPassword).toBe(false);
        });

        it('it should verify if the character number of old password is not valid when collaborator is filling a 4 character password', function () {
            var password = '1234';
            vmProfilToUpdate.verifyOldPassword(password);
            expect(vmProfilToUpdate.errorMessageOldPassword).toBe('Le mot de passe doit avoir au minimum 6 caractères');
            expect(vmProfilToUpdate.isOldPasswordValid).toBe(false);
            expect(vmProfilToUpdate.isValidOldPassword).toBe(false);
            expect(vmProfilToUpdate.isNotValidOldPassword).toBe(true);
        });

        it('it should verify number character password is valid', function () {
            var password = '123456';
            vmProfilToUpdate.verifyPassword(password);
            expect(vmProfilToUpdate.errorMessagePassword).toBe('');
            expect(vmProfilToUpdate.isPasswordValid).toBe(true);
            expect(vmProfilToUpdate.isValidPassword).toBe(true);
            expect(vmProfilToUpdate.isNotValidPassword).toBe(false);
        });

        it('it should verify number character password is not valid', function () {
            var password = '1234';
            vmProfilToUpdate.verifyPassword(password);
            expect(vmProfilToUpdate.errorMessagePassword).toBe('Le mot de passe doit avoir au minimum 6 caractères');
            expect(vmProfilToUpdate.isPasswordValid).toBe(false);
            expect(vmProfilToUpdate.isValidPassword).toBe(false);
            expect(vmProfilToUpdate.isNotValidPassword).toBe(true);
        });

        it('it should verify confirm password is valid', function () {
            vmProfilToUpdate.verifyConfirmPassword();
            expect(vmProfilToUpdate.errorMessageConfirmPassword).toBe('');
            expect(vmProfilToUpdate.isConfirmPasswordValid).toBe(true);
            expect(vmProfilToUpdate.isValidConfirmPassword).toBe(true);
            expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(false);
        });

        it('it should verify confirm password is not valid', function () {
            vmProfilToUpdate.newPassword = '123';
            vmProfilToUpdate.confirmPassword = '456';
            vmProfilToUpdate.verifyConfirmPassword();
            expect(vmProfilToUpdate.errorMessageConfirmPassword).toBe('La confirmation du mot de passe n\'est pas valide');
            expect(vmProfilToUpdate.isConfirmPasswordValid).toBe(false);
            expect(vmProfilToUpdate.isValidConfirmPassword).toBe(false);
            expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(true);
        });

        it('it should test if the first name is empty', function () {
            vmProfilToUpdate.isFirstNameEmpty();
            expect(vmProfilToUpdate.firstNameEmpty).toBe(true);
        });

        it('it should test if the last name is empty', function () {
            vmProfilToUpdate.isLastNameEmpty();
            expect(vmProfilToUpdate.lastNameEmpty).toBe(true);
        });

        it('it should test if the email is empty', function () {
            vmProfilToUpdate.isEmailEmpty();
            expect(vmProfilToUpdate.emailEmpty).toBe(true);
        });

        it('it should test if the old password is empty', function () {
            vmProfilToUpdate.isOldPasswordEmpty();
            expect(vmProfilToUpdate.oldPasswordEmpty).toBe(true);
            expect(vmProfilToUpdate.isValidOldPassword).toBe(false);
            expect(vmProfilToUpdate.isNotValidOldPassword).toBe(false);
        });

        it('it should test if the password is empty', function () {
            vmProfilToUpdate.isPasswordEmpty();
            expect(vmProfilToUpdate.passwordEmpty).toBe(true);
            expect(vmProfilToUpdate.isValidPassword).toBe(false);
            expect(vmProfilToUpdate.isNotValidPassword).toBe(false);
        });

        it('it should test if the confirm password is empty', function () {
            vmProfilToUpdate.isConfirmPasswordEmpty();
            expect(vmProfilToUpdate.confirmPasswordEmpty).toBe(true);
            expect(vmProfilToUpdate.isValidConfirmPassword).toBe(false);
            expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(true);
        });

        it('it should update collaborator password when collaborator changed his password and click on the save button', function (done) {
            var collaboratorInformation = [{
                email: "eric.dupont@viseo.com",
                admin: false,
                businessUnit: null,
                firstName: "Eric",
                function: null,
                id: 1,
                isAdmin: false,
                lastName: "DUPONT",
                password: "987654",
                personnalIdNumber: "AAB1234",
                version: 0
            }];
            vmProfilToUpdate.infoCollab.password = '123456';
            vmProfilToUpdate.newPassword = '987654';
            vmProfilToUpdate.confirmPassword = '987654';
            vmProfilToUpdate.password = '123456';
            vmProfilToUpdate.imageHasBeenChanged = true;
            prepareRequest('PUT', 'api/updatecollaborator', 200, collaboratorInformation);
            vmProfilToUpdate.updateCollaboratorInfo();
            vmProfilToUpdate.updateCollaboratorImage();
            console.log("vmProfilToUpdate.infoCollab.password : " + vmProfilToUpdate.infoCollab.password);
            setTimeout(function () {
                expect(vmProfilToUpdate.isRightOldPassword).toBe(true);
                expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
                expect(vmProfilToUpdate.passwordEmpty).toBe(false);
                expect(vmProfilToUpdate.infoCollab.password).toEqual(vmProfilToUpdate.newPassword);
                expect(vmProfilToUpdate.newPassword).toEqual('987654');
                expect(vmProfilToUpdate.imageHasBeenChanged).toBe(false);
                expect(vmProfilToUpdate.CollabToUpdate.defaultPicture).toBe(false);
                done();
            }, 0);
        });

        it('it should check if old and new password are different', function (done) {
            vmProfilToUpdate.infoCollab.password = '123456';
            vmProfilToUpdate.newPassword = '123456';
            vmProfilToUpdate.confirmPassword = '123456';
            vmProfilToUpdate.password = '123456';
            vmProfilToUpdate.updateCollaboratorInfo();

            setTimeout(function () {
                expect(vmProfilToUpdate.isRightOldPassword).toBe(false);

                done();
            }, 0);
        });

        it('it should not update collaborator password when collaborator' +
            ' write a wrong old password', function (done) {
            vmProfilToUpdate.newPassword = '987654';
            vmProfilToUpdate.confirmPassword = '987654';
            vmProfilToUpdate.password = '123459787887';
            vmProfilToUpdate.imageHasBeenChanged = true;
            vmProfilToUpdate.updateCollaboratorInfo();

            setTimeout(function () {
                expect(vmProfilToUpdate.isRightOldPassword).toBe(false);
                done();
            }, 0);
        });

        it('it should update collaborator information when collaborator changed his last name and function and click on save button', function (done) {
            var collaboratorInformation = [{
                email: "eric.dupont@viseo.com",
                admin: false,
                businessUnit: null,
                firstName: "Eric",
                function: null,
                id: 1,
                isAdmin: false,
                lastName: "DUPONT-BEN",
                password: "123456",
                personnalIdNumber: "AAB1234",
                version: 0
            }];
            vmProfilToUpdate.function = 'PDG';
            vmProfilToUpdate.lastName = 'DUPONT-BEN';
            vmProfilToUpdate.firstName = 'Eric';
            vmProfilToUpdate.email = 'eric.dupont@viseo.com';
            prepareRequest('PUT', 'api/updatecollaborator', 200, collaboratorInformation);
            vmProfilToUpdate.imageHasBeenChanged = true;
            vmProfilToUpdate.updateCollaboratorInfo();

            setTimeout(function () {
                expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
                expect(vmProfilToUpdate.passwordEmpty).toBe(false);
                expect(vmProfilToUpdate.confirmPasswordEmpty).toBe(false);
                expect(vmProfilToUpdate.isRightOldPassword).toBe(true);
                expect(vmProfilToUpdate.imageHasBeenChanged).toBe(false);
                done();
            }, 0);
        });

        it('it should the collaborator information empty pass false', function () {
            vmProfilToUpdate.setLastNameEmptyToFalse();
            vmProfilToUpdate.setFirstNameEmptyToFalse();
            vmProfilToUpdate.setEmailAlreadyExistToTrue();
            vmProfilToUpdate.setOldPasswordEmptyToFalse();
            vmProfilToUpdate.setPasswordEmptyToFalse();
            vmProfilToUpdate.setConfirmPasswordEmptyToFalse();
            vmProfilToUpdate.toggleShowPassword();

            expect(vmProfilToUpdate.lastNameEmpty).toBe(false);
            expect(vmProfilToUpdate.firstNameEmpty).toBe(false);
            expect(vmProfilToUpdate.emailEmpty).toBe(false);
            expect(vmProfilToUpdate.oldPasswordEmpty).toBe(false);
            expect(vmProfilToUpdate.passwordEmpty).toBe(false);
            expect(vmProfilToUpdate.confirmPasswordEmpty).toBe(false);
            expect(vmProfilToUpdate.showPass).toBe(true);
        });

        it('it should check if the collaborator profil picture has been changed when the collaborator choose a specific picture', function () {
            var modifyPictureElement = document.createElement('input');
            modifyPictureElement.setAttribute("id", "loadProfilImage");
            document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(modifyPictureElement);
            var currentImageElement = document.createElement('img');
            currentImageElement.setAttribute("id", "profilImageToChange");
            document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(currentImageElement);
            $('#loadprofilImage').trigger("change");
            vmProfilToUpdate.checkIfProfilImageHasBeenChanged("#loadProfilImage");
        });

        it('it should save update collaborator ', function (done) {
            var response = [];
            prepareRequest('PUT', 'api/updatecollaborator', 200, response);
            vmProfilToUpdate.CollabToUpdate = [{
                email: "eric.dupont@viseo.com",
                admin: false,
                businessUnit: null,
                firstName: "Eric",
                function: null,
                id: 1,
                isAdmin: false,
                lastName: "DUPONT-BEN",
                password: "123456",
                personnalIdNumber: "AAB1234",
                version: 0
            }];
            vmProfilToUpdate.saveUpdateCollaborator();
            setTimeout(function () {
                expect(vmProfilToUpdate.imageHasBeenChanged).toBe(false);
                done();
            })
        });

        it('should check if modify the lastName the watch start and verify syntax lastName', function (done) {
            vmProfilToUpdate.lastName = "DUPONT";
            setTimeout(function () {
                expect(vmProfilToUpdate.isLastNameValid).toBe(true);
                done();
            }, 0);
        });
    });
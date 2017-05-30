/**
 * Created by SJO3662 on 19/05/2017.
 */

describe('profil to update test', function () {
    beforeEach(function () {
        let collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
        document = {
            value_: '',

            get cookie() {
                return this.value_;
            },

            set cookie(value) {
                this.value_ += value + ';';
            }
        };
        document.cookie = "token="+ collaboratorToken;
        vmProfilToUpdate = new profilToUpdate().$mount();
        vmProfilToUpdate.collaborator_id = 1;

    });

    afterEach(function () {

    });

    it('it should collect the information of le collaborator', function (done){
        var collaboratorInformation = [{
            "email":"eric.dupont@viseo.com",
            "admin":false,
            "businessUnit":null,
            "firstName":"Eric",
            "function":null,
            "id":1,
            "isAdmin":false,
            "lastName":"DUPONT",
            "password":"123456",
            "personnalIdNumber":"AAB1234",
            "version":0
        }];

        setTimeout( function() {
            expect(vmProfilToUpdate.infoCollab).toEqual(collaboratorInformation);
            expect(vmProfilToUpdate.firstName).toEqual(vmProfilToUpdate.infoCollab.firstName);
            expect(vmProfilToUpdate.lastName).toEqual(vmProfilToUpdate.infoCollab.lastName);
            expect(vmProfilToUpdate.email).toEqual(vmProfilToUpdate.infoCollab.email);
            expect(vmProfilToUpdate.fonction).toEqual(vmProfilToUpdate.infoCollab.fonction);
            expect(vmProfilToUpdate.businessUnit).toEqual(vmProfilToUpdate.infoCollab.businessUnit);
            done();
        } ,0);
    });

    it('it should check cookies collect', function (){
        expect(vmProfilToUpdate.token).not.toBe('undefine');
        expect(vmProfilToUpdate.collaborator_id).not.toBe('');
    });

    it('it should verify first name is valide', function (){
        //vmProfilToUpdate.firstName = 'Eric';
        vmProfilToUpdate.verifyFirstName('Eric');
        expect(vmProfilToUpdate.isFirstNameValid).toBe(true);
        expect(vmProfilToUpdate.errorMessageFirstName).toBe('');

    });
    it('it should verify first name is not valide', function (){
        //vmProfilToUpdate.firstName = 'Eric96';
        vmProfilToUpdate.verifyFirstName('Eric96');
        expect(vmProfilToUpdate.isFirstNameValid).toBe(false);
        expect(vmProfilToUpdate.errorMessageFirstName).toBe('Veuillez entrer un prénom valide');

    });

    it('it should verify last name is valide', function (){

        vmProfilToUpdate.verifyLastName('DUPONT');
        expect(vmProfilToUpdate.isLastNameValid).toBe(true);
        expect(vmProfilToUpdate.errorMessageLastName).toBe('');

    });
    it('it should verify last name is not valide', function (){

        vmProfilToUpdate.verifyLastName('DUPONT96');
        expect(vmProfilToUpdate.isLastNameValid).toBe(false);
        expect(vmProfilToUpdate.errorMessageLastName).toBe('Veuillez entrer un nom valide');

    });

    it('it should verify email is valide', function (){

        vmProfilToUpdate.verifyEmail('eric@viseo.com');
        expect(vmProfilToUpdate.isEmailValid).toBe(true);
        expect(vmProfilToUpdate.errorMessageEmail).toBe('');

    });

    it('it should verify email is not valide', function (){

        vmProfilToUpdate.verifyEmail('eric@viseo');
        expect(vmProfilToUpdate.isEmailValid).toBe(false);
        expect(vmProfilToUpdate.errorMessageEmail).toBe('Veuillez entrer un email valide');

    });


    it('it should verify number character old password is valide', function (){
        var password = '123456';
        vmProfilToUpdate.verifyOldPassword(password);
        expect(vmProfilToUpdate.errorMessageOldPassword).toBe('');
        expect(vmProfilToUpdate.isOldPasswordValid).toBe(true);
        expect(vmProfilToUpdate.isValidOldPassword).toBe(true);
        expect(vmProfilToUpdate.isNotValidOldPassword).toBe(false);
    });

    it('it should verify number character old password is not valide', function (){
        var password = '1234';
        vmProfilToUpdate.verifyOldPassword(password);
        expect(vmProfilToUpdate.errorMessageOldPassword).toBe('Le mot de passe doit avoir au minimum 6 caractères');
        expect(vmProfilToUpdate.isOldPasswordValid).toBe(false);
        expect(vmProfilToUpdate.isValidOldPassword).toBe(false);
        expect(vmProfilToUpdate.isNotValidOldPassword).toBe(true);
    });

    it('it should verify number character password is valide', function (){
        var password = '123456';
        vmProfilToUpdate.verifyPassword(password);
        expect(vmProfilToUpdate.errorMessagePassword).toBe('');
        expect(vmProfilToUpdate.isPasswordValid).toBe(true);
        expect(vmProfilToUpdate.isValidPassword).toBe(true);
        expect(vmProfilToUpdate.isNotValidPassword).toBe(false);
    });

    it('it should verify number character password is not valide', function (){
        var password = '1234';
        vmProfilToUpdate.verifyPassword(password);
        expect(vmProfilToUpdate.errorMessagePassword).toBe('Le mot de passe doit avoir au minimum 6 caractères');
        expect(vmProfilToUpdate.isPasswordValid).toBe(false);
        expect(vmProfilToUpdate.isValidPassword).toBe(false);
        expect(vmProfilToUpdate.isNotValidPassword).toBe(true);
    });

    it('it should verify confirm password is valide', function (){
        vmProfilToUpdate.verifyConfirmPassword();
        expect(vmProfilToUpdate.errorMessageConfirmPassword).toBe('');
        expect(vmProfilToUpdate.isConfirmPasswordValid).toBe(true);
        expect(vmProfilToUpdate.isValidConfirmPassword).toBe(true);
        expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(false);
    });

    it('it should verify confirm password is not valide', function (){
        vmProfilToUpdate.newPassword = '123';
        vmProfilToUpdate.confirmPassword = '456';
        vmProfilToUpdate.verifyConfirmPassword();
        expect(vmProfilToUpdate.errorMessageConfirmPassword).toBe('La confirmation du mot de passe n\'est pas valide');
        expect(vmProfilToUpdate.isConfirmPasswordValid).toBe(false);
        expect(vmProfilToUpdate.isValidConfirmPassword).toBe(false);
        expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(true);
    });

    it('it should test if the first name is empty', function (){
        vmProfilToUpdate.isFirstNameEmpty();
        expect(vmProfilToUpdate.firstNameEmpty).toBe(true);
    });

    it('it should test if the last name is empty', function (){
        vmProfilToUpdate.isLastNameEmpty();
        expect(vmProfilToUpdate.lastNameEmpty).toBe(true);
    });

    it('it should test if the email is empty', function (){
        vmProfilToUpdate.isEmailEmpty();
        expect(vmProfilToUpdate.emailEmpty).toBe(true);
    });

    it('it should test if the old password is empty', function (){
        vmProfilToUpdate.isOldPasswordEmpty();
        expect(vmProfilToUpdate.oldPasswordEmpty).toBe(true);
        expect(vmProfilToUpdate.isValidOldPassword).toBe(false);
        expect(vmProfilToUpdate.isNotValidOldPassword).toBe(false);
    });

    it('it should test if the password is empty', function (){
        vmProfilToUpdate.isPasswordEmpty();
        expect(vmProfilToUpdate.passwordEmpty).toBe(true);
        expect(vmProfilToUpdate.isValidPassword).toBe(false);
        expect(vmProfilToUpdate.isNotValidPassword).toBe(false);
    });

    it('it should test if the confirm password is empty', function (){
        vmProfilToUpdate.isConfirmPasswordEmpty();
        expect(vmProfilToUpdate.confirmPasswordEmpty).toBe(true);
        expect(vmProfilToUpdate.isValidConfirmPassword).toBe(false);
        expect(vmProfilToUpdate.isNotValidConfirmPassword).toBe(true);
    });

    it('it should update collaborator information with password changed', function (done){
        vmProfilToUpdate.imageHasBeenChanged = true;
        vmProfilToUpdate.function = '';
        vmProfilToUpdate.lastName = 'DUPONT';
        vmProfilToUpdate.firstName = 'Eric';
        vmProfilToUpdate.email = 'eric.dupont@viseo.com';
        vmProfilToUpdate.oldPassword = '123456';
        vmProfilToUpdate.newPassword = '987654';
        vmProfilToUpdate.confirmPassword = '987654';
        vmProfilToUpdate.password = '123456';
        vmProfilToUpdate.infoCollab.password = '123456';
        vmProfilToUpdate.updateCollaboratorInfo();
        setTimeout(function () {
            expect(vmProfilToUpdate.imageHasBeenChanged).toBe(false);
            expect(vmProfilToUpdate.isRightOldPassword).toBe(true);
            done();
        },0);
    });

    it('it should update collaborator information', function (done){
        vmProfilToUpdate.imageHasBeenChanged = true;
        vmProfilToUpdate.function = '';
        vmProfilToUpdate.lastName = 'DUPONT';
        vmProfilToUpdate.firstName = 'Eric';
        vmProfilToUpdate.email = 'eric.dupont@viseo.com';
        vmProfilToUpdate.oldPassword = '';
        vmProfilToUpdate.newPassword = '';
        vmProfilToUpdate.confirmPassword = '';
        vmProfilToUpdate.password = '';
        vmProfilToUpdate.infoCollab.password = '123456';
        vmProfilToUpdate.updateCollaboratorInfo();
        setTimeout(function () {
            expect(vmProfilToUpdate.imageHasBeenChanged).toBe(false);
            expect(vmProfilToUpdate.isRightOldPassword).toBe(true);
            done();
        },0);
    });

    it('it should the collaborator information empty pass false', function (){
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

});
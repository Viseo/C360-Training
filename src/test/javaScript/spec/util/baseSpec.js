/**
 * Created by SJO3662 on 21/06/2017.
 */

describe('test base.js', function () {

    beforeEach(function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
    });

    afterEach(function () {});

    it('it should verify if the last name is valid', function () {
        this.verifyLastName('DUPONT');
        expect(this.errorMessageLastName).toEqual('');
        expect(this.isLastNameValid).toBe(true);
    });

    it('it should verify if the last name is not valid', function () {
        this.verifyLastName('DUPONT98');
        expect(this.errorMessageLastName).toEqual('Veuillez entrer un nom valide');
        expect(this.isLastNameValid).toBe(false);
    });

    it('it should verify if the token exist in cookies with informations of collaborator', function () {
        document.cookie = "token=" + collaboratorToken;
        var collaboratorInfo = this.getCollaboratorInfoFromCookie();

        expect(collaboratorInfo.id).not.toBe('');
        expect(collaboratorInfo.firstName).not.toBe('');
        expect(collaboratorInfo.lastName).not.toBe('');
        expect(collaboratorInfo.admin).toBe(false);
        document.cookie = "token=" + collaboratorToken + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    });

    it('it should verify if the token not exist in cookies', function () {
        document.cookie = "token=" + collaboratorToken + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        var collaboratorInfo = this.getCollaboratorInfoFromCookie();
        expect(collaboratorInfo).toBe('');
    });

    it('it should check if stayConnected is present in cookies', function () {
        document.cookie = "stayconnected=true";
        var stayConnected = this.getStayconnetedFromCookie();
        expect(stayConnected).toBe('true');
    });
});
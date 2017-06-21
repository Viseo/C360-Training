/**
 * Created by XME3612 on 10/04/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

const collaboratorToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTEhPVEUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.uDcPruAMKZKaKLcLEPytPx5YP2E1-mFiSAPI6Jv4OpY';
const adminToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJFcmljIiwibGFzdE5hbWUiOiJEVVBPTlQiLCJyb2xlcyI6dHJ1ZSwiaWQiOjF9.VHAgKw4FhDPAxTdW0O4XgvPW3cdCEdY9noPxTUNnm4U';
var newGlobalVueMain = new Vue({
    template: '<div><header-component></header-component></div>',
    router: router,
    components: {
        'blueHeader': Header
    }
}).$mount();

var headerComponent;


describe('Header test', function () {

    beforeEach(function () {

        headerComponent = newGlobalVueMain.$children[0];
    });

    afterEach(function () {
        Object.assign(headerComponent.$data, headerComponent.$options.data());
        clearRequests();

    });

    it('should check if the collaborator is connect and variables initialization from Header component with the token', function () {

        document.cookie = "token=" + collaboratorToken;
        document.cookie = "stayconnected=true";
        document.cookie = "timeConnected=2";
        headerComponent.getCookieInfos();

        expect(headerComponent.lastName).toBe('LHOTE');
        expect(headerComponent.firstName).toBe('Caroline');
        expect(headerComponent.token).toBe(collaboratorToken);
        expect(headerComponent.disconnect).toBe(false);
        expect(headerComponent.idleSecondsCounter).toBe(0);
        expect(headerComponent.myInterval).toBe('');
        expect(headerComponent.stayConnected).toBe(true);
        expect(headerComponent.dialog).toBe(false);
        expect(headerComponent.timeConnected).toBe(2);

        document.cookie = "token=" + collaboratorToken + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        document.cookie = "stayconnected=true" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        document.cookie = "timeConnected=2" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        document.cookie = "defaultPicture=" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";

    });

    it('should check if the admin is connect and variables initialization from Header component with the token', function () {

        headerComponent.token = "undefined";
        document.cookie = "token=" + adminToken;
        document.cookie = "stayconnected=true";
        document.cookie = "timeConnected=2";
        headerComponent.getCookieInfos();

        expect(headerComponent.lastName).toBe('DUPONT');
        expect(headerComponent.firstName).toBe('Eric');
        expect(headerComponent.token).toBe(adminToken);
        expect(headerComponent.disconnect).toBe(false);
        expect(headerComponent.idleSecondsCounter).toBe(0);
        expect(headerComponent.myInterval).toBe('');
        expect(headerComponent.stayConnected).toBe(true);
        expect(headerComponent.dialog).toBe(false);
        expect(headerComponent.timeConnected).toBe(2);

        document.cookie = "token=" + adminToken + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        document.cookie = "stayconnected=true" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        document.cookie = "timeConnected=2" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        document.cookie = "defaultPicture=" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
    });

    it('should check if the collaborator is not connect', function () {

        headerComponent.token = 'undefined';
        document.cookie = "token=" + collaboratorToken + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        document.cookie = "stayconnected=true" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        document.cookie = "timeConnected=2" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        document.cookie = "defaultPicture=" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
        headerComponent.getCookieInfos();

        expect(headerComponent.stayConnected).toBe(true);

    });


    it('should set an value to the variable idleSecondsCounter', function () {
        headerComponent.setIdleSecondsCounter(10);
        expect(headerComponent.idleSecondsCounter).toEqual(10);

    });

    it('should check whether the user disconnect', function (done) {
        document.cookie = "token=" + collaboratorToken;
        document.cookie = "stayconnected=true";
        document.cookie = "timeConnected=2";

        var response = [
            {userConnected: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTEhPVEUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.uDcPruAMKZKaKLcLEPytPx5YP2E1-mFiSAPI6Jv4OpY"}
        ];
        prepareRequest('POST', 'api/userdisconnect', 200, response);
        headerComponent.disconnectUser();
        setTimeout(function () {
            document.cookie = "token=" + collaboratorToken + "; expires=Thu, 18 Dec 2013 12:00:00 UTC";
            document.cookie = "stayconnected=true" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
            document.cookie = "timeConnected=2" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
            document.cookie = "defaultPicture=" +"; expires=Thu, 18 Dec 2013 12:00:00 UTC";
            done();
        }, 0)

    });

    it('should get the Cookie information', function () {
        expect(headerComponent.stayConnected).toBe(true);
    });

    it('should check if user inactive', function (done) {
        headerComponent.timeConnected = 2;
        headerComponent.stayConnected = false;
        headerComponent.checkIfUserInactive();
        setTimeout(function () {
            expect(headerComponent.timeConnected).not.toEqual(0);
            expect(headerComponent.dialog).toBe(true);
            done();
        }, 0);
    });

    it('should checkIdleTime', function (done) {
        var dummyElement = document.createElement('newVue');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);
        headerComponent.idleSecondsCounter = 180;
        headerComponent.checkIdleTime();
        setTimeout(function () {
            expect(headerComponent.dialog).toBe(true);
            done();
        }, 0);

    });

    it('should create by defaut picture without cookie with success response by server', function (done) {
        var response = {
            "email": "eric.dupont@viseo.com",
            "admin": false,
            "businessUnit": null,
            "firstName": "Eric",
            "function": null,
            "id": 1,
            "isAdmin": false,
            "lastName": "DUPONT",
            "password": "123456",
            "personnalIdNumber": "AAB1234",
            "version": 0,
            "defaultPicture": true
        };
        prepareRequest('GET', 'api/getcollaborator/1', 200, response);
        var mydate = new Date();
        document.cookie = "defaultPicture=;expires=" + mydate.toGMTString();
        headerComponent.collaboratorId = 1;
        headerComponent.createDefautPictureCookie();
        setTimeout(function () {
            expect(headerComponent.defaultPicture).toBe(true);
            done();
        }, 0);
    });

    it('should create by defaut picture without cookie with error response by server', function (done) {
        var mydate = new Date();
        document.cookie = "defaultPicture=;expires=" + mydate.toGMTString();
        var response = [];
        prepareRequest('GET', 'api/getcollaborator/1', 500, response);
        headerComponent.collaboratorId = 1;
        headerComponent.createDefautPictureCookie();
        setTimeout(function () {
            done();
        }, 0);
    });

    it('should check if default picture in the cookie is false', function (done) {
        document.cookie = "defaultPicture=false";

        headerComponent.collaboratorId = 1;
        headerComponent.createDefautPictureCookie();
        setTimeout(function () {
            expect(headerComponent.defaultPicture).toBe(false);
            done();
        }, 0);
    });

    it('should check if default picture in the cookie is true', function (done) {
        document.cookie = "defaultPicture=true";

        headerComponent.collaboratorId = 1;
        headerComponent.createDefautPictureCookie();
        setTimeout(function () {
            expect(headerComponent.defaultPicture).toBe(true);
            done();
        }, 0);
    });

    it('should check if token exist in database with success response by server', function (done) {
        var response = false ;
        prepareRequest('POST', 'api/sendtoken', 200, response);
        headerComponent.checkIfTokenExist();
        setTimeout(function () {
            expect(headerComponent.validateToken).toBe(response);
            done();
        }, 0);
    });

    it('should define if the user is connect', function () {
        headerComponent.setDisconnectedToFalse();
        expect(headerComponent.disconnect).toBe(false);
    });

    it('should define if the user is disconnect', function () {
        headerComponent.setDisconnectedToTrue();
        expect(headerComponent.disconnect).toBe(true);
    });

    it('should check if we are in application "Gestion des formations"', function () {
        headerComponent.title = "Gestion des formations";
        headerComponent.setTitle();

        expect(headerComponent.app.training).toBe(true);
        expect(headerComponent.app.skills).toBe(false);
        expect(headerComponent.app.mission).toBe(false);
        expect(headerComponent.app.leave).toBe(false);
    });
});

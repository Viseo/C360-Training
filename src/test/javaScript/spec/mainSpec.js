/**
 * Created by XME3612 on 10/04/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

const collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";

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

    it('should check variable initialization from Header component with the token', function (done) {
        setTimeout( function () {
            expect(headerComponent.lastName).toBe('Lhote');
            expect(headerComponent.firstName).toBe('Caroline');
            expect(headerComponent.token).toBe('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg');
            expect(headerComponent.disconnect).toBe(false);
            expect(headerComponent.idleSecondsCounter).toBe(0);
            expect(headerComponent.myInterval).toBe('');
            expect(headerComponent.stayConnected).toBe(true);
            expect(headerComponent.dialog).toBe(false);
            expect(headerComponent.timeConnected).toBe(0);
            done();
        },0);
    });

    it('should set an value to the variable idleSecondsCounter', function () {
        headerComponent.setIdleSecondsCounter(10);
        expect(headerComponent.idleSecondsCounter).toEqual(10);

    });

    it('should check whether the user disconnect', function () {
        headerComponent.token = collaboratorToken;
        headerComponent.disconnectUser();
    });

    it('should get the Cookie information', function () {
        /*document = {
            value_: '',

            get cookie() {
                return this.value_;
            },

            set cookie(value) {
                this.value_ += value + ';';
            }
        };
        document.cookie = "token="+ collaboratorToken;*/
        expect(headerComponent.stayConnected).toBe(true);
    });

    it('should checkIfUserInactive', function (done) {
       setTimeout( function () {
           headerComponent.timeConnected = 2;
           headerComponent.stayConnected = false;
           headerComponent.checkIfUserInactive();
           expect(headerComponent.timeConnected).not.toEqual(0);
           expect(headerComponent.dialog).toBe(true);
           done();
       },0);
    });

    it('should checkIdleTime', function (done) {
        setTimeout( function () {
            headerComponent.idleSecondsCounter = 60;
            headerComponent.checkIdleTime();
            done();
        },0);

    });

});

/**
 * Created by XME3612 on 10/04/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

Vue.http.interceptors.unshift((request, next) => {
    let route = routes.find((item) => {
        return (request.method === item.method && request.url === item.url);
    });
    if (!route) {
        // we're just going to return a 404 here, since we don't want our test suite making a real HTTP request
        next(request.respondWith({status: 404, statusText: 'Oh no! Not found!'}));
    }else {
        next(
            request.respondWith(
                route.response,
                {status: 200}
            )
        );
    }
});
const collaboratorToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";

//let vmHeader = new Header().$mount();
var vm = new Vue({
    template: '<div><blue-header></blue-header></div>',
    router: router,
    components: {
        'blueHeader': Header
    }
}).$mount();

describe('Header test', function () {

    beforeEach(function () {

    });

    afterEach(function () {

    });

    it('should check variable initialization from Header component', function () {
        let headerComponent = vm.$children[0];
        expect(headerComponent.lastName).toBe('');
        expect(headerComponent.firstName).toBe('');
        //expect(vm.$children[0].token).toBe('');
        expect(headerComponent.disconnect).toBe(false);
        expect(headerComponent.app).toEqual({training:true, skills:false, mission:false, leave:false});
        expect(headerComponent.IDLE_TIMEOUT).toBe(60);
        expect(headerComponent.idleSecondsCounter).toBe(0);
        expect(headerComponent.myInterval).toBe('');
        expect(headerComponent.stayConnected).toBe(true);
        expect(headerComponent.dialog).toBe(false);
        expect(headerComponent.timeConnected).toBe(0);
    });

    it('should set an value to the variable idleSecondsCounter', function () {
        let headerComponent = vm.$children[0];
        headerComponent.setIdleSecondsCounter(10);
        expect(headerComponent.idleSecondsCounter).toEqual(10);

    });

    it('should check whether the user disconnect', function () {
        let headerComponent = vm.$children[0];
        headerComponent.token = collaboratorToken;
        headerComponent.disconnectUser();
    });

    //to continue
    it('should get the Cookie information', function () {
        let headerComponent = vm.$children[0];
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

        headerComponent.getCookieInfos();
        expect(headerComponent.stayConnected).toBe(true);
    });

    it('should checkIfUserInactive', function () {
        let headerComponent = vm.$children[0];
        headerComponent.stayConnected = false;
        headerComponent.checkIfUserInactive();
    });


    it('should checkIdleTime', function () {
        let headerComponent = vm.$children[0];
        headerComponent.checkIdleTime();
    });


});

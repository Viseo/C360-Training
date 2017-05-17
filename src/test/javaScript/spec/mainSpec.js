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
    template: '<div><header-component></header-component></div>',
    router: router,
    components: {
        'blueHeader': Header
    }
}).$mount();

describe('Header test', function () {

    beforeEach(function () {
        headerComponent = vm.$children[0];
    });

    afterEach(function () {

    });

    it('should check variable initialization from Header component', function () {
        setTimeout( function () {
            expect(headerComponent.lastName).toBe('');
            expect(headerComponent.firstName).toBe('');
            expect(vm.$children[0].token).toBe('');
            expect(headerComponent.disconnect).toBe(false);
            expect(headerComponent.app).toEqual({training:true, skills:false, mission:false, leave:false});
            expect(headerComponent.IDLE_TIMEOUT).toBe(60);
            expect(headerComponent.idleSecondsCounter).toBe(0);
            expect(headerComponent.myInterval).toBe('');
            expect(headerComponent.stayConnected).toBe(true);
            expect(headerComponent.dialog).toBe(false);
            expect(headerComponent.timeConnected).toBe(0);
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
        expect(headerComponent.stayConnected).toBe(true);
    });

    it('should checkIfUserInactive', function () {
       setTimeout( function () {
           headerComponent.timeConnected = 2;
           headerComponent.stayConnected = false;
           headerComponent.checkIfUserInactive();
           expect(headerComponent.timeConnected).not.toEqual(0);
           expect(headerComponent.dialog).toBe(true);
           //expect(headerComponent.idleSecondsCounter).toEqual(0);
       },0);
    });

    it('should checkIdleTime', function () {
        setTimeout( function () {
        headerComponent.idleSecondsCounter = 60;
        headerComponent.checkIdleTime();
        },0);

    });
    it('should check hrefSkills', function () {
        headerComponent.hrefSkills();
    });
    it('should check hrefTrainings', function () {
        headerComponent.hrefTrainings();
    })


});

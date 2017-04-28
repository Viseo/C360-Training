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
        expect(vm.$children[0].lastName).toBe('');
        expect(vm.$children[0].firstName).toBe('');
        //expect(vm.$children[0].token).toBe('');
        expect(vm.$children[0].disconnect).toBe(false);
        expect(vm.$children[0].app).toEqual({training:true, skills:false, mission:false, leave:false});
        expect(vm.$children[0].IDLE_TIMEOUT).toBe(20);
        expect(vm.$children[0].idleSecondsCounter).toBe(0);
        expect(vm.$children[0].myInterval).toBe('');
        expect(vm.$children[0].stayConnected).toBe(true);
        expect(vm.$children[0].dialog).toBe(false);
        expect(vm.$children[0].timeconnected).toBe(0);
    });

    it('should set an value to the variable idleSecondsCounter', function () {
        vm.$children[0].setIdleSecondsCounter(10);
        expect(vm.$children[0].idleSecondsCounter).toEqual(10);

    });

    it('should check whether the user disconnect', function () {
        vm.$children[0].token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
        vm.$children[0].disconnectUser();
    });

    //to continue
    it('should get the Cookie information', function () {
        var document = {
            value_: '',

            get cookie() {
                return this.value_;
            },

            set cookie(value) {
                this.value_ += value + ';';
            }
        };
        document.cookie = "token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg; stayconnected=true";
        vm.$children[0].getCookieInfos();
        expect(vm.$children[0].stayConnected).toBe(true);
    });

    it('should checkIfUserInactive', function () {
        vm.$children[0].stayConnected = false;
        vm.$children[0].checkIfUserInactive();
    });


    it('should checkIdleTime', function () {
        vm.$children[0].checkIdleTime();
    });


});

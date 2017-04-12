/**
 * Created by XME3612 on 10/04/2017.
 */
Vue.use(VueResource);

Vue.http.interceptors.unshift((request, next) => {
    let route = routes.find((item) => {
        return (request.method === item.method && request.url === item.url);
    });
    if (!route) {
        // we're just going to return a 404 here, since we don't want our test suite making a real HTTP request
        next(request.respondWith({status: 404, statusText: 'Oh no! Not found!'}));
    } else {

        //  getRoute(route,args);
        // console.log(route.response);
        next(
            // getRoute(route, args),
            // console.log(route.response),
            request.respondWith(
                route.response,
                {status: 200}
            )
        );
    }
});


describe('Header test', function () {

    beforeEach(function () {
        vmHeader = new Header().$mount();
    });

    afterEach(function () {

    });

    it('should check variable initialization from Header component', function () {
        expect(vmHeader.nom).toBe('');
        expect(vmHeader.prenom).toBe('');
        expect(vmHeader.token).toBe('');
        expect(vmHeader.disconnect).toBe(false);
        expect(vmHeader.app).toEqual({training:true, skills:false, mission:false, leave:false});
        expect(vmHeader.IDLE_TIMEOUT).toBe(20);
        expect(vmHeader.idleSecondsCounter).toBe(0);
        expect(vmHeader.myInterval).toBe('');
        expect(vmHeader.test).toBe(50);
        expect(vmHeader.stayConnected).toBe(true);
        expect(vmHeader.dialog).toBe(false);
        expect(vmHeader.timeconnected).toBe(0);
    });

    it('should set an value to the variable idleSecondsCounter', function (done) {
        vmHeader.setIdleSecondsCounter(10);
        done();
        expect(vmHeader.idleSecondsCounter).toEqual(10);

    });

    it('should check whether the user disconnect', function (done) {
        vmHeader.token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";
        vmHeader.disconnectUser();
        done();
    });

    //to continue
    it('should get the Cookie information', function (done) {
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
        vmHeader.getCookieInfos();
        done();
        expect(vmHeader.stayConnected).toBe(true);
    });

    it('should checkIfUserInactive', function (done) {
        vmHeader.stayConnected = false;
        vmHeader.checkIfUserInactive();
        done();
    });


    it('should checkIdleTime', function (done) {
        vmHeader.checkIdleTime();
        done();
    });



});

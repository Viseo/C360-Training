/**
 * Created by NBE3663 on 11/05/2017.
 */

Vue.http.interceptors.unshift((request, next) => {
    let route = routes.find((item) => {
        return (request.method === item.method && request.url === item.url);
    });
    if (!route) {
        // we're just going to return a 404 here, since we don't want our test suite making a real HTTP request
        next(request.respondWith({status: 404, statusText: 'Oh no! Not found!'}));
    } else {
        next(
            request.respondWith(
                route.response,
                {status: 200}
            )
        );
    }
});


describe('state Request training test', function () {

    beforeEach(function() {
        vmStateRequestTraining = new stateRequest().$mount();
        vmStateRequestTraining.collaboratorIdentity.id = 6;

    });

    afterEach(function() {

    });

    it('it should check cookies!!! ', function() {
        expect (vmStateRequestTraining.token).not.toBe('undefined');
        expect (vmStateRequestTraining.collaboratorIdentity.id).not.toBe('');
        expect (vmStateRequestTraining.collaboratorIdentity.lastName).not.toBe('');
        expect (vmStateRequestTraining.collaboratorIdentity.firstName).not.toBe('');

    });

    it('it should check if sessions are in the right order ', function() {
        var vmsessionsValidated = [{
            "begining": '29 Mai 2017'
        }];

        var vmsessionsPending = [{
            "begining": '15 Mai 2017'
        }];
        vmStateRequestTraining.sessionsValidated = vmsessionsValidated;
        vmStateRequestTraining.sessionsPending = vmsessionsPending;
        vmStateRequestTraining.orderSessions();
    });

    it('it should check if trainings titles and session are fetched and if the validated sessions are checked ', function(done) {
        vmStateRequestTraining.fetchTrainingsSessions();
        let vmRequestedTraining =vmStateRequestTraining.requestedTraining;

        setTimeout(function () {

            expect (Object.keys(vmRequestedTraining)[0].requestTrainingList)
                ||
                ( Object.keys(vmRequestedTraining)[0].trainingSessions ).toBe(true);
            done();
        }, 0);

    });
});




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


fdescribe('state Request training test', function () {

    beforeEach(function() {
        vmStateRequestTraining = new stateRequest().$mount();
        vmStateRequestTraining.collaboratorIdentity.id = 6;

    });

    afterEach(function() {

    });

    it('it should check if the date is in the right forme ', function() {
        vmStateRequestTraining.getDate();



    })
    it('it should check cookies!!! ', function() {

    })
    it('it should check if sessions are in the right order ', function() {
        vmStateRequestTraining.orderSessions();
        var vmsessionsValidated = vmStateRequestTraining.sessionsValidated;
        var vmsessionsPending = vmStateRequestTraining.sessionsPending;
        vmsessionsValidated =[{
            "begining": '29 Mai 2017'
         }];
        vmsessionsPending =[{
            "begining": '15 Mai 2017'
        }];



    })
    it('it should check if trainings titles and session are fetched and if the validated sessions are checked ', function(done) {
        vmStateRequestTraining.fetchTrainingsSessions();
        let vmRequestedTraining =vmStateRequestTraining.requestedTraining;

        setTimeout(function () {

            expect (Object.keys(vmRequestedTraining)[0].requestTrainingList)
                ||
                ( Object.keys(vmRequestedTraining)[0].trainingSessions ).toBe(true);
            done();
        }, 0);


    })



});




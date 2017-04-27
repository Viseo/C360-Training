/**
 * Created by NBE3663 on 18/04/2017.
 */
Vue.use(VueResource);

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

describe('assign collaborator test', function () {

    beforeEach(function () {
        vmAssignCollaborator = new assignCollaborator().$mount();
    });

    afterEach(function () {

    });

    it('should check if all available sessions are in the drop-down ', function () {

    });

    it('should check if fields are greys when there are no sessions selected ', function () {

    });

    it('should check if fields are not greys when sessions are selected ', function () {

    });

    it('should check if collaborators are displayed when checkbox is checked ', function () {

    });
    it('should check if counter is increased when collaborators has been added', function () {

    });

    it('should check if collaborators are moved from left list to right list ', function () {

    });
    it('should check if collaborators are moved from right list to left list ', function () {

    });
    it('should check if error message is displayed when there are  type error in search field ', function () {

    });
    it('should check if there is no result when collaborator does not exist ', function () {

    });
    it('should check if there are few results when collaborators exists ', function () {

    });
    it('should check if confirmation message appear and fields are greys when collaborators are saved ', function () {
       vmAssignCollaborator.saveCollabInSessions();

    });


});
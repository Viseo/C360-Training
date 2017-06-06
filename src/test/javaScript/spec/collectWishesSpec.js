/**
 * Created by BBA3616 on 18/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

var newGlobalVue = new Vue({
    template: '<div><collect-wishes></collect-wishes></div>',
    router: router,
    components: {
        'collectWishes': collectWishes
    }
}).$mount();

var vmCollectWishes;

describe('collect wishes panel test', function () {

    beforeEach(function () {
        vmCollectWishes = newGlobalVue.$children[0];
    });

    afterEach(function () {
        Object.assign(vmCollectWishes.$data, vmCollectWishes.$options.data());
        clearRequests();
    });

    it('should check if all wishes are gathered when administrator load the collect wishes panel', function (done) {
        var response = [
            {
                "id": 2,
                "version": 5,
                "label": "SSC",
                "collaborator": {
                    "id": 1,
                    "version": 0,
                    "personnalIdNumber": "AAA1234",
                    "lastName": "nckjzn",
                    "firstName": "ncdxkzn",
                    "email": "xiangzhe.meng@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "vote_ok": [{
                    "id": 1,
                    "version": 0,
                    "personnalIdNumber": "AAA1234",
                    "lastName": "nckjzn",
                    "firstName": "ncdxkzn",
                    "email": "xiangzhe.meng@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                }],
                "vote_ko": [],
                "checked": false
            },
            {
                "id": 3,
                "version": 4,
                "label": "SSCAAS",
                "collaborator": {
                    "id": 1,
                    "version": 0,
                    "personnalIdNumber": "AAA1234",
                    "lastName": "nckjzn",
                    "firstName": "ncdxkzn",
                    "email": "xiangzhe.meng@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                },
                "vote_ok": [{
                    "id": 1,
                    "version": 0,
                    "personnalIdNumber": "AAA1234",
                    "lastName": "nckjzn",
                    "firstName": "ncdxkzn",
                    "email": "xiangzhe.meng@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                }],
                "vote_ko": [],
                "checked": false
            }
        ];
        prepareRequest('GET', 'api/allwishes', 200, response);
        vmCollectWishes.getAllWishes();
        setTimeout(function () {
            let AllWishesInDatabase =
                [{"id":3,"version":4,"label":"SSCAAS","collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},"vote_ok":[{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}],"vote_ko":[],"checked":false},{"id":2,"version":5,"label":"SSC","collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},"vote_ok":[{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}],"vote_ko":[],"checked":false}];
            expect(JSON.stringify(vmCollectWishes.allWishes)).toEqual(JSON.stringify(AllWishesInDatabase));
            expect(vmCollectWishes.disableSaveButton).toBe(true);
            done();
        }, 0);
    });

    it('should check if wishes are updated when administrator click on the save button', function (done) {
        vmCollectWishes.listWishesToUpdate =
            [
                {
                    "id": 98,
                    "version": 0,
                    "label": "JAVASCRIPT",
                    "collaborator": {
                        "id": 8,
                        "version": 0,
                        "personnalIdNumber": "POP1234",
                        "lastName": "Batista",
                        "firstName": "Benjamin",
                        "email": "benjamin.batista@viseo.com",
                        "password": "bibimbaps",
                        "isAdmin": false
                    },
                    "vote_ok": [],
                    "vote_ko": [],
                    "checked": true
                },
                {
                    "id": 93,
                    "version": 4,
                    "label": "PHP",
                    "collaborator": {
                        "id": 8,
                        "version": 0,
                        "personnalIdNumber": "POP1234",
                        "lastName": "Batista",
                        "firstName": "Benjamin",
                        "email": "benjamin.batista@viseo.com",
                        "password": "bibimbaps",
                        "isAdmin": false
                    },
                    "vote_ok": [],
                    "vote_ko": [],
                    "checked": false
                }
            ];
        response = [
            {
                "id": 98,
                "version": 0,
                "label": "JAVASCRIPT",
                "collaborator": {
                    "id": 8,
                    "version": 0,
                    "personnalIdNumber": "POP1234",
                    "lastName": "Batista",
                    "firstName": "Benjamin",
                    "email": "benjamin.batista@viseo.com",
                    "password": "bibimbaps",
                    "isAdmin": false
                },
                "vote_ok": [],
                "vote_ko": [],
                "checked": true
            },
            {
                "id": 93,
                "version": 4,
                "label": "PHP",
                "collaborator": {
                    "id": 8,
                    "version": 0,
                    "personnalIdNumber": "POP1234",
                    "lastName": "Batista",
                    "firstName": "Benjamin",
                    "email": "benjamin.batista@viseo.com",
                    "password": "bibimbaps",
                    "isAdmin": false
                },
                "vote_ok": [],
                "vote_ko": [],
                "checked": false
            }
        ];
        prepareRequest('POST', 'api/ischeckedwishestoupdate', 200, response);
        vmCollectWishes.updateWish();

        setTimeout(function () {
            expect(vmCollectWishes.disableSaveButton).toBe(true);
            expect(vmCollectWishes.showConfirmUpdateWishesMessage).toBe(true);
            done();
        }, 0);
    });

    it('should check if wishes are not updated when administrator click on the save button and there is a server error', function (done) {
        vmCollectWishes.listWishesToUpdate =
            [
                {
                    "id": 98,
                    "version": 0,
                    "label": "JAVASCRIPT",
                    "collaborator": {
                        "id": 8,
                        "version": 0,
                        "personnalIdNumber": "POP1234",
                        "lastName": "Batista",
                        "firstName": "Benjamin",
                        "email": "benjamin.batista@viseo.com",
                        "password": "bibimbaps",
                        "isAdmin": false
                    },
                    "vote_ok": [],
                    "vote_ko": [],
                    "checked": true
                },
                {
                    "id": 93,
                    "version": 4,
                    "label": "PHP",
                    "collaborator": {
                        "id": 8,
                        "version": 0,
                        "personnalIdNumber": "POP1234",
                        "lastName": "Batista",
                        "firstName": "Benjamin",
                        "email": "benjamin.batista@viseo.com",
                        "password": "bibimbaps",
                        "isAdmin": false
                    },
                    "vote_ok": [],
                    "vote_ko": [],
                    "checked": false
                }
            ];
        vmCollectWishes.updateWish();

        setTimeout(function () {
            expect(vmCollectWishes.disableSaveButton).toBe(false);
            expect(vmCollectWishes.showConfirmUpdateWishesMessage).toBe(false);
            done();
        }, 2001);
    });

    it('should check if wish is ready to be update and icon is changed from grey to color when administrator validate the wish', function (done) {
        var wish =
                {
                    id : 98,
                    version: 0,
                    label: "JAVASCRIPT",
                    collaborator: {
                        id: 8,
                        version: 0,
                        personnalIdNumber: "POP1234",
                        lastName: "Batista",
                        firstName: "Benjamin",
                        email: "benjamin.batista@viseo.com",
                        password: "bibimbaps",
                        isAdmin: false
                    },

                    vote_ok: [],
                    vote_ko: [],
                    checked: false
                };
        vmCollectWishes.addWishToListWishes(wish,true);
        setTimeout(function(){
            expect(vmCollectWishes.listWishesToUpdate[0].checked).toBe(true);
            expect(vmCollectWishes.listWishesToUpdate[0].id).toBe(98);
            expect(vmCollectWishes.listWishesToUpdate[0].label).toBe("JAVASCRIPT");
            done();
        }, 0);
    });

    it('should check if wish is ready to be update and icon is changed from color to grey when administrator do not validate the wish', function (done) {
        var wish =
                {
                    id: 98,
                    version: 0,
                    label: "JAVASCRIPT",
                    collaborator: {
                        id: 8,
                        version: 0,
                        personnalIdNumber: "POP1234",
                        lastName: "Batista",
                        firstName: "Benjamin",
                        email: "benjamin.batista@viseo.com",
                        password: "bibimbaps",
                        isAdmin: false
                    },

                    vote_ok: [],
                    vote_ko: [],
                    checked: true
                };
        vmCollectWishes.addWishToListWishes(wish,false);
        setTimeout(function(){
            expect(vmCollectWishes.listWishesToUpdate[0].checked).toBe(false);
            expect(vmCollectWishes.listWishesToUpdate[0].id).toBe(98);
            expect(vmCollectWishes.listWishesToUpdate[0].label).toBe("JAVASCRIPT");
            done();
        }, 0);
    });

    it('should check if wish is ready to be update and icon is changed from color to grey when administrator do not validate the wish and has already added the wish but did not click on save', function (done) {
        var wishAlreadyInListToUpdate =
            {
                id: 98,
                version: 0,
                label: "JAVASCRIPT",
                collaborator: {
                    id: 8,
                    version: 0,
                    personnalIdNumber: "POP1234",
                    lastName: "Batista",
                    firstName: "Benjamin",
                    email: "benjamin.batista@viseo.com",
                    password: "bibimbaps",
                    isAdmin: false
                },

                vote_ok: [],
                vote_ko: [],
                checked: true
            };
        vmCollectWishes.listWishesToUpdate.push(wishAlreadyInListToUpdate);
        vmCollectWishes.addWishToListWishes(wishAlreadyInListToUpdate,false);
        setTimeout(function(){
            expect(vmCollectWishes.listWishesToUpdate[0].checked).toBe(false);
            expect(vmCollectWishes.listWishesToUpdate[0].id).toBe(98);
            expect(vmCollectWishes.listWishesToUpdate[0].label).toBe("JAVASCRIPT");
            done();
        }, 0);
    });

});


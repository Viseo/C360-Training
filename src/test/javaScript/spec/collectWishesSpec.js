/**
 * Created by BBA3616 on 18/05/2017.
 */

Vue.use(VueResource);
Vue.use(VueRouter);

var vmCollectWishe = new Vue({
    template: '<div><collect-wishes></collect-wishes></div>',
    router: router,
    components: {
        'collectWishes': collectWishes
    }
}).$mount();

describe('collect wishes panel test', function () {

    beforeEach(function () {
        vmCollectWishes = vmCollectWishe.$children[0];
    });

    afterEach(function () {
        vmCollectWishes.listWishesToUpdate = [];

    });

    it('should check if all wishes are gathered when administrator is in the wishes collected panel', function (done) {
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
        vmCollectWishes.updateWish();
        setTimeout(function () {
            expect(vmCollectWishes.disableSaveButton).toBe(true);
            expect(vmCollectWishes.showConfirmUpdateWishesMessage).toBe(true);
            done();
        }, 0);
    });

    it('should check if wish is ready to be update and icon is changed from grey to color when administrator validate the wish', function () {
        var wish =
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
                    "checked": false
                }
            ];
        vmCollectWishes.addWishToListWishes(wish,true);

        //setTimeout(function () {
            expect(vmCollectWishes.listWishesToUpdate[0].checked).toBe(true);
            /*done();
        }, 0);*/
    });

    it('should check if wish is ready to be update and icon is changed from color to grey when administrator dont validate the wish', function () {
        var wish =
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
                }
            ];
        vmCollectWishes.addWishToListWishes(wish,false);

        console.log(vmCollectWishes.listWishesToUpdate[0]);
        //setTimeout(function () {
        expect(vmCollectWishes.listWishesToUpdate[0].checked).toBe(false);
        /*done();
         }, 0);*/
    });

});


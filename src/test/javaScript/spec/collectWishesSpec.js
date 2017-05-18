/**
 * Created by BBA3616 on 18/05/2017.
 */
describe('collect wishes panel test', function () {

    beforeEach(function () {
        vmCollectWishes = new collectWishes().$mount();
    });

    afterEach(function () {

    });

    it('should check if all wishes are gathered when administrator is in the wishes collected panel', function () {
        vmCollectWishes.getAllWishes();
        setTimeout(function () {
            let AllWishesInDatabase =
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
                        "checked": null
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
                        "checked": null
                    }
                ];
            expect(vmCollectWishes.allWishes).toEqual(AllWishesInDatabase);
            expect(vmCollectWishes.disableSaveButton).toBe(true);
        }, 0);
    });

    it('should check if wishes are updated when administrator click on the save button', function () {
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
            expect(vmCollectionWishes.disableSaveButton).toBe(false);
            expect(vmCollection.showConfirmUpdateWishesMessage).toBe(true);
        }, 0);
    });

    it('should check if wish is ready to be update and icon is changed from grey to color when administrator validate the wish', function () {
        wish =
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

        setTimeout(function () {
        console.log(vmCollectWishes.listWishesToUpdate)

        }, 0);
    });

});


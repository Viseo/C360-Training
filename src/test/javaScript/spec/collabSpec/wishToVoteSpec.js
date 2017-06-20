/**
 * Created by XME3612 on 11/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

var wishToVote = new Vue({
    template: '<div><wish-to-vote></wish-to-vote></div>',
    router: router,
    components: {
        'wishToVoteComponent': wishToVoteComponent
    }
}).$mount();

//let collabToken = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDYXJvbGluZSIsImxhc3ROYW1lIjoiTGhvdGUiLCJyb2xlcyI6ZmFsc2UsImlkIjoxfQ.b6V6cYkhMD4QCXBF_3-kO4S19fwnhDkDQR4ggNqktiyYP6CrbfUCb9Ov2B-2PX1EawUeuPy9WKAobT8FMFoDtg";

var vmWishToVote;

describe('wish to vote Panel test', function () {

    beforeEach(function () {
        /*document = {
            value_: '',

            get cookie() {
                return this.value_;
            },

            set cookie(value) {
                this.value_ += value + ';';
            }
        };*/
        document.cookie = "token="+ collaboratorToken;
        vmWishToVote = wishToVote.$children[0];
    });

    afterEach(function () {
        clearRequests();
    });

    it('should check if user has already voted ok', function(){
        var wish={
            "id":2,
            "version":5,
            "label":"SSC",
            "collaborator":{
                "id":1,
                "version":0,
                "personnalIdNumber":"AAA1234",
                "lastName":"nckjzn",
                "firstName":"ncdxkzn",
                "email":"xiangzhe.meng@outlook.com",
                "password":"123456",
                "isAdmin":false
            },
            "vote_ok":[
                {"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}
            ],
            "vote_ko":[
                {"id":2,"version":0,"personnalIdNumber":"BBB1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@hotmail.com","password":"123456","isAdmin":false}
            ],
            "checked":false
        };
        vmWishToVote.collaborator_id = 1;
        vmWishToVote.userAlreadyVotedOk(wish);
        expect(vmWishToVote.collaboratorAlreadyVotedTheSameVote).toBe(true);
        expect(vmWishToVote.collaboratorAlreadyVotedTheOppositeVote).toBe(false);
        vmWishToVote.collaborator_id = 2;
        vmWishToVote.userAlreadyVotedOk(wish);
        expect(vmWishToVote.collaboratorAlreadyVotedTheSameVote).toBe(false);
        expect(vmWishToVote.collaboratorAlreadyVotedTheOppositeVote).toBe(true);
    });

    it('should check if user has already voted ko', function(){
        var wish={
            "id":2,
            "version":5,
            "label":"SSC",
            "collaborator":{
                "id":1,
                "version":0,
                "personnalIdNumber":"AAA1234",
                "lastName":"nckjzn",
                "firstName":"ncdxkzn",
                "email":"xiangzhe.meng@outlook.com",
                "password":"123456",
                "isAdmin":false
            },
            "vote_ok":[
                {"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}
            ],
            "vote_ko":[
                {"id":2,"version":0,"personnalIdNumber":"BBB1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@hotmail.com","password":"123456","isAdmin":false}
            ],
            "checked":false
        };
        vmWishToVote.collaborator_id = 2;
        vmWishToVote.userAlreadyVotedKo(wish);
        expect(vmWishToVote.collaboratorAlreadyVotedTheSameVote).toBe(true);
        expect(vmWishToVote.collaboratorAlreadyVotedTheOppositeVote).toBe(false);
        vmWishToVote.collaborator_id = 1;
        vmWishToVote.userAlreadyVotedKo(wish);
        expect(vmWishToVote.collaboratorAlreadyVotedTheSameVote).toBe(false);
        expect(vmWishToVote.collaboratorAlreadyVotedTheOppositeVote).toBe(true);
    });

    it('should check if we can hide message by function hideMessage', function(){
        vmWishToVote.hideMessage();
        expect(vmWishToVote.wish_id).toEqual('');
        expect(vmWishToVote.collaboratorAlreadyVotedTheSameVote).toBe(false);
        expect(vmWishToVote.collaboratorAlreadyVotedTheOppositeVote).toBe(false);
    });

    it('should check if all the wish is collect', function(done){
        var response = [{"id":3,"version":1,"label":"VUE.JS","collaborator":{"id":1,"version":0,"personnalIdNumber":"AAB1234","lastName":"DUPONT","firstName":"Eric","email":"dupont.eric@gmail.com","password":"123456","isAdmin":true,"function":null,"businessUnit":null,"defaultPicture":true,"admin":true},"vote_ok":[],"vote_ko":[],"checked":true},{"id":2,"version":1,"label":"JAVA","collaborator":{"id":1,"version":0,"personnalIdNumber":"AAB1234","lastName":"JOHN","firstName":"Soline","email":"john.soline@gmail.com","password":"123456","isAdmin":true,"function":null,"businessUnit":null,"defaultPicture":true,"admin":true},"vote_ok":[],"vote_ko":[],"checked":true}];
        prepareRequest('GET', 'api/allvalidatedwishes', 200, response);

        vmWishToVote.getAllWishes();
        setTimeout(function () {
            expect(vmWishToVote.allWishes).toBe(response);
            done();
        }, 0);
    });

    it('should check if we can add a vote ok when the user did not vote ok or ko before ', function(done){
        var response = [{
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
        }];
        var wish = {
            "id":2,
            "version":5,
            "label":"SSC",
            "collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},
            "vote_ok":[],
            "vote_ko":[],
            "checked":false
        };
        prepareRequest('PUT', 'api/okwishtoupdate/1', 200, response);
        vmWishToVote.collaborator_id = 1;
        vmWishToVote.addVoteOk(wish);

        setTimeout(function () {
            clearRequests();
            prepareRequest('PUT', 'api/okwishtoupdate/1', 500, response);
            vmWishToVote.addVoteOk(wish);
            done();
        }, 0);
    });

    it('should check if we can add a vote ok when the user voted ko before', function(done){
        var response = {
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
        };
        var wish = {
            "id":2,
            "version":5,
            "label":"SSC",
            "collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},
            "vote_ok":[],
            "vote_ko":[{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}],
            "checked":false
        };
        vmWishToVote.collaborator_id = 1;
        prepareRequest('PUT', 'api/kowishtochange/1', 200, response);
        vmWishToVote.addVoteOk(wish);
        setTimeout(function () {
            clearRequests();
            prepareRequest('PUT', 'api/kowishtochange/1', 500, response);
            vmWishToVote.addVoteOk(wish);
            done();
        }, 0);
    });

    it('should check if we can add a vote ko when the user did not vote ok or ko before', function(done){
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
                "vote_ok": [],
                "vote_ko": [{
                    "id": 1,
                    "version": 0,
                    "personnalIdNumber": "AAA1234",
                    "lastName": "nckjzn",
                    "firstName": "ncdxkzn",
                    "email": "xiangzhe.meng@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                }],
                "checked": false
            }
        ];

        var wish = {
            "id":2,
            "version":5,
            "label":"SSC",
            "collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},
            "vote_ok":[],
            "vote_ko":[],
            "checked":false
        };
        vmWishToVote.collaborator_id = 1;
        prepareRequest('PUT', 'api/kowishtoupdate/1', 200, response);
        vmWishToVote.addVoteKo(wish);
        setTimeout(function () {
            clearRequests();
            prepareRequest('PUT', 'api/kowishtoupdate/1', 500, response);
            vmWishToVote.addVoteKo(wish);
            done();
        }, 0);
    });

    it('should check if we can add a vote ko when the user voted ok before', function(done){
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
                "vote_ok": [],
                "vote_ko": [{
                    "id": 1,
                    "version": 0,
                    "personnalIdNumber": "AAA1234",
                    "lastName": "nckjzn",
                    "firstName": "ncdxkzn",
                    "email": "xiangzhe.meng@outlook.com",
                    "password": "123456",
                    "isAdmin": false
                }],
                "checked": false
            }
        ];

        var wish = {
            "id":2,
            "version":5,
            "label":"SSC",
            "collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},
            "vote_ok":[{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}],
            "vote_ko":[],
            "checked":false
        };
        vmWishToVote.collaborator_id = 1;
        prepareRequest('PUT', 'api/okwishtochange/1', 200, response);
        vmWishToVote.addVoteKo(wish);
        setTimeout(function () {
            clearRequests();
            prepareRequest('PUT', 'api/okwishtochange/1', 500, response);
            vmWishToVote.addVoteKo(wish);
            done();
        }, 0);
    });
});
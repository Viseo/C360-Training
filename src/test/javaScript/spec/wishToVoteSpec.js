/**
 * Created by XME3612 on 11/05/2017.
 */
Vue.use(VueResource);
Vue.use(VueRouter);

var vm5 = new Vue({
    template: '<div><wish-to-vote></wish-to-vote></div>',
    router: router,
    components: {
        'wishToVoteComponent': wishToVoteComponent
    }
}).$mount();

describe('wish to vote Panel test', function () {

    beforeEach(function () {
        vmWishToVote = vm5.$children[0];

    });

    afterEach(function () {

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

    it('should check if we can add a vote ok when the user did not vote ok or ko before', function(done){
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
        vmWishToVote.addVoteOk(wish);
        setTimeout(function () {
            done();
        }, 0);
    });

    it('should check if we can add a vote ok when the user voted ko before', function(done){
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
        vmWishToVote.addVoteOk(wish);
        setTimeout(function () {
            done();
        }, 0);
    });

    it('should check if we can add a vote ko when the user did not vote ok or ko before', function(done){
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
        vmWishToVote.addVoteKo(wish);
        setTimeout(function () {
            done();
        }, 0);
    });

    it('should check if we can add a vote ko when the user voted ok before', function(done){
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
        vmWishToVote.addVoteKo(wish);
        setTimeout(function () {
            done();
        }, 0);
    });
});
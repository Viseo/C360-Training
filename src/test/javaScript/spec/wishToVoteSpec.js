/**
 * Created by XME3612 on 11/05/2017.
 */
describe('wish to vote Panel test', function () {

    beforeEach(function () {
        vmWishToVote = new wishToVoteComponent().$mount();

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

    /*it('should check if we can get all wishes', function(){
        var result=[{"id":2,"version":5,"label":"SSC","collaborator":{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false},"vote_ok":[{"id":1,"version":0,"personnalIdNumber":"AAA1234","lastName":"nckjzn","firstName":"ncdxkzn","email":"xiangzhe.meng@outlook.com","password":"123456","isAdmin":false}],"vote_ko":[],"checked":false}];
        vmWishToVote.getAllWishes();
        setTimeout(function () {
            expect(vmWishToVote.allWishes).toEqual(result);
            done();
        }, 0);
    });*/

});
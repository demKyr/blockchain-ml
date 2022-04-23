let Reviews = artifacts.require("TwitterReview.sol");

let reviewsInstance;

contract('TwitterReview', (accounts) => {

    it("Contract deployment", function(){
        return Reviews.deployed().then(function (instance){
            reviewsInstance =  instance;
            assert(reviewsInstance !== undefined, 'TwitterReview contract should be defined');
        });
    });

    it("should allow a user to add a caption", function(){
        let caption = "I had a great time!";
        let lbl = 2
        return reviewsInstance.addCaption(caption, lbl, {
            from: accounts[1],
            value: 1e18,
        }).then(function (result){
            return reviewsInstance.getCaption(0)
        }).then(function (result){
            assert.equal(result.content, caption, 'Caption added correclty')
            assert.equal(result.label, lbl, 'Label added correclty')
        })
    });

    it("should allow a user to review a caption", function(){
        let idx = 0;
        let lbl = 1;
        let oldcnt;
        return reviewsInstance.getCaption(idx)
        .then(function (result){
            oldcnt = result.Votes[lbl];
            return reviewsInstance.reviewCaption(idx, lbl, {
                from: accounts[2],
                value: 1e18,
            })
        })       
        .then(function (result){
            return reviewsInstance.getCaption(idx)
        })
        .then(function (result){
            assert.equal(result.Votes[lbl],parseInt(oldcnt)+1,'Review added correctly')
        })
    });

    it("should mark caption as finished when a label receives X votes", function(){
        let idx = 0;
        let lbl = 1;
        return reviewsInstance.reviewCaption(idx, lbl,{
            from: accounts[3],
            value: 1e18,
        })
        .then(function (result){
            return reviewsInstance.reviewCaption(idx, lbl, {
                from: accounts[4],
                value: 1e18,
            })
        })
        .then(function (result){
            return reviewsInstance.getCaption(idx)
        })
        .then(function (result){
            assert.equal(result.verified,true,'A label reached X votes so caption is verified')
        })
    });


    it("should return number of captions", function(){
        return reviewsInstance.getCaptionCnt()
        .then(function(result){
            assert.equal(result,1,'Number of captions obtained successfully')
        })
    });


});
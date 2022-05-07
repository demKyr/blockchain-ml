let Reviews = artifacts.require("CaptionReview.sol");

let reviewsInstance;

contract('CaptionReview', (accounts) => {

    it("Contract deployment", function(){
        return Reviews.deployed().then(function (instance){
            reviewsInstance =  instance;
            assert(reviewsInstance !== undefined, 'CaptionReview contract should be defined');
        });
    });

    it("should allow a user to request a model", function () {
      let description = "this is model a";
      let NumOfVotes = 3;
      let NumOfCaptions = 100;
      let labels = ["positive", "negative", "neutral"];
      return reviewsInstance
        .addModel(description, NumOfVotes, NumOfCaptions, labels, {
          from: accounts[1],
          value: 1e18,
        })
        .then(function (result) {
          return reviewsInstance.getModel(0);
        })
        .then(function (result) {
          assert.equal(result.description, description, "Description added correclty");
          assert.equal(result.NumberOfVotes, NumOfVotes, "Num of Votes added correclty");
          assert.equal(result.NumberOfCaptions, NumOfCaptions, "Num of Captions added correclty");
        });
    });

    it("should allow a user to add a caption", function(){
        let caption = "I had a great time!";
        let lbl = 2
        return reviewsInstance.addCaption(caption, lbl, 0, {
            from: accounts[1],
            value: 1e16,
        }).then(function (result){
            return reviewsInstance.getCaption(0)
        }).then(function (result){
            assert.equal(result.content, caption, 'Caption added correclty')
            assert.equal(result.proposedLabel, lbl, "Label added correclty");
        })
    });

    it("should allow a user to review a caption", function(){
        let idx = 0;
        let lbl = 1;
        let modelId = 0;
        let oldcnt;
        return reviewsInstance.getCaption(idx)
        .then(function (result){
            oldcnt = result.Votes[lbl];
            return reviewsInstance.reviewCaption(idx, lbl, modelId, {
                from: accounts[2],
                value: 1e15,
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
        let modelId = 0;
        return reviewsInstance.reviewCaption(idx, lbl, modelId,{
            from: accounts[3],
            value: 1e15,
        })
        .then(function (result){
            return reviewsInstance.reviewCaption(idx, lbl, modelId, {
              from: accounts[4],
              value: 1e15,
            });
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
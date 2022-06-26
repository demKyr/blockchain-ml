let Reviews = artifacts.require("CaptionReview.sol");

let reviewsInstance;

contract("CaptionReview", (accounts) => {
  it("Contract deployment", function () {
    return Reviews.deployed().then(function (instance) {
      reviewsInstance = instance;
      assert(
        reviewsInstance !== undefined,
        "CaptionReview contract should be defined"
      );
    });
  });

  it("should allow a user to request a model", function () {
    let name = "Model a";
    let description =
      "Tweets categorized according to their content (eg. This is the best day of my life -> Positive)";
    let NumOfVotes = 3;
    let NumOfCaptions = 100;
    let initialAcc = 98765;
    let labels = ["positive", "negative", "neutral"];
    return reviewsInstance
      .addModel(name, description, NumOfVotes, NumOfCaptions, initialAcc, labels, {
        from: accounts[1],
        value: 1e18,
      })
      .then(function (result) {
        return reviewsInstance.getModels();
      })
      .then(function (result) {
        assert.equal(result[0].name, name, "Name added correctly");
        assert.equal(
          result[0].description,
          description,
          "Description added correctly"
        );
        assert.equal(
          result[0].NumberOfVotes,
          NumOfVotes,
          "Num of Votes added correctly"
        );
        assert.equal(
          result[0].NumberOfCaptions,
          NumOfCaptions,
          "Num of Captions added correctly"
        );
      });
  });

  it("should allow a user to add a caption", function () {
    let caption = "I had a great time!";
    let lbl = 2;
    return reviewsInstance
      .addCaption(caption, lbl, 0, {
        from: accounts[1],
        value: 1e16,
      })
      .then(function (result) {
        return reviewsInstance.getCaptions();
      })
      .then(function (result) {
        assert.equal(result[0].content, caption, "Caption added correctly");
        assert.equal(result[0].proposedLabel, lbl, "Label added correctly");
      });
  });

  it("should allow a user to review a caption", function () {
    let idx = 0;
    let lbl = 1;
    let modelId = 0;
    let oldcnt;
    return reviewsInstance
      .getCaptions()
      .then(function (result) {
        oldcnt = result[0].Votes[lbl];
        return reviewsInstance.reviewCaption(idx, lbl, modelId, {
          from: accounts[2],
          value: 1e15,
        });
      })
      .then(function (result) {
        return reviewsInstance.getCaptions();
      })
      .then(function (result) {
        assert.equal(
          result[0].Votes[lbl],
          parseInt(oldcnt) + 1,
          "Review added correctly"
        );
      });
  });

  it("should mark caption as finished when a label receives X votes", function () {
    let idx = 0;
    let lbl = 1;
    let modelId = 0;
    return reviewsInstance
      .reviewCaption(idx, lbl, modelId, {
        from: accounts[3],
        value: 1e15,
      })
      .then(function (result) {
        return reviewsInstance.reviewCaption(idx, lbl, modelId, {
          from: accounts[4],
          value: 1e15,
        });
      })
      .then(function (result) {
        return reviewsInstance.getCaptions();
      })
      .then(function (result) {
        assert.equal(
          result[0].verified,
          true,
          "A label reached X votes so caption is verified"
        );
      });
  });

  it("should should allow adding new accuracy value", function () {
    let idx = 0;
    let acc = 99999;
    return reviewsInstance.addAccuracy(idx,acc)
    .then(function (result) {
      return reviewsInstance.getModels();
    })
    .then(function (result) {
      assert.equal(
        result[0].accuracy[1],
        acc,
        "A label reached X votes so caption is verified"
      );
    })
  });
});

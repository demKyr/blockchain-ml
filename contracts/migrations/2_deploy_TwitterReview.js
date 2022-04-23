const TwitterReview = artifacts.require("TwitterReview");

module.exports = function (deployer) {
  deployer.deploy(TwitterReview);
};

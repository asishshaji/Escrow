var OffChain = artifacts.require("./OffChain.sol");

module.exports = function(deployer) {
  deployer.deploy(OffChain);
};

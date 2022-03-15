const CampaignFactory = artifacts.require("CampaignFactory");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(CampaignFactory, {
    from: accounts[0],
    value: web3.utils.toWei("0.1", "ether")
  });
};

const CampaignFactory = artifacts.require("CampaignFactory");
const Endorsement = artifacts.require("Endorsement");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Endorsement, {
    from: accounts[0]
  }).then(() => {
    return deployer.deploy(CampaignFactory, Endorsement.address, {
      from: accounts[0],
      value: web3.utils.toWei("0.1", "ether")
    });
  });
};

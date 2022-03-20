const Clones = artifacts.require("Clones");
const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require("CampaignFactory");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Clones);
  await deployer.deploy(Campaign);
  await deployer.deploy(CampaignFactory, Campaign.address, {
    from: accounts[0],
    value: web3.utils.toWei("0.1", "ether")
  });
};

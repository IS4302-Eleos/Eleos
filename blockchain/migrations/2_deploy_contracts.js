const CampaignFactory = artifacts.require("CampaignFactory");
const Reputation = artifacts.require("Reputation");

module.exports = async (deployer, network, accounts) => {
  const deployingAccount = accounts[0];

  // Deploy CampaignFactory contract
  await deployer.deploy(CampaignFactory, {
    from: deployingAccount,
    value: web3.utils.toWei("0.1", "ether")
  });

  const campaignFactoryInstance = await CampaignFactory.deployed();

  // Deploy Reputation contract
  await deployer.deploy(Reputation, campaignFactoryInstance.address, {
    from: deployingAccount
  });

  // Set reputation address in CampaignFactory contract
  const reputationInstance = await Reputation.deployed();
  await campaignFactoryInstance.setReputationAddress(reputationInstance.address, {
    from: deployingAccount
  });
};

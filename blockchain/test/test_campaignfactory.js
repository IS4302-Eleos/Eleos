const truffleAssert = require("truffle-assertions");

const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require("CampaignFactory");
const Reputation = artifacts.require("Reputation");

contract("CampaignFactory", (accounts) => {
  const deployingAccount = accounts[0];
  const beneficiary = accounts[1];
  const campaignOwner = accounts[2];

  let campaignFactoryInstance;

  before(async () => {
    const deploymentAmount = web3.utils.toWei("0.01", "ether");

    // Deploy CampaignFactory contract
    campaignFactoryInstance = await CampaignFactory.new({
      from: deployingAccount,
      value: deploymentAmount
    });

    // Deploy Reputation contract
    const reputationInstance = await Reputation.new(campaignFactoryInstance.address, {
      from: deployingAccount
    });

    // Set Reputation address in CampaignFactory contract
    campaignFactoryInstance.setReputationAddress(reputationInstance.address, {
      from: deployingAccount
    });
  });

  it("should create new campaign", async () => {
    const campaignName = "Charity 1";
    const organisationUrl = "https://www.charity1.com";
    const endTimestamp = 1672502399; // 31/12/2022 23:59:59 GMT+8
    const beneficiaryAddress = beneficiary;
    const campaignOwnerAddress = campaignOwner;
    const targetDonationAmount = 10;
    const campaignDescription = "It's a cool charity";

    const tx = await campaignFactoryInstance.startCampaign(
      campaignName,
      organisationUrl,
      endTimestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetDonationAmount,
      campaignDescription
    );

    // Watch for CampaignStarted Event
    await truffleAssert.eventEmitted(tx, "CampaignStarted");
  });
});

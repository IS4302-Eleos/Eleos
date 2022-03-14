const truffleAssert = require("truffle-assertions");
const assert = require("assert");

const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require("CampaignFactory");

contract("CampaignFactory", (accounts) => {
  const deployingAccount = accounts[0];
  const beneficiary = accounts[1];
  const campaignOwner = accounts[2];
  const donor = accounts[3];

  let campaignFactoryInstance;
  let campaignInstance;

  before(async () => {
    const deploymentAmount = web3.utils.toWei("0.01", "ether");
    campaignFactoryInstance = await CampaignFactory.new({
      from: deployingAccount,
      value: deploymentAmount
    });
  });

  it("should create new campaign", async () => {
    const campaignName = "Charity 1";
    const organisationUrl = "https://www.charity1.com";
    const endTimestamp = 1672502399; // 31/12/2022 23:59:59 GMT+8
    const beneficiaryAddress = beneficiary;
    const campaignOwnerAddress = campaignOwner;
    const targetDonationAmount = 10;

    const tx = await campaignFactoryInstance.startCampaign(
      campaignName,
      organisationUrl,
      endTimestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetDonationAmount
    );

    // Watch for CampaignStarted Event
    await truffleAssert.eventEmitted(tx, "CampaignStarted");

    // Update new campaign instance
    const campaignAddress = tx.logs[0].args.campaignAddress;
    campaignInstance = await Campaign.at(campaignAddress);
  });
});

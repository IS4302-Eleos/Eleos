const assert = require("assert");

const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");
const Reputation = artifacts.require("Reputation");

contract("Reputation", (accounts) => {
  const deployingAccount = accounts[0];
  const beneficiary = accounts[1];
  const donor = accounts[2];

  let reputationInstance;
  let campaignInstance;

  before(async () => {
    // Campaign details
    const campaignName = "Charity 1";
    const organisationUrl = "https://www.charity1.com";
    const endTimestamp = 1672502399000; // 31/12/2022 23:59:59 GMT+8
    const beneficiaryAddress = beneficiary;
    const campaignOwnerAddress = beneficiary;
    const targetDonationAmount = 10;
    const campaignDescription = "It's a cool charity";

    const deploymentAmount = web3.utils.toWei("0.01", "ether");

    // Deploy CampaignFactory contract
    const campaignFactoryInstance = await CampaignFactory.new({
      from: deployingAccount,
      value: deploymentAmount
    });

    // Deploy Reputation contract
    reputationInstance = await Reputation.new(campaignFactoryInstance.address, {
      from: deployingAccount
    });

    // Set Reputation address in CampaignFactory contract
    campaignFactoryInstance.setReputationAddress(reputationInstance.address, {
      from: deployingAccount
    });

    // Deploy campaign
    const tx = await campaignFactoryInstance.startCampaign(
      campaignName,
      organisationUrl,
      endTimestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetDonationAmount,
      campaignDescription,
      {
        from: deployingAccount
      }
    );

    campaignInstance = await Campaign.at(tx.logs[0].args.campaignAddress);
  });

  it("should get default reputation of 0", async () => {
    const reputation = await reputationInstance.getReputation.call(beneficiary);
    assert.equal(reputation.toNumber(), 0);
  });

  it("should update beneficiary reputation through donation", async () => {
    const reputationValue = web3.utils.toWei("5", "ether");

    await campaignInstance.donate({
      from: donor,
      value: reputationValue
    });

    const reputation = await reputationInstance.getReputation(beneficiary);
    assert.strictEqual(reputation.toString(), reputationValue);
  });
});

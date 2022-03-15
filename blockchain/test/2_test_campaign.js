const truffleAssert = require("truffle-assertions");
const assert = require("assert");

const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require("CampaignFactory");

contract("Campaign", (accounts) => {
  const deployingAccount = accounts[0];
  const beneficiary = accounts[1];
  const campaignOwner = accounts[2];
  const donor = accounts[3];

  let campaignInstance;

  before(async () => {
    // Deploy campaign factory
    const deploymentAmount = web3.utils.toWei("0.01", "ether");
    const campaignFactoryInstance = await CampaignFactory.new({
      from: deployingAccount,
      value: deploymentAmount
    });

    // New campaign details
    const campaignName = "Charity 1";
    const organisationUrl = "https://www.charity1.com";
    const endTimestamp = 1672502399; // 31/12/2022 23:59:59 GMT+8
    const beneficiaryAddress = beneficiary;
    const campaignOwnerAddress = campaignOwner;
    const targetDonationAmount = 10;

    // Start new campaign
    const tx = await campaignFactoryInstance.startCampaign(
      campaignName,
      organisationUrl,
      endTimestamp,
      beneficiaryAddress,
      campaignOwnerAddress,
      targetDonationAmount
    );

    // Update new campaign instance
    const campaignAddress = tx.logs[0].args.campaignAddress;
    campaignInstance = await Campaign.at(campaignAddress);
  });

  it("should fail donate 0 ether", async () => {
    const donationAmount = 0;

    // Try to donate 0 ether
    await truffleAssert.fails(
      campaignInstance.donate({
        from: donor,
        value: donationAmount
      }),
      truffleAssert.ErrorType.REVERT
    );
  });

  it("should donate 0.01 ether", async () => {
    const donationAmount = web3.utils.toBN(web3.utils.toWei("0.01", "ether"));

    const tx = await campaignInstance.donate({
      from: donor,
      value: donationAmount
    });

    // Watch for Donate event
    truffleAssert.eventEmitted(tx, "Donate", (ev) => {
      return ev.donorAddress === donor && ev.amount.toString() === donationAmount.toString();
    }, "Donate event should be emitted with correct parameters");

    // Balances after donation
    const donorDonatedAmount = await campaignInstance.getOwnDonationAmount({ from: donor });
    const campaignTotalDonations = await campaignInstance.getTotalDonationAmount();

    // Verify donor donation amount
    assert.deepEqual(
      donorDonatedAmount,
      donationAmount,
      "Donor donation amount incorrect"
    );

    // Verify campaign total donations
    assert.deepEqual(
      campaignTotalDonations,
      donationAmount,
      "Campaign total donations incorrect"
    );
  });

  it("should not withdraw as other users", async () => {
    const withdrawAmount = await campaignInstance.getTotalDonationAmount();

    await truffleAssert.fails(
      campaignInstance.withdraw(withdrawAmount, { from: donor }),
      truffleAssert.ErrorType.REVERT
    );
  });

  it("should not withdraw more than total donations", async () => {
    const withdrawAmount = web3.utils.toWei("100", "ether");

    // Try to withdraw more than total donations
    await truffleAssert.fails(
      campaignInstance.withdraw(withdrawAmount, { from: beneficiary }),
      truffleAssert.ErrorType.REVERT
    );
  });

  it("should withdraw by beneficiary", async () => {
    const withdrawAmount = await campaignInstance.getTotalDonationAmount();
    const tx = await campaignInstance.withdraw(withdrawAmount, { from: beneficiary });

    // Watch for Withdraw event
    truffleAssert.eventEmitted(tx, "Withdraw", (ev) => {
      return ev.withdrawerAddress === beneficiary &&
        ev.amount.toString() === withdrawAmount.toString() &&
        ev.toAddress === beneficiary;
    });
  });
});
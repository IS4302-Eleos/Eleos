const _deploy_contracts = require('../migrations/2_deploy_contracts');
const truffleAssert = require('truffle-assertions');

var assert = require('assert');

var campaign = artifacts.require("../contracts/Campaign.sol");

contract('Campaign', function(accounts) {
    var testDonationAmount = "8000000000000000000";
    var withdrawAmount = "2000000000000000000";

    before(async () => {
        campaignInstance = await campaign.deployed();
    });

    console.log("Contracts Deployed")

    it('Donating as a user', async () => {
        let donation = await campaignInstance.donate({
            from: accounts[1],
            value: testDonationAmount
        });

        var balance = await campaignInstance.getAvailableDonationBalance();

        var errorMessage = "There should be " + testDonationAmount + "...";
        assert.equal(balance, testDonationAmount, errorMessage);
    });

    // The beneficiary is accounts[3] as of test deployment.
    it('Withdrawing as the beneficiary', async () => {
        let withdraw = await campaignInstance.withdraw(withdrawAmount, {
            from: accounts[3]
        });
        console.log(withdraw);
        truffleAssert.eventEmitted(
            withdraw,
            'withdrawn',
            null,
            "The beneficiary should be able to withdraw from the campaign..."
        );
    });

    // Campaign owner is accounts[4] as of test deployment.
    it('Withdrawing as campaign owner for beneficiary', async () => {
        let withdraw = await campaignInstance.withdraw(withdrawAmount, {
            from: accounts[4]
        });
        truffleAssert.eventEmitted(
            withdraw,
            'withdrawn',
            null,
            "The campaign owner should be able to initiate the withdraw to beneficiary..."
         );
    });

    it('Withdrawing as other user', async () => {
        await truffleAssert.fails(
            campaignInstance.withdraw(withdrawAmount, {
                from: accounts[2]
            }),
            truffleAssert.ErrorType.REVERT
        );
    });
});

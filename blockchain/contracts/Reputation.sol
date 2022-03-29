// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;

contract Reputation {
    address campaignFactory;

    // Stores the reputation of beneficiaries in terms of ETH
    mapping(address => uint256) public reputation;

    constructor(address _campaignFactory) {
        campaignFactory = _campaignFactory;
    }

    // Update the reputation of an address
    function updateReputation(address beneficiaryAddress, uint256 value)
        public
    {
        require(
            msg.sender == campaignFactory,
            "Only CampaignFactory can update reputation"
        );
        reputation[beneficiaryAddress] += value;
    }

    // Get the reputation of an address
    function getReputation(address beneficiaryAddress)
        public
        view
        returns (uint256)
    {
        return reputation[beneficiaryAddress];
    }
}

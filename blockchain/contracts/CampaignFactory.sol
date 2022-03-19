// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
import "./Campaign.sol";

contract CampaignFactory {
    event CampaignStarted(address ownerAddress, address campaignAddress);

    constructor() payable {
        require(
            msg.value >= 0.01 ether,
            "CampaignFactory must be deployed with 0.01 ETH"
        );
    }

    // Checks if campaign end timestamp is in the future
    modifier isValidEndTimestamp(uint64 endTimestamp) {
        require(
            endTimestamp > block.timestamp,
            "Campaign end date must be in the future"
        );
        require(
            endTimestamp <= 8640000000000000,
            "Campaign end date must not be after the max date in Javascript"
        );
        _;
    }

    // Checks if campaign target donation amount is above or equals zero
    modifier isValidTargetDonation(uint256 targetDonationAmount) {
        require(
            targetDonationAmount >= 0,
            "Target donation amount must be >= 0 ETH"
        );
        _;
    }

    // Deploys a new campaign contract with user provided data
    function startCampaign(
        string memory _campaignName,
        string memory _organisationUrl,
        uint64 _endTimestamp,
        address payable _beneficiaryAddress,
        address _campaignOwnerAddress,
        uint256 _targetDonationAmount,
        string memory _campaignDescription
    )
        public
        isValidEndTimestamp(_endTimestamp)
        isValidTargetDonation(_targetDonationAmount)
        returns (address)
    {
        // Create new campaign contract
        Campaign newCampaign = new Campaign(
            _campaignName,
            _organisationUrl,
            _endTimestamp,
            _beneficiaryAddress,
            _campaignOwnerAddress,
            _targetDonationAmount,
            _campaignDescription
        );

        emit CampaignStarted(_campaignOwnerAddress, address(newCampaign));
        return address(newCampaign);
    }
}

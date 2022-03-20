// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
import "./Campaign.sol";
import "./Clones.sol";

contract CampaignFactory {

    address immutable campaignImplementation;

    event CampaignStarted(address ownerAddress, address campaignAddress);

    constructor(address _campaignImplementation) payable {
        require(
            msg.value >= 0.01 ether,
            "CampaignFactory must be deployed with 0.01 ETH"
        );
        campaignImplementation = _campaignImplementation;
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
        returns (address)
    {

        address cloneAddress = Clones.clone(campaignImplementation);

        Campaign(cloneAddress).init(
            _campaignName,
            _organisationUrl,
            _endTimestamp,
            _beneficiaryAddress,
            _campaignOwnerAddress,
            _targetDonationAmount,
            _campaignDescription
        );

        emit CampaignStarted(
            _campaignOwnerAddress, 
            cloneAddress
        );

        return cloneAddress;
    }
}

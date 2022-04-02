// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
import "./Campaign.sol";
import "./AddressSet.sol";
import "./Reputation.sol";

contract CampaignFactory {
    using AddressSet for AddressSet.Set;

    address owner;
    Reputation reputation;

    event CampaignStarted(address ownerAddress, address campaignAddress);
    event Donate(address campaignAddress, address donorAddress, uint256 amount);
    event Withdraw(
        address campaignAddress,
        address withdrawerAddress,
        uint256 amount,
        address toAddress
    );

    AddressSet.Set createdCampaigns;

    constructor() payable {
        require(
            msg.value >= 0.01 ether,
            "CampaignFactory must be deployed with 0.01 ETH"
        );

        owner = msg.sender;
    }

    // Set Reputation address
    function setReputationAddress(address _reputationAddress) public {
        require(
            msg.sender == owner,
            "Only owner can set the Reputation address"
        );
        reputation = Reputation(_reputationAddress);
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

    // Checks if caller is a Campaign created from this CampaignFactory
    modifier isBelongToCampaignFactory(address caller) {
        require(
            createdCampaigns.exists(caller), 
            "Sender must be a Campaign created from this CampaignFactory"
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

        // Add new campaign to set of created campaigns
        createdCampaigns.insert(address(newCampaign));

        emit CampaignStarted(_campaignOwnerAddress, address(newCampaign));
        return address(newCampaign);
    }

    function emitDonateEvent(address donorAddress, uint256 amount) 
        public 
        isBelongToCampaignFactory(msg.sender) 
    {
        emit Donate(msg.sender, donorAddress, amount);
    }

    function emitWithdrawEvent(address withdrawerAddress, uint256 amount, address beneficiaryAddress)
        public
        isBelongToCampaignFactory(msg.sender) 
    {
        emit Withdraw(msg.sender, withdrawerAddress, amount, beneficiaryAddress);
    }

    function updateReputation(address beneficiaryAddress, uint256 value)
        public
        isBelongToCampaignFactory(msg.sender)
    {
        reputation.updateReputation(beneficiaryAddress, value);
    }
}

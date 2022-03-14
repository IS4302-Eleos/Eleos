pragma solidity >= 0.5.0;

contract Campaign {

    string campaignName;
    string campaignDescription;
    string organizationURL;
    uint64 endTimestamp;
    address payable beneficiaryAddress;
    address campaignOwnerAddress;
    uint256 targetAmount;

    // Default starting donated sum
    uint256 totalDonatedSum = 0;

    // Mappings of address to donation amount
    mapping(address => uint) public donations;

    // Events
    event donated(address donorAddress, uint256 amount);
    event withdrawn(address withdrawerAddress, uint256 amount, address toAddress);

    constructor (string memory _campaignName, string memory _campaignDescription, string memory _organizationURL, uint64 _endTimestamp,
            address payable _beneficiaryAddress, address _campaignOwnerAddress, uint256 _targetAmount) public {
        campaignName = _campaignName;
        campaignDescription = _campaignDescription;
        organizationURL = _organizationURL;
        endTimestamp = _endTimestamp;
        beneficiaryAddress = _beneficiaryAddress;
        campaignOwnerAddress = _campaignOwnerAddress;
        targetAmount = _targetAmount;
    }

    // Modifiers
    // Checks if the donation value is not zero.
    modifier notZeroDonationValue(uint256 value) {
        require(value > 0, "Donation value needs to be more than zero...");
        _;
    }

    // Checks if the withdrawer's address belongs to the campaign owner or the beneficiary.
    modifier equalsCampaignOwnerOrBeneficary(address withdrawerAddress) {
        require(withdrawerAddress == campaignOwnerAddress || withdrawerAddress == beneficiaryAddress);
        _;
    }

    // Checks if there is enough donation balance available for withdrawing.
    modifier hasAvailableDonationBalance(uint256 value) {
        require(address(this).balance >= value, "There is not enough donation funds to withdraw this amount...");
        _;
    }

    // Main functionalities
    // Donates eth to the campaign. The ether is held in this contract.
    function donate() public payable notZeroDonationValue(msg.value) {
        totalDonatedSum += msg.value;
        donations[msg.sender] += msg.value;
        emit donated(msg.sender, msg.value);
    }

    // Withdraws the specified eth amount from this campaign contract.
    function withdraw(uint256 amount) public payable equalsCampaignOwnerOrBeneficary(msg.sender) hasAvailableDonationBalance(amount) {
        beneficiaryAddress.transfer(amount);
        emit withdrawn(msg.sender, amount, beneficiaryAddress);
    }

    // Getters
    function getCampaignName() public view returns (string memory) {
        return campaignName;
    }

    function getCampaignDescription() public view returns (string memory) {
        return campaignDescription;
    }

    function getOrganizationURL() public view returns (string memory) {
        return organizationURL;
    }

    function getEndTimeStamp() public view returns (uint64) {
        return endTimestamp;
    }

    function getBeneficiaryAddress() public view returns (address) {
        return beneficiaryAddress;
    }

    function getCampaignOwnerAddress() public view returns (address) {
        return campaignOwnerAddress;
    }

    function getTotalDonatedSum() public view returns (uint256) {
        return totalDonatedSum;
    }

    function getDonationAmountByAddress(address donorAddress) public view returns (uint256) {
        return donations[donorAddress];
    }

    function getOwnDonationAmount() public view returns (uint256) {
        return donations[msg.sender];
    }

    function getCurrentAvailableDonationBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

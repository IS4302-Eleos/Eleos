pragma solidity >= 0.5.0;

contract Campaign {
    string campaignName;
    string organisationUrl;
    uint64 endTimestamp;
    address payable beneficiaryAddress;
    address campaignOwnerAddress;
    uint256 targetDonationAmount;

    // Default starting donated sum
    uint256 totalDonationAmount = 0;

    // Mappings of address to donation amount
    mapping(address => uint) public donations;

    event donated(address donorAddress, uint256 amount);
    event withdrawn(
        address withdrawerAddress,
        uint256 amount,
        address toAddress
    );

    constructor (
        string memory _campaignName,
        string memory _organisationUrl,
        uint64 _endTimestamp,
        address payable _beneficiaryAddress,
        address _campaignOwnerAddress,
        uint256 _targetDonationAmount
    ) public {
        campaignName = _campaignName;
        organisationUrl = _organisationUrl;
        endTimestamp = _endTimestamp;
        beneficiaryAddress = _beneficiaryAddress;
        campaignOwnerAddress = _campaignOwnerAddress;
        targetDonationAmount = _targetDonationAmount;
    }

    // Checks if the donation value is not zero.
    modifier notZeroDonationValue(uint256 value) {
        require(value > 0, "Donation value needs to be more than zero...");
        _;
    }

    // Checks if the withdrawer's address belongs
    // to the campaign owner or the beneficiary.
    modifier equalsCampaignOwnerOrBeneficary(address withdrawerAddress) {
        bool isCampaignOwnerAddress = withdrawerAddress == campaignOwnerAddress;
        bool isBeneficiaryAddress = withdrawerAddress == beneficiaryAddress;
        require(
            isCampaignOwnerAddress || isBeneficiaryAddress,
            "Only campaign owner or beneficiary can initiate/access withdraw..."
        );
        _;
    }

    // Checks if there is enough donation balance available for withdrawing.
    modifier hasAvailableDonationBalance(uint256 value) {
        require(
            address(this).balance >= value,
            "There is not enough donation funds to withdraw this amount..."
        );
        _;
    }

    // Donates eth to the campaign. The ether is held in this contract.
    function donate() public payable notZeroDonationValue(msg.value) {
        totalDonationAmount += msg.value;
        donations[msg.sender] += msg.value;
        emit donated(msg.sender, msg.value);
    }

    // Withdraws the specified eth amount from this campaign contract.
    function withdraw(uint256 amount)
        public
        payable
        equalsCampaignOwnerOrBeneficary(msg.sender)
        hasAvailableDonationBalance(amount)
    {
        beneficiaryAddress.transfer(amount);
        emit withdrawn(msg.sender, amount, beneficiaryAddress);
    }

    function getCampaignName() public view returns (string memory) {
        return campaignName;
    }

    function getorganisationUrl() public view returns (string memory) {
        return organisationUrl;
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

    function getTotalDonationAmount() public view returns (uint256) {
        return totalDonationAmount;
    }

    function getOwnDonationAmount() public view returns (uint256) {
        return donations[msg.sender];
    }

    function getDonationAmountByAddress(address donorAddress)
        public
        view
        returns (uint256)
    {
        return donations[donorAddress];
    }

    function getAvailableDonationBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
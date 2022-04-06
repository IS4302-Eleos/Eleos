// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
import "./CampaignFactory.sol";
import "./Reputation.sol";

contract Campaign {
    string campaignName;
    string organisationUrl;
    uint64 endTimestamp;
    address payable beneficiaryAddress;
    address campaignOwnerAddress;
    uint256 targetDonationAmount;
    string campaignDescription;

    CampaignFactory origin;

    // Default starting donated sum
    uint256 totalDonationAmount = 0;

    event Donate(address donorAddress, uint256 amount);
    event Withdraw(
        address withdrawerAddress,
        uint256 amount,
        address toAddress
    );

    constructor(
        string memory _campaignName,
        string memory _organisationUrl,
        uint64 _endTimestamp,
        address payable _beneficiaryAddress,
        address _campaignOwnerAddress,
        uint256 _targetDonationAmount,
        string memory _campaignDescription
    ) {
        campaignName = _campaignName;
        organisationUrl = _organisationUrl;
        endTimestamp = _endTimestamp;
        beneficiaryAddress = _beneficiaryAddress;
        campaignOwnerAddress = _campaignOwnerAddress;
        targetDonationAmount = _targetDonationAmount;
        campaignDescription = _campaignDescription;
        origin = CampaignFactory(msg.sender);
    }

    // Checks if the donation value is not zero.
    modifier notZeroDonationValue(uint256 value) {
        require(
            value > 0,
            "Value of 0 donated..."
        );
        _;
    }

    // Checks if the withdrawer's address belongs
    // to the campaign owner or the beneficiary.
    modifier equalsCampaignOwnerOrBeneficary(address withdrawerAddress) {
        bool isCampaignOwnerAddress = withdrawerAddress == campaignOwnerAddress;
        bool isBeneficiaryAddress = withdrawerAddress == beneficiaryAddress;
        require(
            isCampaignOwnerAddress || isBeneficiaryAddress,
            "Not owner or beneficiary..."
        );
        _;
    }

    // Checks if there is enough donation balance available for withdrawing.
    modifier hasAvailableDonationBalance(uint256 value) {
        require(
            address(this).balance >= value,
            "Not enough balance..."
        );
        _;
    }

    // Checks if the donation made is to an expired campaign.
    modifier noExpiredDonations() {
      require(
          endTimestamp / 1000 > block.timestamp,
          "Cannot donate to expired campaign..."
      );
      _;
    }

    // Checks if donor is not beneficiary.
    modifier noDonationAsBeneficiary() {
      require(
        beneficiaryAddress != msg.sender,
        "Cannot donate to own dedicated campaign..."
      );
      _;
    }

    // Donates eth to the campaign. The ether is held in this contract.
    function donate()
        public
        payable
        noDonationAsBeneficiary()
        noExpiredDonations()
        notZeroDonationValue(msg.value)
    {
        totalDonationAmount += msg.value;
        emit Donate(msg.sender, msg.value);
        origin.emitDonateEvent(msg.sender, msg.value);

        // Update reputation
        origin.updateReputation(beneficiaryAddress, msg.value);
    }

    // Withdraws the specified eth amount from this campaign contract.
    function withdraw(uint256 amount)
        public
        payable
        equalsCampaignOwnerOrBeneficary(msg.sender)
        hasAvailableDonationBalance(amount)
    {
        beneficiaryAddress.transfer(amount);
        emit Withdraw(msg.sender, amount, beneficiaryAddress);
        origin.emitWithdrawEvent(msg.sender, amount, beneficiaryAddress);
    }

    function getCampaignName() public view returns (string memory) {
        return campaignName;
    }

    function getOrganisationUrl() public view returns (string memory) {
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

    function getTargetDonationAmount() public view returns (uint256) {
        return targetDonationAmount;
    }

    function getTotalDonationAmount() public view returns (uint256) {
        return totalDonationAmount;
    }

    function getCampaignDescription() public view returns (string memory) {
        return campaignDescription;
    }

    function getWithdrawalBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

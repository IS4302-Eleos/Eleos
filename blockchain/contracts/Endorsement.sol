// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0;
import "./AddressSet.sol";

contract Endorsement {
    using AddressSet for AddressSet.Set;

    mapping(address => AddressSet.Set) endorserSet; // Accounts that are endorsing this user
    mapping(address => AddressSet.Set) endorseeSet; // Accounts that this user are endorsing

    modifier notSelf(address user) {
        require(user != msg.sender, "Cannot endorse or retract yourself...");
        _;
    }

    // Endorse a user
    function endorse(address endorsee) public notSelf(endorsee) {
        endorserSet[endorsee].insert(msg.sender);
        endorseeSet[msg.sender].insert(endorsee);
    }

    // Retract a user's endorsement
    function retract(address endorsee) public notSelf(endorsee) {
        endorserSet[endorsee].remove(msg.sender);
        endorseeSet[msg.sender].remove(endorsee);
    }

    function getEndorsers(address user) public view returns (address[] memory) {
        return endorserSet[user].keyList;
    }

    function getEndorserCount(address user) public view returns (uint256) {
        return endorserSet[user].count();
    }

    function getEndorsees(address user) public view returns (address[] memory) {
        return endorseeSet[user].keyList;
    }

    function getEndorseeCount(address user) public view returns (uint256) {
        return endorseeSet[user].count();
    }
}

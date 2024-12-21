// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {
    mapping(address => uint) public balances;
    mapping(address => uint) public depositTimestamps;
    uint public interestRate = 1; // 1% interest rate per day

    function deposit() public payable {
        balances[msg.sender] += msg.value;
        depositTimestamps[msg.sender] = block.timestamp;
    }

    function withdraw() public {
        uint depositTimestamp = depositTimestamps[msg.sender];
        uint depositAmount = balances[msg.sender];
        require(depositAmount > 0, "No deposit to withdraw");

        uint elapsedTime = (block.timestamp - depositTimestamp) / 1 days;
        uint interest = (depositAmount * interestRate * elapsedTime) / 100;

        balances[msg.sender] = 0;
        depositTimestamps[msg.sender] = 0;
        payable(msg.sender).transfer(depositAmount + interest);
    }
}
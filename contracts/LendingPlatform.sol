// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {
    mapping(address => uint) public balances;           // Tracks deposits (lending balance)
    mapping(address => uint) public depositTimestamps;  // Timestamps for deposit to calculate interest
    mapping(address => uint) public borrowedAmounts;    // Tracks borrowed amount per address
    mapping(address => uint) public borrowTimestamps;   // Tracks the timestamp of borrow for interest calculation
    uint public interestRate = 1;                        // 1% interest rate per day on deposits and borrowings
    uint public totalFundsAvailable;                     // Total funds available for borrowing

    // Deposit funds into the contract
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        depositTimestamps[msg.sender] = block.timestamp;
        totalFundsAvailable += msg.value;
    }

    // Withdraw funds as a lender
    function withdraw(uint256 amount) public {
        uint depositAmount = balances[msg.sender];
        require(depositAmount >= amount, "Insufficient balance to withdraw");
        
        uint depositTimestamp = depositTimestamps[msg.sender];
        uint elapsedTime = (block.timestamp - depositTimestamp) / 1 days;
        uint interest = (depositAmount * interestRate * elapsedTime) / 100;
        
        balances[msg.sender] -= amount;
        totalFundsAvailable -= amount;
        
        payable(msg.sender).transfer(amount + interest);  // Transfer principal + interest
    }

    // Borrow funds from the contract
    function borrow(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= totalFundsAvailable, "Not enough funds available in the contract");

        // Ensure borrower doesn't have an existing debt
        uint currentDebt = borrowedAmounts[msg.sender];
        require(currentDebt == 0, "You already have an outstanding loan");

        borrowedAmounts[msg.sender] = amount;
        borrowTimestamps[msg.sender] = block.timestamp;
        totalFundsAvailable -= amount;

        payable(msg.sender).transfer(amount);  // Transfer borrowed funds to the borrower
    }

    // Repay borrowed funds
    function repay() public payable {
        uint amountOwed = borrowedAmounts[msg.sender];
        require(amountOwed > 0, "No outstanding loan to repay");

        uint elapsedTime = (block.timestamp - borrowTimestamps[msg.sender]) / 1 days;
        uint interestOwed = (amountOwed * interestRate * elapsedTime) / 100;

        uint totalRepaymentAmount = amountOwed + interestOwed;
        require(msg.value >= totalRepaymentAmount, "Insufficient funds to repay the loan");

        borrowedAmounts[msg.sender] = 0; // Reset borrower's debt
        borrowTimestamps[msg.sender] = 0;

        totalFundsAvailable += msg.value;  // Add repayment to available funds
        payable(address(this)).transfer(msg.value);  // Transfer the repayment to the contract's balance
    }

    // View function to check the contract's balance
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

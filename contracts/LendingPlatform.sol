// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {
    mapping(address => uint) public balances;           // Tracks deposits (lending balance)
    mapping(address => uint) public borrowedAmounts;    // Tracks borrowed amount per address
    uint public totalFundsAvailable;                     // Total funds available for borrowing

    // Deposit funds into the contract
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        totalFundsAvailable += msg.value;
    }

    // Withdraw funds as a lender
    function withdraw(uint256 amount) public {
        uint depositAmount = balances[msg.sender];
        require(depositAmount >= amount, "Insufficient balance to withdraw");
        
        balances[msg.sender] -= amount;
        totalFundsAvailable -= amount;
        
        payable(msg.sender).transfer(amount);  // Transfer principal back to the lender
    }

    // Borrow funds from the contract
    function borrow(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= totalFundsAvailable, "Not enough funds available in the contract");

        uint currentDebt = borrowedAmounts[msg.sender];
        uint totalDebt = currentDebt + amount;
        require(totalDebt <= balances[msg.sender], "Cannot borrow more than you have deposited");

        borrowedAmounts[msg.sender] = totalDebt;
        totalFundsAvailable -= amount;

        payable(msg.sender).transfer(amount);  // Transfer borrowed funds to the borrower
    }

    // Repay borrowed funds partially or fully
    function repay(uint256 amount) public payable {
        uint amountOwed = borrowedAmounts[msg.sender];
        require(amountOwed > 0, "No outstanding loan to repay");
        require(amount <= amountOwed, "Cannot repay more than the owed amount");

        borrowedAmounts[msg.sender] -= amount;
        totalFundsAvailable += amount;  // Add repayment to available funds

        payable(address(this)).transfer(amount);  // Transfer repayment to the contract
    }

    // View function to check the contract's balance
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

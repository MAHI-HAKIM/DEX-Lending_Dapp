// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {
    // State Variables
    mapping(address => uint) public balances;           // Tracks user deposits (collateral balance)
    mapping(address => uint) public borrowedAmounts;    // Tracks borrowed amounts per user
    uint public totalFundsAvailable;                    // Total funds available for borrowing
    uint public constant LTV = 75;                      // Loan-to-Value ratio (e.g., 75%)

    // Events for transparency
    event Deposit(address indexed user, uint amount);
    event Withdraw(address indexed user, uint amount);
    event Borrow(address indexed user, uint amount);
    event Repay(address indexed user, uint amount);

    // Deposit funds into the contract (collateral)
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        balances[msg.sender] += msg.value;
        totalFundsAvailable += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw collateral (only if user has no outstanding loans)
    function withdraw(uint256 amount) public {
        uint depositAmount = balances[msg.sender];
        uint debt = borrowedAmounts[msg.sender];

        require(debt == 0, "Outstanding loan exists, cannot withdraw collateral");
        require(depositAmount >= amount, "Insufficient balance to withdraw");

        balances[msg.sender] -= amount;
        totalFundsAvailable -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdraw(msg.sender, amount);
    }

    // Borrow funds from the contract
    function borrow(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        uint maxBorrowable = (balances[msg.sender] * LTV) / 100; // Calculate max borrowable based on LTV
        uint currentDebt = borrowedAmounts[msg.sender];

        require(currentDebt + amount <= maxBorrowable, "Exceeds borrow limit based on collateral");
        require(amount <= totalFundsAvailable, "Not enough funds available in the contract");
        require(address(this).balance >= amount, "Contract does not have enough liquidity");

        borrowedAmounts[msg.sender] += amount;
        totalFundsAvailable -= amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit Borrow(msg.sender, amount);
    }

    // Repay borrowed funds partially or fully
    function repay() public payable {
        uint amount = msg.value; // Repayment amount is the value sent with the transaction
        uint amountOwed = borrowedAmounts[msg.sender];

        require(amount > 0, "Repayment amount must be greater than 0");
        require(amountOwed > 0, "No outstanding loan to repay");
        require(amount <= amountOwed, "Cannot repay more than the owed amount");

        borrowedAmounts[msg.sender] -= amount;
        totalFundsAvailable += amount; // Add repayment to available funds

        emit Repay(msg.sender, amount);
    }

    // View function to check the contract's ETH balance
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // View function to check the user's borrowing capacity
    function borrowingCapacity(address user) public view returns (uint256) {
        uint maxBorrowable = (balances[user] * LTV) / 100;
        uint debt = borrowedAmounts[user];
        return maxBorrowable > debt ? maxBorrowable - debt : 0;
    }
    // Get user eligibility for withdrawal
    function canWithdraw(address user) public view returns (bool) {
        return borrowedAmounts[user] == 0 && balances[user] > 0;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingPlatform {

    // State Variables
    mapping(address => uint256) public balances;          // User collateral balances
    mapping(address => uint256) public borrowedAmounts;   // User borrowed amounts
    mapping(address => uint256) public loanStartTimes;    // Loan start times for interest calculation
    mapping(address => uint256) public loanDueDates;      // Loan due dates

    uint256 public totalFundsAvailable;                   // Total funds available for borrowing
    uint256 public constant LTV = 75;                     // Loan-to-Value ratio (e.g., 75%)
    uint256 public annualInterestRate = 5;                // 5% annual interest rate
    uint256 public latePenaltyRate = 2;                   // 2% penalty for overdue loans
    uint256 public platformFee = 1;                       // 1% service charge
    uint256 public insuranceFund;                         // Insurance fund pool

    // Address of the contract owner (deployer)
    address public owner;

    // Struct to store transaction details
    struct Transaction {
        address user;
        string transactionType; // e.g., "deposit", "withdraw", "borrow", "repay"
        uint256 amount;
        uint256 timestamp;
    }

    // Array to store all transactions
    Transaction[] public transactions;

    // Events for transparency
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount);
    event Repay(address indexed user, uint256 amount);
    event TransactionRecorded(address indexed user, string transactionType, uint256 amount, uint256 timestamp);

    // Constructor to set the owner
    constructor() {
        owner = msg.sender; // Set the deployer as the owner
    }

    // Modifier to restrict access to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    // Record a transaction
    function recordTransaction(address user, string memory transactionType, uint256 amount) internal {
        transactions.push(Transaction({
            user: user,
            transactionType: transactionType,
            amount: amount,
            timestamp: block.timestamp
        }));

        emit TransactionRecorded(user, transactionType, amount, block.timestamp);
    }

    // Deposit funds into the contract (collateral)
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        uint256 fee = msg.value * platformFee / 100;
        uint256 netAmount = msg.value - fee;

        balances[msg.sender] = balances[msg.sender] + netAmount;
        totalFundsAvailable = totalFundsAvailable + netAmount;
        insuranceFund = insuranceFund + (fee / 2); // 50% of fees go to the insurance fund

        recordTransaction(msg.sender, "deposit", netAmount);
        emit Deposit(msg.sender, netAmount);
    }

    // Withdraw collateral (only if user has no outstanding loans)
    function withdraw(uint256 amount) public {
        require(borrowedAmounts[msg.sender] == 0, "Outstanding loan exists, cannot withdraw collateral");
        require(balances[msg.sender] >= amount, "Insufficient balance to withdraw");

        balances[msg.sender] = balances[msg.sender] - amount;
        totalFundsAvailable = totalFundsAvailable - amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        recordTransaction(msg.sender, "withdraw", amount);
        emit Withdraw(msg.sender, amount);
    }

    // Borrow funds from the contract
    function borrow(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        uint256 maxBorrowable = balances[msg.sender] * LTV / 100; // Calculate max borrowable based on LTV
        uint256 currentDebt = borrowedAmounts[msg.sender];

        require(currentDebt + amount <= maxBorrowable, "Exceeds borrow limit based on collateral");
        require(amount <= totalFundsAvailable, "Not enough funds available in the contract");
        require(address(this).balance >= amount, "Contract does not have enough liquidity");

        borrowedAmounts[msg.sender] = borrowedAmounts[msg.sender] + amount;
        loanStartTimes[msg.sender] = block.timestamp;
        loanDueDates[msg.sender] = block.timestamp + 30 days; // Loan repayment due in 30 days
        totalFundsAvailable = totalFundsAvailable - amount;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        recordTransaction(msg.sender, "borrow", amount);
        emit Borrow(msg.sender, amount);
    }

    // Calculate interest based on loan duration
    function calculateInterest(address user) public view returns (uint256) {
        uint256 debt = borrowedAmounts[user];
        uint256 duration = block.timestamp - loanStartTimes[user];
        uint256 interest = debt * annualInterestRate * duration / 365 days / 100;
        return interest;
    }

    // Repay borrowed funds partially or fully
    function repay() public payable {
        uint256 amount = msg.value; // Repayment amount is the value sent with the transaction
        uint256 interest = calculateInterest(msg.sender);
        uint256 penalty = 0;

        // Apply penalty if repayment is overdue
        if (block.timestamp > loanDueDates[msg.sender]) {
            penalty = borrowedAmounts[msg.sender] * latePenaltyRate / 100;
        }

        uint256 totalOwed = borrowedAmounts[msg.sender] + interest + penalty;
        require(amount > 0, "Repayment amount must be greater than 0");
        require(totalOwed > 0, "No outstanding loan to repay");
        require(amount <= totalOwed, "Cannot repay more than the owed amount");

        borrowedAmounts[msg.sender] = totalOwed - amount;
        totalFundsAvailable = totalFundsAvailable + amount;

        recordTransaction(msg.sender, "repay", amount);
        emit Repay(msg.sender, amount);
    }

    // View function to check the contract's ETH balance
    function contractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // View function to check the user's borrowing capacity
    function borrowingCapacity(address user) public view returns (uint256) {
        uint256 maxBorrowable = balances[user] * LTV / 100;
        uint256 debt = borrowedAmounts[user];
        return maxBorrowable > debt ? maxBorrowable - debt : 0;
    }

    // Get user eligibility for withdrawal
    function canWithdraw(address user) public view returns (bool) {
        return borrowedAmounts[user] == 0 && balances[user] > 0;
    }

    // Admin function to update platform parameters
    function updateParameters(uint256 _interestRate, uint256 _penaltyRate, uint256 _platformFee) public onlyOwner {
        annualInterestRate = _interestRate;
        latePenaltyRate = _penaltyRate;
        platformFee = _platformFee;
    }

  function getTransactionsByUser(address user) public view returns (Transaction[] memory) {
    uint256 count = 0;

    // Count transactions for the user
    for (uint256 i = 0; i < transactions.length; i++) {
        if (transactions[i].user == user) {
            count++;
        }
    }

    // Create an array to hold user's transactions
    Transaction[] memory userTransactions = new Transaction[](count);
    uint256 index = 0;

    // Populate the array
    for (uint256 i = 0; i < transactions.length; i++) {
        if (transactions[i].user == user) {
            userTransactions[index] = transactions[i];
            index++;
        }
    }

    return userTransactions;
    }
}

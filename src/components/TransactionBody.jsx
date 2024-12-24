import React, { useState, useEffect } from "react";
import StatBar from "./StatBar";
import StatBar2 from "./StatBar2";

function TransactionBody(props) {
  const [borrowError, setBorrowError] = useState("");
  const [repayError, setRepayError] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [depositError, setDepositError] = useState("");

  const contractEthBalance = props.contractBalance
    ? `${props.contractBalance.slice(0, 7)}...`
    : 0;

  // Function to reset all input values and errors
  const resetInputs = () => {
    props.setDepositAmount("");
    props.setWithdrawAmount("");
    props.setBorrowAmount("");
    props.setRepayAmount("");
    setBorrowError("");
    setRepayError("");
    setWithdrawError("");
    setDepositError("");
  };

  // useEffect to validate user inputs
  useEffect(() => {
    const depositAmount = parseFloat(props.depositAmount) || 0; // Ensure it's a number
    const withdrawAmount = parseFloat(props.withdrawAmount) || 0;
    const borrowAmount = parseFloat(props.borrowAmount) || 0;
    const repayAmount = parseFloat(props.repayAmount) || 0;
  
    // Validate Borrow Amount
    if (borrowAmount < 0 || isNaN(borrowAmount)) {
      setBorrowError("Invalid amount. Enter a positive number.");
    } else if (borrowAmount > props.borrowCapacity) {
      setBorrowError("Amount exceeds borrowing capacity.");
    } else if (borrowAmount > props.walletBalance) {
      setBorrowError("Amount exceeds wallet balance.");
    } else if (borrowAmount > 0 && props.userCollateral === 0) {
      setBorrowError("You have no collateral.");
    }else if(borrowAmount > 0 && props.userBorrowed > 0){
        setBorrowError("You have borrowed amount. Repay it first.");
    }
    else {
      setBorrowError("");
    }
  
    // Validate Repay Amount
    if (repayAmount < 0 || isNaN(repayAmount)) {
      setRepayError("Invalid amount. Enter a positive number.");
    } else if (repayAmount > props.userBorrowed) {
      setRepayError("Amount exceeds your debt.");
    } else {
      setRepayError("");
    }
  
    // Validate Withdraw Amount
    if (withdrawAmount < 0 || isNaN(withdrawAmount)) {
      setWithdrawError("Invalid amount. Enter a positive number.");
    } else if (withdrawAmount > props.userCollateral) {
      setWithdrawError("Amount exceeds collateral or not eligible.");
    } else if (props.userBorrowed > 0 && withdrawAmount > 0) {
      setWithdrawError("You have borrowed amount. Repay it first.");
    } else {
      setWithdrawError("");
    }
  
    // Validate Deposit Amount
    if (depositAmount < 0 || isNaN(depositAmount)) {
      setDepositError("Invalid amount. Enter a positive number.");
    } else if (depositAmount > props.walletBalance) {
      setDepositError("Amount exceeds wallet balance.");
    } else {
      setDepositError("");
    }
  }, [
    props.borrowAmount,
    props.repayAmount,
    props.withdrawAmount,
    props.depositAmount,
    props.canWithdraw,
    props.borrowCapacity,
    props.userCollateral,
    props.userBorrowed,
    props.walletBalance,
  ]);
  
  return (
    <>
      <div
        className="shadow-md rounded-lg p-8 w-full max-w-3xl relative"
        style={{
          background: "linear-gradient(45deg, rgba(0, 0,50, 0.4), rgba(9, 3, 7, 0.8))",
        }}
      >
        <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-8">
          <StatBar title="Contract Balance" value={contractEthBalance} />
          <StatBar title="Collateral" value={props.userCollateral} />
        </div>

        <div className="grid grid-cols-3 gap-y-6 gap-x-6 mb-8">
          <StatBar2 title="Borrowed" value={props.userBorrowed} />
          <StatBar2 title="Borrowing Capacity" value={props.borrowCapacity} />

          <div className="p-4 bg-gray-100 rounded-md shadow">
            <h2 className="text- font-semibold">Withdrawal Eligibility</h2>
            <p
              className={`p-2 rounded-lg shadow ${
                props.canWithdraw ? "bg-green-200" : "bg-gray-200"
              }`}
            >
              {props.canWithdraw ? "Eligible" : "Not Eligible"}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4" style={{ color: "gray" }}>
            Actions
          </h2>
          <div className="grid grid-cols-2 gap-y-8 gap-x-6">
            {/* Deposit Section */}
            <div>
            <input
                type="number"
                placeholder="Deposit"
                value={props.depositAmount}
                onChange={(e) => props.setDepositAmount(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              {depositError && (
                <p className="text-red-500 text-sm">{depositError}</p>
              )}
               <button
                onClick={() => {
                    props.handleDeposit();
                    resetInputs();
                }}
                disabled={!!depositError}
                className={`p-2 rounded w-full text-white ${
                  depositError
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : ""
                }`}
                style={{
                  background: depositError
                    ? "linear-gradient(45deg, #4C585B, #A5BFCC)"
                    : "linear-gradient(45deg, #5FBDFF, #0766AD)",
                }}
              >

              Deposit
              </button>
           
            </div>

            {/* Withdraw Section */}
            <div>
              <input
                type="number"
                placeholder="Withdraw"
                value={props.withdrawAmount}
                onChange={(e) => props.setWithdrawAmount(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              {withdrawError && (
                <p className="text-red-500 text-sm">{withdrawError}</p>
              )}
              <button
                onClick={() => {
                  props.handleWithdraw();
                  resetInputs();
                }}
                disabled={!!withdrawError}
                className={`p-2 rounded w-full text-white ${
                  withdrawError
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : ""
                }`}
                style={{
                  background: withdrawError
                    ? "linear-gradient(45deg, #4C585B, #A5BFCC)"
                    : "linear-gradient(45deg, #32CD32, #228B22)",
                }}
              >
                Withdraw
              </button>
            </div>

            {/* Borrow Section */}
            <div>
              <input
                type="number"
                placeholder="Borrow"
                value={props.borrowAmount}
                onChange={(e) => props.setBorrowAmount(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              {borrowError && (
                <p className="text-red-500 text-sm">{borrowError}</p>
              )}
              <button
                onClick={() => {
                  props.handleBorrow();
                  resetInputs();
                }}
                disabled={!!borrowError}
                className={`p-2 rounded w-full text-white ${
                  borrowError
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : ""
                }`}
                style={{
                  background: borrowError
                    ? "linear-gradient(45deg, #4C585B, #A5BFCC)"
                    : "linear-gradient(45deg, #E5E483, #FFA500)",
                }}
              >
                Borrow
              </button>
            </div>

            {/* Repay Section */}
            <div>
              <input
                type="number"
                placeholder="Repay"
                value={props.repayAmount}
                onChange={(e) => props.setRepayAmount(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              {repayError && (
                <p className="text-red-500 text-sm">{repayError}</p>
              )}
              <button
                onClick={() => {
                  props.handleRepay();
                  resetInputs();
                }}
                disabled={!!repayError}
                className={`p-2 rounded w-full text-white ${
                  repayError
                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                    : ""
                }`}
                style={{
                  background: repayError
                    ? "linear-gradient(45deg, #4C585B, #A5BFCC)"
                    : "linear-gradient(45deg, #FF4500, #FF7D29)",
                }}
              >
                Repay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionBody;

import React from "react";
import StatBar from "../components/StatBar";
import StatBar2 from "../components/StatBar2";
import TransactionHistory from "./TransactionHistory";

function TransactionContainer(props) {

  
  const contractBalance = props.contractEthBalance && props.contractEthBalance > 0
    ? `${props.contractEthBalance.slice(0, 7)}...`
    : 0;

  // Function to reset all input values
  const resetInputs = () => {
    props.setDepositAmount("");
    props.setWithdrawAmount("");
    props.setBorrowAmount("");
    props.setRepayAmount("");
  };

  return (
    <>
      <div
        className="min-h-screen flex flex-col py-5 px-10"
        style={{
          background: "linear-gradient(45deg, #192134, #1B2E59, #25689F, #070815)",
        }}
      >
        <div
          className="flex flex-wrap m-1 ml-4 gap-9"
        >
          {/* TransactionContainer */}
          <div
            className="shadow-md rounded-lg p-8 w-full max-w-3xl relative"
            style={{
              background: "linear-gradient(45deg, rgba(0, 0,50, 0.4), rgba(9, 3, 7, 0.8))",
            }}
          >
            <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-8">
              <StatBar title="Contract Balance" value={contractBalance} />
              <StatBar title="Collateral" value={props.userCollateral} />
            </div>

            <div className="grid grid-cols-3 gap-y-6 gap-x-6 mb-8">
              <StatBar2 title="Borrowed" value={props.userBorrowed} />
              <StatBar2 title="Borrowing Capacity" value={props.borrowCapacity} />

              <div className="p-4 bg-gray-100 rounded-md shadow">
                <h2 className="text- font-semibold">Withdrawal Eligibility</h2>
                <p className={`p-2 rounded-lg shadow ${props.canWithdraw ? "bg-green-200" : "bg-gray-200"}`}>
                  {props.canWithdraw ? "Eligible" : "Not Eligible"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold mb-4" style={{ color: "gray" }}>Actions</h2>
              <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                <div>
                  <input
                    type="number"
                    placeholder="Deposit"
                    value={props.depositAmount}
                    onChange={(e) => props.setDepositAmount(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                  />
                  <button
                    onClick={() => {
                      props.handleDeposit();
                      resetInputs(); // Clear inputs after action
                    }}
                    className="p-2 rounded w-full text-white"
                    style={{
                      background: "linear-gradient(45deg, #074799, #3795BD)",
                    }}
                  >
                    Deposit
                  </button>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Withdraw"
                    value={props.withdrawAmount}
                    onChange={(e) => props.setWithdrawAmount(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                  />
                  <button
                    onClick={() => {
                      props.handleWithdraw();
                      resetInputs(); // Clear inputs after action
                    }}
                    disabled={!props.canWithdraw}
                    className={`p-2 rounded w-full text-white ${
                      props.canWithdraw
                        ? "cursor-pointer"
                        : "cursor-not-allowed bg-gray-300 text-gray-500"
                    }`}
                    style={{
                      background: props.canWithdraw
                        ? "linear-gradient(45deg, #32CD32, #228B22)"
                        : "linear-gradient(45deg, #4C585B, #A5BFCC)",
                    }}
                  >
                    Withdraw
                  </button>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Borrow"
                    value={props.borrowAmount}
                    onChange={(e) => props.setBorrowAmount(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                  />
                  <button
                    onClick={() => {
                      props.handleBorrow();
                      resetInputs(); // Clear inputs after action
                    }}
                    className="p-2 rounded w-full text-white"
                    style={{
                      background: "linear-gradient(45deg, #E5E483, #FFA500)",
                    }}
                  >
                    Borrow
                  </button>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Repay"
                    value={props.repayAmount}
                    onChange={(e) => props.setRepayAmount(e.target.value)}
                    className="border p-2 rounded w-full mb-4"
                  />
                  <button
                    onClick={() => {
                      props.handleRepay();
                      resetInputs(); // Clear inputs after action
                    }}
                    className="p-2 rounded w-full text-white"
                    style={{
                      background: "linear-gradient(45deg, #FF4500, #FF7D29)",
                    }}
                  >
                    Repay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TransactionHistory */}
          <div className="w-full max-w-2xl">
            <TransactionHistory transactions={props.transactions} />
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionContainer;

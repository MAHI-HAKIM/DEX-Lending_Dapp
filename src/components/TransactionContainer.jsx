import React from "react";

function TransactionContainer(props) {

    const contractBalance = props.contractEthBalance
    ? `${props.contractEthBalance.slice(0, 7)}...`
    : "Connect";

  return (
    <div
      className="min-h-screen flex flex-col items-center py-8 px-4"
      style={{
        background: "linear-gradient(45deg, #192134, #1B2E59, #25689F, #070815)",
      }}
    >
      <div
        className="shadow-md rounded-lg p-8 w-full max-w-3xl relative"
        style={{
          background: "linear-gradient(45deg, rgba(0, 0,50, 0.4), rgba(9, 3, 7, 0.8))",
        }}
      >
        <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-8">
          <div className="p-4 bg-blue-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Contract Balance</h2>
            <p>{contractBalance} ETH</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Collateral</h2>
            <p>{props.userCollateral} ETH</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-y-6 gap-x-6 mb-8">
          <div className="p-4 bg-red-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Borrowed</h2>
            <p>{props.userBorrowed} ETH</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Borrowing Capacity</h2>
            <p>{props.borrowCapacity} ETH</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Withdrawal Eligibility</h2>
            <p>{props.canWithdraw ? "Eligible" : "Not Eligible"}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4" style={
            {
              color: "gray"
            }
          }>Actions</h2>
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
                onClick={props.handleDeposit}
                className="p-2 rounded w-full text-white"
                style={{
                  background: "linear-gradient(45deg, #1E90FF, #00BFFF)",
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
                onClick={props.handleWithdraw}
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
                onClick={props.handleBorrow}
                className="p-2 rounded w-full text-white"
                style={{
                  background: "linear-gradient(45deg, #FFD700, #FFA500)",
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
                onClick={props.handleRepay}
                className="p-2 rounded w-full text-white"
                style={{
                  background: "linear-gradient(45deg, #FF4500, #DC143C)",
                }}
              >
                Repay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionContainer;

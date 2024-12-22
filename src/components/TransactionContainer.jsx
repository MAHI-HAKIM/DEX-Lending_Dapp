import React from 'react'

function TransactionContainer(props) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-4">
          Lending & Borrowing Platform
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Wallet Balance</h2>
            <p>{props.walletBalance} ETH</p>
          </div>
          <div className="p-4 bg-green-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Contract Balance</h2>
            <p>{props.contractEthBalance} ETH</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-yellow-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Collateral</h2>
            <p>{props.userCollateral} ETH</p>
          </div>
          <div className="p-4 bg-red-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Borrowed</h2>
            <p>{props.userBorrowed} ETH</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
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
          <h2 className="text-lg font-bold mb-2">Actions</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <input
                type="number"
                placeholder="Deposit"
                value={props.depositAmount}
                onChange={(e) => props.setDepositAmount(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={props.handleDeposit}
                className="bg-blue-500 text-white p-2 rounded w-full mt-2"
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
                className="border p-2 rounded w-full"
              />
              <button
                onClick={props.handleWithdraw}
                disabled={!props.canWithdraw}
                className={`${
                    props.canWithdraw
                    ? "bg-green-500"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } text-white p-2 rounded w-full mt-2`}
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
                className="border p-2 rounded w-full"
              />
              <button
                onClick={props.handleBorrow}
                className="bg-yellow-500 text-white p-2 rounded w-full mt-2"
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
                className="border p-2 rounded w-full"
              />
              <button
                onClick={props.handleRepay}
                className="bg-red-500 text-white p-2 rounded w-full mt-2"
              >
                Repay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionContainer
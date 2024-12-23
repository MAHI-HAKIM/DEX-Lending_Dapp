import React from "react";
import TransactionHistory from "../components/TransactionHistory";
import TransactionBody from "../components/TransactionBody";

function TransactionContainer(props) {
  
  const contractBalance = props.contractEthBalance && props.contractEthBalance > 0
    ? `${props.contractEthBalance.slice(0, 7)}...`
    : 0;

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
          <TransactionBody 
          contractBalance={contractBalance}
          walletBalance={props.walletBalance}
          userCollateral={props.userCollateral}
          userBorrowed={props.userBorrowed}
          borrowCapacity={props.borrowCapacity}
          canWithdraw={props.canWithdraw}
          depositAmount={props.depositAmount}
          setDepositAmount={props.setDepositAmount}
          handleDeposit={props.handleDeposit}
          withdrawAmount={props.withdrawAmount}
          setWithdrawAmount={props.setWithdrawAmount}
          handleWithdraw={props.handleWithdraw}
          borrowAmount={props.borrowAmount}
          setBorrowAmount={props.setBorrowAmount}
          handleBorrow={props.handleBorrow}
          repayAmount={props.repayAmount}
          setRepayAmount={props.setRepayAmount}
          handleRepay={props.handleRepay}
          
          />

          {/* TransactionHistory */}
          <div className="">
            <TransactionHistory transactions={props.transactions} />
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionContainer;

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import LendingPlatform from "./LendingPlatform.json"; // Replace with the correct ABI path

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  // State variables for user and contract data
  const [walletBalance, setWalletBalance] = useState(0);
  const [contractEthBalance, setContractEthBalance] = useState(0);
  const [userCollateral, setUserCollateral] = useState(0);
  const [userBorrowed, setUserBorrowed] = useState(0);
  const [borrowCapacity, setBorrowCapacity] = useState(0);
  const [canWithdraw, setCanWithdraw] = useState(false);

  // Form inputs
  const [depositAmount, setDepositAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Initialize Web3 and contract
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accountsList = await web3Instance.eth.getAccounts();
        setAccounts(accountsList);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = LendingPlatform.networks[networkId];
        if (deployedNetwork) {
          const contractInstance = new web3Instance.eth.Contract(
            LendingPlatform.abi,
            deployedNetwork.address
          );
          setContract(contractInstance);
        } else {
          alert("Smart contract not deployed on detected network.");
        }
      } else {
        alert("Please install MetaMask to use this app.");
      }
    };

    initWeb3();
  }, []);

  // Fetch user and contract data
  const fetchData = async () => {
    if (contract && accounts.length > 0) {
      const [wallet, contractBalance, collateral, borrowed, capacity, withdrawEligibility] =
        await Promise.all([
          web3.eth.getBalance(accounts[0]),
          contract.methods.contractBalance().call(),
          contract.methods.balances(accounts[0]).call(),
          contract.methods.borrowedAmounts(accounts[0]).call(),
          contract.methods.borrowingCapacity(accounts[0]).call(),
          contract.methods.canWithdraw(accounts[0]).call(),
        ]);

      setWalletBalance(web3.utils.fromWei(wallet, "ether"));
      setContractEthBalance(web3.utils.fromWei(contractBalance, "ether"));
      setUserCollateral(web3.utils.fromWei(collateral, "ether"));
      setUserBorrowed(web3.utils.fromWei(borrowed, "ether"));
      setBorrowCapacity(web3.utils.fromWei(capacity, "ether"));
      setCanWithdraw(withdrawEligibility);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contract, accounts]);

  // Action handlers
  const handleDeposit = async () => {
    if (depositAmount > 0) {
      await contract.methods.deposit().send({
        from: accounts[0],
        value: web3.utils.toWei(depositAmount, "ether"),
      });
      fetchData();
    }
  };

  const handleWithdraw = async () => {
    if (withdrawAmount > 0 && canWithdraw) {
      await contract.methods
        .withdraw(web3.utils.toWei(withdrawAmount, "ether"))
        .send({ from: accounts[0] });
      fetchData();
    }
  };

  const handleBorrow = async () => {
    if (borrowAmount > 0) {
      await contract.methods
        .borrow(web3.utils.toWei(borrowAmount, "ether"))
        .send({ from: accounts[0] });
      fetchData();
    }
  };

  const handleRepay = async () => {
    if (repayAmount > 0) {
      await contract.methods.repay().send({
        from: accounts[0],
        value: web3.utils.toWei(repayAmount, "ether"),
      });
      fetchData();
    }
  };

  // Render UI
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-4">
          Lending & Borrowing Platform
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Wallet Balance</h2>
            <p>{walletBalance} ETH</p>
          </div>
          <div className="p-4 bg-green-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Contract Balance</h2>
            <p>{contractEthBalance} ETH</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-yellow-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Collateral</h2>
            <p>{userCollateral} ETH</p>
          </div>
          <div className="p-4 bg-red-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Borrowed</h2>
            <p>{userBorrowed} ETH</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-purple-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Borrowing Capacity</h2>
            <p>{borrowCapacity} ETH</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md shadow">
            <h2 className="text-lg font-semibold">Withdrawal Eligibility</h2>
            <p>{canWithdraw ? "Eligible" : "Not Eligible"}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">Actions</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <input
                type="number"
                placeholder="Deposit"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleDeposit}
                className="bg-blue-500 text-white p-2 rounded w-full mt-2"
              >
                Deposit
              </button>
            </div>
            <div>
              <input
                type="number"
                placeholder="Withdraw"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleWithdraw}
                disabled={!canWithdraw}
                className={`${
                  canWithdraw
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
                value={borrowAmount}
                onChange={(e) => setBorrowAmount(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleBorrow}
                className="bg-yellow-500 text-white p-2 rounded w-full mt-2"
              >
                Borrow
              </button>
            </div>
            <div>
              <input
                type="number"
                placeholder="Repay"
                value={repayAmount}
                onChange={(e) => setRepayAmount(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleRepay}
                className="bg-red-500 text-white p-2 rounded w-full mt-2"
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

export default App;

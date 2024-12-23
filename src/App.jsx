import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; // Import Navigate for redirection
import LendingPlatform from "./LendingPlatform.json"; // ABI of your updated LendingPlatform contract
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import TransactionContainer from "./pages/TransactionContainer";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [authUser, setAuthUser] = useState(false); // State for checking if user is connected
  const [walletBalance, setWalletBalance] = useState(0);
  const [contractEthBalance, setContractEthBalance] = useState(0);
  const [userCollateral, setUserCollateral] = useState(0);
  const [userBorrowed, setUserBorrowed] = useState(0);
  const [borrowCapacity, setBorrowCapacity] = useState(0);
  const [canWithdraw, setCanWithdraw] = useState(false);

  const [depositAmount, setDepositAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [repayAmount, setRepayAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [transactions, setTransactions] = useState([]);

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

      await fetchTransactionHistory();
    }
  };
  
  //Fetch transaction history
  const fetchTransactionHistory = async () => {
    if (contract && accounts.length > 0) {
      try {
        // Call the getTransactionsByUser function
        const userTransactions = await contract.methods.getTransactionsByUser(accounts[0]).call();
  
        // Map the transactions into a readable format
        const formattedTxs = userTransactions.map((tx) => ({
          user: tx.user, // Address of the user
          transactionType: tx.transactionType, // Deposit, Borrow, Repay, or Withdraw
          // Handle BigInt conversion to string before using fromWei
           amount: web3.utils.fromWei(tx.amount.toString(), "ether"), // Convert amount to Ether
           timestamp: new Date(Number(tx.timestamp) * 1000).toLocaleString(), // Convert UNIX timestamp
          }));
  
        setTransactions(formattedTxs); // Update the state with the formatted transactions
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  // Connect function to request user account
  const connect = async () => {
    if (window.ethereum) {
      const accountsList = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accountsList);
      localStorage.setItem("accountAddress", accountsList[0]); // Save account to localStorage
      setAuthUser(true);
    } else {
      alert("Please install MetaMask to connect.");
    }
  };

  // Logout function
  const logout = () => {
    setAuthUser(false); // Reset authentication state
    setAccounts([]); // Clear accounts
    localStorage.removeItem("accountAddress"); // Remove saved account from localStorage
  };

  // Deposit handlers
  const handleDeposit = async () => {
    if (depositAmount > 0) {
      await contract.methods.deposit().send({
        from: accounts[0],
        value: web3.utils.toWei(depositAmount, "ether"),
      });
      fetchData();
    }
  };

  // Withdraw handlers
  const handleWithdraw = async () => {
    if (withdrawAmount > 0 && canWithdraw) {
      await contract.methods
        .withdraw(web3.utils.toWei(withdrawAmount, "ether"))
        .send({ from: accounts[0] });
      fetchData();
    }
  };
  
  // Borrow handlers
  const handleBorrow = async () => {
    if (borrowAmount > 0) {
      await contract.methods
        .borrow(web3.utils.toWei(borrowAmount, "ether"))
        .send({ from: accounts[0] });
      fetchData();
    }
  };

  // Repay handlers
  const handleRepay = async () => {
    if (repayAmount > 0) {
      await contract.methods.repay().send({
        from: accounts[0],
        value: web3.utils.toWei(repayAmount, "ether"),
      });
      fetchData();
    }
  };

  // Initialize Web3 and contract
    useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

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

    // Load saved account from localStorage on page refresh
    useEffect(() => {
      const savedAccount = localStorage.getItem("accountAddress");
      if (savedAccount) {
        setAccounts([savedAccount]);
        setAuthUser(true);
      }
  }, []);

    useEffect(() => {
    fetchData();
  }, [contract, accounts, fetchData]);

  // Render UI
  return (
    <>
      <Header address={accounts[0]} authUser={authUser} walletBalance={walletBalance} connect={connect} logout={logout} /> {/* Pass account address to the Header */}
      <Router>
        <Routes>
          {/* Conditional routes based on authentication */}
          <Route
            path="/transactions"
            element={authUser ? <TransactionContainer
              transactions={transactions}
              walletBalance={walletBalance}
              contractEthBalance={contractEthBalance}
              userCollateral={userCollateral}
              userBorrowed={userBorrowed}
              borrowCapacity={borrowCapacity}
              canWithdraw={canWithdraw}
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              handleDeposit={handleDeposit}
              withdrawAmount={withdrawAmount}
              setWithdrawAmount={setWithdrawAmount}
              handleWithdraw={handleWithdraw}
              borrowAmount={borrowAmount}
              setBorrowAmount={setBorrowAmount}
              handleBorrow={handleBorrow}
              repayAmount={repayAmount}
              setRepayAmount={setRepayAmount}
              handleRepay={handleRepay}
            /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={!authUser ? <LandingPage connect={connect} /> : <Navigate to="/transactions" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;

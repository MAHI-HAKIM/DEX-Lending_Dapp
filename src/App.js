import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LendingPlatform from './LendingPlatform.json'; // Ensure ABI path is correct

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');
  const [userDeposited, setUserDeposited] = useState(0);
  const [userBorrowed, setUserBorrowed] = useState(0);
  const [remainingRepay, setRemainingRepay] = useState(0);

  // Initialize Web3 and Contract
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accountsList = await web3Instance.eth.getAccounts();
          setAccounts(accountsList);

          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = LendingPlatform.networks[networkId];

          if (deployedNetwork) {
            console.log("Deployed Network address: ", deployedNetwork.address);
            const lendingPlatformInstance = new web3Instance.eth.Contract(
              LendingPlatform.abi,
              deployedNetwork.address
            );
            setContract(lendingPlatformInstance);
          } else {
            alert('Smart contract not deployed to detected network.');
          }
        } else {
          alert('Please install MetaMask to use this app.');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      }
    };

    initWeb3();
  }, []);

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (web3 && accounts.length > 0) {
      const balance = await web3.eth.getBalance(accounts[0]);
      setWalletBalance(web3.utils.fromWei(balance, 'ether'));
    }
  };

  // Fetch the total contract balance
  const fetchContractBalance = async () => {
    if (contract) {
      try {
        const balance = await contract.methods.contractBalance().call();
        setContractBalance(web3.utils.fromWei(balance, 'ether'));
      } catch (error) {
        console.error('Error fetching contract balance:', error);
      }
    }
  };

  // Fetch user-specific data (deposits, borrowed, remaining repay)
  const fetchUserData = async () => {
    if (contract && accounts.length > 0) {
        try {
            // Directly access balances and borrowedAmounts mappings
            const deposited = await contract.methods.balances(accounts[0]).call();
            setUserDeposited(web3.utils.fromWei(deposited, 'ether'));

            const borrowed = await contract.methods.borrowedAmounts(accounts[0]).call();
            setUserBorrowed(web3.utils.fromWei(borrowed, 'ether'));

            const remainingRepayAmount = await contract.methods.borrowedAmounts(accounts[0]).call();
            setRemainingRepay(web3.utils.fromWei(remainingRepayAmount, 'ether'));
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
};


  // Handle deposit (lend)
  const deposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid deposit amount');
      return;
    }

    if (contract && accounts.length > 0) {
      try {
        await contract.methods.deposit().send({
          from: accounts[0],
          value: web3.utils.toWei(depositAmount, 'ether'),
        });
        alert('Deposit Successful!');
        fetchUserData(); // Fetch updated data after deposit
        fetchContractBalance();
        fetchWalletBalance();
      } catch (error) {
        console.error('Error during deposit:', error);
        alert('Deposit failed. Check console for details.');
      }
    }
  };

  // Handle borrowing
  const borrow = async () => {
    if (!borrowAmount || isNaN(borrowAmount) || parseFloat(borrowAmount) <= 0) {
      alert('Please enter a valid borrow amount');
      return;
    }

    if (contract && accounts.length > 0) {
      try {
        await contract.methods.borrow(web3.utils.toWei(borrowAmount, 'ether')).send({
          from: accounts[0],
        });
        alert('Borrowing Successful!');
        fetchUserData(); // Fetch updated data after borrowing
        fetchContractBalance();
        fetchWalletBalance();
      } catch (error) {
        console.error('Error during borrowing:', error);
        alert('Borrow failed. Check console for details.');
      }
    }
  };

  // Handle repayment
  const repay = async () => {
    if (!repayAmount || isNaN(repayAmount) || parseFloat(repayAmount) <= 0) {
      alert('Please enter a valid repay amount');
      return;
    }

    if (contract && accounts.length > 0) {
      try {
        await contract.methods.repay(web3.utils.toWei(repayAmount, 'ether')).send({
          from: accounts[0],
        });
        alert('Repayment Successful!');
        fetchUserData(); // Fetch updated data after repayment
        fetchContractBalance();
        fetchWalletBalance();
      } catch (error) {
        console.error('Error during repayment:', error);
        alert('Repayment failed. Check console for details.');
      }
    }
  };

  // Refresh wallet and contract balances
  useEffect(() => {
    fetchWalletBalance();
    fetchContractBalance();
    fetchUserData();
  }, [contract, accounts]);

  return (
    <div className="App">
      <h1>Lending & Borrowing Platform</h1>
      <h3>Account: {accounts[0]}</h3>
      <h4>Wallet Balance (MetaMask): {walletBalance} ETH</h4>
      <h4>User Deposited to Contract: {userDeposited} ETH</h4>
      <h4>User Borrowed from Contract: {userBorrowed} ETH</h4>
      <h4>Remaining Repayment: {remainingRepay} ETH</h4>
      <h4>Total Deposits in Contract: {contractBalance} ETH</h4>

      <div>
        <h3>Lend (Deposit)</h3>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={deposit}>Deposit</button>
      </div>

      <div>
        <h3>Borrow</h3>
        <input
          type="number"
          value={borrowAmount}
          onChange={(e) => setBorrowAmount(e.target.value)}
          placeholder="Amount to Borrow in ETH"
        />
        <button onClick={borrow}>Borrow</button>
      </div>

      <div>
        <h3>Repay Borrowed Amount</h3>
        <input
          type="number"
          value={repayAmount}
          onChange={(e) => setRepayAmount(e.target.value)}
          placeholder="Amount to Repay in ETH"
        />
        <button onClick={repay}>Repay</button>
      </div>

      <button onClick={() => { fetchWalletBalance(); fetchContractBalance(); fetchUserData(); }}>Refresh Balances</button>
    </div>
  );
}

export default App;

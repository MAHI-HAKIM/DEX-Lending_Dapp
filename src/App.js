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

// Fetch user data
const fetchUserData = async () => {
  if (contract && accounts.length > 0) {
    try {
      const deposited = await contract.methods.balances(accounts[0]).call();
      // Ensure it's a number
      setUserDeposited(parseFloat(web3.utils.fromWei(deposited, 'ether')));

      const borrowed = await contract.methods.borrowedAmounts(accounts[0]).call();
      setUserBorrowed(parseFloat(web3.utils.fromWei(borrowed, 'ether')));

      const repayAmount = await contract.methods.borrowedAmounts(accounts[0]).call();
      setRemainingRepay(parseFloat(web3.utils.fromWei(repayAmount, 'ether')));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
};

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    if (web3 && accounts.length > 0) {
      const balance = await web3.eth.getBalance(accounts[0]);
      const balanceInEther = web3.utils.fromWei(balance, 'ether');
      setWalletBalance(parseFloat(balanceInEther));  // Ensure it's a number
    }
  };

  // Fetch the total contract balance
  const fetchContractBalance = async () => {
    if (contract) {
      try {
        const balance = await contract.methods.contractBalance().call();
        setContractBalance(parseFloat(web3.utils.fromWei(balance, 'ether'))); // Convert to float
      } catch (error) {
        console.error('Error fetching contract balance:', error);
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Lending & Borrowing Platform</h1>
        <h3 className="text-xl font-medium text-center text-gray-800 mb-4">Account: {accounts[0]}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h4>Wallet Balance (MetaMask): {walletBalance.toFixed(2)} ETH</h4>
            <p className="text-2xl text-gray-900">{walletBalance.toFixed(2)} ETH</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-medium text-gray-700">Contract Balance</h4>
            <p className="text-2xl text-gray-900">{isNaN(contractBalance) ? '0.00' : contractBalance.toFixed(2)} ETH</p>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700">Your Deposited Amount</h4>
             <p className="text-xl text-gray-900">
                 {isNaN(userDeposited) ? '0.00' : userDeposited.toFixed(2)} ETH
             </p>
           </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700">Your Borrowed Amount</h4>
          <p className="text-xl text-gray-900">{userBorrowed.toFixed(2)} ETH</p>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700">Remaining Repayment</h4>
          <p className="text-xl text-gray-900">{remainingRepay.toFixed(2)} ETH</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Lend (Deposit)</h3>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="w-full p-3 border border-gray-300 rounded-lg mb-2"
            />
            <button onClick={deposit} className="w-full bg-blue-600 text-white p-3 rounded-lg">Deposit</button>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Borrow</h3>
            <input
              type="number"
              value={borrowAmount}
              onChange={(e) => setBorrowAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="w-full p-3 border border-gray-300 rounded-lg mb-2"
            />
            <button onClick={borrow} className="w-full bg-green-600 text-white p-3 rounded-lg">Borrow</button>
          </div>

          <div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Repay</h3>
            <input
              type="number"
              value={repayAmount}
              onChange={(e) => setRepayAmount(e.target.value)}
              placeholder="Amount in ETH"
              className="w-full p-3 border border-gray-300 rounded-lg mb-2"
            />
            <button onClick={repay} className="w-full bg-red-600 text-white p-3 rounded-lg">Repay</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LendingPlatform from './LendingPlatform.json';



function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0); // User's MetaMask balance
  const [contractBalance, setContractBalance] = useState(0); // User's contract balance
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {

   

    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // console.log('Contract ABI Networks:', LendingPlatform.networks);

          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accountsList = await web3Instance.eth.getAccounts();
          setAccounts(accountsList);

          const networkId = await web3Instance.eth.net.getId();
          // console.log('Network ID:', networkId);
          const deployedNetwork = LendingPlatform.networks[networkId];

          // console.log('Network ID:', networkId);

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

  const fetchWalletBalance = async () => {
    if (web3 && accounts.length > 0) {
      const balance = await web3.eth.getBalance(accounts[0]);
      setWalletBalance(web3.utils.fromWei(balance, 'ether'));
    }
  };

  const fetchContractBalance = async () => {
    if (contract && accounts.length > 0) {
      try {
        const balance = await contract.methods.balances(accounts[0]).call();
        setContractBalance(web3.utils.fromWei(balance, 'ether'));
      } catch (error) {
        console.error('Error fetching contract balance:', error);
      }
    }
  };

  const deposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid deposit amount');
      return;
    }
    
    console.log('Deposit function triggered...');
    console.log('Contract Instance:', contract);
    console.log('Deposit Amount:', depositAmount);

    if (contract && accounts.length > 0 && depositAmount) {
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
    } else {
        console.log('Missing contract, account, or depositAmount!');
    }
};


  const withdraw = async () => {
    if (contract && accounts.length > 0) {
      try {
        console.log('Withdrawal initiated...');
        await contract.methods.withdraw().send({ from: accounts[0] });
        alert('Withdraw Successful!');
        fetchContractBalance();
        fetchWalletBalance();
      } catch (error) {
        console.error('Error during withdrawal:', error);
        alert('Withdrawal failed. Check console for details.');
      }
    }
  };

  useEffect(() => {
    fetchWalletBalance();
    fetchContractBalance();
  }, [contract, accounts]);

  return (
    <div className="App">
      <h1>Lending Platform</h1>
      <h3>Account: {accounts[0]}</h3>
      <h4>Wallet Balance (MetaMask): {walletBalance} ETH</h4>
      <h4>Contract Balance: {contractBalance} ETH</h4>

      <div>
        <h3>Deposit</h3>
        <input
          type="number"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button
  onClick={() => {
    console.log('Deposit button clicked');
    deposit();
  }}
>
  Deposit
</button>

      </div>

      <div>
        <h3>Withdraw</h3>
        <button onClick={withdraw}>Withdraw All</button>
      </div>

      <button onClick={() => { fetchWalletBalance(); fetchContractBalance(); }}>Refresh Balances</button>
    </div>
  );
}

export default App;

# Lending Platform

This project is a decentralized Ethereum-based lending platform, implemented as a smart contract using Solidity. The platform allows users to:

- Deposit ETH as collateral.
- Borrow ETH based on the collateral with a defined Loan-to-Value (LTV) ratio.
- Repay borrowed amounts.
- Withdraw collateral if no outstanding loans exist.

The platform includes features such as service charges, interest rates, and dynamic borrowing limits, making it a professional-grade lending application.

---

## Features

1. **Deposit**
   - Users can deposit ETH into the platform as collateral.

2. **Borrow**
   - Users can borrow ETH up to 75% of their deposited collateral (configurable LTV ratio).
   - Borrowing incurs an annual interest rate, calculated in real time.

3. **Repay**
   - Users can repay borrowed ETH either partially or fully.

4. **Withdraw**
   - Users can withdraw their collateral if they have no outstanding debt.

5. **Service Charges**
   - The platform charges a small fee on each transaction to maintain the ecosystem.

6. **Transparency**
   - All user actions (deposit, withdraw, borrow, repay) are logged using Ethereum events.

7. **Dynamic Borrowing Capacity**
   - The platform dynamically adjusts borrowing limits based on the user’s collateral value and current debt.

8. **Security Features**
   - Utilizes OpenZeppelin’s `Ownable` and `SafeMath` libraries for enhanced security and error handling.

---

## Installation Guide

### Prerequisites
1. **Node.js** (Recommended version: LTS, such as v18.x or v16.x)
2. **Ganache** for local Ethereum blockchain development
3. **Truffle** for smart contract management and deployment
4. **MetaMask** browser extension for interacting with the deployed contract

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd lending-platform
```

### Step 2: Install Dependencies
Ensure you have all required packages installed:
```bash
npm install
```

### Step 3: Install Ganache
Ganache provides a local Ethereum blockchain for testing and development.

1. Download Ganache:
   - [Ganache Desktop](https://trufflesuite.com/ganache/)
   - Alternatively, install Ganache CLI:
     ```bash
     npm install -g ganache-cli
     ```

2. Start Ganache:
   - If using the desktop app, launch Ganache and start a new workspace.
   - If using the CLI:
     ```bash
     ganache-cli
     ```

### Step 4: Configure Truffle
Update `truffle-config.js` to match Ganache’s network settings:
```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.0" // Ensure compatibility with Solidity code
    }
  }
};
```

### Step 5: Deploy the Contract
Deploy the smart contract to the Ganache network:
```bash
truffle migrate --reset
```

### Step 6: Interact with the Contract
Use Truffle Console or a front-end interface (e.g., React or Web3.js) to interact with the deployed contract.

---

## Front-End Integration

The platform can be integrated with a React front-end application using `web3.js` or `ethers.js` for interaction with the smart contract.

1. Install Web3.js:
   ```bash
   npm install web3
   ```

2. Connect to MetaMask and the deployed contract:
   ```javascript
   import Web3 from "web3";

   const web3 = new Web3(Web3.givenProvider);
   const contractAddress = "<Deployed Contract Address>";
   const abi = [<Contract ABI>];

   const contract = new web3.eth.Contract(abi, contractAddress);
   ```

---

## Testing

Truffle provides a framework for writing automated tests for your smart contract. To run tests:
```bash
truffle test
```

---

## Application Insights

### Landing Page
![Application Screenshots](https://github.com/MAHI-HAKIM/DEX-Lending_DAPP/blob/master/pic/landingPage.png)
### Transaction Page
![Application Screenshots](https://github.com/MAHI-HAKIM/DEX-Lending_DAPP/blob/master/pic/metamaskRequest.png)
### Transaction History 
![Application Screenshots](https://github.com/MAHI-HAKIM/DEX-Lending_DAPP/blob/master/pic/transactionHistory.png)

---

## Troubleshooting

### Common Issues

1. **Ganache Connection Error**:
   - Ensure Ganache is running and listening on the correct host and port.

2. **Compatibility Issues**:
   - Ensure Node.js version is compatible with Truffle and Ganache.
   - Reinstall dependencies if errors persist:
     ```bash
     rm -rf node_modules package-lock.json
     npm install
     ```

3. **Deployment Fails**:
   - Check `truffle-config.js` for correct network configuration.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments

- [OpenZeppelin](https://openzeppelin.com) for their reusable Solidity libraries.
- [Truffle Suite](https://trufflesuite.com) for making Ethereum development seamless.
- [Ganache](https://trufflesuite.com/ganache/) for local blockchain simulation.
- [MetaMask](https://metamask.io) for user-friendly Ethereum wallet integration.


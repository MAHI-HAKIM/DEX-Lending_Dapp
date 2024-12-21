module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (Ganache)
      port: 7545,        // Ganache port
      network_id: "*",   // Match any network ID
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Specify the Solidity compiler version
    },
  },
};

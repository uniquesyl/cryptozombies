require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

const { MNEMONIC, PROJECT_ID } = process.env;

// 多个RPC端点配置
const rpcEndpoints = {
  infura: `https://sepolia.infura.io/v3/${PROJECT_ID}`,
  public: 'https://rpc.sepolia.org',
  publicnode: 'https://ethereum-sepolia.publicnode.com',
  tenderly: 'https://sepolia.gateway.tenderly.co'
};

// 创建不同的网络配置
const networkConfigs = {
  sepolia_infura: {
    provider: () => new HDWalletProvider({
      mnemonic: MNEMONIC,
      providerOrUrl: rpcEndpoints.infura,
      numberOfAddresses: 1,
      shareNonce: true,
      derivationPath: "m/44'/60'/0'/0/",
      pollingInterval: 12000,
      chainId: 11155111
    }),
    network_id: 11155111,
    gas: 5000000,
    gasPrice: 20000000000,
    confirmations: 2,
    timeoutBlocks: 200,
    skipDryRun: true,
    networkCheckTimeout: 30000,
    deploymentPollingInterval: 15000
  },
  
  sepolia_public: {
    provider: () => new HDWalletProvider({
      mnemonic: MNEMONIC,
      providerOrUrl: rpcEndpoints.public,
      numberOfAddresses: 1,
      shareNonce: true,
      derivationPath: "m/44'/60'/0'/0/",
      pollingInterval: 8000,
      chainId: 11155111
    }),
    network_id: 11155111,
    gas: 5000000,
    gasPrice: 20000000000,
    confirmations: 2,
    timeoutBlocks: 200,
    skipDryRun: true,
    networkCheckTimeout: 30000
  },
  
  sepolia_publicnode: {
    provider: () => new HDWalletProvider({
      mnemonic: MNEMONIC,
      providerOrUrl: rpcEndpoints.publicnode,
      numberOfAddresses: 1,
      shareNonce: true,
      derivationPath: "m/44'/60'/0'/0/",
      pollingInterval: 8000,
      chainId: 11155111
    }),
    network_id: 11155111,
    gas: 5000000,
    gasPrice: 20000000000,
    confirmations: 2,
    timeoutBlocks: 200,
    skipDryRun: true,
    networkCheckTimeout: 30000
  }
};

module.exports = {
  rpcEndpoints,
  networkConfigs
}; 
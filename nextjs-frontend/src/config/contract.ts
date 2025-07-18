import { NetworkConfig, ContractConfig } from '../types';

// 网络配置
export const NETWORKS: Record<string, NetworkConfig> = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2',
    blockExplorer: 'https://sepolia.etherscan.io',
    currency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18
    }
  },
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2',
    blockExplorer: 'https://etherscan.io',
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  },
  localhost: {
    chainId: 1337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545',
    blockExplorer: '',
    currency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    }
  }
};

// 合约配置
export const CONTRACT_CONFIG: ContractConfig = {
  address: '0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4',
  abi: [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "createRandomZombie",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_zombieId",
          "type": "uint256"
        }
      ],
      "name": "levelUp",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_zombieId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_targetId",
          "type": "uint256"
        }
      ],
      "name": "attack",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_zombieId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_newName",
          "type": "string"
        }
      ],
      "name": "changeName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "getZombiesByOwner",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "zombies",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "dna",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "level",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "readyTime",
          "type": "uint32"
        },
        {
          "internalType": "uint16",
          "name": "winCount",
          "type": "uint16"
        },
        {
          "internalType": "uint16",
          "name": "lossCount",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ] as const
};

// 默认网络
export const DEFAULT_NETWORK = NETWORKS.sepolia;

// 合约地址映射
export const CONTRACT_ADDRESSES: Record<number, string> = {
  [NETWORKS.sepolia.chainId]: CONTRACT_CONFIG.address,
  [NETWORKS.mainnet.chainId]: '', // 主网合约地址（待部署）
  [NETWORKS.localhost.chainId]: '' // 本地合约地址
};

// 获取当前网络的合约地址
export const getContractAddress = (chainId: number): string => {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_CONFIG.address;
};

// 检查网络是否支持
export const isSupportedNetwork = (chainId: number): boolean => {
  return Object.values(NETWORKS).some(network => network.chainId === chainId);
};

// 获取网络配置
export const getNetworkConfig = (chainId: number): NetworkConfig | null => {
  return Object.values(NETWORKS).find(network => network.chainId === chainId) || null;
}; 
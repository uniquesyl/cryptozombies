import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // 检测 MetaMask 是否安装
  const detectProvider = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum;
    }
    return null;
  }, []);

  // 连接钱包
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const ethereum = await detectProvider();
      
      if (!ethereum) {
        throw new Error('请安装 MetaMask 钱包');
      }

      // 请求连接账户
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('没有找到账户');
      }

      const account = accounts[0];
      setAccount(account);

      // 创建 provider 和 signer
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      
      setProvider(provider);
      setSigner(signer);

      // 获取当前网络并等待一下确保网络信息完全加载
      try {
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        console.log('网络信息:', network.name, network.chainId);
      } catch (networkErr) {
        console.warn('获取网络信息失败，稍后重试:', networkErr);
        // 不抛出错误，让连接继续进行
      }

      console.log('钱包连接成功:', account);
      return account;

    } catch (err) {
      console.error('连接钱包失败:', err);
      setError(err.message || '连接钱包失败');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [detectProvider]);

  // 断开连接
  const disconnectWallet = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setError(null);
    console.log('钱包已断开连接');
  }, []);

  // 切换网络
  const switchNetwork = useCallback(async (targetChainId) => {
    if (!window.ethereum) {
      throw new Error('MetaMask 未安装');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
    } catch (err) {
      // 如果网络不存在，尝试添加网络
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${targetChainId.toString(16)}`,
            chainName: 'Sepolia Testnet',
            nativeCurrency: {
              name: 'Sepolia Ether',
              symbol: 'SEP',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2'],
            blockExplorerUrls: ['https://sepolia.etherscan.io/']
          }]
        });
      } else {
        throw err;
      }
    }
  }, []);

  // 处理账户变化
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      // 用户断开了连接
      disconnectWallet();
    } else {
      // 用户切换了账户
      setAccount(accounts[0]);
    }
  }, [disconnectWallet]);

  // 处理网络变化
  const handleChainChanged = useCallback(async (chainId) => {
    setChainId(parseInt(chainId, 16));
    
    // 重新获取 provider 和 signer
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);
    }
  }, []);

  // 初始化
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const ethereum = await detectProvider();
        
        if (ethereum) {
          // 检查是否已经连接
          const accounts = await ethereum.request({
            method: 'eth_accounts'
          });

          if (accounts.length > 0) {
            const account = accounts[0];
            setAccount(account);

            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            
            setProvider(provider);
            setSigner(signer);
            
            // 获取网络信息
            try {
              const network = await provider.getNetwork();
              setChainId(network.chainId);
            } catch (networkErr) {
              console.warn('初始化时获取网络信息失败:', networkErr);
            }
          }

          // 监听事件
          ethereum.on('accountsChanged', handleAccountsChanged);
          ethereum.on('chainChanged', handleChainChanged);

          // 清理函数
          return () => {
            ethereum.removeListener('accountsChanged', handleAccountsChanged);
            ethereum.removeListener('chainChanged', handleChainChanged);
          };
        }
      } catch (err) {
        console.error('初始化 Web3 失败:', err);
        setError(err.message);
      }
    };

    initWeb3();
  }, [detectProvider, handleAccountsChanged, handleChainChanged]);

  // 网络状态自动刷新
  useEffect(() => {
    if (provider && chainId === null) {
      const refreshNetwork = async () => {
        try {
          const network = await provider.getNetwork();
          setChainId(network.chainId);
        } catch (err) {
          console.warn('刷新网络信息失败:', err);
        }
      };

      // 延迟1秒后重试获取网络信息
      const timer = setTimeout(refreshNetwork, 1000);
      return () => clearTimeout(timer);
    }
  }, [provider, chainId]);

  // 检查是否在正确的网络
  const isCorrectNetwork = useCallback(() => {
    // 如果 chainId 还没有加载，返回 true 避免显示错误
    if (chainId === null) {
      return true;
    }
    // Sepolia 测试网的 chainId 是 11155111
    return chainId === 11155111n;
  }, [chainId]);

  return {
    provider,
    signer,
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    isCorrectNetwork,
    detectProvider
  };
}; 
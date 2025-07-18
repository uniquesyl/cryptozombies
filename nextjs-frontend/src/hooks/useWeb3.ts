'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Web3State } from '../types';
import { NETWORKS } from '../config/contract';

// 扩展 Window 接口
declare global {
  interface Window {
    ethereum?: unknown;
  }
}

// 检测 MetaMask 提供者
const detectProvider = async (): Promise<unknown> => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return window.ethereum;
  }
  return null;
};

export const useWeb3 = (): Web3State & {
  connectWallet: () => Promise<string>;
  disconnectWallet: () => void;
  switchNetwork: (targetChainId: number) => Promise<void>;
  chainId: number | null;
  isInitializing: boolean;
  retryCount: number;
} => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // 自动重连机制
  useEffect(() => {
    if (retryCount > 0 && retryCount < 5) {
      const timer = setTimeout(async () => {
        console.log(`尝试重新连接钱包 (${retryCount}/5)...`);
        try {
          // 直接在这里实现重连逻辑，避免依赖问题
          const ethereum = await detectProvider();
          if (ethereum) {
            const accounts = await (ethereum as { request: (params: { method: string }) => Promise<string[]> }).request({
              method: 'eth_requestAccounts'
            });
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              const provider = new ethers.providers.Web3Provider(ethereum as ethers.providers.ExternalProvider);
              const signer = provider.getSigner();
              setProvider(provider);
              setSigner(signer);
              setError(null);
              setRetryCount(0);
            }
          }
        } catch (err) {
          console.warn('重试连接失败:', err);
        }
      }, 1000 * (retryCount + 1)); // 递增延迟
      
      return () => clearTimeout(timer);
    }
  }, [retryCount]);

  // 连接钱包
  const connectWallet = useCallback(async (): Promise<string> => {
    setIsConnecting(true);
    setError(null);

    try {
      const ethereum = await detectProvider();
      
      if (!ethereum) {
        throw new Error('请安装 MetaMask 钱包');
      }

      // 请求连接账户
      const accounts = await (ethereum as { request: (params: { method: string }) => Promise<string[]> }).request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('没有找到账户');
      }

      const account = accounts[0];
      setAccount(account);

      // 创建 provider 和 signer，添加重试机制
      let provider: ethers.providers.Web3Provider | undefined;
      let signer: ethers.Signer | undefined;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          provider = new ethers.providers.Web3Provider(ethereum as ethers.providers.ExternalProvider);
          signer = provider.getSigner();
          break;
        } catch (err) {
          attempts++;
          console.warn(`Provider 创建失败，尝试 ${attempts}/${maxAttempts}:`, err);
          if (attempts >= maxAttempts) {
            throw new Error('无法创建钱包连接，请刷新页面重试');
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (!provider || !signer) {
        throw new Error('无法创建钱包连接');
      }
      
      setProvider(provider);
      setSigner(signer);

      // 获取当前网络并等待一下确保网络信息完全加载
      try {
        const network = await provider.getNetwork();
        const networkChainId = Number(network.chainId);
        setChainId(networkChainId);
        console.log('连接钱包时网络信息:', {
          chainId: networkChainId,
          networkName: network.name,
          isSepolia: networkChainId === NETWORKS.sepolia.chainId
        });
      } catch (networkErr) {
        console.warn('获取网络信息失败，尝试备用方法:', networkErr);
        // 尝试从 ethereum 对象获取 chainId
        try {
          const chainIdHex = await (ethereum as { request: (params: { method: string }) => Promise<string> }).request({ method: 'eth_chainId' });
          const chainId = parseInt(chainIdHex, 16);
          setChainId(chainId);
          console.log('备用方法获取 chainId:', chainId);
        } catch (fallbackErr) {
          console.warn('备用网络检测也失败:', fallbackErr);
          // 不抛出错误，让连接继续进行
        }
      }

      console.log('钱包连接成功:', account);
      setRetryCount(0); // 重置重试计数
      return account;

    } catch (err) {
      console.error('连接钱包失败:', err);
      const errorMessage = err instanceof Error ? err.message : '连接钱包失败';
      setError(errorMessage);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // 断开连接
  const disconnectWallet = useCallback((): void => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setChainId(null);
    setError(null);
    setRetryCount(0);
    console.log('钱包已断开连接');
  }, []);

  // 切换网络
  const switchNetwork = useCallback(async (targetChainId: number): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask 未安装');
    }

    try {
      await (window.ethereum as { request: (params: unknown) => Promise<unknown> }).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      });
    } catch (err: unknown) {
      // 如果网络不存在，尝试添加网络
      if ((err as { code: number }).code === 4902) {
        const networkConfig = Object.values(NETWORKS).find(network => network.chainId === targetChainId);
        if (!networkConfig) {
          throw new Error('不支持的网络');
        }

        await (window.ethereum as { request: (params: unknown) => Promise<unknown> }).request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${targetChainId.toString(16)}`,
            chainName: networkConfig.name,
            nativeCurrency: networkConfig.currency,
            rpcUrls: [networkConfig.rpcUrl],
            blockExplorerUrls: networkConfig.blockExplorer ? [networkConfig.blockExplorer] : []
          }]
        });
      } else {
        throw err;
      }
    }
  }, []);

  // 处理账户变化
  const handleAccountsChanged = useCallback((accounts: string[]): void => {
    if (accounts.length === 0) {
      // 用户断开了连接
      disconnectWallet();
    } else {
      // 用户切换了账户
      setAccount(accounts[0]);
    }
  }, [disconnectWallet]);

  // 处理网络变化
  const handleChainChanged = useCallback(async (chainId: string): Promise<void> => {
    console.log('网络变化事件触发:', chainId);
    const newChainId = parseInt(chainId, 16);
    setChainId(newChainId);
    
    // 重新获取 provider 和 signer
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
        const signer = provider.getSigner();
        setProvider(provider);
        setSigner(signer);
        
        // 验证网络信息
        const network = await provider.getNetwork();
        console.log('网络变化后验证:', {
          eventChainId: newChainId,
          networkChainId: Number(network.chainId),
          networkName: network.name
        });
        
        // 确保网络信息一致
        if (Number(network.chainId) !== newChainId) {
          console.warn('网络信息不一致，使用事件中的 chainId');
          setChainId(newChainId);
        }
      } catch (err) {
        console.warn('网络变化时重新连接失败:', err);
      }
    }
  }, []);

  // 初始化
  useEffect(() => {
    const initWeb3 = async (): Promise<void> => {
      setIsInitializing(true);
      try {
        const ethereum = await detectProvider();
        
        if (ethereum) {
          // 检查是否已经连接
          const accounts = await (ethereum as { request: (params: { method: string }) => Promise<string[]> }).request({
            method: 'eth_accounts'
          });

          if (accounts.length > 0) {
            const account = accounts[0];
            setAccount(account);

            // 创建 provider 和 signer，添加重试机制
            let provider: ethers.providers.Web3Provider | undefined;
            let signer: ethers.Signer | undefined;
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts) {
              try {
                provider = new ethers.providers.Web3Provider(ethereum as ethers.providers.ExternalProvider);
                signer = provider.getSigner();
                break;
              } catch (err) {
                attempts++;
                console.warn(`初始化时 Provider 创建失败，尝试 ${attempts}/${maxAttempts}:`, err);
                if (attempts >= maxAttempts) {
                  throw new Error('无法创建钱包连接');
                }
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }

            if (provider && signer) {
              setProvider(provider);
              setSigner(signer);

              // 获取网络信息
              try {
                const network = await provider.getNetwork();
                const networkChainId = Number(network.chainId);
                setChainId(networkChainId);
                console.log('初始化时网络信息:', {
                  chainId: networkChainId,
                  networkName: network.name,
                  isSepolia: networkChainId === NETWORKS.sepolia.chainId
                });
              } catch (networkErr) {
                console.warn('初始化时获取网络信息失败，尝试备用方法:', networkErr);
                try {
                  const chainIdHex = await (ethereum as { request: (params: { method: string }) => Promise<string> }).request({ method: 'eth_chainId' });
                  const chainId = parseInt(chainIdHex, 16);
                  setChainId(chainId);
                  console.log('初始化时备用方法获取 chainId:', chainId);
                } catch (fallbackErr) {
                  console.warn('初始化时备用网络检测也失败:', fallbackErr);
                }
              }
            }

            // 设置事件监听器
            (ethereum as { on: (event: string, handler: (...args: unknown[]) => void) => void }).on('accountsChanged', (...args: unknown[]) => {
              const accounts = args[0] as string[];
              handleAccountsChanged(accounts);
            });
            (ethereum as { on: (event: string, handler: (...args: unknown[]) => void) => void }).on('chainChanged', (...args: unknown[]) => {
              const chainId = args[0] as string;
              handleChainChanged(chainId);
            });
          }
        }
      } catch (err) {
        console.error('初始化 Web3 失败:', err);
        setError(err instanceof Error ? err.message : '初始化失败');
        setRetryCount(prev => prev + 1);
      } finally {
        setIsInitializing(false);
      }
    };

    initWeb3();

    // 清理函数
    return () => {
      const cleanup = async () => {
        const ethereum = await detectProvider();
        if (ethereum) {
          // 使用与设置监听器时相同的包装函数
          const accountsChangedWrapper = (...args: unknown[]) => {
            const accounts = args[0] as string[];
            handleAccountsChanged(accounts);
          };
          const chainChangedWrapper = (...args: unknown[]) => {
            const chainId = args[0] as string;
            handleChainChanged(chainId);
          };
          
          (ethereum as { removeListener: (event: string, handler: (...args: unknown[]) => void) => void }).removeListener('accountsChanged', accountsChangedWrapper);
          (ethereum as { removeListener: (event: string, handler: (...args: unknown[]) => void) => void }).removeListener('chainChanged', chainChangedWrapper);
        }
      };
      cleanup();
    };
  }, [handleAccountsChanged, handleChainChanged]);

  return {
    provider,
    signer,
    account,
    chainId,
    isConnecting,
    isInitializing,
    error,
    retryCount,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };
}; 
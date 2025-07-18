'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { NETWORKS } from '../config/contract';
import { WalletConnectProps } from '../types';

const WalletConnect: React.FC<WalletConnectProps> = ({ className = '', compact = false }) => {
  const {
    account,
    chainId,
    isConnecting,
    isInitializing,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork
  } = useWeb3();

  const [showTooltip, setShowTooltip] = useState(false);

  // 检查是否是正确的网络
  const isCorrectNetwork = React.useMemo(() => {
    if (!chainId) return false;
    return chainId === NETWORKS.sepolia.chainId;
  }, [chainId]);

  // 处理连接钱包
  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('连接失败:', err);
    }
  };

  // 处理切换网络
  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork(NETWORKS.sepolia.chainId);
    } catch (err) {
      console.error('切换网络失败:', err);
    }
  };

  // 处理断开连接
  const handleDisconnect = () => {
    disconnectWallet();
  };

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {!account ? (
          <button
            onClick={handleConnect}
            disabled={isConnecting || isInitializing}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>连接中...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>🔗</span>
                <span>连接钱包</span>
              </div>
            )}
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            {/* 网络状态指示器 */}
            <div className="relative">
              <div 
                className={`w-3 h-3 rounded-full border-2 border-white ${
                  isCorrectNetwork ? 'bg-green-400' : 'bg-red-400'
                }`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              />
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                  {isCorrectNetwork ? 'Sepolia 网络' : '请切换到 Sepolia'}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>

            {/* 账户地址 */}
            <div className="flex items-center space-x-1 bg-gray-800 rounded-lg px-3 py-2 text-white">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-mono">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>

            {/* 网络切换按钮 */}
            {!isCorrectNetwork && (
              <button
                onClick={handleSwitchNetwork}
                className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                🔄 切换网络
              </button>
            )}

            {/* 断开连接按钮 */}
            <button
              onClick={handleDisconnect}
              className="bg-gray-600 text-white px-3 py-1 rounded-md text-xs hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              ✕ 断开
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">钱包连接</h2>
        <div className="text-2xl">🔗</div>
      </div>
      
      {isInitializing ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">正在初始化 Web3...</p>
          <p className="text-gray-500 text-sm mt-2">请稍候</p>
        </div>
      ) : !account ? (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-bounce">🔗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">连接您的钱包</h3>
            <p className="text-gray-600">连接 MetaMask 钱包开始游戏</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <div className="text-red-500 mr-3 text-xl">⚠️</div>
                <div>
                  <p className="text-red-800 font-medium">连接错误</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>正在连接...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">🦊</span>
                <span>连接 MetaMask</span>
              </div>
            )}
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">还没有 MetaMask？</p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 underline font-medium transition-colors duration-200"
            >
              立即下载 →
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 连接状态 */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-green-800 font-semibold">钱包已连接</p>
                  <p className="text-green-700 text-sm font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </div>
          
          {/* 网络状态 */}
          {!isCorrectNetwork ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div>
                    <p className="text-red-800 font-semibold">网络错误</p>
                    <p className="text-red-700 text-sm">请切换到 Sepolia 测试网</p>
                  </div>
                </div>
                <div className="text-2xl">⚠️</div>
              </div>
              
              {chainId && (
                <div className="bg-red-100 rounded-lg p-3 mb-3">
                  <p className="text-red-800 text-sm">
                    <span className="font-medium">当前网络:</span> Chain ID {chainId}
                  </p>
                  <p className="text-red-800 text-sm">
                    <span className="font-medium">需要网络:</span> Chain ID {NETWORKS.sepolia.chainId}
                  </p>
                </div>
              )}
              
              <button
                onClick={handleSwitchNetwork}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>🔄</span>
                  <span>切换到 Sepolia</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-blue-800 font-semibold">网络正确</p>
                    <p className="text-blue-700 text-sm">Sepolia 测试网</p>
                  </div>
                </div>
                <div className="text-2xl">🌐</div>
              </div>
            </div>
          )}
          
          {/* 断开连接 */}
          <button
            onClick={handleDisconnect}
            className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>✕</span>
              <span>断开连接</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 
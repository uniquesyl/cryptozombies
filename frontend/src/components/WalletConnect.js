import React from 'react';
import { useWeb3 } from '../hooks/useWeb3';

const WalletConnect = () => {
  const {
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    isCorrectNetwork
  } = useWeb3();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('连接失败:', err);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchNetwork(11155111n); // Sepolia
    } catch (err) {
      console.error('切换网络失败:', err);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 px-3 py-1 rounded">
          {error}
        </div>
      )}

      {!account ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isConnecting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isConnecting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              连接中...
            </div>
          ) : (
            '连接钱包'
          )}
        </button>
      ) : (
        <div className="flex items-center space-x-3">
          {/* 网络状态 */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              chainId === null ? 'bg-yellow-500' : (isCorrectNetwork() ? 'bg-green-500' : 'bg-red-500')
            }`}></div>
            <span className="text-sm text-gray-300">
              {chainId === null ? '检测中...' : (isCorrectNetwork() ? 'Sepolia' : '错误网络')}
            </span>
          </div>

          {/* 切换网络按钮 */}
          {chainId !== null && !isCorrectNetwork() && (
            <button
              onClick={handleSwitchNetwork}
              className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
            >
              切换到 Sepolia
            </button>
          )}

          {/* 账户信息 */}
          <div className="bg-gray-200 px-3 py-1 rounded text-sm text-gray-800 font-mono">
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>

          {/* 断开连接 */}
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
          >
            断开
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 
import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWeb3 } from '../hooks/useWeb3';
import DiagnosticInfo from './DiagnosticInfo';

const CreateZombie = ({ onZombieCreated }) => {
  const [zombieName, setZombieName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { provider, signer, account } = useWeb3();
  const { createRandomZombie, loading, error: contractError } = useContract(provider, signer);

  const handleCreateZombie = async (e) => {
    e.preventDefault();
    
    if (!zombieName.trim()) {
      setError('请输入僵尸名称');
      return;
    }

    if (!account) {
      setError('请先连接钱包');
      return;
    }

    if (!provider || !signer) {
      setError('Web3 连接失败，请重新连接钱包');
      return;
    }

    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      const zombieId = await createRandomZombie(zombieName);
      
      if (zombieId) {
        setSuccess(`僵尸 "${zombieName}" 创建成功！ID: ${zombieId}`);
        setZombieName('');
        
        // 通知父组件僵尸已创建
        if (onZombieCreated) {
          onZombieCreated(zombieId);
        }
      } else {
        setError('创建僵尸失败，请重试');
      }
    } catch (err) {
      console.error('创建僵尸错误:', err);
      setError(err.message || '创建僵尸失败');
    } finally {
      setIsCreating(false);
    }
  };

  const isDisabled = !account || isCreating || loading;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">创建新僵尸</h2>
      
      {account && <DiagnosticInfo />}
      
      {!account && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <p className="text-yellow-800">请先连接钱包以创建僵尸</p>
        </div>
      )}

      <form onSubmit={handleCreateZombie} className="space-y-4">
        <div>
          <label htmlFor="zombieName" className="block text-sm font-medium text-gray-700 mb-2">
            僵尸名称
          </label>
          <input
            type="text"
            id="zombieName"
            value={zombieName}
            onChange={(e) => setZombieName(e.target.value)}
            placeholder="输入僵尸名称..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            disabled={isDisabled}
            maxLength={20}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {contractError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">合约错误: {contractError}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
          }`}
        >
          {isCreating || loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              创建中...
            </div>
          ) : (
            '创建僵尸'
          )}
        </button>
      </form>

      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">创建说明：</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 每个地址只能创建一个僵尸</li>
          <li>• 僵尸名称不能为空</li>
          <li>• 创建后僵尸将获得随机DNA</li>
          <li>• 创建需要支付少量gas费用</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateZombie; 
'use client';

import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { useWeb3 } from '../hooks/useWeb3';

const CreateZombie: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [canCreate, setCanCreate] = useState<boolean>(true);

  const { provider, signer } = useWeb3();
  const { createRandomZombie, getZombieCount } = useContract(provider, signer);
  const { account } = useWeb3();

  // 检查用户是否可以创建僵尸
  useEffect(() => {
    const checkCanCreate = async () => {
      if (!account) return;
      
      try {
        const zombieCount = await getZombieCount(account);
        const hasZombies = parseInt(zombieCount) > 0;
        setCanCreate(!hasZombies);
        
        if (hasZombies) {
          setError('您已经拥有僵尸，无法创建新的僵尸。每个地址只能创建一个僵尸。');
        } else {
          setError('');
        }
      } catch (err) {
        console.error('检查僵尸数量失败:', err);
      }
    };

    checkCanCreate();
  }, [account, getZombieCount]);

  const handleCreateZombie = async () => {
    if (!account) {
      setError('请先连接钱包');
      return;
    }

    if (!name.trim()) {
      setError('请输入僵尸名称');
      return;
    }

    if (name.length > 16) {
      setError('僵尸名称不能超过16个字符');
      return;
    }

    if (!canCreate) {
      setError('您已经拥有僵尸，无法创建新的僵尸');
      return;
    }

    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      await createRandomZombie(name);
      setSuccess('僵尸创建成功！');
      setName('');
      setCanCreate(false); // 更新状态
    } catch (err: unknown) {
      console.error('创建僵尸失败:', err);
      let errorMessage = '创建僵尸失败';
      
      if (err instanceof Error) {
        // 解析常见的合约错误
        if (err.message.includes('execution reverted')) {
          errorMessage = '合约执行失败。可能的原因：\n1. 您已经拥有僵尸\n2. 网络连接问题\n3. Gas费用不足';
        } else if (err.message.includes('user rejected')) {
          errorMessage = '用户取消了交易';
        } else if (err.message.includes('insufficient funds')) {
          errorMessage = '余额不足，请确保有足够的ETH支付Gas费用';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  if (!account) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">请先连接钱包</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">创建新僵尸</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="zombieName" className="block text-sm font-medium text-gray-700 mb-2">
            僵尸名称
          </label>
          <input
            type="text"
            id="zombieName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入僵尸名称 (最多16个字符)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            maxLength={16}
            disabled={isCreating || !canCreate}
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded whitespace-pre-line">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <button
          onClick={handleCreateZombie}
          disabled={isCreating || !name.trim() || !canCreate}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              创建中...
            </div>
          ) : !canCreate ? (
            '无法创建僵尸'
          ) : (
            '创建僵尸'
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">创建说明:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 每个地址只能创建一个僵尸</li>
          <li>• 僵尸名称不能超过16个字符</li>
          <li>• 创建后需要等待交易确认</li>
          <li>• 确保钱包有足够的ETH支付Gas费用</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateZombie; 
'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useContract } from '../hooks/useContract';

const DiagnosticInfo: React.FC = () => {
  const [diagnosticData, setDiagnosticData] = useState<{
    account: string;
    zombieCount: string;
    zombieIds: string[];
    hasZombies: boolean;
    canCreateZombie: boolean;
  } | { error: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { account, provider, signer } = useWeb3();
  const { getZombieCount, getZombiesByOwner } = useContract(provider, signer);

  const runDiagnostic = async () => {
    if (!account) return;

    setLoading(true);
    try {
      const zombieCount = await getZombieCount(account);
      const zombieIds = await getZombiesByOwner(account);
      
      setDiagnosticData({
        account,
        zombieCount,
        zombieIds,
        hasZombies: parseInt(zombieCount) > 0,
        canCreateZombie: parseInt(zombieCount) === 0
      });
    } catch (error) {
      console.error('诊断失败:', error);
      setDiagnosticData({ error: error instanceof Error ? error.message : '诊断失败' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      runDiagnostic();
    }
  }, [account]);

  if (!account) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">诊断信息</h3>
        <p className="text-yellow-700">请先连接钱包</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">诊断信息</h3>
        <p className="text-blue-700">正在检查账户状态...</p>
      </div>
    );
  }

  if (!diagnosticData) {
    return null;
  }

  if ('error' in diagnosticData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">诊断错误</h3>
        <p className="text-red-700">{diagnosticData.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">账户诊断信息</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">钱包地址:</span>
          <span className="font-mono text-gray-800">{diagnosticData.account}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">僵尸数量:</span>
          <span className="font-semibold text-gray-800">{diagnosticData.zombieCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">僵尸ID列表:</span>
          <span className="font-mono text-gray-800">
            {diagnosticData.zombieIds.length > 0 
              ? diagnosticData.zombieIds.join(', ') 
              : '无'
            }
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">是否可以创建僵尸:</span>
          <span className={`font-semibold ${diagnosticData.canCreateZombie ? 'text-green-600' : 'text-red-600'}`}>
            {diagnosticData.canCreateZombie ? '是' : '否'}
          </span>
        </div>
      </div>

      {!diagnosticData.canCreateZombie && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <p className="text-yellow-800 text-sm">
            <strong>注意:</strong> 您已经拥有僵尸，无法创建新的僵尸。每个地址只能创建一个僵尸。
          </p>
        </div>
      )}

      <button
        onClick={runDiagnostic}
        className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
      >
        刷新诊断信息
      </button>
    </div>
  );
};

export default DiagnosticInfo; 
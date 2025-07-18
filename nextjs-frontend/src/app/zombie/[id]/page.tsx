'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useWeb3 } from '../../../hooks/useWeb3';
import { useContract } from '../../../hooks/useContract';
import { Zombie } from '../../../types';
import ZombieCard from '../../../components/ZombieCard';
import LoadingState from '../../../components/LoadingState';
import Header from '../../../components/Header';
import CooldownTimer from '../../../components/CooldownTimer';

const ZombieDetailPage: React.FC = () => {
  const params = useParams();
  const zombieId = params.id as string;
  
  const [zombie, setZombie] = useState<Zombie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [isChangingName, setIsChangingName] = useState<boolean>(false);

  const { provider, signer, account, isInitializing } = useWeb3();
  const { 
    getZombieDetails, 
    changeName, 
    levelUp,
    loading: contractLoading, 
    error: contractError 
  } = useContract(provider, signer);

  useEffect(() => {
    const loadZombie = async () => {
      if (!zombieId || isInitializing) return;

      setLoading(true);
      setError('');

      try {
        const zombieData = await getZombieDetails(zombieId);
        if (zombieData) {
          setZombie(zombieData);
          setNewName(zombieData.name);
        } else {
          setError('僵尸不存在');
        }
      } catch (err) {
        console.error('加载僵尸详情失败:', err);
        setError('加载僵尸详情失败');
      } finally {
        setLoading(false);
      }
    };

    loadZombie();
  }, [zombieId, getZombieDetails, isInitializing]);

  const handleChangeName = async () => {
    if (!zombie || !newName.trim() || newName === zombie.name) return;

    setIsChangingName(true);
    setError('');

    try {
      await changeName(zombie.id, newName);
      setZombie({ ...zombie, name: newName });
    } catch (err) {
      console.error('改名失败:', err);
      const errorMessage = err instanceof Error ? err.message : '改名失败';
      setError(errorMessage);
    } finally {
      setIsChangingName(false);
    }
  };

  const handleLevelUp = async () => {
    if (!zombie) return;

    setLoading(true);
    setError('');

    try {
      await levelUp(zombie.id);
      // 重新加载僵尸数据
      const updatedZombie = await getZombieDetails(zombie.id);
      if (updatedZombie) {
        setZombie(updatedZombie);
      }
    } catch (err) {
      console.error('升级失败:', err);
      const errorMessage = err instanceof Error ? err.message : '升级失败';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = zombie && account && zombie.owner.toLowerCase() === account.toLowerCase();
  const isReady = zombie && parseInt(zombie.readyTime) <= Math.floor(Date.now() / 1000);

  if (isInitializing) {
    return (
      <div>
        <Header />
        <LoadingState message="正在初始化..." />
      </div>
    );
  }

  if (loading || contractLoading) {
    return (
      <div>
        <Header />
        <LoadingState message="正在加载僵尸详情..." />
      </div>
    );
  }

  if (error || !zombie) {
    return (
      <div>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">僵尸详情</h1>
            <p className="text-red-600">{error || '僵尸不存在'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">僵尸详情</h1>
          
          {contractError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {contractError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 僵尸卡片 */}
            <div>
              <ZombieCard
                zombie={zombie}
                showDetails={true}
                showOwner={true}
              />
            </div>

            {/* 僵尸信息和管理 */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">基本信息</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID:</span>
                    <span className="font-medium">{zombie.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">等级:</span>
                    <span className="font-medium">{zombie.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">DNA:</span>
                    <span className="font-medium font-mono text-sm">{zombie.dna}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">胜场:</span>
                    <span className="font-medium text-green-600">{zombie.winCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">负场:</span>
                    <span className="font-medium text-red-600">{zombie.lossCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">所有者:</span>
                    <span className="font-medium font-mono text-sm">{zombie.owner}</span>
                  </div>
                </div>
              </div>

              {/* 冷却时间 */}
              {!isReady && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-yellow-800 mb-2">冷却时间</h3>
                  <CooldownTimer endTime={parseInt(zombie.readyTime)} />
                </div>
              )}

              {/* 管理功能 */}
              {isOwner && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">管理功能</h2>
                  
                  {/* 改名功能 */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-2">
                        新名称
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          id="newName"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="输入新名称"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          maxLength={16}
                        />
                        <button
                          onClick={handleChangeName}
                          disabled={isChangingName || !newName.trim() || newName === zombie.name}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isChangingName ? '改名中...' : '改名'}
                        </button>
                      </div>
                    </div>

                    {/* 升级功能 */}
                    <button
                      onClick={handleLevelUp}
                      disabled={loading}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? '升级中...' : '升级僵尸 (需要 0.001 ETH)'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZombieDetailPage; 
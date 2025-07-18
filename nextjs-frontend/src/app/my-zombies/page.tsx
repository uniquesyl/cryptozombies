'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeb3 } from '../../hooks/useWeb3';
import { useContract } from '../../hooks/useContract';
import { Zombie } from '../../types';
import ZombieCard from '../../components/ZombieCard';
import LoadingState from '../../components/LoadingState';
import Header from '../../components/Header';

const MyZombiesPage: React.FC = () => {
  const [zombies, setZombies] = useState<Zombie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { provider, signer, account, isInitializing } = useWeb3();
  const { getAllZombies, loading: contractLoading, error: contractError } = useContract(provider, signer);

  useEffect(() => {
    const loadZombies = async () => {
      if (!account || isInitializing) return;

      setLoading(true);
      setError('');

      try {
        const userZombies = await getAllZombies(account);
        setZombies(userZombies);
      } catch (err) {
        console.error('加载僵尸失败:', err);
        setError('加载僵尸失败');
      } finally {
        setLoading(false);
      }
    };

    loadZombies();
  }, [account, getAllZombies, isInitializing]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <Header />
        <div className="pt-24">
          <LoadingState message="正在初始化..." />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <Header />
        <div className="pt-24">
          <div className="container-responsive">
            <div className="text-center py-20">
              <div className="text-8xl mb-8 animate-pulse">🔒</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">我的僵尸</h1>
              <p className="text-xl text-gray-600 mb-8">请先连接钱包查看您的僵尸收藏</p>
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                <p className="text-gray-700 mb-4">连接 MetaMask 钱包开始游戏</p>
                <button className="btn-primary">
                  <div className="flex items-center space-x-2">
                    <span>🔗</span>
                    <span>连接钱包</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header />
      <div className="pt-24">
        <div className="container-responsive">
          {/* 页面标题 */}
          <div className="text-center mb-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">我的僵尸军团</h1>
            <div className="flex justify-center space-x-4 pt-4">
              <Link
                href="/battle"
                className="btn-primary px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⚔️</span>
                  <span>前去战斗</span>
                </div>
              </Link>
            </div>
          </div>
          
          {/* 错误提示 */}
          {contractError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center">
                <div className="text-red-500 mr-4 text-2xl">⚠️</div>
                <div>
                  <p className="text-red-800 font-semibold text-lg">合约连接错误</p>
                  <p className="text-red-700 mt-1">{contractError}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center">
                <div className="text-red-500 mr-4 text-2xl">❌</div>
                <div>
                  <p className="text-red-800 font-semibold text-lg">加载失败</p>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 加载状态 */}
          {loading || contractLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-purple-600 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 font-medium">正在加载您的僵尸...</p>
              <p className="text-gray-500 mt-2">请稍候</p>
            </div>
          ) : zombies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-9xl mb-8 animate-pulse">🧟‍♂️</div>
              <h2 className="text-3xl font-bold text-gray-700 mb-4">您还没有僵尸</h2>
              <p className="text-xl text-gray-500 mb-8">创建您的第一个僵尸开始游戏吧！</p>
              <div className="space-y-4">
                <a
                  href="/create-zombie"
                  className="btn-primary inline-block px-8 py-4 text-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">➕</span>
                    <span>创建僵尸</span>
                  </div>
                </a>
                <div className="text-gray-500">
                  <p>或者</p>
                  <Link href="/" className="text-purple-600 hover:text-purple-700 underline font-medium">
                    返回首页
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 僵尸统计 */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-4 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{zombies.length}</div>
                    <div className="text-gray-600">总僵尸数</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {zombies.reduce((sum, zombie) => sum + Number(zombie.winCount), 0)}
                    </div>
                    <div className="text-gray-600">总胜利</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {zombies.reduce((sum, zombie) => sum + Number(zombie.lossCount), 0)}
                    </div>
                    <div className="text-gray-600">总失败</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {zombies.length > 0 ? Math.max(...zombies.map(z => Number(z.level))) : 0}
                    </div>
                    <div className="text-gray-600">最高等级</div>
                  </div>
                </div>
              </div>

              {/* 僵尸网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
                {zombies.map((zombie) => (
                  <ZombieCard
                    key={zombie.id}
                    zombie={zombie}
                    showDetails={true}
                    showOwner={false}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyZombiesPage; 
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWeb3 } from '../../hooks/useWeb3';
import { useContract } from '../../hooks/useContract';
import { Zombie } from '../../types';
import ZombieCard from '../../components/ZombieCard';
import LoadingState from '../../components/LoadingState';
import Header from '../../components/Header';
import CooldownTimer from '../../components/CooldownTimer';

const BattlePage: React.FC = () => {
  const [myZombies, setMyZombies] = useState<Zombie[]>([]);
  const [allZombies, setAllZombies] = useState<Zombie[]>([]);
  const [selectedZombie, setSelectedZombie] = useState<Zombie | null>(null);
  const [targetZombie, setTargetZombie] = useState<Zombie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { provider, signer, account, isInitializing } = useWeb3();
  const { 
    getAllZombies, 
    getAllZombiesForBattle,
    attack,
    isZombieReady,
    loading: contractLoading, 
    error: contractError 
  } = useContract(provider, signer);

  useEffect(() => {
    const loadZombies = async () => {
      if (!account || isInitializing) return;

      setLoading(true);
      setError('');

      try {
        // 加载我的僵尸
        const userZombies = await getAllZombies(account);
        console.log('加载用户僵尸:', userZombies.length, '个');
        console.log('当前账户:', account);
        console.log('用户僵尸详情:', userZombies.map(z => ({
          id: z.id,
          name: z.name,
          owner: z.owner,
          ownerLower: z.owner.toLowerCase(),
          accountLower: account.toLowerCase(),
          isOwner: z.owner.toLowerCase() === account.toLowerCase()
        })));
        setMyZombies(userZombies);

        // 加载所有僵尸（用于选择攻击目标）
        const allZombiesData = await getAllZombiesForBattle();
        console.log('加载所有僵尸:', allZombiesData.length, '个');
        setAllZombies(allZombiesData);
      } catch (err) {
        console.error('加载僵尸失败:', err);
        setError('加载僵尸失败');
      } finally {
        setLoading(false);
      }
    };

    loadZombies();
  }, [account, getAllZombies, isInitializing]);

  const handleAttack = async () => {
    if (!selectedZombie || !targetZombie || !account) {
      setError('请选择攻击者和目标');
      return;
    }

    if (selectedZombie.id === targetZombie.id) {
      setError('不能攻击自己的僵尸');
      return;
    }

    // 验证攻击者确实是用户拥有的僵尸（双重检查）
    if (selectedZombie.owner.toLowerCase() !== account.toLowerCase()) {
      console.error('权限检查失败:', {
        selectedZombieOwner: selectedZombie.owner,
        account: account,
        selectedZombieId: selectedZombie.id
      });
      setError('只能使用自己的僵尸进行攻击');
      return;
    }

    // 检查攻击者是否准备就绪
    const isReady = await isZombieReady(selectedZombie.id);
    if (!isReady) {
      setError('您的僵尸还在冷却中，请等待冷却时间结束');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await attack(selectedZombie.id, targetZombie.id);
      setSuccess('攻击成功！');
      
      // 重新加载僵尸数据
      const userZombies = await getAllZombies(account);
      const allZombiesData = await getAllZombiesForBattle();
      setMyZombies(userZombies);
      setAllZombies(allZombiesData);
      
      setSelectedZombie(null);
      setTargetZombie(null);
    } catch (err) {
      console.error('攻击失败:', err);
      const errorMessage = err instanceof Error ? err.message : '攻击失败';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-4xl font-bold text-gray-900 mb-6">僵尸战斗</h1>
              <p className="text-xl text-gray-600 mb-8">请先连接钱包参与战斗</p>
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
            <h1 className="text-5xl font-bold text-gray-900 mb-4">僵尸战斗</h1>
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
                  <p className="text-red-800 font-semibold text-lg">战斗失败</p>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center">
                <div className="text-green-500 mr-4 text-2xl">✅</div>
                <div>
                  <p className="text-green-800 font-semibold text-lg">战斗成功</p>
                  <p className="text-green-700 mt-1">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* 加载状态 */}
          {loading || contractLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-purple-600 mx-auto mb-8"></div>
              <p className="text-xl text-gray-600 font-medium">正在处理战斗...</p>
              <p className="text-gray-500 mt-2">请稍候</p>
            </div>
          ) : myZombies.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-9xl mb-8 animate-pulse">⚔️</div>
              <h2 className="text-3xl font-bold text-gray-700 mb-4">您还没有僵尸</h2>
              <p className="text-xl text-gray-500 mb-8">创建僵尸后即可参与战斗！</p>
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
            <div className="space-y-12">
              {/* 选择攻击者 */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">选择攻击者</h2>
                  <p className="text-gray-600">选择你的僵尸战士进行攻击</p>
                  <p className="text-sm text-gray-500 mt-2">
                    冷却中的僵尸无法参与战斗
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myZombies.map((zombie) => {
                    // 检查僵尸是否在冷却中
                    const now = Math.floor(Date.now() / 1000);
                    const readyTime = parseInt(zombie.readyTime);
                    const isZombieReady = now >= readyTime;
                    
                    return (
                      <ZombieCard
                        key={zombie.id}
                        zombie={zombie}
                        selected={selectedZombie?.id === zombie.id}
                        onClick={() => {
                          if (isZombieReady) {
                            setSelectedZombie(zombie);
                          } else {
                            setError('该僵尸还在冷却中，无法参与战斗');
                          }
                        }}
                        showDetails={true}
                        showOwner={false}
                        className={!isZombieReady ? 'cursor-not-allowed opacity-60' : ''}
                      />
                    );
                  })}
                </div>
                
                {/* 显示冷却中的僵尸数量 */}
                {myZombies.filter(zombie => {
                  const now = Math.floor(Date.now() / 1000);
                  const readyTime = parseInt(zombie.readyTime);
                  return now < readyTime;
                }).length > 0 && (
                  <div className="mt-6 text-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 max-w-md mx-auto">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="text-yellow-600 text-xl">⏰</div>
                        <div>
                          <p className="text-yellow-800 font-semibold">冷却中的僵尸</p>
                          <p className="text-yellow-700 text-sm">
                            {myZombies.filter(zombie => {
                              const now = Math.floor(Date.now() / 1000);
                              const readyTime = parseInt(zombie.readyTime);
                              return now < readyTime;
                            }).length} 个僵尸正在冷却中
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 选择攻击目标 */}
              {selectedZombie && (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">选择攻击目标</h2>
                    <p className="text-gray-600">选择要攻击的僵尸</p>
                    <p className="text-sm text-gray-500 mt-2">
                      找到 {allZombies.length} 个僵尸，可用目标 {allZombies.filter(zombie => zombie.id !== selectedZombie.id).length} 个
                    </p>
                  </div>
                  
                  {allZombies.filter(zombie => zombie.id !== selectedZombie.id).length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">没有可攻击的目标</h3>
                      <p className="text-gray-500 mb-4">
                        目前没有其他僵尸可以攻击。您可以：
                      </p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• 等待其他玩家创建僵尸</p>
                        <p>• 创建更多僵尸进行内部战斗</p>
                        <p>• 稍后再来查看</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allZombies
                        .filter((zombie) => zombie.id !== selectedZombie.id)
                        .map((zombie) => (
                          <ZombieCard
                            key={zombie.id}
                            zombie={zombie}
                            isTarget={true}
                            selected={targetZombie?.id === zombie.id}
                            onClick={() => setTargetZombie(zombie)}
                            showDetails={true}
                            showOwner={true}
                          />
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* 战斗按钮 */}
              {selectedZombie && targetZombie && (() => {
                // 检查攻击者是否在冷却中
                const now = Math.floor(Date.now() / 1000);
                const readyTime = parseInt(selectedZombie.readyTime);
                const isAttackerReady = now >= readyTime;
                
                return (
                  <div className="text-center">
                    <div className={`rounded-2xl p-8 max-w-2xl mx-auto border ${
                      isAttackerReady 
                        ? 'bg-gradient-to-r from-red-50 to-purple-50 border-red-200' 
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
                    }`}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">准备战斗</h3>
                      <div className="flex items-center justify-center space-x-8 mb-6">
                        <div className="text-center">
                          <div className={`text-4xl mb-2 ${!isAttackerReady ? 'grayscale opacity-50' : ''}`}>⚔️</div>
                          <p className="font-semibold text-gray-900">{selectedZombie.name}</p>
                          <p className="text-sm text-gray-500">等级 {selectedZombie.level}</p>
                          {!isAttackerReady && (
                            <div className="mt-2">
                              <CooldownTimer endTime={readyTime} />
                            </div>
                          )}
                        </div>
                        <div className={`text-3xl animate-pulse ${isAttackerReady ? 'text-red-500' : 'text-gray-400'}`}>VS</div>
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎯</div>
                          <p className="font-semibold text-gray-900">{targetZombie.name}</p>
                          <p className="text-sm text-gray-500">等级 {targetZombie.level}</p>
                        </div>
                      </div>
                      
                      {!isAttackerReady && (
                        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="text-yellow-600 text-xl">⏰</div>
                            <div>
                              <p className="text-yellow-800 font-semibold">攻击者还在冷却中</p>
                              <p className="text-yellow-700 text-sm">请等待冷却时间结束或选择其他僵尸</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={handleAttack}
                        disabled={loading || !isAttackerReady}
                        className={`px-12 py-4 text-lg ${
                          isAttackerReady 
                            ? 'btn-danger' 
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>战斗中...</span>
                          </div>
                        ) : !isAttackerReady ? (
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">⏰</span>
                            <span>冷却中</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">⚔️</span>
                            <span>开始攻击</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* 战斗说明 */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto border border-purple-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">战斗规则</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">如何战斗</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        选择你的僵尸作为攻击者
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        选择要攻击的目标僵尸
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        点击开始攻击按钮
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">战斗结果</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        胜利者获得经验值
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">✗</span>
                        失败者不会失去经验值
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">⚡</span>
                        战斗有冷却时间
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattlePage; 
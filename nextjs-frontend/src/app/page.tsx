'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useContract } from '../hooks/useContract';
import { Zombie } from '../types';
import { NETWORKS } from '../config/contract';
import { generateZombieAppearance, getZombieLevelColor } from '../utils/zombieUtils';
import Header from '../components/Header';

export default function HomePage() {
  const { account, signer, chainId, provider } = useWeb3();
  const { getAllZombies, createRandomZombie, getZombieCount } = useContract(provider, signer);
  
  const [zombies, setZombies] = useState<Zombie[]>([]);
  const [isLoadingZombies, setIsLoadingZombies] = useState(false);
  const [zombieName, setZombieName] = useState<string>('');
  const [isCreatingZombie, setIsCreatingZombie] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>('');
  const [createSuccess, setCreateSuccess] = useState<string>('');
  const [canCreate, setCanCreate] = useState<boolean>(true);

  // 加载用户僵尸
  const loadUserZombies = useCallback(async (): Promise<void> => {
    if (account && signer) {
      setIsLoadingZombies(true);
      try {
        const userZombies = await getAllZombies(account);
        setZombies(userZombies);
      } catch (err) {
        console.error('加载僵尸失败:', err);
      } finally {
        setIsLoadingZombies(false);
      }
    }
  }, [account, signer, getAllZombies]);

  // 检查用户是否可以创建僵尸
  const checkCanCreate = useCallback(async () => {
    if (!account) return;
    
    try {
      const zombieCount = await getZombieCount(account);
      const hasZombies = parseInt(zombieCount) > 0;
      setCanCreate(!hasZombies);
      
      if (hasZombies) {
        setCreateError('您已经拥有僵尸，无法创建新的僵尸。每个地址只能创建一个僵尸。');
      } else {
        setCreateError('');
      }
    } catch (err) {
      console.error('检查僵尸数量失败:', err);
    }
  }, [account, getZombieCount]);

  // 当账户或签名者变化时重新加载僵尸和检查创建权限
  useEffect(() => {
    loadUserZombies();
    checkCanCreate();
  }, [loadUserZombies, checkCanCreate]);

  // 处理创建僵尸
  const handleCreateZombie = async () => {
    if (!zombieName.trim()) {
      setCreateError('请输入僵尸名称');
      return;
    }

    if (zombieName.length > 16) {
      setCreateError('僵尸名称不能超过16个字符');
      return;
    }

    if (!canCreate) {
      setCreateError('您已经拥有僵尸，无法创建新的僵尸');
      return;
    }

    setIsCreatingZombie(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      await createRandomZombie(zombieName);
      setCreateSuccess('僵尸创建成功！');
      setZombieName('');
      setCanCreate(false); // 更新状态
      // 重新加载僵尸列表
      await loadUserZombies();
    } catch (err) {
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
      
      setCreateError(errorMessage);
    } finally {
      setIsCreatingZombie(false);
    }
  };

  // 网络检测逻辑
  const isCorrectNetwork = React.useMemo(() => {
    if (!chainId) return false;
    const currentChainId = Number(chainId);
    const expectedChainId = NETWORKS.sepolia.chainId;
    const isCorrect = currentChainId === expectedChainId;
    
    console.log('网络检测详细分析:', {
      currentChainId,
      expectedChainId,
      isCorrect,
      chainIdType: typeof chainId,
      account: account ? `${account.slice(0, 6)}...${account.slice(-4)}` : null
    });
    
    return isCorrect;
  }, [chainId, account]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header />
      
      {/* 英雄区域 */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* 动态背景元素 */}
          <div className="absolute top-10 left-10 text-8xl opacity-10 animate-pulse">🧟</div>
          <div className="absolute top-32 right-20 text-6xl opacity-10 animate-bounce">⚔️</div>
          <div className="absolute bottom-20 left-1/4 text-7xl opacity-10 animate-pulse">💀</div>
          <div className="absolute bottom-32 right-1/4 text-5xl opacity-10 animate-bounce">🦴</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-5 animate-pulse">🧟‍♂️</div>
        </div>
        
        <div className="container-responsive relative z-10 pt-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-2xl animate-fade-in">
              CryptoZombies
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed animate-slide-in">
              在以太坊上创建、收集和战斗你的僵尸军团
              <br />
              <span className="text-lg text-white/70">体验区块链游戏的无限可能</span>
            </p>
            

            {/* 统计信息 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">🎮</div>
                <div className="text-2xl font-bold text-white mb-1">区块链游戏</div>
                <div className="text-white/70">真正的所有权</div>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">🔄</div>
                <div className="text-2xl font-bold text-white mb-1">去中心化</div>
                <div className="text-white/70">安全透明</div>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">💎</div>
                <div className="text-2xl font-bold text-white mb-1">NFT 收藏</div>
                <div className="text-white/70">独一无二</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容区域 */}
      <section className="py-20">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* 创建新僵尸卡片 */}
            <div className="card card-hover">
              <div className="flex items-center mb-8">
                <div className="text-4xl mr-4">➕</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">创建新僵尸</h2>
                  <p className="text-gray-600 mt-1">铸造你的第一个僵尸 NFT</p>
                </div>
              </div>
              
              {!account ? (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">🔒</div>
                    <div>
                      <p className="text-yellow-800 font-semibold text-lg">请先连接钱包</p>
                      <p className="text-yellow-700 mt-1">连接 MetaMask 钱包以创建僵尸</p>
                    </div>
                  </div>
                </div>
              ) : !isCorrectNetwork ? (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">⚠️</div>
                    <div>
                      <p className="text-red-800 font-semibold text-lg">请切换到 Sepolia 测试网</p>
                      <p className="text-red-700 mt-1">
                        需要: Chain ID {NETWORKS.sepolia.chainId}
                        {chainId && <span className="block">当前: Chain ID {chainId}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ) : !canCreate ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">✅</div>
                    <div>
                      <p className="text-blue-800 font-semibold text-lg">您已经拥有僵尸</p>
                      <p className="text-blue-700 mt-1">每个地址只能创建一个僵尸，请管理您现有的僵尸</p>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {createError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
                  <div className="flex items-center">
                    <div className="text-red-500 mr-3 text-xl">❌</div>
                    <p className="text-red-800 font-medium whitespace-pre-line">{createError}</p>
                  </div>
                </div>
              )}

              {createSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8">
                  <div className="flex items-center">
                    <div className="text-green-500 mr-3 text-xl">✅</div>
                    <p className="text-green-800 font-medium">{createSuccess}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    僵尸名称
                  </label>
                  <input
                    type="text"
                    value={zombieName}
                    onChange={(e) => setZombieName(e.target.value)}
                    placeholder="输入僵尸名称..."
                    className="input-primary"
                    disabled={!account || !isCorrectNetwork || isCreatingZombie || !canCreate}
                    maxLength={16}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    最多16个字符 • 当前: {zombieName.length}/16
                  </p>
                </div>
                
                <button
                  onClick={handleCreateZombie}
                  disabled={!account || !isCorrectNetwork || isCreatingZombie || !zombieName.trim() || !canCreate}
                  className="btn-primary w-full py-4"
                >
                  {isCreatingZombie ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>创建中...</span>
                    </div>
                  ) : !canCreate ? (
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-xl">✅</span>
                      <span>无法创建僵尸</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-xl">🧟‍♂️</span>
                      <span>创建僵尸</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* 我的僵尸卡片 */}
            <div className="card card-hover">
              <div className="flex items-center mb-8">
                <div className="text-4xl mr-4">🧟‍♂️</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">我的僵尸</h2>
                  <p className="text-gray-600 mt-1">管理你的僵尸军团</p>
                </div>
              </div>
              
              {!account ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 animate-pulse">🔒</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">请先连接钱包</h3>
                  <p className="text-gray-500">连接钱包查看您的僵尸收藏</p>
                </div>
              ) : !isCorrectNetwork ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 animate-bounce">🌐</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">请切换到 Sepolia 测试网</h3>
                  <p className="text-gray-500">切换到正确的网络查看僵尸</p>
                  {chainId && (
                    <p className="text-sm text-gray-400 mt-3">
                      当前网络: Chain ID {chainId} | 需要: Chain ID {NETWORKS.sepolia.chainId}
                    </p>
                  )}
                </div>
              ) : isLoadingZombies ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-6"></div>
                  <p className="text-gray-600 font-medium">加载中...</p>
                </div>
              ) : zombies.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-8xl mb-6 animate-pulse">🧟</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">你还没有僵尸</h3>
                  <p className="text-gray-500 mb-6">创建一个开始游戏吧！</p>
                  <button 
                    onClick={() => setZombieName('我的第一个僵尸')}
                    className="btn-outline"
                    disabled={!canCreate}
                  >
                    立即创建
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {zombies.slice(0, 3).map((zombie) => {
                    const appearance = generateZombieAppearance(zombie.dna);
                    const levelColor = getZombieLevelColor(zombie.level);
                    
                    return (
                      <div key={zombie.id} className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center space-x-4">
                          {/* 僵尸图片 */}
                          <div className={`${levelColor} p-4 rounded-2xl flex-shrink-0 shadow-lg`}>
                            <div className="text-4xl">{appearance.mainAppearance}</div>
                          </div>
                          
                          {/* 僵尸信息 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-bold text-gray-900 text-xl truncate">{zombie.name}</span>
                              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                等级 {zombie.level}
                              </span>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span className="flex items-center">
                                <span className="text-green-500 mr-2 text-lg">✓</span>
                                胜利 {zombie.winCount}
                              </span>
                              <span className="flex items-center">
                                <span className="text-red-500 mr-2 text-lg">✗</span>
                                失败 {zombie.lossCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {zombies.length > 3 && (
                    <div className="text-center pt-6">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
                        <p className="text-purple-700 font-medium">
                          还有 {zombies.length - 3} 个僵尸...
                        </p>
                        <button 
                          onClick={() => window.location.href = '/my-zombies'}
                          className="text-purple-600 hover:text-purple-700 underline mt-2"
                        >
                          查看全部 →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 特色功能区域 */}
      <section className="pb-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">游戏特色</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-6xl mb-6">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">独特外观</h3>
              <p className="text-gray-600 leading-relaxed">每个僵尸都有独特的 DNA，生成不同的外观和属性</p>
            </div>
            <div className="card text-center">
              <div className="text-6xl mb-6">⚔️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">激烈战斗</h3>
              <p className="text-gray-600 leading-relaxed">与其他玩家的僵尸进行战斗，提升等级和技能</p>
            </div>
            <div className="card text-center">
              <div className="text-6xl mb-6">💎</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">NFT 收藏</h3>
              <p className="text-gray-600 leading-relaxed">真正的数字所有权，你的僵尸永远属于你</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

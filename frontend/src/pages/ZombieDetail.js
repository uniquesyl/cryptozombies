import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useContract } from '../hooks/useContract';
import { 
  generateZombieAppearance, 
  getZombieLevelColor, 
  getZombieStats, 
  formatDNA 
} from '../utils/zombieHelper';
import CooldownTimer from '../components/CooldownTimer';

const ZombieDetail = () => {
  const { zombieId } = useParams();
  const [zombie, setZombie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDNA, setShowDNA] = useState(false);

  const { provider, signer, account } = useWeb3();
  const { getZombieDetails, getZombieOwner, loading: contractLoading, error: contractError } = useContract(provider, signer);

  useEffect(() => {
    const loadZombie = async () => {
      if (!zombieId) return;

      setLoading(true);
      setError('');

      try {
        const zombieData = await getZombieDetails(zombieId);
        if (zombieData) {
          const owner = await getZombieOwner(zombieId);
          setZombie({
            ...zombieData,
            owner
          });
        } else {
          setError('僵尸不存在');
        }
      } catch (err) {
        console.error('加载僵尸失败:', err);
        setError('加载僵尸失败: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadZombie();
  }, [zombieId, getZombieDetails, getZombieOwner]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载僵尸中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !zombie) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <p className="text-red-800">{error || '僵尸不存在'}</p>
          </div>
        </div>
      </div>
    );
  }

  const appearance = generateZombieAppearance(zombie.dna);
  const stats = getZombieStats(zombie);
  const levelColor = getZombieLevelColor(zombie.level);
  const isOwner = account && zombie.owner && account.toLowerCase() === zombie.owner.toLowerCase();

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部信息 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">僵尸详情</h1>
          <p className="text-gray-600">ID: {zombieId}</p>
        </div>

        {/* 错误提示 */}
        {contractError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">合约错误: {contractError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：僵尸外观 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">外观</h2>
            
            {/* 主要外观 */}
            <div className={`${levelColor} p-8 rounded-lg mb-6 relative overflow-hidden text-center`}>
              <div className="text-8xl mb-4">{appearance.mainAppearance}</div>
              
              {/* 等级徽章 */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-bold">
                Lv.{zombie.level}
              </div>
              
              {/* 稀有度光效 */}
              {appearance.rarity >= 80 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
              )}
              
              {/* 特征组合描述 */}
              <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-80 text-white text-sm p-2 rounded z-10 shadow-lg">
                {appearance.appearance?.description || '特征组合'}
              </div>
            </div>
            
            {/* 稀有度徽章 - 移到外观下方 */}
            <div className="text-center mb-4">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
                appearance.rarity >= 90 ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" :
                appearance.rarity >= 80 ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white" :
                appearance.rarity >= 60 ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-white" :
                appearance.rarity >= 40 ? "bg-gradient-to-r from-green-400 to-teal-500 text-white" :
                "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
              }`}>
                {appearance.rarityDescription} ({appearance.rarity}/100)
              </div>
            </div>

            {/* 僵尸名称 */}
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{zombie.name}</h3>
              <p className="text-gray-600">DNA: {showDNA ? formatDNA(zombie.dna) : `${zombie.dna.slice(0, 8)}...`}</p>
              <button
                onClick={() => setShowDNA(!showDNA)}
                className="text-sm text-purple-600 hover:text-purple-700 mt-1"
              >
                {showDNA ? '隐藏完整DNA' : '显示完整DNA'}
              </button>
            </div>

            {/* 特征详情 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">特征详情</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">头部:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{appearance.appearance?.head || '🧟‍♂️'}</span>
                    <span className="text-sm font-medium">{appearance.traits.head}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">眼睛:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{appearance.appearance?.eyes || '👁️'}</span>
                    <span className="text-sm font-medium">{appearance.traits.eyes}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">身体:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{appearance.appearance?.body || '🦴'}</span>
                    <span className="text-sm font-medium">{appearance.traits.body}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">服装:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{appearance.appearance?.clothing || '👕'}</span>
                    <span className="text-sm font-medium">{appearance.traits.clothing}</span>
                  </div>
                </div>
              </div>
              
              {/* 稀有度 */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">稀有度:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${appearance.colorTheme.replace('bg-gradient-to-r', 'bg')}`}
                        style={{ width: `${appearance.rarity}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">{appearance.rarity}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：僵尸信息 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">信息</h2>
            
            {/* 基础信息 */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">所有者:</span>
                <span className="font-medium">{zombie.owner?.slice(0, 6)}...{zombie.owner?.slice(-4)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">等级:</span>
                <span className="font-medium">{zombie.level}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">状态:</span>
                <CooldownTimer readyTime={zombie.readyTime} />
              </div>
            </div>

            {/* 战斗统计 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">战斗统计</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{zombie.winCount}</div>
                  <div className="text-sm text-gray-600">胜利</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{zombie.lossCount}</div>
                  <div className="text-sm text-gray-600">失败</div>
                </div>
              </div>
              
              {stats.totalBattles > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">总战斗:</span>
                    <span className="text-sm font-medium">{stats.totalBattles}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">胜率:</span>
                    <span className="text-sm font-medium">{stats.winRate}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            {isOwner && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">操作</h4>
                
                <button
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                  onClick={() => window.location.href = '/battle'}
                >
                  进入战斗
                </button>
                
                <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => window.location.href = '/'}
                >
                  返回主页
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 底部导航 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZombieDetail; 
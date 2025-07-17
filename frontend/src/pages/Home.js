import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useContract } from '../hooks/useContract';
import CreateZombie from '../components/CreateZombie';

const Home = () => {
  const [userZombies, setUserZombies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { provider, signer, account } = useWeb3();
  const { 
    getAllZombies, 
    getZombieCount,
    loading: contractLoading,
    error: contractError 
  } = useContract(provider, signer);

  // 加载用户僵尸
  const loadUserZombies = async () => {
    if (!account) {
      setUserZombies([]);
      return;
    }

    setLoading(true);
    try {
      const zombies = await getAllZombies(account);
      setUserZombies(zombies);
    } catch (err) {
      console.error('加载僵尸失败:', err);
      setError('加载僵尸失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 当账户变化时重新加载
  useEffect(() => {
    loadUserZombies();
  }, [account, getAllZombies]);

  // 处理僵尸创建成功
  const handleZombieCreated = (zombieId) => {
    setSuccess(`僵尸创建成功！ID: ${zombieId}`);
    // 重新加载僵尸列表
    loadUserZombies();
    
    // 3秒后清除成功消息
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 英雄区域 */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🧟‍♂️ CryptoZombies
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              在以太坊上创建、收集和战斗你的僵尸军团
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/my-zombies"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                查看我的僵尸
              </a>
              <a
                href="/battle"
                className="bg-purple-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-900 transition-colors"
              >
                开始战斗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 错误和成功提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {contractError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">合约错误: {contractError}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 创建僵尸区域 */}
          <div>
            <CreateZombie onZombieCreated={handleZombieCreated} />
          </div>

          {/* 用户僵尸预览 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">我的僵尸</h2>
            
            {!account ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔒</div>
                <p className="text-gray-600">请先连接钱包查看您的僵尸</p>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">加载中...</p>
              </div>
            ) : userZombies.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🧟‍♂️</div>
                <p className="text-gray-600 mb-4">您还没有僵尸</p>
                <p className="text-sm text-gray-500">在左侧创建您的第一个僵尸开始游戏吧！</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    共 {userZombies.length} 个僵尸
                  </span>
                  <a
                    href="/my-zombies"
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    查看全部 →
                  </a>
                </div>
                
                {/* 显示前3个僵尸 */}
                <div className="space-y-3">
                  {userZombies.slice(0, 3).map((zombie) => (
                    <div
                      key={zombie.id}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="text-2xl mr-3">🧟‍♂️</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{zombie.name}</div>
                        <div className="text-sm text-gray-600">
                          等级 {zombie.level} • 胜利 {zombie.winCount} • 失败 {zombie.lossCount}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">#{zombie.id}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 游戏特色 */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">游戏特色</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">创建僵尸</h3>
              <p className="text-gray-600">
                创建独特的僵尸，每个僵尸都有随机的DNA和属性
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚔️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">僵尸战斗</h3>
              <p className="text-gray-600">
                让你的僵尸与其他玩家的僵尸战斗，提升等级和技能
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">区块链游戏</h3>
              <p className="text-gray-600">
                基于以太坊区块链，真正拥有你的游戏资产
              </p>
            </div>
          </div>
        </div>

        {/* 快速开始指南 */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">快速开始</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">第一步：连接钱包</h3>
              <ol className="space-y-2 text-gray-600">
                <li>1. 安装 MetaMask 钱包扩展</li>
                <li>2. 切换到 Sepolia 测试网络</li>
                <li>3. 获取一些测试 ETH</li>
                <li>4. 连接钱包到游戏</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">第二步：开始游戏</h3>
              <ol className="space-y-2 text-gray-600">
                <li>1. 创建您的第一个僵尸</li>
                <li>2. 升级僵尸提升战斗力</li>
                <li>3. 与其他玩家战斗</li>
                <li>4. 收集更多僵尸</li>
              </ol>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Home; 
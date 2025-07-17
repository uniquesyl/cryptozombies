import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useContract } from '../hooks/useContract';
import CooldownTimer from '../components/CooldownTimer';
import ZombieCard from '../components/ZombieCard';

const Battle = () => {
  const [myZombies, setMyZombies] = useState([]);
  const [allZombies, setAllZombies] = useState([]);
  const [selectedZombie, setSelectedZombie] = useState(null);
  const [targetZombie, setTargetZombie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [battleLoading, setBattleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { provider, signer, account } = useWeb3();
  const { 
    getAllZombies, 
    getZombieDetails,
    attack,
    loading: contractLoading,
    error: contractError 
  } = useContract(provider, signer);

  // 加载所有僵尸数据
  const loadZombies = async () => {
    if (!account) {
      setMyZombies([]);
      setAllZombies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 获取我的僵尸
      const myZombieList = await getAllZombies(account);
      setMyZombies(myZombieList);

      // 获取所有僵尸（这里简化处理，实际应该从合约获取）
      // 由于合约没有获取所有僵尸的函数，我们创建一个模拟列表
      const allZombiesList = [];
      
      // 只尝试获取前10个僵尸，避免过多的无效调用
      for (let i = 0; i < 10; i++) {
        const zombie = await getZombieDetails(i.toString());
        if (zombie && zombie.name !== '') {
          allZombiesList.push(zombie);
        }
      }
      setAllZombies(allZombiesList);
    } catch (err) {
      console.error('加载僵尸失败:', err);
      setError('加载僵尸失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 当账户变化时重新加载
  useEffect(() => {
    loadZombies();
  }, [account, getAllZombies, getZombieDetails]);

  // 处理战斗
  const handleBattle = async () => {
    if (!selectedZombie || !targetZombie) {
      setError('请选择攻击者和目标');
      return;
    }

    if (selectedZombie.id === targetZombie.id) {
      setError('不能攻击自己的僵尸');
      return;
    }

    if (selectedZombie.owner === targetZombie.owner) {
      setError('不能攻击自己的僵尸');
      return;
    }

    // 检查攻击者僵尸是否准备就绪
    const now = Math.floor(Date.now() / 1000);
    const readyTime = parseInt(selectedZombie.readyTime);
    const isReady = readyTime <= now;
    
    if (!isReady) {
      const cooldownRemaining = readyTime - now;
      const hours = Math.floor(cooldownRemaining / 3600);
      const minutes = Math.floor((cooldownRemaining % 3600) / 60);
      setError(`攻击者僵尸正在冷却中，剩余时间: ${hours}小时${minutes}分钟`);
      return;
    }

    setBattleLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('开始战斗:', selectedZombie.id, 'vs', targetZombie.id);
      const success = await attack(selectedZombie.id, targetZombie.id);
      
      if (success) {
        setSuccess('战斗完成！请查看结果');
        // 重新加载僵尸数据
        await loadZombies();
        // 清除选择
        setSelectedZombie(null);
        setTargetZombie(null);
      } else {
        setError('战斗失败，请重试');
      }
    } catch (err) {
      console.error('战斗错误:', err);
      setError('战斗失败: ' + err.message);
    } finally {
      setBattleLoading(false);
    }
  };

  // 移除旧的僵尸外观函数，现在使用 ZombieCard 组件

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">僵尸战斗</h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
              <p className="text-yellow-800 text-lg">请先连接钱包以参与战斗</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">僵尸战斗</h1>
          <p className="text-gray-600">选择你的僵尸与其他玩家的僵尸战斗</p>
        </div>

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

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载僵尸中...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* 我的僵尸选择 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">选择攻击者</h2>
              {myZombies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">您还没有僵尸</p>
                  <a
                    href="/"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  >
                    创建僵尸
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myZombies.map((zombie) => (
                    <ZombieCard
                      key={zombie.id}
                      zombie={zombie}
                      isSelected={selectedZombie?.id === zombie.id}
                      onClick={() => setSelectedZombie(zombie)}
                      showDetails={true}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 目标僵尸选择 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">选择攻击目标</h2>
              {allZombies.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">没有找到可攻击的僵尸</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allZombies
                    .filter(zombie => zombie.owner !== account) // 过滤掉自己的僵尸
                    .map((zombie) => (
                      <ZombieCard
                        key={zombie.id}
                        zombie={zombie}
                        isTarget={targetZombie?.id === zombie.id}
                        onClick={() => setTargetZombie(zombie)}
                        showOwner={true}
                        showDetails={true}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* 战斗按钮 */}
            {selectedZombie && targetZombie && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">战斗预览</h2>
                <div className="flex items-center justify-center space-x-8 mb-6">
                  {/* 攻击者 */}
                  <div className="text-center">
                    <ZombieCard
                      zombie={selectedZombie}
                      isSelected={true}
                      showDetails={false}
                      className="w-32"
                    />
                  </div>

                  {/* VS */}
                  <div className="text-4xl font-bold text-red-600">⚔️</div>

                  {/* 目标 */}
                  <div className="text-center">
                    <ZombieCard
                      zombie={targetZombie}
                      isTarget={true}
                      showDetails={false}
                      className="w-32"
                    />
                  </div>
                </div>

                <div className="text-center">
                  {(() => {
                    const now = Math.floor(Date.now() / 1000);
                    const readyTime = parseInt(selectedZombie.readyTime);
                    const isReady = readyTime <= now;
                    const isDisabled = battleLoading || contractLoading || !isReady;
                    
                    return (
                      <button
                        onClick={handleBattle}
                        disabled={isDisabled}
                        className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                          isDisabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {battleLoading || contractLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            战斗中...
                          </div>
                        ) : !isReady ? (
                          <div className="flex items-center justify-center">
                            <span>⏰ 等待冷却</span>
                          </div>
                        ) : (
                          '开始战斗'
                        )}
                      </button>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* 战斗说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">战斗规则</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• 只能攻击其他玩家的僵尸</li>
                <li>• 战斗结果基于僵尸等级和随机因素</li>
                <li>• 胜利者获得经验值，失败者损失生命值</li>
                <li>• 每次战斗后僵尸需要冷却时间</li>
                <li>• 战斗需要支付少量gas费用</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Battle; 
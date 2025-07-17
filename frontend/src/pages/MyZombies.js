import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useContract } from '../hooks/useContract';
import ZombieManager from '../components/ZombieManager';

const MyZombies = () => {
  const [userZombies, setUserZombies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    
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

  // 处理僵尸更新
  const handleZombieUpdate = () => {
    loadUserZombies();
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">我的僵尸</h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
              <p className="text-yellow-800 text-lg">请先连接钱包查看您的僵尸</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的僵尸</h1>
          <p className="text-gray-600">管理您的僵尸军团</p>
        </div>

        {/* 错误提示 */}
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

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载僵尸中...</p>
          </div>
        )}

        {/* 僵尸列表 */}
        {!loading && (
          <>
            {userZombies.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">🧟‍♂️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">您还没有僵尸</h2>
                <p className="text-gray-600 mb-6">创建您的第一个僵尸开始游戏吧！</p>
                <a
                  href="/"
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  创建僵尸
                </a>
              </div>
            ) : (
              <>
                {/* 统计信息 */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{userZombies.length}</div>
                      <div className="text-sm text-gray-600">总僵尸数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {userZombies.reduce((sum, zombie) => sum + parseInt(zombie.winCount), 0)}
                      </div>
                      <div className="text-sm text-gray-600">总胜利</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {userZombies.reduce((sum, zombie) => sum + parseInt(zombie.lossCount), 0)}
                      </div>
                      <div className="text-sm text-gray-600">总失败</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {userZombies.reduce((sum, zombie) => sum + parseInt(zombie.level), 0)}
                      </div>
                      <div className="text-sm text-gray-600">总等级</div>
                    </div>
                  </div>
                </div>

                {/* 僵尸网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userZombies.map((zombie) => (
                    <ZombieManager
                      key={zombie.id}
                      zombie={zombie}
                      onUpdate={handleZombieUpdate}
                    />
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="mt-8 text-center">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/battle"
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      进入战斗
                    </a>
                    <a
                      href="/"
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      返回主页
                    </a>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyZombies; 
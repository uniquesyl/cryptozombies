import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useContract } from '../hooks/useContract';
import { generateZombieAppearance, getZombieLevelColor, getZombieStats } from '../utils/zombieHelper';
import CooldownTimer from './CooldownTimer';

const ZombieManager = ({ zombie, onUpdate }) => {
  const [showActions, setShowActions] = useState(false);
  const [newName, setNewName] = useState('');
  const [isChangingName, setIsChangingName] = useState(false);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { account } = useWeb3();
  const { changeName, levelUp, loading: contractLoading, error: contractError } = useContract();

  const appearance = generateZombieAppearance(zombie.dna);
  const stats = getZombieStats(zombie);
  const levelColor = getZombieLevelColor(zombie.level);

  // 检查是否是僵尸所有者
  const isOwner = account && zombie.owner && account.toLowerCase() === zombie.owner.toLowerCase();

  // 检查僵尸是否准备就绪
  const isReady = parseInt(zombie.readyTime) <= Math.floor(Date.now() / 1000);

  // 检查僵尸等级是否满足改名要求
  const canChangeName = parseInt(zombie.level) >= 2;

  const handleLevelUp = async () => {
    if (!isOwner || !isReady || contractLoading) return;

    setIsLevelingUp(true);
    setError('');
    setSuccess('');

    try {
      const result = await levelUp(zombie.id);
      if (result) {
        setSuccess('僵尸升级成功！');
        setShowActions(false);
        if (onUpdate) onUpdate();
      } else {
        setError('升级失败，请重试');
      }
    } catch (err) {
      console.error('升级错误:', err);
      setError('升级失败: ' + err.message);
    } finally {
      setIsLevelingUp(false);
    }
  };

  const handleChangeName = async () => {
    if (!newName.trim() || !isOwner || contractLoading) return;

    setIsChangingName(true);
    setError('');
    setSuccess('');

    try {
      const result = await changeName(zombie.id, newName);
      if (result) {
        setSuccess('僵尸改名成功！');
        setNewName('');
        setShowActions(false);
        if (onUpdate) onUpdate();
      } else {
        setError('改名失败，请重试');
      }
    } catch (err) {
      console.error('改名错误:', err);
      setError('改名失败: ' + err.message);
    } finally {
      setIsChangingName(false);
    }
  };

  const getBorderColor = () => {
    if (!isReady) return 'border-yellow-300 bg-yellow-50';
    return 'border-gray-200 hover:border-gray-300';
  };

  return (
    <div className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${getBorderColor()}`}>
      {/* 错误和成功提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-2 mb-3">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-2 mb-3">
          <p className="text-green-800 text-sm">{success}</p>
        </div>
      )}

      <div className="text-center">
        {/* 稀有度徽章 */}
        <div className="mb-2">
          <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
            appearance.rarity >= 90 ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white" :
            appearance.rarity >= 80 ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white" :
            appearance.rarity >= 60 ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-white" :
            appearance.rarity >= 40 ? "bg-gradient-to-r from-green-400 to-teal-500 text-white" :
            "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
          }`}>
            {appearance.rarityDescription}
          </div>
        </div>

        {/* 僵尸外观 */}
        <div className={`${levelColor} p-4 rounded-lg mb-3 relative overflow-hidden`}>
          <div className="text-4xl mb-1">{appearance.mainAppearance}</div>
          
          {/* 等级显示 */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs font-bold">
            Lv.{zombie.level}
          </div>
          
          {/* 稀有度光效 */}
          {appearance.rarity >= 80 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
          )}
        </div>

        {/* 僵尸名称 */}
        <div className="font-medium text-gray-900 mb-2">{zombie.name}</div>
        
        {/* 基础统计 */}
        <div className="text-sm text-gray-600 mb-2">
          <div className="flex justify-center space-x-4">
            <span>胜利 {zombie.winCount}</span>
            <span>失败 {zombie.lossCount}</span>
          </div>
          {stats.totalBattles > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              胜率: {stats.winRate}%
            </div>
          )}
        </div>

        {/* 冷却时间显示 */}
        <div className="mb-2">
          <CooldownTimer readyTime={zombie.readyTime} className="text-xs" />
        </div>

        {/* 操作按钮 */}
        {isOwner && (
          <div className="space-y-2">
            <button
              onClick={() => setShowActions(!showActions)}
              className="w-full py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              {showActions ? '隐藏操作' : '显示操作'}
            </button>
            
            {showActions && (
              <div className="space-y-2">
                {/* 升级按钮 */}
                <button
                  onClick={handleLevelUp}
                  disabled={!isReady || contractLoading || isLevelingUp}
                  className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    !isReady || contractLoading || isLevelingUp
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isLevelingUp ? '升级中...' : '升级 (0.001 ETH)'}
                </button>

                {/* 改名功能 */}
                <div className="space-y-2">
                  {/* 等级不足提示 */}
                  {!canChangeName && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-2">
                      <p className="text-yellow-800 text-xs">
                        ⚠️ 僵尸等级不足，需要等级 &gt;= 2 才能改名
                      </p>
                    </div>
                  )}
                  
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={canChangeName ? "新名称..." : "需要等级 >= 2"}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900 placeholder-gray-500 ${
                      !canChangeName ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    maxLength={20}
                    disabled={contractLoading || isChangingName || !canChangeName}
                  />
                  <button
                    onClick={handleChangeName}
                    disabled={!newName.trim() || contractLoading || isChangingName || !canChangeName}
                    className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      !newName.trim() || contractLoading || isChangingName || !canChangeName
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isChangingName ? '改名中...' : canChangeName ? '改名' : '需要升级'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 非所有者提示 */}
        {!isOwner && (
          <div className="text-xs text-gray-500 mt-2">
            只有所有者可以操作此僵尸
          </div>
        )}
      </div>
    </div>
  );
};

export default ZombieManager; 
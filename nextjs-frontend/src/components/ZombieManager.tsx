'use client';

import React, { useState } from 'react';
import { ZombieManagerProps } from '../types';
import { useContract } from '../hooks/useContract';
import CooldownTimer from './CooldownTimer';

const ZombieManager: React.FC<ZombieManagerProps> = ({ zombie, onUpdate }) => {
  const [newName, setNewName] = useState<string>('');
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [isChangingName, setIsChangingName] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(true);
  const [cooldownEndTime, setCooldownEndTime] = useState<number>(0);

  const { levelUp, changeName, isZombieReady } = useContract(null, null);

  // 检查冷却时间
  React.useEffect(() => {
    const checkCooldown = async () => {
      try {
        const ready = await isZombieReady(zombie.id);
        setIsReady(ready);
        
        const now = Math.floor(Date.now() / 1000);
        const readyTime = parseInt(zombie.readyTime);
        setCooldownEndTime(readyTime);
      } catch (err) {
        console.error('检查冷却时间失败:', err);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);

    return () => clearInterval(interval);
  }, [zombie.id, zombie.readyTime, isZombieReady]);

  const handleLevelUp = async () => {
    if (!isReady) {
      setError('僵尸还在冷却中，无法升级');
      return;
    }

    setIsUpgrading(true);
    setError('');
    setSuccess('');

    try {
      await levelUp(zombie.id);
      setSuccess('僵尸升级成功！');
      onUpdate();
    } catch (err) {
      console.error('升级失败:', err);
      const errorMessage = err instanceof Error ? err.message : '升级失败';
      setError(errorMessage);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleChangeName = async () => {
    if (!newName.trim()) {
      setError('请输入新的僵尸名称');
      return;
    }

    if (newName.trim() === zombie.name) {
      setError('新名称不能与当前名称相同');
      return;
    }

    if (parseInt(zombie.level) < 2) {
      setError('僵尸需要达到2级才能改名');
      return;
    }

    setIsChangingName(true);
    setError('');
    setSuccess('');

    try {
      await changeName(zombie.id, newName.trim());
      setSuccess('僵尸改名成功！');
      setNewName('');
      onUpdate();
    } catch (err) {
      console.error('改名失败:', err);
      const errorMessage = err instanceof Error ? err.message : '改名失败';
      setError(errorMessage);
    } finally {
      setIsChangingName(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">僵尸管理</h3>
      
      {/* 冷却时间显示 */}
      {!isReady && cooldownEndTime > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-red-600 text-lg">⏰</span>
              <span className="text-red-800 font-semibold">冷却中</span>
            </div>
            <CooldownTimer endTime={cooldownEndTime} />
          </div>
          <p className="text-red-700 text-sm mt-2">
            冷却期间无法进行升级和改名操作
          </p>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">❌</span>
            <span className="text-red-800 font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span className="text-green-800 font-semibold">{success}</span>
          </div>
        </div>
      )}

      {/* 升级功能 */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">升级僵尸</h4>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-700 font-medium">当前等级: {zombie.level}</p>
              <p className="text-gray-600 text-sm">升级费用: 0.001 ETH</p>
            </div>
            <button
              onClick={handleLevelUp}
              disabled={!isReady || isUpgrading}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                isReady && !isUpgrading
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isUpgrading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>升级中...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>升级</span>
                </div>
              )}
            </button>
          </div>
          {!isReady && (
            <p className="text-red-600 text-sm">
              ⚠️ 僵尸在冷却中，无法升级
            </p>
          )}
        </div>
      </div>

      {/* 改名功能 */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">修改名称</h4>
        <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-4 border border-green-200">
          <div className="mb-3">
            <p className="text-gray-700 font-medium mb-2">当前名称: {zombie.name}</p>
            <p className="text-gray-600 text-sm mb-3">
              要求: 僵尸等级 ≥ 2级 (当前: {zombie.level}级)
            </p>
            <div className="flex space-x-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="输入新名称..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={parseInt(zombie.level) < 2}
              />
              <button
                onClick={handleChangeName}
                disabled={!isReady || isChangingName || parseInt(zombie.level) < 2 || !newName.trim()}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isReady && !isChangingName && parseInt(zombie.level) >= 2 && newName.trim()
                    ? 'bg-gradient-to-r from-green-600 to-yellow-600 text-white hover:from-green-700 hover:to-yellow-700 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isChangingName ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>修改中...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>✏️</span>
                    <span>修改</span>
                  </div>
                )}
              </button>
            </div>
          </div>
          {parseInt(zombie.level) < 2 && (
            <p className="text-orange-600 text-sm">
              ⚠️ 僵尸等级不足，无法改名
            </p>
          )}
          {!isReady && parseInt(zombie.level) >= 2 && (
            <p className="text-red-600 text-sm">
              ⚠️ 僵尸在冷却中，无法改名
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ZombieManager; 
'use client';

import React, { useState, useEffect } from 'react';
import { ZombieCardProps } from '../types';
import { generateZombieAppearance, getZombieLevelColor, getZombieStats, formatAddress } from '../utils/zombieUtils';
import CooldownTimer from './CooldownTimer';

const ZombieCard: React.FC<ZombieCardProps> = ({
  zombie,
  selected = false,
  isSelected = false,
  isTarget = false,
  onClick,
  showDetails = false,
  showOwner = false,
  className = ''
}) => {
  const appearance = generateZombieAppearance(zombie.dna);
  const levelColor = getZombieLevelColor(zombie.level);
  const stats = getZombieStats(zombie);
  const [isReady, setIsReady] = useState<boolean>(true);
  const [cooldownEndTime, setCooldownEndTime] = useState<number>(0);

  useEffect(() => {
    const checkCooldown = () => {
      const now = Math.floor(Date.now() / 1000);
      const readyTime = parseInt(zombie.readyTime);
      const isZombieReady = now >= readyTime;
      
      setIsReady(isZombieReady);
      setCooldownEndTime(readyTime);
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);

    return () => clearInterval(interval);
  }, [zombie.readyTime]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const baseClasses = `
    card card-hover border-2 transition-all duration-300 cursor-pointer
    ${selected || isSelected ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-glow scale-105' : 'border-gray-200 hover:border-purple-300 hover:shadow-glow hover:scale-102'}
    ${isTarget ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 shadow-glow-red' : ''}
    ${!isReady ? 'opacity-75' : ''}
    ${className}
  `;

  return (
    <div className={baseClasses} onClick={handleClick}>
      {/* 头部区域 */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* 僵尸图片 */}
          <div className={`${levelColor} p-4 rounded-2xl flex-shrink-0 shadow-lg relative overflow-hidden ${!isReady ? 'grayscale' : ''}`}>
            <div className="text-5xl relative z-10">{appearance.mainAppearance}</div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            {!isReady && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-white text-2xl">⏰</div>
              </div>
            )}
          </div>
          
          {/* 僵尸基本信息 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-xl truncate mb-2">{zombie.name}</h3>
            <div className="flex items-center space-x-3">
              <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 px-3 py-1 rounded-full font-semibold text-sm">
                等级 {zombie.level}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${appearance.color} bg-opacity-20`}>
                {appearance.rarityDescription}
              </span>
            </div>
            
            {/* 冷却时间显示 */}
            {!isReady && cooldownEndTime > 0 && (
              <div className="mt-2">
                <CooldownTimer endTime={cooldownEndTime} />
              </div>
            )}
          </div>
        </div>
        
        {/* 选择状态指示器 */}
        {(selected || isSelected) && (
          <div className="text-purple-600 text-2xl bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-full shadow-lg animate-pulse">
            ✓
          </div>
        )}
        {isTarget && (
          <div className="text-red-600 text-2xl bg-gradient-to-br from-red-100 to-red-200 p-3 rounded-full shadow-lg animate-bounce">
            🎯
          </div>
        )}
      </div>

      {/* 战斗统计 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 shadow-md">
          <div className="font-bold text-green-700 text-2xl mb-1">{zombie.winCount}</div>
          <div className="text-green-600 text-sm font-semibold">胜利</div>
        </div>
        <div className="text-center bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 border border-red-200 shadow-md">
          <div className="font-bold text-red-700 text-2xl mb-1">{zombie.lossCount}</div>
          <div className="text-red-600 text-sm font-semibold">失败</div>
        </div>
      </div>

      {/* 详细统计信息 */}
      {showDetails && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-3 border border-blue-200 shadow-md">
              <div className="font-bold text-blue-700 text-lg mb-1">{stats.attack}</div>
              <div className="text-blue-600 text-xs font-semibold">攻击</div>
            </div>
            <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-3 border border-green-200 shadow-md">
              <div className="font-bold text-green-700 text-lg mb-1">{stats.defense}</div>
              <div className="text-green-600 text-xs font-semibold">防御</div>
            </div>
            <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-3 border border-yellow-200 shadow-md">
              <div className="font-bold text-yellow-700 text-lg mb-1">{stats.speed}</div>
              <div className="text-yellow-600 text-xs font-semibold">速度</div>
            </div>
          </div>
          
          <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 shadow-md">
            <div className="text-sm text-gray-700">
              胜率: <span className="font-bold text-purple-600 text-lg">{stats.winRate}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 所有者信息 */}
      {showOwner && (
        <div className="text-sm text-gray-600 border-t border-gray-200 pt-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">所有者:</span>
            <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs">{formatAddress(zombie.owner)}</span>
          </div>
        </div>
      )}

      {/* 特征标签 */}
      <div className="flex flex-wrap gap-2">
        {appearance.features.slice(0, 3).map((feature, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full font-semibold border border-gray-300 shadow-sm"
          >
            {feature}
          </span>
        ))}
        {appearance.features.length > 3 && (
          <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-xs rounded-full font-semibold border border-purple-300 shadow-sm">
            +{appearance.features.length - 3}
          </span>
        )}
      </div>

      {/* 悬停效果指示器 */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default ZombieCard; 
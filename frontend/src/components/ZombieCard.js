import React from 'react';
import { 
  generateZombieAppearance, 
  getZombieLevelColor, 
  getZombieStats, 
  formatDNA 
} from '../utils/zombieHelper';
import CooldownTimer from './CooldownTimer';

const ZombieCard = ({ 
  zombie, 
  isSelected = false, 
  isTarget = false, 
  onClick, 
  showOwner = false,
  showDetails = false,
  className = "" 
}) => {
  const appearance = generateZombieAppearance(zombie.dna);
  const stats = getZombieStats(zombie);
  const levelColor = getZombieLevelColor(zombie.level);
  
  const getBorderColor = () => {
    if (isSelected) return 'border-purple-500 bg-purple-50';
    if (isTarget) return 'border-red-500 bg-red-50';
    return 'border-gray-200 hover:border-gray-300';
  };

  const getRarityBadge = () => {
    const rarityColors = {
      "传奇": "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg",
      "史诗": "bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg",
      "稀有": "bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg",
      "罕见": "bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg",
      "普通": "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg"
    };
    
    return (
      <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${rarityColors[appearance.rarityDescription]}`}>
        {appearance.rarityDescription}
      </div>
    );
  };

    return (
    <div
      onClick={onClick}
      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${getBorderColor()} ${className}`}
    >
              <div className="text-center">
          {/* 稀有度徽章 - 移到外观上方 */}
          <div className="mb-2">
            {getRarityBadge()}
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
            
            {/* 特征组合提示 */}
            {showDetails && (
              <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-80 text-white text-xs p-1 rounded z-10">
                {appearance.appearance?.description || '特征组合'}
              </div>
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
        
        {/* 所有者信息 */}
        {showOwner && zombie.owner && (
          <div className="text-xs text-gray-500 mb-2">
            所有者: {zombie.owner.slice(0, 6)}...{zombie.owner.slice(-4)}
          </div>
        )}
        
        {/* 冷却时间 */}
        <CooldownTimer readyTime={zombie.readyTime} className="mb-2" />
        
        {/* 详细信息 */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">
              DNA: {formatDNA(zombie.dna)}
            </div>
            
            {/* 特征显示 */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span>头部:</span>
                <span>{appearance.traits.head}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>眼睛:</span>
                <span>{appearance.traits.eyes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>身体:</span>
                <span>{appearance.traits.body}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>服装:</span>
                <span>{appearance.traits.clothing}</span>
              </div>
            </div>
            
            {/* 稀有度详情 */}
            <div className="mt-2 text-xs">
              <div className="flex items-center justify-between">
                <span>稀有度:</span>
                <span className="font-bold">{appearance.rarity}/100</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZombieCard; 
import { Zombie, ZombieAppearance, ZombieStats, ZombieLevelColor } from '../types';

// 僵尸外观生成
export const generateZombieAppearance = (dna: string): ZombieAppearance => {
  const dnaNum = parseInt(dna);
  
  // 根据 DNA 生成外观特征
  const features = [];
  let mainAppearance = '🧟';
  let rarity = 0;
  let rarityDescription = '普通';
  let color = 'bg-gray-100';

  // 根据 DNA 的最后几位数字决定外观
  const lastDigits = dnaNum % 1000;
  
  if (lastDigits < 100) {
    mainAppearance = '🧟‍♂️';
    features.push('男性僵尸');
    rarity = 10;
    rarityDescription = '稀有';
    color = 'bg-blue-100';
  } else if (lastDigits < 200) {
    mainAppearance = '🧟‍♀️';
    features.push('女性僵尸');
    rarity = 15;
    rarityDescription = '稀有';
    color = 'bg-pink-100';
  } else if (lastDigits < 300) {
    mainAppearance = '🧟‍♂️';
    features.push('战士僵尸');
    rarity = 25;
    rarityDescription = '史诗';
    color = 'bg-purple-100';
  } else if (lastDigits < 400) {
    mainAppearance = '🧟‍♀️';
    features.push('法师僵尸');
    rarity = 30;
    rarityDescription = '史诗';
    color = 'bg-indigo-100';
  } else if (lastDigits < 500) {
    mainAppearance = '🧟‍♂️';
    features.push('刺客僵尸');
    rarity = 40;
    rarityDescription = '传说';
    color = 'bg-yellow-100';
  } else if (lastDigits < 600) {
    mainAppearance = '🧟‍♀️';
    features.push('牧师僵尸');
    rarity = 45;
    rarityDescription = '传说';
    color = 'bg-green-100';
  } else if (lastDigits < 700) {
    mainAppearance = '🧟‍♂️';
    features.push('骑士僵尸');
    rarity = 60;
    rarityDescription = '神话';
    color = 'bg-red-100';
  } else if (lastDigits < 800) {
    mainAppearance = '🧟‍♀️';
    features.push('女王僵尸');
    rarity = 70;
    rarityDescription = '神话';
    color = 'bg-purple-200';
  } else if (lastDigits < 900) {
    mainAppearance = '🧟‍♂️';
    features.push('国王僵尸');
    rarity = 85;
    rarityDescription = '传说';
    color = 'bg-yellow-200';
  } else {
    mainAppearance = '🧟‍♀️';
    features.push('女神僵尸');
    rarity = 95;
    rarityDescription = '神话';
    color = 'bg-gradient-to-r from-yellow-400 to-orange-500';
  }

  // 添加额外特征
  if (dnaNum % 2 === 0) {
    features.push('强壮');
  }
  if (dnaNum % 3 === 0) {
    features.push('敏捷');
  }
  if (dnaNum % 5 === 0) {
    features.push('智慧');
  }
  if (dnaNum % 7 === 0) {
    features.push('幸运');
  }

  return {
    mainAppearance,
    rarity,
    rarityDescription,
    color,
    features
  };
};

// 获取僵尸统计信息
export const getZombieStats = (zombie: Zombie): ZombieStats => {
  const level = parseInt(zombie.level);
  const winCount = parseInt(zombie.winCount);
  const lossCount = parseInt(zombie.lossCount);
  const totalBattles = winCount + lossCount;
  const winRate = totalBattles > 0 ? Math.round((winCount / totalBattles) * 100) : 0;

  // 根据 DNA 和等级计算属性
  const dnaNum = parseInt(zombie.dna);
  const attack = level * 10 + (dnaNum % 20);
  const defense = level * 8 + (dnaNum % 15);
  const speed = level * 5 + (dnaNum % 10);

  return {
    attack,
    defense,
    speed,
    totalBattles,
    winRate
  };
};

// 获取僵尸等级颜色
export const getZombieLevelColor = (level: string): ZombieLevelColor => {
  const levelNum = parseInt(level);
  
  if (levelNum >= 10) return 'bg-red-100';
  if (levelNum >= 8) return 'bg-yellow-100';
  if (levelNum >= 6) return 'bg-purple-100';
  if (levelNum >= 4) return 'bg-blue-100';
  if (levelNum >= 2) return 'bg-green-100';
  return 'bg-gray-100';
};

// 格式化时间
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  } else if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  } else {
    return `${secs}秒`;
  }
};

// 计算冷却时间
export const calculateCooldown = (readyTime: string): number => {
  const now = Math.floor(Date.now() / 1000);
  const ready = parseInt(readyTime);
  return Math.max(0, ready - now);
};

// 检查僵尸是否准备就绪
export const isZombieReady = (readyTime: string): boolean => {
  return calculateCooldown(readyTime) <= 0;
};

// 格式化地址
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// 格式化 ETH 余额
export const formatEthBalance = (balance: string): string => {
  const num = parseFloat(balance);
  if (num === 0) return '0 ETH';
  if (num < 0.001) return '< 0.001 ETH';
  return `${num.toFixed(3)} ETH`;
};

// 生成随机 DNA
export const generateRandomDNA = (): string => {
  return Math.floor(Math.random() * 1000000000).toString();
};

// 验证僵尸名称
export const validateZombieName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim() === '') {
    return { valid: false, error: '僵尸名称不能为空' };
  }
  
  if (name.length > 20) {
    return { valid: false, error: '僵尸名称不能超过20个字符' };
  }
  
  if (!/^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/.test(name)) {
    return { valid: false, error: '僵尸名称只能包含字母、数字、中文和空格' };
  }
  
  return { valid: true };
};

// 获取僵尸等级描述
export const getZombieLevelDescription = (level: string): string => {
  const levelNum = parseInt(level);
  
  if (levelNum >= 10) return '传奇';
  if (levelNum >= 8) return '史诗';
  if (levelNum >= 6) return '稀有';
  if (levelNum >= 4) return '优秀';
  if (levelNum >= 2) return '普通';
  return '新手';
};

// 计算升级费用
export const calculateUpgradeFee = (level: string): string => {
  const levelNum = parseInt(level);
  const baseFee = 0.001; // 基础费用 0.001 ETH
  const multiplier = 1 + (levelNum * 0.1); // 每级增加 10% 费用
  return (baseFee * multiplier).toFixed(4);
}; 
// 僵尸外观生成工具
// 基于 CryptoZombies 官方教程实现

// DNA 位数配置
const DNA_DIGITS = 16;
const DNA_MODULUS = 10 ** DNA_DIGITS;

// 外观特征配置
const ZOMBIE_NAMES = [
  "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie",
  "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie", "Zombie"
];

// 根据 CryptoZombies 教程，DNA 的不同位数代表不同特征
// 实现真正的特征化外观系统
const ZOMBIE_TRAITS = {
  // 头部特征 (DNA 的前2位) - 10种不同的头部样式
  head: [
    "🧟‍♂️", // 0: 男性僵尸
    "🧟‍♀️", // 1: 女性僵尸
    "🧟",   // 2: 中性僵尸
    "👻",   // 3: 幽灵僵尸
    "💀",   // 4: 骷髅僵尸
    "🤖",   // 5: 机器人僵尸
    "👹",   // 6: 恶魔僵尸
    "👺",   // 7: 天狗僵尸
    "🤡",   // 8: 小丑僵尸
    "👽"    // 9: 外星僵尸
  ],
  // 眼睛特征 (DNA 的第3-4位) - 10种不同的眼睛样式
  eyes: [
    "👁️",     // 0: 单眼
    "👁️‍🗨️",   // 1: 异色眼
    "👀",     // 2: 双眼
    "😵",     // 3: 眩晕眼
    "😴",     // 4: 睡眠眼
    "😈",     // 5: 恶魔眼
    "🤪",     // 6: 疯狂眼
    "🥺",     // 7: 可怜眼
    "😏",     // 8: 狡猾眼
    "🤩"      // 9: 星星眼
  ],
  // 身体特征 (DNA 的第5-6位) - 10种不同的身体样式
  body: [
    "🦴",   // 0: 骨架
    "💀",   // 1: 骷髅
    "🦿",   // 2: 假肢
    "🩻",   // 3: X光
    "🩺",   // 4: 听诊器
    "🩹",   // 5: 绷带
    "🩼",   // 6: 拐杖
    "🩽",   // 7: 轮椅
    "🩾",   // 8: 义肢
    "🩿"    // 9: 假牙
  ],
  // 服装特征 (DNA 的第7-8位) - 10种不同的服装样式
  clothing: [
    "👕",   // 0: T恤
    "👔",   // 1: 领带
    "👖",   // 2: 裤子
    "👗",   // 3: 裙子
    "👘",   // 4: 和服
    "👙",   // 5: 泳装
    "👚",   // 6: 女装
    "👛",   // 7: 钱包
    "👜",   // 8: 手提包
    "👝"    // 9: 手包
  ]
};

// 解析 DNA 获取特征
export const parseDNA = (dna) => {
  const dnaNum = parseInt(dna);
  
  // 确保 DNA 在有效范围内
  if (isNaN(dnaNum) || dnaNum < 0 || dnaNum >= DNA_MODULUS) {
    return {
      head: 0,
      eyes: 0,
      body: 0,
      clothing: 0,
      rarity: 0
    };
  }

  // 将 DNA 转换为字符串，确保有足够的位数
  const dnaStr = dnaNum.toString().padStart(DNA_DIGITS, '0');
  
  // 提取不同位置的特征
  const head = parseInt(dnaStr.slice(0, 2)) % 10;
  const eyes = parseInt(dnaStr.slice(2, 4)) % 10;
  const body = parseInt(dnaStr.slice(4, 6)) % 10;
  const clothing = parseInt(dnaStr.slice(6, 8)) % 10;
  
  // 计算稀有度 (基于 DNA 的特殊模式)
  const rarity = calculateRarity(dnaNum);
  
  return {
    head,
    eyes,
    body,
    clothing,
    rarity
  };
};

// 计算僵尸稀有度
const calculateRarity = (dna) => {
  const dnaStr = dna.toString().padStart(DNA_DIGITS, '0');
  
  // 检查特殊模式
  if (dnaStr.match(/^(\d)\1{15}$/)) {
    return 100; // 所有数字相同 - 极其稀有
  }
  
  if (dnaStr.match(/^(\d)\1{7}/)) {
    return 80; // 前8位相同 - 非常稀有
  }
  
  if (dnaStr.match(/^(\d)\1{3}/)) {
    return 60; // 前4位相同 - 稀有
  }
  
  // 检查连续数字
  if (dnaStr.match(/1234567890123456/)) {
    return 90; // 连续数字 - 极其稀有
  }
  
  // 检查回文
  if (dnaStr === dnaStr.split('').reverse().join('')) {
    return 85; // 回文 - 非常稀有
  }
  
  // 基础稀有度基于 DNA 的复杂度
  const uniqueDigits = new Set(dnaStr.split('')).size;
  return Math.max(10, uniqueDigits * 5);
};

// 生成僵尸外观
export const generateZombieAppearance = (dna) => {
  const traits = parseDNA(dna);
  
  // 根据特征组合生成外观
  const appearance = generateCombinedAppearance(traits);
  
  return {
    // 主要外观 (组合特征)
    mainAppearance: appearance.main,
    // 特征组合
    appearance: appearance,
    // 完整特征
    traits,
    // 稀有度
    rarity: traits.rarity,
    // 稀有度描述
    rarityDescription: getRarityDescription(traits.rarity),
    // 颜色主题
    colorTheme: getColorTheme(traits.rarity)
  };
};

// 根据特征组合生成外观
const generateCombinedAppearance = (traits) => {
  const head = ZOMBIE_TRAITS.head[traits.head];
  const eyes = ZOMBIE_TRAITS.eyes[traits.eyes];
  const body = ZOMBIE_TRAITS.body[traits.body];
  const clothing = ZOMBIE_TRAITS.clothing[traits.clothing];
  
  // 根据特征组合创建独特的外观
  let mainAppearance = head;
  
  // 特殊组合效果
  if (traits.head === 4 && traits.eyes === 5) {
    // 骷髅头 + 恶魔眼 = 恶魔骷髅
    mainAppearance = "💀🔥";
  } else if (traits.head === 5 && traits.body === 2) {
    // 机器人 + 假肢 = 机械僵尸
    mainAppearance = "🤖⚙️";
  } else if (traits.head === 3 && traits.clothing === 4) {
    // 幽灵 + 和服 = 日本幽灵
    mainAppearance = "👻🎌";
  } else if (traits.head === 6 && traits.eyes === 5) {
    // 恶魔 + 恶魔眼 = 双恶魔
    mainAppearance = "👹😈";
  } else if (traits.head === 8 && traits.eyes === 6) {
    // 小丑 + 疯狂眼 = 疯狂小丑
    mainAppearance = "🤡🤪";
  } else if (traits.head === 9 && traits.eyes === 9) {
    // 外星人 + 星星眼 = 外星访客
    mainAppearance = "👽🤩";
  } else {
    // 普通组合，使用头部特征
    mainAppearance = head;
  }
  
  return {
    main: mainAppearance,
    head: head,
    eyes: eyes,
    body: body,
    clothing: clothing,
    // 特征描述
    description: getAppearanceDescription(traits)
  };
};

// 获取外观描述
const getAppearanceDescription = (traits) => {
  const descriptions = [];
  
  // 头部描述
  const headNames = ["男性僵尸", "女性僵尸", "中性僵尸", "幽灵僵尸", "骷髅僵尸", "机器人僵尸", "恶魔僵尸", "天狗僵尸", "小丑僵尸", "外星僵尸"];
  descriptions.push(headNames[traits.head]);
  
  // 眼睛描述
  const eyeNames = ["单眼", "异色眼", "双眼", "眩晕眼", "睡眠眼", "恶魔眼", "疯狂眼", "可怜眼", "狡猾眼", "星星眼"];
  descriptions.push(eyeNames[traits.eyes]);
  
  // 身体描述
  const bodyNames = ["骨架", "骷髅", "假肢", "X光", "听诊器", "绷带", "拐杖", "轮椅", "义肢", "假牙"];
  descriptions.push(bodyNames[traits.body]);
  
  // 服装描述
  const clothingNames = ["T恤", "领带", "裤子", "裙子", "和服", "泳装", "女装", "钱包", "手提包", "手包"];
  descriptions.push(clothingNames[traits.clothing]);
  
  return descriptions.join(" + ");
};

// 获取稀有度描述
const getRarityDescription = (rarity) => {
  if (rarity >= 90) return "传奇";
  if (rarity >= 80) return "史诗";
  if (rarity >= 60) return "稀有";
  if (rarity >= 40) return "罕见";
  return "普通";
};

// 获取颜色主题
const getColorTheme = (rarity) => {
  if (rarity >= 90) return "bg-gradient-to-r from-yellow-400 to-orange-500";
  if (rarity >= 80) return "bg-gradient-to-r from-purple-400 to-pink-500";
  if (rarity >= 60) return "bg-gradient-to-r from-blue-400 to-cyan-500";
  if (rarity >= 40) return "bg-gradient-to-r from-green-400 to-teal-500";
  return "bg-gradient-to-r from-gray-400 to-gray-500";
};

// 获取僵尸等级颜色
export const getZombieLevelColor = (level) => {
  const levelNum = parseInt(level);
  if (levelNum >= 20) return "bg-gradient-to-r from-red-600 to-pink-600";
  if (levelNum >= 15) return "bg-gradient-to-r from-purple-600 to-indigo-600";
  if (levelNum >= 10) return "bg-gradient-to-r from-blue-600 to-cyan-600";
  if (levelNum >= 7) return "bg-gradient-to-r from-green-600 to-emerald-600";
  if (levelNum >= 4) return "bg-gradient-to-r from-yellow-600 to-orange-600";
  return "bg-gradient-to-r from-gray-600 to-gray-700";
};

// 获取僵尸状态图标
export const getZombieStatusIcon = (zombie) => {
  const now = Math.floor(Date.now() / 1000);
  const readyTime = parseInt(zombie.readyTime);
  const isReady = readyTime <= now;
  
  if (isReady) {
    return "✅";
  }
  
  const cooldownRemaining = readyTime - now;
  const hours = Math.floor(cooldownRemaining / 3600);
  
  if (hours > 12) return "😴";
  if (hours > 6) return "😪";
  if (hours > 1) return "😴";
  return "⏰";
};

// 获取僵尸详细信息
export const getZombieDetails = (zombie) => {
  const appearance = generateZombieAppearance(zombie.dna);
  const statusIcon = getZombieStatusIcon(zombie);
  
  return {
    ...zombie,
    appearance,
    statusIcon,
    isReady: parseInt(zombie.readyTime) <= Math.floor(Date.now() / 1000)
  };
};

// 格式化 DNA 显示
export const formatDNA = (dna) => {
  const dnaNum = parseInt(dna);
  return dnaNum.toString().padStart(DNA_DIGITS, '0');
};

// 获取僵尸统计信息
export const getZombieStats = (zombie) => {
  const winRate = parseInt(zombie.winCount) + parseInt(zombie.lossCount) > 0 
    ? Math.round((parseInt(zombie.winCount) / (parseInt(zombie.winCount) + parseInt(zombie.lossCount))) * 100)
    : 0;
    
  return {
    winRate,
    totalBattles: parseInt(zombie.winCount) + parseInt(zombie.lossCount),
    winCount: parseInt(zombie.winCount),
    lossCount: parseInt(zombie.lossCount),
    level: parseInt(zombie.level)
  };
}; 
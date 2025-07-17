console.log('🧟 僵尸外观系统测试\n');

// 测试僵尸外观生成
function testZombieAppearance() {
  console.log('🔍 测试僵尸外观生成...\n');
  
  try {
    // 导入僵尸外观工具
    const { 
      generateZombieAppearance, 
      parseDNA, 
      formatDNA, 
      getZombieStats 
    } = require('./src/utils/zombieHelper');
    
    // 测试不同的 DNA
    const testDNAs = [
      '1234567890123456', // 连续数字 - 应该很稀有
      '1111111111111111', // 全相同 - 极其稀有
      '1234567890123456', // 连续数字
      '9999999999999999', // 全9 - 稀有
      '1234567890123456', // 连续数字
      '9876543210987654', // 回文 - 稀有
      '1234567890123456', // 连续数字
      '5555555555555555', // 全5 - 稀有
      '1234567890123456', // 连续数字
      '1234567890123456'  // 连续数字
    ];
    
    console.log('📋 测试 DNA 解析和外观生成:');
    
    testDNAs.forEach((dna, index) => {
      console.log(`\n🧪 测试 ${index + 1}:`);
      console.log(`DNA: ${dna}`);
      
      // 解析 DNA
      const traits = parseDNA(dna);
      console.log(`特征: 头部=${traits.head}, 眼睛=${traits.eyes}, 身体=${traits.body}, 服装=${traits.clothing}`);
      console.log(`稀有度: ${traits.rarity}/100`);
      
      // 生成外观
      const appearance = generateZombieAppearance(dna);
      console.log(`外观: ${appearance.mainAppearance}`);
      console.log(`稀有度描述: ${appearance.rarityDescription}`);
      console.log(`颜色主题: ${appearance.colorTheme}`);
      
      // 格式化 DNA
      const formattedDNA = formatDNA(dna);
      console.log(`格式化DNA: ${formattedDNA}`);
    });
    
    // 测试僵尸统计
    console.log('\n📊 测试僵尸统计:');
    const testZombie = {
      winCount: '5',
      lossCount: '3',
      level: '10'
    };
    
    const stats = getZombieStats(testZombie);
    console.log(`僵尸统计:`, stats);
    console.log(`胜率: ${stats.winRate}%`);
    console.log(`总战斗: ${stats.totalBattles}`);
    
    console.log('\n✅ 僵尸外观系统测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n💡 可能的原因:');
    console.log('1. 模块路径不正确');
    console.log('2. 需要在前端环境中运行');
    console.log('3. 需要先启动前端应用');
  }
}

// 测试 DNA 稀有度计算
function testDNARarity() {
  console.log('\n🔍 测试 DNA 稀有度计算...\n');
  
  try {
    const { parseDNA } = require('./src/utils/zombieHelper');
    
    const rarityTests = [
      { dna: '1111111111111111', expected: '极其稀有 (100)' },
      { dna: '1234567890123456', expected: '极其稀有 (90)' },
      { dna: '9876543210987654', expected: '非常稀有 (85)' },
      { dna: '1111111100000000', expected: '非常稀有 (80)' },
      { dna: '1111000000000000', expected: '稀有 (60)' },
      { dna: '1234567890123456', expected: '极其稀有 (90)' },
      { dna: '5555555555555555', expected: '稀有 (60)' },
      { dna: '1234567890123456', expected: '极其稀有 (90)' },
      { dna: '9999999999999999', expected: '稀有 (60)' },
      { dna: '1234567890123456' }  // 连续数字
    ];
    
    console.log('📋 DNA 稀有度测试:');
    
    rarityTests.forEach((test, index) => {
      const traits = parseDNA(test.dna);
      const rarity = traits.rarity;
      
      let rarityDesc = '普通';
      if (rarity >= 90) rarityDesc = '极其稀有';
      else if (rarity >= 80) rarityDesc = '非常稀有';
      else if (rarity >= 60) rarityDesc = '稀有';
      else if (rarity >= 40) rarityDesc = '罕见';
      
      console.log(`${index + 1}. DNA: ${test.dna} -> ${rarityDesc} (${rarity})`);
      
      if (test.expected) {
        const expectedRarity = parseInt(test.expected.match(/\((\d+)\)/)[1]);
        if (rarity === expectedRarity) {
          console.log(`   ✅ 符合预期`);
        } else {
          console.log(`   ❌ 不符合预期，期望 ${expectedRarity}，实际 ${rarity}`);
        }
      }
    });
    
    console.log('\n✅ DNA 稀有度测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 测试外观特征
function testAppearanceTraits() {
  console.log('\n🔍 测试外观特征...\n');
  
  try {
    const { generateZombieAppearance } = require('./src/utils/zombieHelper');
    
    console.log('📋 外观特征测试:');
    
    // 测试不同特征组合
    const traitTests = [
      { dna: '0000000000000000', desc: '全0特征' },
      { dna: '1111111111111111', desc: '全1特征' },
      { dna: '2222222222222222', desc: '全2特征' },
      { dna: '3333333333333333', desc: '全3特征' },
      { dna: '4444444444444444', desc: '全4特征' },
      { dna: '5555555555555555', desc: '全5特征' },
      { dna: '6666666666666666', desc: '全6特征' },
      { dna: '7777777777777777', desc: '全7特征' },
      { dna: '8888888888888888', desc: '全8特征' },
      { dna: '9999999999999999', desc: '全9特征' }
    ];
    
    traitTests.forEach((test, index) => {
      const appearance = generateZombieAppearance(test.dna);
      console.log(`${index + 1}. ${test.desc}:`);
      console.log(`   外观: ${appearance.mainAppearance}`);
      console.log(`   特征: 头部=${appearance.traits.head}, 眼睛=${appearance.traits.eyes}, 身体=${appearance.traits.body}, 服装=${appearance.traits.clothing}`);
      console.log(`   稀有度: ${appearance.rarityDescription} (${appearance.rarity})`);
    });
    
    console.log('\n✅ 外观特征测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 导出测试函数到全局作用域
window.testZombieAppearance = testZombieAppearance;
window.testDNARarity = testDNARarity;
window.testAppearanceTraits = testAppearanceTraits;

console.log('📝 僵尸外观测试函数已加载:');
console.log('  - testZombieAppearance(): 测试僵尸外观生成');
console.log('  - testDNARarity(): 测试 DNA 稀有度计算');
console.log('  - testAppearanceTraits(): 测试外观特征');
console.log('\n💡 在浏览器控制台中运行这些函数来测试僵尸外观系统');

// 如果直接运行此脚本
if (typeof window === 'undefined') {
  console.log('\n🚀 直接运行测试...');
  testZombieAppearance();
  testDNARarity();
  testAppearanceTraits();
} 
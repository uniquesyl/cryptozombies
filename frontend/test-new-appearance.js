console.log('🧟 新僵尸外观系统测试\n');

// 测试新的僵尸外观生成
function testNewZombieAppearance() {
  console.log('🔍 测试新僵尸外观生成...\n');
  
  try {
    // 模拟导入僵尸外观工具
    const { 
      generateZombieAppearance, 
      parseDNA, 
      formatDNA 
    } = require('./src/utils/zombieHelper');
    
    // 测试不同的 DNA 组合
    const testDNAs = [
      { dna: '0000000000000000', desc: '全0特征 - 男性僵尸+单眼+骨架+T恤' },
      { dna: '1111111111111111', desc: '全1特征 - 女性僵尸+异色眼+骷髅+领带' },
      { dna: '2222222222222222', desc: '全2特征 - 中性僵尸+双眼+假肢+裤子' },
      { dna: '3333333333333333', desc: '全3特征 - 幽灵僵尸+眩晕眼+X光+裙子' },
      { dna: '4444444444444444', desc: '全4特征 - 骷髅僵尸+睡眠眼+听诊器+和服' },
      { dna: '5555555555555555', desc: '全5特征 - 机器人僵尸+恶魔眼+绷带+泳装' },
      { dna: '6666666666666666', desc: '全6特征 - 恶魔僵尸+疯狂眼+拐杖+女装' },
      { dna: '7777777777777777', desc: '全7特征 - 天狗僵尸+可怜眼+轮椅+钱包' },
      { dna: '8888888888888888', desc: '全8特征 - 小丑僵尸+狡猾眼+义肢+手提包' },
      { dna: '9999999999999999', desc: '全9特征 - 外星僵尸+星星眼+假牙+手包' }
    ];
    
    console.log('📋 测试 DNA 特征组合:');
    
    testDNAs.forEach((test, index) => {
      console.log(`\n🧪 测试 ${index + 1}: ${test.desc}`);
      console.log(`DNA: ${test.dna}`);
      
      // 解析 DNA
      const traits = parseDNA(test.dna);
      console.log(`特征值: 头部=${traits.head}, 眼睛=${traits.eyes}, 身体=${traits.body}, 服装=${traits.clothing}`);
      
      // 生成外观
      const appearance = generateZombieAppearance(test.dna);
      console.log(`主要外观: ${appearance.mainAppearance}`);
      console.log(`特征描述: ${appearance.appearance?.description || '无描述'}`);
      console.log(`稀有度: ${appearance.rarityDescription} (${appearance.rarity})`);
      
      // 显示特征组合
      if (appearance.appearance) {
        console.log(`特征组合:`);
        console.log(`  头部: ${appearance.appearance.head}`);
        console.log(`  眼睛: ${appearance.appearance.eyes}`);
        console.log(`  身体: ${appearance.appearance.body}`);
        console.log(`  服装: ${appearance.appearance.clothing}`);
      }
    });
    
    // 测试特殊组合
    console.log('\n🎯 测试特殊组合效果:');
    const specialCombos = [
      { dna: '4500000000000000', desc: '骷髅头+恶魔眼 = 恶魔骷髅' },
      { dna: '5200000000000000', desc: '机器人+假肢 = 机械僵尸' },
      { dna: '3400000000000000', desc: '幽灵+和服 = 日本幽灵' },
      { dna: '6500000000000000', desc: '恶魔+恶魔眼 = 双恶魔' },
      { dna: '8600000000000000', desc: '小丑+疯狂眼 = 疯狂小丑' },
      { dna: '9900000000000000', desc: '外星人+星星眼 = 外星访客' }
    ];
    
    specialCombos.forEach((combo, index) => {
      console.log(`\n🔥 特殊组合 ${index + 1}: ${combo.desc}`);
      const appearance = generateZombieAppearance(combo.dna);
      console.log(`外观: ${appearance.mainAppearance}`);
      console.log(`描述: ${appearance.appearance?.description || '无描述'}`);
    });
    
    console.log('\n✅ 新僵尸外观系统测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n💡 可能的原因:');
    console.log('1. 模块路径不正确');
    console.log('2. 需要在前端环境中运行');
    console.log('3. 需要先启动前端应用');
  }
}

// 测试特征映射
function testTraitMapping() {
  console.log('\n🔍 测试特征映射...\n');
  
  try {
    const { parseDNA } = require('./src/utils/zombieHelper');
    
    console.log('📋 特征映射测试:');
    
    // 测试每个特征位置
    const traitTests = [
      { dna: '0000000000000000', expected: { head: 0, eyes: 0, body: 0, clothing: 0 } },
      { dna: '1111111111111111', expected: { head: 1, eyes: 1, body: 1, clothing: 1 } },
      { dna: '2222222222222222', expected: { head: 2, eyes: 2, body: 2, clothing: 2 } },
      { dna: '3333333333333333', expected: { head: 3, eyes: 3, body: 3, clothing: 3 } },
      { dna: '4444444444444444', expected: { head: 4, eyes: 4, body: 4, clothing: 4 } },
      { dna: '5555555555555555', expected: { head: 5, eyes: 5, body: 5, clothing: 5 } },
      { dna: '6666666666666666', expected: { head: 6, eyes: 6, body: 6, clothing: 6 } },
      { dna: '7777777777777777', expected: { head: 7, eyes: 7, body: 7, clothing: 7 } },
      { dna: '8888888888888888', expected: { head: 8, eyes: 8, body: 8, clothing: 8 } },
      { dna: '9999999999999999', expected: { head: 9, eyes: 9, body: 9, clothing: 9 } }
    ];
    
    traitTests.forEach((test, index) => {
      const traits = parseDNA(test.dna);
      const expected = test.expected;
      
      console.log(`测试 ${index + 1}: DNA ${test.dna}`);
      console.log(`  实际: 头部=${traits.head}, 眼睛=${traits.eyes}, 身体=${traits.body}, 服装=${traits.clothing}`);
      console.log(`  期望: 头部=${expected.head}, 眼睛=${expected.eyes}, 身体=${expected.body}, 服装=${expected.clothing}`);
      
      const isCorrect = traits.head === expected.head && 
                       traits.eyes === expected.eyes && 
                       traits.body === expected.body && 
                       traits.clothing === expected.clothing;
      
      console.log(`  结果: ${isCorrect ? '✅ 正确' : '❌ 错误'}`);
    });
    
    console.log('\n✅ 特征映射测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 测试稀有度计算
function testRarityCalculation() {
  console.log('\n🔍 测试稀有度计算...\n');
  
  try {
    const { generateZombieAppearance } = require('./src/utils/zombieHelper');
    
    console.log('📋 稀有度测试:');
    
    const rarityTests = [
      { dna: '1111111111111111', expected: '传奇' },
      { dna: '1234567890123456', expected: '史诗' },
      { dna: '9876543210987654', expected: '史诗' },
      { dna: '1111111100000000', expected: '史诗' },
      { dna: '1111000000000000', expected: '稀有' },
      { dna: '5555555555555555', expected: '稀有' },
      { dna: '1234567890123456', expected: '史诗' },
      { dna: '0000000000000000', expected: '稀有' },
      { dna: '9999999999999999', expected: '稀有' },
      { dna: '1234567890123456' }  // 连续数字
    ];
    
    rarityTests.forEach((test, index) => {
      const appearance = generateZombieAppearance(test.dna);
      const rarity = appearance.rarityDescription;
      
      console.log(`${index + 1}. DNA: ${test.dna} -> ${rarity} (${appearance.rarity})`);
      
      if (test.expected) {
        if (rarity === test.expected) {
          console.log(`   ✅ 符合预期`);
        } else {
          console.log(`   ❌ 不符合预期，期望 ${test.expected}，实际 ${rarity}`);
        }
      }
    });
    
    console.log('\n✅ 稀有度计算测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 导出测试函数到全局作用域
window.testNewZombieAppearance = testNewZombieAppearance;
window.testTraitMapping = testTraitMapping;
window.testRarityCalculation = testRarityCalculation;

console.log('📝 新僵尸外观测试函数已加载:');
console.log('  - testNewZombieAppearance(): 测试新僵尸外观生成');
console.log('  - testTraitMapping(): 测试特征映射');
console.log('  - testRarityCalculation(): 测试稀有度计算');
console.log('\n💡 在浏览器控制台中运行这些函数来测试新的僵尸外观系统');

// 如果直接运行此脚本
if (typeof window === 'undefined') {
  console.log('\n🚀 直接运行测试...');
  testNewZombieAppearance();
  testTraitMapping();
  testRarityCalculation();
} 
console.log('⏰ 冷却时间显示测试\n');

// 测试冷却时间计算
function testCooldownCalculation() {
  console.log('🔍 测试冷却时间计算...\n');
  
  // 模拟不同的时间状态
  const now = Math.floor(Date.now() / 1000);
  
  const testCases = [
    {
      name: '准备就绪的僵尸',
      readyTime: now - 3600, // 1小时前就准备好了
      expected: '准备就绪'
    },
    {
      name: '冷却中的僵尸 (1小时后)',
      readyTime: now + 3600, // 1小时后准备好
      expected: '冷却中: 01:00:00'
    },
    {
      name: '冷却中的僵尸 (30分钟后)',
      readyTime: now + 1800, // 30分钟后准备好
      expected: '冷却中: 00:30:00'
    },
    {
      name: '冷却中的僵尸 (5分钟后)',
      readyTime: now + 300, // 5分钟后准备好
      expected: '冷却中: 00:05:00'
    },
    {
      name: '冷却中的僵尸 (1分钟后)',
      readyTime: now + 60, // 1分钟后准备好
      expected: '冷却中: 00:01:00'
    },
    {
      name: '冷却中的僵尸 (30秒后)',
      readyTime: now + 30, // 30秒后准备好
      expected: '冷却中: 00:00:30'
    }
  ];
  
  console.log('📋 冷却时间测试:');
  
  testCases.forEach((testCase, index) => {
    const readyTimeNum = parseInt(testCase.readyTime);
    const remaining = Math.max(0, readyTimeNum - now);
    const isReady = remaining <= 0;
    
    if (isReady) {
      console.log(`${index + 1}. ${testCase.name}: ✅ 准备就绪`);
    } else {
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      
      console.log(`${index + 1}. ${testCase.name}: ⏰ 冷却中: ${timeString}`);
    }
  });
  
  console.log('\n✅ 冷却时间计算测试完成！');
}

// 测试时间格式化
function testTimeFormatting() {
  console.log('\n🔍 测试时间格式化...\n');
  
  const timeTests = [
    { seconds: 0, expected: '00:00:00' },
    { seconds: 30, expected: '00:00:30' },
    { seconds: 60, expected: '00:01:00' },
    { seconds: 90, expected: '00:01:30' },
    { seconds: 3600, expected: '01:00:00' },
    { seconds: 3661, expected: '01:01:01' },
    { seconds: 7200, expected: '02:00:00' },
    { seconds: 86400, expected: '24:00:00' }
  ];
  
  console.log('📋 时间格式化测试:');
  
  timeTests.forEach((test, index) => {
    const hours = Math.floor(test.seconds / 3600);
    const minutes = Math.floor((test.seconds % 3600) / 60);
    const seconds = test.seconds % 60;
    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    console.log(`${index + 1}. ${test.seconds}秒 -> ${formatted} ${formatted === test.expected ? '✅' : '❌'}`);
  });
  
  console.log('\n✅ 时间格式化测试完成！');
}

// 测试僵尸状态判断
function testZombieStatus() {
  console.log('\n🔍 测试僵尸状态判断...\n');
  
  const now = Math.floor(Date.now() / 1000);
  
  const zombieTests = [
    {
      name: '新创建的僵尸',
      readyTime: now + 86400, // 24小时后准备好
      canLevelUp: false,
      canAttack: false,
      canChangeName: true // 改名不需要冷却
    },
    {
      name: '准备就绪的僵尸',
      readyTime: now - 3600, // 1小时前就准备好了
      canLevelUp: true,
      canAttack: true,
      canChangeName: true
    },
    {
      name: '冷却中的僵尸',
      readyTime: now + 1800, // 30分钟后准备好
      canLevelUp: false,
      canAttack: false,
      canChangeName: true
    }
  ];
  
  console.log('📋 僵尸状态测试:');
  
  zombieTests.forEach((test, index) => {
    const readyTimeNum = parseInt(test.readyTime);
    const isReady = readyTimeNum <= now;
    
    console.log(`${index + 1}. ${test.name}:`);
    console.log(`   准备状态: ${isReady ? '✅ 准备就绪' : '⏰ 冷却中'}`);
    console.log(`   可以升级: ${test.canLevelUp && isReady ? '✅ 是' : '❌ 否'}`);
    console.log(`   可以攻击: ${test.canAttack && isReady ? '✅ 是' : '❌ 否'}`);
    console.log(`   可以改名: ${test.canChangeName ? '✅ 是' : '❌ 否'}`);
  });
  
  console.log('\n✅ 僵尸状态测试完成！');
}

// 模拟 CooldownTimer 组件逻辑
function simulateCooldownTimer(readyTime) {
  const now = Math.floor(Date.now() / 1000);
  const readyTimeNum = parseInt(readyTime);
  const remaining = Math.max(0, readyTimeNum - now);
  const isReady = remaining <= 0;
  
  if (isReady) {
    return '✅ 准备就绪';
  }
  
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  
  return `⏰ 冷却中: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 测试 CooldownTimer 组件
function testCooldownTimerComponent() {
  console.log('\n🔍 测试 CooldownTimer 组件...\n');
  
  const now = Math.floor(Date.now() / 1000);
  
  const timerTests = [
    { readyTime: now - 3600, desc: '1小时前准备好' },
    { readyTime: now + 3600, desc: '1小时后准备好' },
    { readyTime: now + 1800, desc: '30分钟后准备好' },
    { readyTime: now + 300, desc: '5分钟后准备好' },
    { readyTime: now + 60, desc: '1分钟后准备好' },
    { readyTime: now + 30, desc: '30秒后准备好' }
  ];
  
  console.log('📋 CooldownTimer 组件测试:');
  
  timerTests.forEach((test, index) => {
    const result = simulateCooldownTimer(test.readyTime);
    console.log(`${index + 1}. ${test.desc}: ${result}`);
  });
  
  console.log('\n✅ CooldownTimer 组件测试完成！');
}

// 导出测试函数到全局作用域
window.testCooldownCalculation = testCooldownCalculation;
window.testTimeFormatting = testTimeFormatting;
window.testZombieStatus = testZombieStatus;
window.testCooldownTimerComponent = testCooldownTimerComponent;

console.log('📝 冷却时间测试函数已加载:');
console.log('  - testCooldownCalculation(): 测试冷却时间计算');
console.log('  - testTimeFormatting(): 测试时间格式化');
console.log('  - testZombieStatus(): 测试僵尸状态判断');
console.log('  - testCooldownTimerComponent(): 测试 CooldownTimer 组件');
console.log('\n💡 在浏览器控制台中运行这些函数来测试冷却时间显示功能');

// 如果直接运行此脚本
if (typeof window === 'undefined') {
  console.log('\n🚀 直接运行测试...');
  testCooldownCalculation();
  testTimeFormatting();
  testZombieStatus();
  testCooldownTimerComponent();
} 
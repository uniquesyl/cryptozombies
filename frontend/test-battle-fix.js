console.log('🔍 验证战斗功能修复\n');

// 测试函数：检查僵尸所有者信息
async function testZombieOwnership() {
  console.log('🧟 测试僵尸所有者信息获取...');
  
  try {
    // 检查合约是否可用
    if (typeof window.contract === 'undefined') {
      console.log('❌ 合约未定义，请确保已连接钱包');
      return;
    }
    
    // 检查账户是否连接
    if (typeof window.account === 'undefined') {
      console.log('❌ 账户未定义，请确保已连接钱包');
      return;
    }
    
    const contract = window.contract;
    const account = window.account;
    
    console.log('✅ 合约和账户已连接');
    console.log('📍 当前账户:', account);
    
    // 获取僵尸总数
    const zombieCount = await contract.zombies.length;
    console.log('📊 总僵尸数量:', zombieCount.toString());
    
    // 检查前几个僵尸的所有者信息
    console.log('\n🔍 检查僵尸所有者信息:');
    for (let i = 0; i < Math.min(5, zombieCount); i++) {
      try {
        const zombie = await contract.zombies(i);
        
        if (zombie.name && zombie.name !== '') {
          const owner = await contract.ownerOf(i);
          const isOwnedByMe = owner.toLowerCase() === account.toLowerCase();
          
          console.log(`\n僵尸 #${i}:`);
          console.log(`  名称: ${zombie.name}`);
          console.log(`  所有者: ${owner}`);
          console.log(`  是否属于我: ${isOwnedByMe ? '✅ 是' : '❌ 否'}`);
          console.log(`  等级: ${zombie.level}`);
          console.log(`  胜利: ${zombie.winCount}, 失败: ${zombie.lossCount}`);
        }
      } catch (err) {
        console.log(`僵尸 #${i}: 不存在或获取失败`);
      }
    }
    
    // 获取我的僵尸
    console.log('\n🎯 获取我的僵尸:');
    const myZombies = await contract.getZombiesByOwner(account);
    console.log('我的僵尸ID列表:', myZombies.map(id => id.toString()));
    
    if (myZombies.length > 0) {
      console.log('\n我的僵尸详情:');
      for (const id of myZombies) {
        const zombie = await contract.zombies(id);
        const owner = await contract.ownerOf(id);
        console.log(`  僵尸 #${id}: ${zombie.name} (所有者: ${owner})`);
      }
    }
    
    console.log('\n✅ 测试完成！');
    console.log('\n💡 如果看到"不能攻击自己的僵尸"错误，这是正常行为：');
    console.log('1. 系统正确识别了僵尸所有者');
    console.log('2. 防止了自相残杀');
    console.log('3. 应该选择其他玩家的僵尸进行攻击');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 测试函数：模拟前端过滤逻辑
async function testFilteringLogic() {
  console.log('\n🔍 测试前端过滤逻辑...');
  
  try {
    if (typeof window.contract === 'undefined' || typeof window.account === 'undefined') {
      console.log('❌ 请先连接钱包');
      return;
    }
    
    const contract = window.contract;
    const account = window.account;
    
    // 模拟获取所有僵尸
    const allZombies = [];
    const zombieCount = await contract.zombies.length;
    
    for (let i = 0; i < Math.min(10, zombieCount); i++) {
      try {
        const zombie = await contract.zombies(i);
        if (zombie.name && zombie.name !== '') {
          const owner = await contract.ownerOf(i);
          allZombies.push({
            id: i,
            name: zombie.name,
            owner: owner
          });
        }
      } catch (err) {
        // 跳过不存在的僵尸
      }
    }
    
    console.log('📋 所有僵尸:', allZombies.map(z => `#${z.id}:${z.name}`));
    
    // 模拟前端过滤逻辑
    const myZombies = allZombies.filter(zombie => 
      zombie.owner.toLowerCase() === account.toLowerCase()
    );
    
    const otherZombies = allZombies.filter(zombie => 
      zombie.owner.toLowerCase() !== account.toLowerCase()
    );
    
    console.log('\n🎯 我的僵尸 (攻击者选择):', myZombies.map(z => `#${z.id}:${z.name}`));
    console.log('🎯 其他僵尸 (目标选择):', otherZombies.map(z => `#${z.id}:${z.name}`));
    
    if (myZombies.length > 0 && otherZombies.length > 0) {
      console.log('\n✅ 可以进行战斗！');
      console.log('💡 选择我的僵尸作为攻击者，选择其他僵尸作为目标');
    } else if (myZombies.length === 0) {
      console.log('\n⚠️ 您还没有僵尸，需要先创建僵尸');
    } else if (otherZombies.length === 0) {
      console.log('\n⚠️ 没有其他玩家的僵尸可以攻击');
    }
    
  } catch (error) {
    console.error('❌ 过滤逻辑测试失败:', error.message);
  }
}

// 导出测试函数到全局作用域
window.testZombieOwnership = testZombieOwnership;
window.testFilteringLogic = testFilteringLogic;

console.log('📝 测试函数已加载:');
console.log('  - testZombieOwnership(): 测试僵尸所有者信息');
console.log('  - testFilteringLogic(): 测试前端过滤逻辑');
console.log('\n💡 在浏览器控制台中运行这些函数来测试修复效果'); 
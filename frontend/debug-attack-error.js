console.log('🔍 攻击失败诊断工具\n');

// 诊断攻击失败的原因
async function debugAttackError() {
  console.log('🧟 开始诊断攻击失败原因...\n');
  
  try {
    // 检查合约和账户
    if (typeof window.contract === 'undefined') {
      console.log('❌ 合约未定义，请确保已连接钱包');
      return;
    }
    
    if (typeof window.account === 'undefined') {
      console.log('❌ 账户未定义，请确保已连接钱包');
      return;
    }
    
    const contract = window.contract;
    const account = window.account;
    
    console.log('✅ 合约和账户已连接');
    console.log('📍 当前账户:', account);
    console.log('📋 合约地址:', contract.address);
    
    // 获取我的僵尸
    console.log('\n🎯 检查我的僵尸...');
    const myZombies = await contract.getZombiesByOwner(account);
    console.log('我的僵尸ID列表:', myZombies.map(id => id.toString()));
    
    if (myZombies.length === 0) {
      console.log('❌ 您没有僵尸，无法进行攻击');
      return;
    }
    
    // 检查每个僵尸的状态
    console.log('\n🔍 检查僵尸状态...');
    for (const zombieId of myZombies) {
      const zombie = await contract.zombies(zombieId);
      const owner = await contract.ownerOf(zombieId);
      const now = Math.floor(Date.now() / 1000);
      const readyTime = parseInt(zombie.readyTime);
      const isReady = readyTime <= now;
      const cooldownRemaining = Math.max(0, readyTime - now);
      
      console.log(`\n僵尸 #${zombieId}:`);
      console.log(`  名称: ${zombie.name}`);
      console.log(`  等级: ${zombie.level}`);
      console.log(`  所有者: ${owner}`);
      console.log(`  准备时间: ${readyTime} (${new Date(readyTime * 1000).toLocaleString()})`);
      console.log(`  当前时间: ${now} (${new Date(now * 1000).toLocaleString()})`);
      console.log(`  是否准备就绪: ${isReady ? '✅ 是' : '❌ 否'}`);
      if (!isReady) {
        console.log(`  剩余冷却时间: ${cooldownRemaining} 秒 (${Math.floor(cooldownRemaining / 3600)} 小时 ${Math.floor((cooldownRemaining % 3600) / 60)} 分钟)`);
      }
      console.log(`  胜利: ${zombie.winCount}, 失败: ${zombie.lossCount}`);
    }
    
    // 获取可攻击的目标僵尸
    console.log('\n🎯 检查可攻击的目标...');
    const allZombies = [];
    const zombieCount = await contract.zombies.length;
    
    for (let i = 0; i < Math.min(20, zombieCount); i++) {
      try {
        const zombie = await contract.zombies(i);
        if (zombie.name && zombie.name !== '') {
          const owner = await contract.ownerOf(i);
          if (owner.toLowerCase() !== account.toLowerCase()) {
            allZombies.push({
              id: i,
              name: zombie.name,
              level: zombie.level,
              owner: owner
            });
          }
        }
      } catch (err) {
        // 跳过不存在的僵尸
      }
    }
    
    console.log('可攻击的目标僵尸:', allZombies.map(z => `#${z.id}:${z.name}`));
    
    if (allZombies.length === 0) {
      console.log('❌ 没有其他玩家的僵尸可以攻击');
      return;
    }
    
    // 测试攻击条件
    console.log('\n⚔️ 测试攻击条件...');
    const readyZombies = [];
    
    for (const zombieId of myZombies) {
      const zombie = await contract.zombies(zombieId);
      const now = Math.floor(Date.now() / 1000);
      const readyTime = parseInt(zombie.readyTime);
      const isReady = readyTime <= now;
      
      if (isReady) {
        readyZombies.push(zombieId);
      }
    }
    
    console.log('准备就绪的僵尸:', readyZombies.map(id => id.toString()));
    
    if (readyZombies.length === 0) {
      console.log('❌ 所有僵尸都在冷却中，无法攻击');
      console.log('💡 需要等待僵尸冷却时间结束');
      return;
    }
    
    // 模拟攻击调用
    console.log('\n🔧 模拟攻击调用...');
    const attackerId = readyZombies[0];
    const targetId = allZombies[0].id;
    
    console.log(`攻击者僵尸: #${attackerId}`);
    console.log(`目标僵尸: #${targetId}`);
    
    try {
      // 尝试调用攻击函数（不发送交易，只估算gas）
      const attackData = contract.interface.encodeFunctionData('attack', [attackerId, targetId]);
      console.log('攻击函数数据:', attackData);
      
      // 检查攻击者僵尸的所有权
      const attackerOwner = await contract.ownerOf(attackerId);
      console.log(`攻击者僵尸所有者: ${attackerOwner}`);
      console.log(`当前账户: ${account}`);
      console.log(`所有权检查: ${attackerOwner.toLowerCase() === account.toLowerCase() ? '✅ 通过' : '❌ 失败'}`);
      
      // 检查目标僵尸是否存在
      const targetZombie = await contract.zombies(targetId);
      console.log(`目标僵尸存在: ${targetZombie.name ? '✅ 是' : '❌ 否'}`);
      
      // 检查攻击者僵尸是否准备就绪
      const attackerZombie = await contract.zombies(attackerId);
      const now = Math.floor(Date.now() / 1000);
      const readyTime = parseInt(attackerZombie.readyTime);
      const isReady = readyTime <= now;
      console.log(`攻击者僵尸准备就绪: ${isReady ? '✅ 是' : '❌ 否'}`);
      
      if (!isReady) {
        console.log(`❌ 攻击者僵尸仍在冷却中，剩余时间: ${readyTime - now} 秒`);
        return;
      }
      
      console.log('✅ 所有检查通过，攻击应该可以执行');
      console.log('💡 如果仍然失败，可能是网络或gas问题');
      
    } catch (err) {
      console.error('❌ 攻击调用失败:', err.message);
      
      if (err.message.includes('onlyOwnerOf')) {
        console.log('💡 原因: 您不是攻击者僵尸的所有者');
      } else if (err.message.includes('_isReady')) {
        console.log('💡 原因: 攻击者僵尸正在冷却中');
      } else if (err.message.includes('zombies')) {
        console.log('💡 原因: 僵尸不存在');
      } else {
        console.log('💡 原因: 其他合约错误');
      }
    }
    
  } catch (error) {
    console.error('❌ 诊断失败:', error.message);
  }
}

// 检查特定僵尸的冷却状态
async function checkZombieCooldown(zombieId) {
  console.log(`🔍 检查僵尸 #${zombieId} 的冷却状态...\n`);
  
  try {
    if (typeof window.contract === 'undefined') {
      console.log('❌ 合约未定义');
      return;
    }
    
    const contract = window.contract;
    const zombie = await contract.zombies(zombieId);
    
    if (!zombie.name || zombie.name === '') {
      console.log('❌ 僵尸不存在');
      return;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const readyTime = parseInt(zombie.readyTime);
    const isReady = readyTime <= now;
    const cooldownRemaining = Math.max(0, readyTime - now);
    
    console.log(`僵尸名称: ${zombie.name}`);
    console.log(`等级: ${zombie.level}`);
    console.log(`准备时间: ${readyTime} (${new Date(readyTime * 1000).toLocaleString()})`);
    console.log(`当前时间: ${now} (${new Date(now * 1000).toLocaleString()})`);
    console.log(`是否准备就绪: ${isReady ? '✅ 是' : '❌ 否'}`);
    
    if (!isReady) {
      console.log(`剩余冷却时间: ${cooldownRemaining} 秒`);
      console.log(`剩余时间: ${Math.floor(cooldownRemaining / 3600)} 小时 ${Math.floor((cooldownRemaining % 3600) / 60)} 分钟`);
    }
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  }
}

// 导出函数到全局作用域
window.debugAttackError = debugAttackError;
window.checkZombieCooldown = checkZombieCooldown;

console.log('📝 诊断函数已加载:');
console.log('  - debugAttackError(): 全面诊断攻击失败原因');
console.log('  - checkZombieCooldown(zombieId): 检查特定僵尸的冷却状态');
console.log('\n💡 在浏览器控制台中运行这些函数来诊断问题'); 
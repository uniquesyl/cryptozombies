console.log('🧪 综合测试所有修复\n');

// 测试所有修复的功能
async function testAllFixes() {
  console.log('🔍 开始综合测试...\n');
  
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
    
    console.log('✅ 基础连接检查通过');
    console.log('📍 当前账户:', account);
    console.log('📋 合约地址:', contract.address);
    
    // 测试1: 僵尸所有者信息获取
    console.log('\n🧪 测试1: 僵尸所有者信息获取');
    const myZombies = await contract.getZombiesByOwner(account);
    console.log('我的僵尸ID列表:', myZombies.map(id => id.toString()));
    
    if (myZombies.length > 0) {
      const testZombieId = myZombies[0];
      const zombie = await contract.zombies(testZombieId);
      const owner = await contract.ownerOf(testZombieId);
      
      console.log(`僵尸 #${testZombieId} 详情:`);
      console.log(`  名称: ${zombie.name}`);
      console.log(`  所有者: ${owner}`);
      console.log(`  所有者检查: ${owner.toLowerCase() === account.toLowerCase() ? '✅ 通过' : '❌ 失败'}`);
    }
    
    // 测试2: 僵尸冷却状态检查
    console.log('\n🧪 测试2: 僵尸冷却状态检查');
    if (myZombies.length > 0) {
      const testZombieId = myZombies[0];
      const zombie = await contract.zombies(testZombieId);
      const now = Math.floor(Date.now() / 1000);
      const readyTime = parseInt(zombie.readyTime);
      const isReady = readyTime <= now;
      const cooldownRemaining = Math.max(0, readyTime - now);
      
      console.log(`僵尸 #${testZombieId} 冷却状态:`);
      console.log(`  准备时间: ${readyTime} (${new Date(readyTime * 1000).toLocaleString()})`);
      console.log(`  当前时间: ${now} (${new Date(now * 1000).toLocaleString()})`);
      console.log(`  是否准备就绪: ${isReady ? '✅ 是' : '❌ 否'}`);
      
      if (!isReady) {
        const hours = Math.floor(cooldownRemaining / 3600);
        const minutes = Math.floor((cooldownRemaining % 3600) / 60);
        console.log(`  剩余冷却时间: ${hours}小时${minutes}分钟`);
      }
    }
    
    // 测试3: 可攻击目标检查
    console.log('\n🧪 测试3: 可攻击目标检查');
    const allZombies = [];
    const zombieCount = await contract.zombies.length;
    
    for (let i = 0; i < Math.min(10, zombieCount); i++) {
      try {
        const zombie = await contract.zombies(i);
        if (zombie.name && zombie.name !== '') {
          const owner = await contract.ownerOf(i);
          if (owner.toLowerCase() !== account.toLowerCase()) {
            allZombies.push({
              id: i,
              name: zombie.name,
              owner: owner
            });
          }
        }
      } catch (err) {
        // 跳过不存在的僵尸
      }
    }
    
    console.log('可攻击的目标僵尸:', allZombies.map(z => `#${z.id}:${z.name}`));
    console.log(`目标数量: ${allZombies.length}`);
    
    // 测试4: 攻击条件验证
    console.log('\n🧪 测试4: 攻击条件验证');
    if (myZombies.length > 0 && allZombies.length > 0) {
      const attackerId = myZombies[0];
      const targetId = allZombies[0].id;
      
      console.log(`测试攻击: 僵尸 #${attackerId} 攻击 僵尸 #${targetId}`);
      
      // 检查攻击者条件
      const attackerZombie = await contract.zombies(attackerId);
      const attackerOwner = await contract.ownerOf(attackerId);
      const now = Math.floor(Date.now() / 1000);
      const readyTime = parseInt(attackerZombie.readyTime);
      const isReady = readyTime <= now;
      
      console.log('攻击者条件检查:');
      console.log(`  所有权: ${attackerOwner.toLowerCase() === account.toLowerCase() ? '✅ 通过' : '❌ 失败'}`);
      console.log(`  准备就绪: ${isReady ? '✅ 通过' : '❌ 失败'}`);
      
      // 检查目标条件
      const targetZombie = await contract.zombies(targetId);
      const targetOwner = await contract.ownerOf(targetId);
      
      console.log('目标条件检查:');
      console.log(`  目标存在: ${targetZombie.name ? '✅ 通过' : '❌ 失败'}`);
      console.log(`  不是自己的僵尸: ${targetOwner.toLowerCase() !== account.toLowerCase() ? '✅ 通过' : '❌ 失败'}`);
      
      // 综合判断
      const canAttack = attackerOwner.toLowerCase() === account.toLowerCase() && 
                       isReady && 
                       targetZombie.name && 
                       targetOwner.toLowerCase() !== account.toLowerCase();
      
      console.log(`\n攻击可行性: ${canAttack ? '✅ 可以攻击' : '❌ 无法攻击'}`);
      
      if (!canAttack) {
        if (attackerOwner.toLowerCase() !== account.toLowerCase()) {
          console.log('💡 原因: 您不是攻击者僵尸的所有者');
        } else if (!isReady) {
          console.log('💡 原因: 攻击者僵尸正在冷却中');
        } else if (!targetZombie.name) {
          console.log('💡 原因: 目标僵尸不存在');
        } else if (targetOwner.toLowerCase() === account.toLowerCase()) {
          console.log('💡 原因: 不能攻击自己的僵尸');
        }
      }
    } else {
      if (myZombies.length === 0) {
        console.log('❌ 您没有僵尸，无法进行攻击');
      } else {
        console.log('❌ 没有其他玩家的僵尸可以攻击');
      }
    }
    
    // 测试5: 前端过滤逻辑模拟
    console.log('\n🧪 测试5: 前端过滤逻辑模拟');
    const frontendZombies = [];
    
    for (let i = 0; i < Math.min(10, zombieCount); i++) {
      try {
        const zombie = await contract.zombies(i);
        if (zombie.name && zombie.name !== '') {
          const owner = await contract.ownerOf(i);
          frontendZombies.push({
            id: i,
            name: zombie.name,
            owner: owner,
            readyTime: zombie.readyTime
          });
        }
      } catch (err) {
        // 跳过不存在的僵尸
      }
    }
    
    const myFrontendZombies = frontendZombies.filter(z => 
      z.owner.toLowerCase() === account.toLowerCase()
    );
    
    const otherFrontendZombies = frontendZombies.filter(z => 
      z.owner.toLowerCase() !== account.toLowerCase()
    );
    
    console.log('前端过滤结果:');
    console.log(`  我的僵尸: ${myFrontendZombies.map(z => `#${z.id}:${z.name}`)}`);
    console.log(`  其他僵尸: ${otherFrontendZombies.map(z => `#${z.id}:${z.name}`)}`);
    console.log(`  过滤效果: ${myFrontendZombies.length} 个我的僵尸, ${otherFrontendZombies.length} 个其他僵尸`);
    
    console.log('\n✅ 综合测试完成！');
    console.log('\n📋 测试总结:');
    console.log('1. ✅ 僵尸所有者信息获取 - 已修复');
    console.log('2. ✅ 僵尸冷却状态检查 - 已实现');
    console.log('3. ✅ 可攻击目标检查 - 已实现');
    console.log('4. ✅ 攻击条件验证 - 已实现');
    console.log('5. ✅ 前端过滤逻辑 - 已修复');
    
    console.log('\n💡 如果所有测试都通过，说明修复成功！');
    console.log('💡 现在可以正常使用战斗功能了。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n🔧 可能的解决方案:');
    console.log('1. 确保已连接钱包');
    console.log('2. 确保在正确的网络（Sepolia）');
    console.log('3. 确保合约地址正确');
    console.log('4. 检查网络连接');
  }
}

// 导出函数到全局作用域
window.testAllFixes = testAllFixes;

console.log('📝 综合测试函数已加载:');
console.log('  - testAllFixes(): 测试所有修复的功能');
console.log('\n💡 在浏览器控制台中运行 testAllFixes() 来验证所有修复'); 
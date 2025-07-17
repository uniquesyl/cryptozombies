const { ethers } = require('ethers');
require('dotenv').config();

// 合约地址和ABI（需要根据实际部署情况调整）
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x...'; // 请替换为实际地址
const CONTRACT_ABI = require('./src/utils/contract').CONTRACT_ABI;

async function testOwnerCheck() {
  console.log('🔍 测试僵尸所有者检查功能\n');
  
  try {
    // 连接到网络
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://sepolia.infura.io/v3/' + process.env.PROJECT_ID);
    
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x...') {
      console.log('❌ 请先设置正确的合约地址');
      console.log('💡 在 .env 文件中添加: CONTRACT_ADDRESS=你的合约地址');
      return;
    }
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    console.log('📋 检查合约连接...');
    const zombieCount = await contract.zombies.length;
    console.log(`✅ 合约连接成功，总僵尸数量: ${zombieCount}\n`);
    
    // 测试获取僵尸详情和所有者
    console.log('🧟 测试获取僵尸详情...');
    
    for (let i = 0; i < Math.min(5, zombieCount); i++) {
      try {
        const zombie = await contract.zombies(i);
        
        if (zombie.name && zombie.name !== '') {
          const owner = await contract.ownerOf(i);
          console.log(`\n僵尸 #${i}:`);
          console.log(`  名称: ${zombie.name}`);
          console.log(`  等级: ${zombie.level}`);
          console.log(`  所有者: ${owner}`);
          console.log(`  DNA: ${zombie.dna}`);
          console.log(`  胜利: ${zombie.winCount}, 失败: ${zombie.lossCount}`);
        }
      } catch (err) {
        console.log(`僵尸 #${i}: 不存在或获取失败`);
      }
    }
    
    // 测试不同地址的僵尸
    console.log('\n🔍 测试不同地址的僵尸...');
    
    // 获取一些账户地址（这里使用示例地址）
    const testAddresses = [
      '0x1234567890123456789012345678901234567890', // 示例地址1
      '0x0987654321098765432109876543210987654321'  // 示例地址2
    ];
    
    for (const address of testAddresses) {
      try {
        const zombieIds = await contract.getZombiesByOwner(address);
        if (zombieIds.length > 0) {
          console.log(`\n地址 ${address} 拥有的僵尸:`);
          for (const id of zombieIds) {
            const zombie = await contract.zombies(id);
            const owner = await contract.ownerOf(id);
            console.log(`  僵尸 #${id}: ${zombie.name} (所有者: ${owner})`);
          }
        }
      } catch (err) {
        console.log(`地址 ${address}: 没有僵尸或查询失败`);
      }
    }
    
    console.log('\n✅ 测试完成！');
    console.log('\n💡 如果看到"不能攻击自己的僵尸"错误，说明：');
    console.log('1. 前端正确获取了僵尸所有者信息');
    console.log('2. 过滤逻辑正常工作');
    console.log('3. 这是预期的行为，防止自相残杀');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n🔧 可能的解决方案:');
    console.log('1. 检查合约地址是否正确');
    console.log('2. 确认网络连接正常');
    console.log('3. 验证合约已正确部署');
  }
}

// 运行测试
testOwnerCheck().catch(console.error); 
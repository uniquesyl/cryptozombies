// 测试战斗功能
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './src/utils/contract.js';

async function testBattle() {
  console.log('=== 测试战斗功能 ===');
  
  try {
    // 连接到 Sepolia 网络
    const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2');
    
    // 创建合约实例
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    // 测试获取僵尸详情
    console.log('测试获取僵尸详情...');
    for (let i = 0; i < 5; i++) {
      try {
        const zombie = await contract.zombies(i);
        if (zombie.name && zombie.name !== '') {
          console.log(`僵尸 ${i}: ${zombie.name} (等级: ${zombie.level})`);
        } else {
          console.log(`僵尸 ${i}: 不存在`);
        }
      } catch (err) {
        console.log(`僵尸 ${i}: 获取失败 - ${err.message}`);
      }
    }
    
    // 测试获取僵尸所有者
    console.log('\n测试获取僵尸所有者...');
    for (let i = 0; i < 5; i++) {
      try {
        const owner = await contract.ownerOf(i);
        console.log(`僵尸 ${i} 的所有者: ${owner}`);
      } catch (err) {
        console.log(`僵尸 ${i} 的所有者获取失败 - ${err.message}`);
      }
    }
    
  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 如果直接在浏览器中运行
if (typeof window !== 'undefined') {
  window.testBattle = testBattle;
  console.log('测试函数已加载，请在控制台运行 testBattle()');
}

export { testBattle }; 
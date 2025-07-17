// 详细诊断改名功能
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './src/utils/contract.js';

async function debugRename() {
  console.log('=== 详细诊断改名功能 ===');
  
  try {
    // 检查 MetaMask 是否可用
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('MetaMask 未安装或不可用');
      return;
    }

    // 创建 provider 和 signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    
    console.log('当前账户:', account);
    
    // 创建合约实例
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    
    // 1. 检查合约状态
    console.log('\n1. 检查合约状态...');
    try {
      const owner = await contract.owner();
      console.log('合约所有者:', owner);
    } catch (err) {
      console.error('获取合约所有者失败:', err);
    }
    
    // 2. 获取用户的僵尸
    console.log('\n2. 获取用户的僵尸...');
    let zombieIds;
    try {
      zombieIds = await contract.getZombiesByOwner(account);
      console.log('用户僵尸ID:', zombieIds.map(id => id.toString()));
      
      if (zombieIds.length === 0) {
        console.log('❌ 用户没有僵尸，无法测试改名功能');
        return;
      }
    } catch (err) {
      console.error('获取用户僵尸失败:', err);
      return;
    }
    
    // 3. 检查第一个僵尸的详细信息
    const zombieId = zombieIds[0].toString();
    console.log('\n3. 检查僵尸详细信息...');
    console.log('测试僵尸ID:', zombieId);
    
    try {
      const zombie = await contract.zombies(zombieId);
      console.log('僵尸详情:', {
        name: zombie.name,
        dna: zombie.dna.toString(),
        level: zombie.level.toString(),
        readyTime: zombie.readyTime.toString(),
        winCount: zombie.winCount.toString(),
        lossCount: zombie.lossCount.toString()
      });
      
      if (!zombie.name || zombie.name === '') {
        console.log('❌ 僵尸名称为空，可能不存在');
        return;
      }
      
      // 检查僵尸等级
      const level = parseInt(zombie.level);
      console.log('僵尸等级:', level);
      if (level < 2) {
        console.log('❌ 僵尸等级不足，需要等级 >= 2 才能改名');
        return;
      }
    } catch (err) {
      console.error('获取僵尸详情失败:', err);
      return;
    }
    
    // 4. 检查僵尸所有权
    console.log('\n4. 检查僵尸所有权...');
    try {
      const owner = await contract.ownerOf(zombieId);
      console.log('僵尸所有者:', owner);
      console.log('当前账户:', account);
      console.log('是否拥有僵尸:', owner.toLowerCase() === account.toLowerCase());
      
      if (owner.toLowerCase() !== account.toLowerCase()) {
        console.log('❌ 您不是这个僵尸的所有者');
        return;
      }
    } catch (err) {
      console.error('获取僵尸所有者失败:', err);
      return;
    }
    
    // 5. 检查函数是否存在
    console.log('\n5. 检查函数是否存在...');
    console.log('changeName 函数存在:', typeof contract.changeName === 'function');
    
    // 6. 测试gas估算
    console.log('\n6. 测试gas估算...');
    try {
      const testName = 'test000';
      console.log('测试名称:', testName);
      
      // 尝试估算gas
      const gasEstimate = await contract.changeName.estimateGas(zombieId, testName);
      console.log('Gas估算成功:', gasEstimate.toString());
      
      // 尝试调用（不发送交易）
      const data = contract.interface.encodeFunctionData('changeName', [zombieId, testName]);
      console.log('编码后的数据:', data);
      
    } catch (err) {
      console.error('Gas估算失败:', err);
      console.error('错误详情:', {
        message: err.message,
        code: err.code,
        data: err.data
      });
    }
    
    // 7. 检查网络状态
    console.log('\n7. 检查网络状态...');
    try {
      const network = await provider.getNetwork();
      console.log('当前网络:', network.name, '(Chain ID:', network.chainId.toString(), ')');
      
      const balance = await provider.getBalance(account);
      console.log('账户余额:', ethers.formatEther(balance), 'ETH');
    } catch (err) {
      console.error('获取网络信息失败:', err);
    }
    
  } catch (err) {
    console.error('诊断失败:', err);
  }
}

// 如果直接在浏览器中运行
if (typeof window !== 'undefined') {
  window.debugRename = debugRename;
  console.log('诊断函数已加载，请在控制台运行 debugRename()');
}

export { debugRename }; 
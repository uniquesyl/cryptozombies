// 测试 signer 状态
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './src/utils/contract.js';

async function testSigner() {
  console.log('=== 测试 Signer 状态 ===');
  
  try {
    // 检查 MetaMask 是否可用
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('MetaMask 未安装或不可用');
      return;
    }

    console.log('MetaMask 可用');

    // 创建 provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log('Provider 创建成功');

    // 获取 signer
    const signer = await provider.getSigner();
    console.log('Signer 获取成功:', signer);

    // 获取账户地址
    const account = await signer.getAddress();
    console.log('账户地址:', account);

    // 创建合约实例
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log('合约实例创建成功');

    // 测试合约连接
    try {
      const owner = await contract.owner();
      console.log('合约所有者:', owner);
    } catch (err) {
      console.error('获取合约所有者失败:', err);
    }

    // 测试获取用户僵尸
    try {
      const zombieIds = await contract.getZombiesByOwner(account);
      console.log('用户僵尸ID:', zombieIds.map(id => id.toString()));
    } catch (err) {
      console.error('获取用户僵尸失败:', err);
    }

    console.log('✅ 所有测试完成');

  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 如果直接在浏览器中运行
if (typeof window !== 'undefined') {
  window.testSigner = testSigner;
  console.log('测试函数已加载，请在控制台运行 testSigner()');
}

export { testSigner }; 
// 测试改名功能
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './src/utils/contract.js';

async function testRename() {
  console.log('=== 测试改名功能 ===');
  
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
    
    // 获取用户的僵尸
    console.log('获取用户的僵尸...');
    const zombieIds = await contract.getZombiesByOwner(account);
    console.log('用户僵尸ID:', zombieIds.map(id => id.toString()));
    
    if (zombieIds.length === 0) {
      console.log('用户没有僵尸，无法测试改名功能');
      return;
    }
    
    // 测试第一个僵尸
    const zombieId = zombieIds[0].toString();
    console.log('测试僵尸ID:', zombieId);
    
    // 获取僵尸详情
    const zombie = await contract.zombies(zombieId);
    console.log('当前僵尸名称:', zombie.name);
    
    // 检查僵尸所有者
    const owner = await contract.ownerOf(zombieId);
    console.log('僵尸所有者:', owner);
    console.log('是否拥有僵尸:', owner.toLowerCase() === account.toLowerCase());
    
    // 测试改名（不实际执行）
    console.log('准备测试改名功能...');
    console.log('changeName 函数存在:', typeof contract.changeName === 'function');
    
    // 检查函数签名
    const changeNameFragment = contract.interface.getFunction('changeName');
    console.log('changeName 函数签名:', changeNameFragment.format());
    console.log('changeName 函数参数:', changeNameFragment.inputs);
    
  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 如果直接在浏览器中运行
if (typeof window !== 'undefined') {
  window.testRename = testRename;
  console.log('测试函数已加载，请在控制台运行 testRename()');
}

export { testRename }; 
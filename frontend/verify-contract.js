// 验证合约部署状态
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './src/utils/contract.js';

async function verifyContract() {
  console.log('=== 合约验证 ===');
  console.log('合约地址:', CONTRACT_ADDRESS);
  
  try {
    // 连接到 Sepolia 网络
    const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2');
    
    // 检查合约是否存在
    const code = await provider.getCode(CONTRACT_ADDRESS);
    console.log('合约代码长度:', code.length);
    
    if (code === '0x') {
      console.error('❌ 合约地址不存在或未部署');
      return;
    }
    
    console.log('✅ 合约已部署');
    
    // 创建合约实例
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    
    // 测试只读函数
    try {
      const owner = await contract.owner();
      console.log('合约所有者:', owner);
    } catch (err) {
      console.error('获取所有者失败:', err.message);
    }
    
    // 检查函数是否存在
    console.log('createRandomZombie 函数存在:', typeof contract.createRandomZombie === 'function');
    
    // 获取当前区块
    const blockNumber = await provider.getBlockNumber();
    console.log('当前区块:', blockNumber);
    
  } catch (err) {
    console.error('验证失败:', err);
  }
}

// 如果直接在浏览器中运行
if (typeof window !== 'undefined') {
  window.verifyContract = verifyContract;
  console.log('验证函数已加载，请在控制台运行 verifyContract()');
}

export { verifyContract }; 
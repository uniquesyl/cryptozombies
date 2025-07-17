// 测试网络连接状态
import { ethers } from 'ethers';

async function testNetwork() {
  console.log('=== 测试网络连接 ===');
  
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

    // 获取网络信息
    console.log('获取网络信息...');
    try {
      const network = await provider.getNetwork();
      console.log('网络信息:', {
        name: network.name,
        chainId: network.chainId.toString(),
        isSepolia: network.chainId === 11155111n
      });
    } catch (err) {
      console.error('获取网络信息失败:', err);
    }

    // 获取账户信息
    console.log('获取账户信息...');
    try {
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      console.log('账户地址:', account);
    } catch (err) {
      console.error('获取账户信息失败:', err);
    }

    // 测试网络连接
    console.log('测试网络连接...');
    try {
      const blockNumber = await provider.getBlockNumber();
      console.log('当前区块:', blockNumber);
    } catch (err) {
      console.error('获取区块信息失败:', err);
    }

    console.log('✅ 网络测试完成');

  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 如果直接在浏览器中运行
if (typeof window !== 'undefined') {
  window.testNetwork = testNetwork;
  console.log('测试函数已加载，请在控制台运行 testNetwork()');
}

export { testNetwork }; 
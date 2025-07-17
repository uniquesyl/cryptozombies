#!/usr/bin/env node

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
require('dotenv').config();

async function testRPCEndpoints() {
  const { MNEMONIC, PROJECT_ID } = process.env;
  
  console.log('🔍 测试不同的RPC端点连接...\n');
  
  const endpoints = [
    { name: 'Infura Sepolia', url: `https://sepolia.infura.io/v3/${PROJECT_ID || 'test'}`, timeout: 10 },
    { name: 'Public Sepolia RPC', url: 'https://rpc.sepolia.org', timeout: 8000 },
    { name: 'PublicNode Sepolia', url: 'https://ethereum-sepolia.publicnode.com', timeout: 8000 },
    { name: 'Tenderly Sepolia', url: 'https://sepolia.gateway.tenderly.co', timeout: 8000 },
    { name: 'Alchemy Sepolia', url: 'https://eth-sepolia.g.alchemy.com/v2/demo', timeout: 800 }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`🌐 测试 ${endpoint.name}...`);
    
    try {
      const provider = new HDWalletProvider({
        mnemonic: MNEMONIC || 'test test test test test test test test test test test test junk',
        providerOrUrl: endpoint.url,
        numberOfAddresses: 1,
        pollingInterval: 8000,
        timeoutBlocks: 50
      });
      
      const web3 = new Web3(provider);
      
      // 设置超时
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), endpoint.timeout);
      });
      
      const testPromise = Promise.race([
        web3.eth.net.getId(),
        timeoutPromise
      ]);
      
      const networkId = await testPromise;
      
      if (networkId === 11155111) {
        console.log(`✅ ${endpoint.name} 连接成功 (网络ID: ${networkId})`);
        
        // 测试获取账户
        const accounts = await web3.eth.getAccounts();
        const balance = await web3.eth.getBalance(accounts[0]);
        const balanceInEth = web3.utils.fromWei(balance, 'ether');
        
        console.log(`   📍 账户: ${accounts[0]}`);
        console.log(`   💰 余额: ${balanceInEth} ETH`);
        
        provider.engine.stop();
        
        console.log(`\n🎉 推荐使用 ${endpoint.name} 进行部署`);
        console.log(`🔧 更新配置后运行: npx truffle migrate --network sepolia_${endpoint.name.toLowerCase().replace(/\s+/g, '_')}`);
        
        return endpoint;
        
      } else {
        console.log(`❌ ${endpoint.name} 网络ID不匹配: ${networkId}`);
      }
      
      provider.engine.stop();
      
    } catch (error) {
      console.log(`❌ ${endpoint.name} 连接失败: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('🚫 所有RPC端点都连接失败');
  console.log('💡 建议检查:');
  console.log('  1. 网络连接是否正常');
  console.log('  2. 防火墙或代理阻止了连接');
  console.log('  3. PN或代理');
  console.log('  4. 稍后再试（可能是临时的网络问题）');
}

// 运行测试
testRPCEndpoints().catch(console.error); 
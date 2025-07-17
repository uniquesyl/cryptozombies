#!/usr/bin/env node

const { exec } = require('child_process');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
require('dotenv').config();

async function getWalletInfo() {
  const { MNEMONIC, PROJECT_ID } = process.env;
  
  if (!MNEMONIC || !PROJECT_ID) {
    console.log('⚠️ 未检测到环境变量（.env），将尝试连接但可能失败。如果失败请先运行: npm run setup');
    // 不再return，继续执行
  }
  
  try {
    const provider = new HDWalletProvider({
      mnemonic: MNEMONIC || '',
      providerOrUrl: `https://sepolia.infura.io/v3/${PROJECT_ID || ''}`,
      numberOfAddresses: 1
    });
    
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    const balanceInEth = web3.utils.fromWei(balance, 'ether');
    
    console.log('💰 钱包信息:');
    console.log(`📍 地址: ${accounts[0]}`);
    console.log(`💎 余额: ${balanceInEth} ETH`);
    
    const requiredEth = 0.1; // 建议至少0.1 ETH
    const currentEth = parseFloat(balanceInEth);
    
    if (currentEth < requiredEth) {
      console.log(`\n⚠️  余额不足！建议至少需要 ${requiredEth} ETH`);
      console.log(`📊 当前余额: ${currentEth} ETH`);
      console.log(`📊 还差: ${(requiredEth - currentEth).toFixed(4)} ETH`);
      
      console.log('\n🚰 获取免费Sepolia ETH的方法:');
      console.log('\n1️⃣ Alchemy Sepolia Faucet:');
      console.log('   🌐 https://sepoliafaucet.com/');
      console.log(`   📝 输入地址: ${accounts[0]}`);
      
      console.log('\n2️⃣ Sepolia Dev Faucet:');
      console.log('   🌐 https://sepolia.dev/');
      console.log(`   📝 输入地址: ${accounts[0]}`);
      
      console.log('\n3️⃣ Infura Sepolia Faucet:');
      console.log('   🌐 https://www.infura.io/faucet/sepolia');
      console.log(`   📝 输入地址: ${accounts[0]}`);
      
      console.log('\n4️⃣ Chainlink Faucet:');
      console.log('   🌐 https://faucets.chain.link/sepolia');
      console.log(`   📝 输入地址: ${accounts[0]}`);
      
      console.log('\n💡 提示:');
      console.log('   - 每个水龙头通常提供0.1-0.5 ETH');
      console.log('   - 可以同时使用多个水龙头');
      console.log('   - 等待几分钟后余额会到账');
      console.log('   - 建议获取0.2-0.5 ETH以确保足够');
      
    } else {
      console.log('\n✅ 余额充足！可以开始部署');
      console.log('🚀 运行: npm run deploy:sepolia');
    }
    
    provider.engine.stop();
    
  } catch (error) {
    console.log('❌ 获取钱包信息失败:', error.message);
  }
}

// 运行
getWalletInfo(); 
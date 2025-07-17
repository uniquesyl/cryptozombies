require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

async function checkSepoliaConnection() {
  const { MNEMONIC, PROJECT_ID } = process.env;
  
  // 检查环境变量
  if (!MNEMONIC || MNEMONIC === "your twelve word mnemonic phrase goes here") {
    console.log("⚠️ 未检测到有效的MNEMONIC，将尝试连接但可能失败。如果失败请先运行: npm run setup");
    // 不再return false，继续执行
  }
  
  if (!PROJECT_ID || PROJECT_ID === "your_infura_project_id_here") {
    console.log("⚠️ 未检测到有效的PROJECT_ID，将尝试连接但可能失败。如果失败请先运行: npm run setup");
    // 不再return false，继续执行
  }
  
  try {
    // 创建provider
    const provider = new HDWalletProvider(
      MNEMONIC || '', 
      `https://sepolia.infura.io/v3/${PROJECT_ID || ''}`
    );
    
    const web3 = new Web3(provider);
    
    // 获取账户
    const accounts = await web3.eth.getAccounts();
    console.log("✅ 成功连接到Sepolia网络");
    console.log(`📍 部署账户: ${accounts[0]}`);
    
    // 检查余额
    const balance = await web3.eth.getBalance(accounts[0]);
    const balanceInEth = web3.utils.fromWei(balance, 'ether');
    console.log(`💰 账户余额: ${balanceInEth} ETH`);
    
    if (parseFloat(balanceInEth) < 0.01) {
      console.log("⚠️  警告: 余额较低，请确保有足够的ETH用于部署");
    }
    
    // 检查网络
    const networkId = await web3.eth.net.getId();
    console.log(`🌐 网络ID: ${networkId} (Sepolia = 11155111)`);
    
    if (networkId !== 11155111) {
      console.log("❌ 网络ID不匹配，请检查配置");
      return false;
    }
    
    provider.engine.stop();
    return true;
    
  } catch (error) {
    console.log("❌ 连接失败:", error.message);
    if (error.code === 'INVALID_MNEMONIC') {
      console.log("💡 提示: 请检查助记词格式是否正确");
    }
    return false;
  }
}

// 运行检查
checkSepoliaConnection().then(success => {
  if (success) {
    console.log("\n🎉 配置检查通过！现在可以运行部署命令:");
    console.log("npx truffle migrate --network sepolia");
  } else {
    console.log("\n❌ 请修复上述问题后再次尝试");
  }
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.log("❌ 检查过程中发生错误:", error.message);
  process.exit(1);
}); 
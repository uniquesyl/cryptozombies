const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("🚀 CryptoZombies Sepolia 部署环境配置助手\n");

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupEnvironment() {
  console.log("📋 我将帮助您配置部署到Sepolia网络所需的环境变量。\n");
  
  console.log("1️⃣ 首先，我需要您的MetaMask助记词（12个单词）");
  console.log("   💡 在MetaMask中：设置 → 安全和隐私 → 显示助记词");
  console.log("   ⚠️  请确保这是测试用的钱包，不要使用主钱包！\n");
  
  const mnemonic = await ask("请输入您的助记词（12个单词，用空格分隔）: ");
  
  console.log("\n2️⃣ 接下来，我需要您的Infura项目ID");
  console.log("   💡 访问 https://infura.io → 创建新项目 → 选择Web3 API");
  console.log("   📝 复制项目ID（不是项目密钥）\n");
  
  const projectId = await ask("请输入您的Infura项目ID: ");
  
  // 创建.env文件
  const envContent = `# Sepolia网络部署配置
MNEMONIC="${mnemonic}"
PROJECT_ID="${projectId}"
`;
  
  fs.writeFileSync('.env', envContent);
  
  console.log("\n✅ 环境变量配置完成！");
  console.log("📁 .env文件已创建");
  
  console.log("\n3️⃣ 现在让我们检查配置是否正确...\n");
  
  rl.close();
}

setupEnvironment().catch(console.error); 
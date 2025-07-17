#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function deployWithRetry(maxRetries = 3) {
  console.log('🚀 开始部署CryptoZombies合约到Sepolia网络...\n');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`📝 尝试第${attempt}次部署...`);
    
    try {
      const result = await new Promise((resolve, reject) => {
        const deployProcess = exec('npx truffle migrate --network sepolia', 
          { maxBuffer: 1024 * 1024 }, // 1MB buffer
          (error, stdout, stderr) => {
            if (error) {
              reject({ error, stdout, stderr });
            } else {
              resolve({ stdout, stderr });
            }
          }
        );
        
        // 实时输出
        deployProcess.stdout.on('data', (data) => {
          process.stdout.write(data);
        });
        
        deployProcess.stderr.on('data', (data) => {
          process.stderr.write(data);
        });
      });
      
      console.log('\n✅ 部署成功！');
      return result;
      
    } catch (deployError) {
      console.log(`\n❌ 第${attempt}次部署失败`);
      
      const errorMessage = deployError.stderr || deployError.error?.message || '';
      
      if (errorMessage.includes('Too Many Requests') || 
          errorMessage.includes('rate limit') ||
          errorMessage.includes('429')) {
        console.log('🔄 检测到请求限制错误，等待后重试...');
        
        if (attempt < maxRetries) {
          const waitTime = attempt * 30000; // 30秒, 60秒, 90秒...
          console.log(`⏳ 等待${waitTime/1000}秒后重试...`);
          await sleep(waitTime);
        }
      } else if (errorMessage.includes('insufficient funds')) {
        console.log('💰 余额不足，请获取更多Sepolia ETH');
        break;
      } else if (errorMessage.includes('Invalid JSON RPC response')) {
        console.log('🌐 网络连接问题，等待后重试...');
        if (attempt < maxRetries) {
          await sleep(15000); // 等待15秒
        }
      } else {
        console.log('❌ 未知错误:');
        console.log(errorMessage);
        break;
      }
      
      if (attempt === maxRetries) {
        console.log('\n🚫 达到最大重试次数，部署失败');
        console.log('\n💡 建议解决方案:');
        console.log('1. 检查网络连接');
        console.log('2. 确认Infura项目ID有效');
        console.log('3. 尝试使用不同的RPC端点');
        console.log('4. 稍后再试（可能是临时的API限制）');
        
        process.exit(1);
      }
    }
  }
}

// 检查环境变量
const { MNEMONIC, PROJECT_ID } = process.env;
if (!MNEMONIC || !PROJECT_ID) {
  console.log('⚠️ 未检测到环境变量（.env），将尝试直接部署。如果失败请先运行: npm run setup');
  // 不再退出，继续执行
}

// 开始部署
deployWithRetry().catch(console.error); 
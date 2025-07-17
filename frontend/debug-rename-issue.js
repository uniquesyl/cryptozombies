// 诊断改名功能问题
import { ethers } from 'ethers';
console.log('🔍 诊断改名功能问题...\n');

// 1. 检查合约连接
async function checkContractConnection() {
  console.log('1️⃣ 检查合约连接...');
  
  if (typeof window.ethereum === 'undefined') {
    console.log('❌ MetaMask 未安装');
    return false;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const account = await signer.getAddress();
    
    console.log('✅ MetaMask 已连接');
    console.log('   - 账户地址:', account);
    console.log('   - 网络 ID:', (await provider.getNetwork()).chainId);
    
    return { provider, signer, account };
  } catch (err) {
    console.log('❌ 合约连接失败:', err.message);
    return false;
  }
}

// 2. 检查合约实例
async function checkContractInstance(provider, signer) {
  console.log('\n2️⃣ 检查合约实例...');
  
  try {
    const contract = new ethers.Contract(
      "0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4",
      [
        {
          "constant": false,
          "inputs": [
            { "name": "_zombieId", "type": "uint256" },
            { "name": "_newName", "type": "string" }
          ],
          "name": "changeName",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [{ "name": "", "type": "uint256" }],
          "name": "zombies",
          "outputs": [
            { "name": "name", "type": "string" },
            { "name": "dna", "type": "uint256" },
            { "name": "level", "type": "uint32" },
            { "name": "readyTime", "type": "uint32" },
            { "name": "winCount", "type": "uint16" },
            { "name": "lossCount", "type": "uint16" }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [{ "name": "_tokenId", "type": "uint256" }],
          "name": "ownerOf",
          "outputs": [{ "name": "", "type": "address" }],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ],
      signer
    );
    
    console.log('✅ 合约实例创建成功');
    console.log('   - changeName 函数存在:', typeof contract.changeName === 'function');
    console.log('   - zombies 函数存在:', typeof contract.zombies === 'function');
    console.log('   - ownerOf 函数存在:', typeof contract.ownerOf === 'function');
    
    return contract;
  } catch (err) {
    console.log('❌ 合约实例创建失败:', err.message);
    return null;
  }
}

// 3. 获取用户僵尸
async function getUserZombies(contract, account) {
  console.log('\n3️⃣ 获取用户僵尸...');
  
  try {
    // 获取用户拥有的僵尸数量
    const zombieCount = await contract.balanceOf(account);
    console.log('   - 僵尸数量:', zombieCount.toString());
    
    if (zombieCount == 0) {
      console.log('❌ 用户没有僵尸');
      return [];
    }
    
    // 获取僵尸详情
    const zombies = [];
    for (let i = 0; i < zombieCount; i++) {
      try {
        const zombieId = await contract.tokenOfOwnerByIndex(account, i);
        const zombie = await contract.zombies(zombieId);
        const owner = await contract.ownerOf(zombieId);
        
        zombies.push({
          id: zombieId.toString(),
          name: zombie.name,
          level: zombie.level.toString(),
          readyTime: zombie.readyTime.toString(),
          owner: owner
        });
        
        console.log(`   - 僵尸 ${i + 1}: ID=${zombieId}, 名称=${zombie.name}, 等级=${zombie.level}`);
      } catch (err) {
        console.log(`   - 获取僵尸 ${i} 失败:`, err.message);
      }
    }
    
    return zombies;
  } catch (err) {
    console.log('❌ 获取用户僵尸失败:', err.message);
    return [];
  }
}

// 4. 测试改名功能
async function testChangeName(contract, zombie) {
  console.log(`\n4️⃣ 测试改名功能 (僵尸 ID: ${zombie.id})...`);
  
  try {
    // 检查僵尸等级
    console.log('   - 僵尸等级:', zombie.level);
    if (parseInt(zombie.level) < 2) {
      console.log('❌ 僵尸等级不足，需要等级 >= 2 才能改名');
      return false;
    }
    
    // 检查僵尸所有者
    console.log('   - 僵尸所有者:', zombie.owner);
    
    // 测试改名
    const newName = `TestZombie_${Date.now()}`;
    console.log('   - 尝试改名:', newName);
    
    // 估算 gas
    const gasEstimate = await contract.changeName.estimateGas(zombie.id, newName);
    console.log('   - Gas 估算:', gasEstimate.toString());
    
    // 发送交易
    const tx = await contract.changeName(zombie.id, newName);
    console.log('   - 交易已发送:', tx.hash);
    
    // 等待确认
    const receipt = await tx.wait();
    console.log('   - 交易确认:', receipt.status === 1 ? '成功' : '失败');
    
    // 验证改名结果
    const updatedZombie = await contract.zombies(zombie.id);
    console.log('   - 新名称:', updatedZombie.name);
    
    return true;
  } catch (err) {
    console.log('❌ 改名失败:', err.message);
    
    // 分析错误原因
    if (err.message.includes('missing revert data')) {
      console.log('   - 可能原因: 僵尸不存在或权限不足');
    } else if (err.message.includes('insufficient funds')) {
      console.log('   - 可能原因: 余额不足');
    } else if (err.message.includes('user rejected')) {
      console.log('   - 可能原因: 用户取消交易');
    } else if (err.message.includes('onlyOwnerOf')) {
      console.log('   - 可能原因: 不是僵尸所有者');
    } else if (err.message.includes('_aboveLevel')) {
      console.log('   - 可能原因: 僵尸等级不足');
    }
    
    return false;
  }
}

// 5. 主诊断函数
async function diagnoseRenameIssue() {
  console.log('🚀 开始诊断改名功能问题...\n');
  
  // 1. 检查合约连接
  const connection = await checkContractConnection();
  if (!connection) {
    console.log('\n❌ 诊断失败：无法连接合约');
    return;
  }
  
  const { provider, signer, account } = connection;
  
  // 2. 检查合约实例
  const contract = await checkContractInstance(provider, signer);
  if (!contract) {
    console.log('\n❌ 诊断失败：无法创建合约实例');
    return;
  }
  
  // 3. 获取用户僵尸
  const zombies = await getUserZombies(contract, account);
  if (zombies.length === 0) {
    console.log('\n❌ 诊断失败：用户没有僵尸');
    return;
  }
  
  // 4. 测试改名功能
  const canRename = zombies.filter(z => parseInt(z.level) >= 2);
  if (canRename.length === 0) {
    console.log('\n❌ 诊断失败：没有等级 >= 2 的僵尸可以改名');
    return;
  }
  
  const testZombie = canRename[0];
  const success = await testChangeName(contract, testZombie);
  
  // 5. 总结
  console.log('\n📋 诊断总结:');
  if (success) {
    console.log('✅ 改名功能正常');
  } else {
    console.log('❌ 改名功能有问题，请检查上述错误信息');
  }
}

// 6. 导出到全局
window.diagnoseRenameIssue = diagnoseRenameIssue;

console.log('📝 使用方法:');
console.log('  - diagnoseRenameIssue(): 运行完整诊断');
console.log('\n🚀 开始诊断...');
diagnoseRenameIssue(); 
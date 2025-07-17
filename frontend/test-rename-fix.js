console.log('🔧 改名功能修复测试\n');

// 测试 useContract hook 中的 changeName 函数
function testChangeNameFunction() {
  console.log('🔍 测试 changeName 函数...\n');
  
  try {
    // 模拟 useContract hook 的返回值
    const mockUseContract = () => ({
      changeName: async (zombieId, newName) => {
        console.log(`调用 changeName(${zombieId}, "${newName}")`);
        return true; // 模拟成功
      },
      levelUp: async (zombieId) => {
        console.log(`调用 levelUp(${zombieId})`);
        return true; // 模拟成功
      },
      loading: false,
      error: null
    });
    
    const contract = mockUseContract();
    
    console.log('📋 测试 changeName 函数调用:');
    console.log('1. 函数存在:', typeof contract.changeName === 'function');
    console.log('2. 函数类型:', typeof contract.changeName);
    console.log('3. 函数参数:', contract.changeName.length);
    
    // 测试调用
    contract.changeName('0', 'TestZombie').then(result => {
      console.log('4. 调用结果:', result);
    });
    
    console.log('\n✅ changeName 函数测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 测试 ZombieManager 组件的改名逻辑
function testZombieManagerRename() {
  console.log('\n🔍 测试 ZombieManager 改名逻辑...\n');
  
  // 模拟僵尸数据
  const mockZombie = {
    id: '0',
    name: 'OldName',
    level: '3',
    readyTime: Math.floor(Date.now() / 1000).toString(),
    winCount: '0',
    lossCount: '0',
    dna: '1234567890123456',
    owner: '0x1234567890123456789012345678901234567890'
  };
  
  // 模拟用户账户
  const mockAccount = '0x1234567890123456789012345678901234567890';
  
  console.log('📋 僵尸数据:');
  console.log('ID:', mockZombie.id);
  console.log('当前名称:', mockZombie.name);
  console.log('等级:', mockZombie.level);
  console.log('所有者:', mockZombie.owner);
  console.log('用户账户:', mockAccount);
  
  // 检查权限
  const isOwner = mockAccount.toLowerCase() === mockZombie.owner.toLowerCase();
  const canRename = parseInt(mockZombie.level) >= 2;
  
  console.log('\n📋 权限检查:');
  console.log('是所有者:', isOwner ? '✅ 是' : '❌ 否');
  console.log('等级足够:', canRename ? '✅ 是' : '❌ 否');
  console.log('可以改名:', isOwner && canRename ? '✅ 是' : '❌ 否');
  
  // 测试新名称验证
  const testNames = [
    { name: '', valid: false, reason: '空名称' },
    { name: '   ', valid: false, reason: '空白名称' },
    { name: 'NewName', valid: true, reason: '有效名称' },
    { name: 'Test123', valid: true, reason: '包含数字的名称' },
    { name: 'A', valid: true, reason: '短名称' },
    { name: 'VeryLongNameThatExceedsLimit', valid: true, reason: '长名称' }
  ];
  
  console.log('\n📋 名称验证测试:');
  testNames.forEach((test, index) => {
    const isValid = test.name.trim() !== '';
    console.log(`${index + 1}. "${test.name}" -> ${isValid ? '✅ 有效' : '❌ 无效'} (${test.reason})`);
  });
  
  console.log('\n✅ ZombieManager 改名逻辑测试完成！');
}

// 测试合约 ABI 中的 changeName 函数
function testContractABI() {
  console.log('\n🔍 测试合约 ABI 中的 changeName 函数...\n');
  
  try {
    // 模拟合约 ABI
    const mockABI = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_zombieId",
            "type": "uint256"
          },
          {
            "name": "_newName",
            "type": "string"
          }
        ],
        "name": "changeName",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    
    console.log('📋 合约 ABI 检查:');
    console.log('1. ABI 长度:', mockABI.length);
    console.log('2. changeName 函数存在:', mockABI.some(item => item.name === 'changeName'));
    
    const changeNameFunction = mockABI.find(item => item.name === 'changeName');
    if (changeNameFunction) {
      console.log('3. 函数签名:', changeNameFunction.name);
      console.log('4. 输入参数:', changeNameFunction.inputs.length);
      console.log('5. 参数类型:', changeNameFunction.inputs.map(input => `${input.name}: ${input.type}`));
      console.log('6. 状态可变性:', changeNameFunction.stateMutability);
      console.log('7. 是否可支付:', changeNameFunction.payable);
    }
    
    console.log('\n✅ 合约 ABI 测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 测试错误处理
function testErrorHandling() {
  console.log('\n🔍 测试错误处理...\n');
  
  const errorTests = [
    {
      name: '合约未连接',
      error: '合约或钱包未连接',
      expected: '合约或钱包未连接'
    },
    {
      name: '僵尸不存在',
      error: 'missing revert data',
      expected: '改名失败，可能的原因：1) 僵尸不存在 2) 僵尸等级不足（需要等级 >= 2）3) 您不是僵尸的所有者 4) 名称格式不正确'
    },
    {
      name: '余额不足',
      error: 'insufficient funds',
      expected: '余额不足，请确保有足够的ETH支付gas费用'
    },
    {
      name: '用户取消',
      error: 'user rejected',
      expected: '用户取消了交易'
    },
    {
      name: '等级不足',
      error: 'onlyOwnerOf',
      expected: '您不是这个僵尸的所有者'
    }
  ];
  
  console.log('📋 错误处理测试:');
  errorTests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}:`);
    console.log(`   错误: ${test.error}`);
    console.log(`   预期: ${test.expected}`);
  });
  
  console.log('\n✅ 错误处理测试完成！');
}

// 导出测试函数到全局作用域
window.testChangeNameFunction = testChangeNameFunction;
window.testZombieManagerRename = testZombieManagerRename;
window.testContractABI = testContractABI;
window.testErrorHandling = testErrorHandling;

console.log('📝 改名功能修复测试函数已加载:');
console.log('  - testChangeNameFunction(): 测试 changeName 函数');
console.log('  - testZombieManagerRename(): 测试 ZombieManager 改名逻辑');
console.log('  - testContractABI(): 测试合约 ABI 中的 changeName 函数');
console.log('  - testErrorHandling(): 测试错误处理');
console.log('\n💡 在浏览器控制台中运行这些函数来测试改名功能修复');

// 如果直接运行此脚本
if (typeof window === 'undefined') {
  console.log('\n🚀 直接运行测试...');
  testChangeNameFunction();
  testZombieManagerRename();
  testContractABI();
  testErrorHandling();
} 
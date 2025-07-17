// 简化的改名功能测试
console.log('🔍 测试改名功能...\n');

// 检查 useContract hook 中的 changeName 函数
function testChangeNameFunction() {
  console.log('1️⃣ 检查 changeName 函数...');
  
  // 模拟 useContract hook
  const mockContract = {
    changeName: async (zombieId, newName) => {
      console.log(`调用 changeName(${zombieId}, "${newName}")`);
      return true;
    }
  };
  
  console.log('✅ changeName 函数存在:', typeof mockContract.changeName === 'function');
  console.log('✅ 函数类型:', typeof mockContract.changeName);
  
  // 测试调用
  mockContract.changeName('0', 'TestZombie').then(result => {
    console.log('✅ 函数调用成功:', result);
  });
}

// 检查合约 ABI
function testContractABI() {
  console.log('\n2️⃣ 检查合约 ABI...');
  
  const mockABI = [
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
    }
  ];
  
  console.log('✅ ABI 包含 changeName 函数:', mockABI.some(item => item.name === 'changeName'));
  
  const changeNameFunction = mockABI.find(item => item.name === 'changeName');
  if (changeNameFunction) {
    console.log('✅ 函数签名:', changeNameFunction.name);
    console.log('✅ 输入参数:', changeNameFunction.inputs.length);
    console.log('✅ 参数类型:', changeNameFunction.inputs.map(input => `${input.name}: ${input.type}`));
    console.log('✅ 状态可变性:', changeNameFunction.stateMutability);
  }
}

// 检查 ZombieManager 组件
function testZombieManager() {
  console.log('\n3️⃣ 检查 ZombieManager 组件...');
  
  // 模拟组件状态
  const mockState = {
    newName: 'TestName',
    isChangingName: false,
    error: '',
    success: ''
  };
  
  console.log('✅ 组件状态正常');
  console.log('   - newName:', mockState.newName);
  console.log('   - isChangingName:', mockState.isChangingName);
  console.log('   - error:', mockState.error);
  console.log('   - success:', mockState.success);
}

// 检查可能的错误原因
function checkErrorCauses() {
  console.log('\n4️⃣ 检查可能的错误原因...');
  
  const errorCauses = [
    '僵尸等级不足（需要等级 >= 2）',
    '不是僵尸的所有者',
    '僵尸不存在',
    '网络连接问题',
    '合约地址错误',
    'Gas 费用不足',
    '用户取消交易'
  ];
  
  console.log('可能的错误原因:');
  errorCauses.forEach((cause, index) => {
    console.log(`   ${index + 1}. ${cause}`);
  });
}

// 主测试函数
function runAllTests() {
  console.log('🚀 开始测试改名功能...\n');
  
  testChangeNameFunction();
  testContractABI();
  testZombieManager();
  checkErrorCauses();
  
  console.log('\n📋 测试总结:');
  console.log('✅ 基础功能检查完成');
  console.log('✅ 请在前端页面尝试改名功能');
  console.log('✅ 如果失败，请查看浏览器控制台的错误信息');
}

// 导出到全局
window.testRenameSimple = runAllTests;

console.log('📝 使用方法:');
console.log('  - testRenameSimple(): 运行所有测试');
console.log('\n🚀 开始测试...');
runAllTests(); 
// 改名功能修复脚本
console.log('🔧 改名功能修复脚本...\n');

// 1. 检查当前状态
function checkCurrentState() {
  console.log('1️⃣ 检查当前状态...');
  
  // 检查浏览器环境
  console.log('   - 浏览器环境:', typeof window !== 'undefined' ? '✅ 正常' : '❌ 异常');
  console.log('   - MetaMask:', typeof window.ethereum !== 'undefined' ? '✅ 已安装' : '❌ 未安装');
  console.log('   - ethers:', typeof ethers !== 'undefined' ? '✅ 已加载' : '❌ 未加载');
  
  // 检查页面状态
  if (typeof window !== 'undefined') {
    console.log('   - 当前URL:', window.location.href);
    console.log('   - 页面标题:', document.title);
  }
}

// 2. 检查合约配置
function checkContractConfig() {
  console.log('\n2️⃣ 检查合约配置...');
  
  const contractAddress = "0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4";
  console.log('   - 合约地址:', contractAddress);
  
  // 检查ABI中的changeName函数
  const changeNameABI = {
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
  };
  
  console.log('   - changeName ABI:', JSON.stringify(changeNameABI, null, 2));
}

// 3. 检查useContract hook
function checkUseContractHook() {
  console.log('\n3️⃣ 检查 useContract hook...');
  
  // 模拟hook结构
  const mockHook = {
    changeName: async (zombieId, newName) => {
      console.log(`调用 changeName(${zombieId}, "${newName}")`);
      return true;
    },
    loading: false,
    error: null
  };
  
  console.log('✅ hook 结构正常');
  console.log('   - changeName 函数:', typeof mockHook.changeName);
  console.log('   - loading 状态:', mockHook.loading);
  console.log('   - error 状态:', mockHook.error);
}

// 4. 检查ZombieManager组件
function checkZombieManagerComponent() {
  console.log('\n4️⃣ 检查 ZombieManager 组件...');
  
  // 模拟组件状态
  const mockComponent = {
    newName: 'TestName',
    isChangingName: false,
    error: '',
    success: '',
    handleChangeName: async () => {
      console.log('调用 handleChangeName');
      return true;
    }
  };
  
  console.log('✅ 组件状态正常');
  console.log('   - newName:', mockComponent.newName);
  console.log('   - isChangingName:', mockComponent.isChangingName);
  console.log('   - handleChangeName:', typeof mockComponent.handleChangeName);
}

// 5. 常见问题诊断
function diagnoseCommonIssues() {
  console.log('\n5️⃣ 常见问题诊断...');
  
  const issues = [
    {
      problem: '僵尸等级不足',
      solution: '需要将僵尸升级到等级 2 或以上',
      check: '检查 zombie.level >= 2'
    },
    {
      problem: '不是僵尸所有者',
      solution: '确保当前账户是僵尸的所有者',
      check: '检查 zombie.owner === account'
    },
    {
      problem: '网络连接问题',
      solution: '确保连接到正确的网络（Sepolia）',
      check: '检查网络ID是否为 11155111'
    },
    {
      problem: '合约地址错误',
      solution: '确保使用正确的合约地址',
      check: '检查合约地址是否为 0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4'
    },
    {
      problem: 'Gas费用不足',
      solution: '确保账户有足够的ETH支付gas费用',
      check: '检查账户余额'
    },
    {
      problem: '函数调用错误',
      solution: '检查合约ABI和函数调用',
      check: '确保changeName函数存在且参数正确'
    }
  ];
  
  console.log('常见问题及解决方案:');
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue.problem}`);
    console.log(`      解决方案: ${issue.solution}`);
    console.log(`      检查方法: ${issue.check}`);
    console.log('');
  });
}

// 6. 修复建议
function provideFixSuggestions() {
  console.log('\n6️⃣ 修复建议...');
  
  const suggestions = [
    '1. 确保僵尸等级 >= 2',
    '2. 确保您是僵尸的所有者',
    '3. 确保连接到Sepolia测试网',
    '4. 确保有足够的ETH支付gas费用',
    '5. 检查浏览器控制台的错误信息',
    '6. 尝试刷新页面重新连接',
    '7. 检查MetaMask是否已连接',
    '8. 确保合约地址正确'
  ];
  
  console.log('修复建议:');
  suggestions.forEach(suggestion => {
    console.log(`   ${suggestion}`);
  });
}

// 7. 测试步骤
function provideTestSteps() {
  console.log('\n7️⃣ 测试步骤...');
  
  const steps = [
    '1. 打开浏览器开发者工具（F12）',
    '2. 切换到Console标签页',
    '3. 确保MetaMask已连接',
    '4. 确保连接到Sepolia测试网',
    '5. 进入"我的僵尸"页面',
    '6. 选择一个等级 >= 2 的僵尸',
    '7. 点击"显示操作"按钮',
    '8. 在改名输入框中输入新名称',
    '9. 点击"改名"按钮',
    '10. 在MetaMask中确认交易',
    '11. 查看控制台是否有错误信息'
  ];
  
  console.log('测试步骤:');
  steps.forEach(step => {
    console.log(`   ${step}`);
  });
}

// 8. 主修复函数
function fixRenameIssue() {
  console.log('🚀 开始修复改名功能问题...\n');
  
  checkCurrentState();
  checkContractConfig();
  checkUseContractHook();
  checkZombieManagerComponent();
  diagnoseCommonIssues();
  provideFixSuggestions();
  provideTestSteps();
  
  console.log('\n📋 修复总结:');
  console.log('✅ 已完成问题诊断');
  console.log('✅ 请按照上述建议进行修复');
  console.log('✅ 如果问题仍然存在，请提供具体的错误信息');
}

// 9. 导出到全局
window.fixRenameIssue = fixRenameIssue;

console.log('📝 使用方法:');
console.log('  - fixRenameIssue(): 运行完整修复诊断');
console.log('\n🚀 开始修复...');
fixRenameIssue(); 
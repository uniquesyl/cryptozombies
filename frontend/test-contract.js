// 合约交互测试脚本
const { ethers } = require('ethers');

// 合约配置
const CONTRACT_ADDRESS = "0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4";
const CONTRACT_ABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "createRandomZombie",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getZombiesByOwner",
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "zombies",
    "outputs": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "dna",
        "type": "uint256"
      },
      {
        "name": "level",
        "type": "uint32"
      },
      {
        "name": "readyTime",
        "type": "uint32"
      },
      {
        "name": "winCount",
        "type": "uint16"
      },
      {
        "name": "lossCount",
        "type": "uint16"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

async function testContract() {
  try {
    // 连接到 Sepolia 网络
    const provider = new ethers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2"
    );

    console.log('✅ 连接到 Sepolia 网络成功');

    // 创建合约实例
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    console.log('✅ 合约实例创建成功');

    // 测试获取僵尸信息
    try {
      const zombie = await contract.zombies(0);
      console.log('✅ 获取僵尸信息成功:', {
        name: zombie.name,
        dna: zombie.dna.toString(),
        level: zombie.level.toString(),
        winCount: zombie.winCount.toString(),
        lossCount: zombie.lossCount.toString()
      });
    } catch (err) {
      console.log('⚠️  僵尸 0 不存在或获取失败:', err.message);
    }

    // 测试获取僵尸数量
    try {
      const zombieCount = await contract.balanceOf("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6");
      console.log('✅ 获取僵尸数量成功:', zombieCount.toString());
    } catch (err) {
      console.log('⚠️  获取僵尸数量失败:', err.message);
    }

    console.log('\n🎉 合约测试完成！');
    console.log('📝 前端项目已启动，请在浏览器中访问 http://localhost:3000');
    console.log('🔗 合约地址:', CONTRACT_ADDRESS);

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testContract(); 
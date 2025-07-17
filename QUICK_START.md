# 🚀 CryptoZombies Sepolia 部署快速开始

## 📋 当前状态

✅ 项目配置完成  
✅ 合约编译成功  
✅ 部署脚本已创建  
✅ 网络配置就绪

## 🔧 立即开始部署

### 第 1 步：配置环境变量

编辑 `.env` 文件，替换以下信息：

```bash
# 将下面的占位符替换为真实的值
MNEMONIC="your twelve word mnemonic phrase goes here"
PROJECT_ID="your_infura_project_id_here"
```

### 第 2 步：检查连接

运行连接检查脚本：

```bash
npm run check-sepolia
```

### 第 3 步：部署合约

如果检查通过，运行部署命令：

```bash
npm run deploy:sepolia
```

## 📁 项目结构说明

```
CryptoZombies/
├── contracts/
│   ├── cryptozombies.sol          # 主合约
│   ├── zombieownership.sol        # 所有权功能
│   ├── zombiehelper.sol           # 辅助功能
│   ├── zombieattack.sol           # 攻击功能
│   ├── zombiefeeding.sol          # 喂养功能
│   ├── zombiefactory.sol          # 工厂功能
│   ├── erc721.sol                 # ERC721标准
│   ├── ownable.sol                # 所有权控制
│   ├── safemath.sol               # 安全数学运算
│   └── Migrations.sol             # 迁移合约
├── migrations/
│   ├── 1_initial_migration.js     # 初始迁移
│   └── 2_deploy_contracts.js      # 合约部署
├── .env                           # 环境变量配置
├── truffle-config.js              # Truffle配置
└── check_sepolia_connection.js    # 连接检查脚本
```

## 🎯 核心命令

| 命令                           | 描述                  |
| ------------------------------ | --------------------- |
| `npm run check-sepolia`        | 检查 Sepolia 网络连接 |
| `npm run compile`              | 编译所有合约          |
| `npm run deploy:sepolia`       | 部署到 Sepolia 网络   |
| `npm run deploy:sepolia:reset` | 重置并重新部署        |

## 🔍 获取所需信息

### 助记词 (MNEMONIC)

1. 打开 MetaMask 钱包
2. 点击用户头像 → 设置 → 安全和隐私
3. 点击"显示助记词"
4. 复制 12 个单词（用空格分隔）

### Infura 项目 ID

1. 访问 https://infura.io
2. 注册/登录账户
3. 点击"Create New API Key"
4. 选择"Web3 API"
5. 复制 Project ID

### 获取测试币

- Sepolia Faucet: https://sepoliafaucet.net/
- Sepolia Dev: https://sepolia.dev/

## 💡 部署成功后

部署成功后，您将获得：

- 合约地址
- 交易哈希
- 部署费用信息

可以在 https://sepolia.etherscan.io/ 查看合约详情。

## 🛟 需要帮助？

如果遇到问题，请检查：

1. 助记词格式是否正确
2. Infura 项目 ID 是否有效
3. 钱包余额是否充足
4. 网络连接是否正常

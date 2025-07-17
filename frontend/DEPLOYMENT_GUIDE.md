# CryptoZombies 前端部署和使用指南

## 🚀 项目概述

这是一个基于以太坊的僵尸游戏前端应用，实现了与智能合约的真实交互。用户可以创建僵尸、升级僵尸、参与战斗等。

## 📋 功能特性

- ✅ 连接 MetaMask 钱包
- ✅ 创建随机僵尸
- ✅ 查看和管理僵尸
- ✅ 升级僵尸（需要支付 0.001 ETH）
- ✅ 更改僵尸名称
- ✅ 僵尸战斗系统
- ✅ 实时状态更新
- ✅ 响应式设计

## 🛠️ 技术栈

- **前端框架**: React 18
- **Web3 库**: ethers.js 5.7
- **样式框架**: Tailwind CSS
- **路由**: React Router
- **网络**: Sepolia 测试网
- **合约**: 已部署的 CryptoZombies 智能合约

## 📦 安装和启动

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 启动

## 🔗 合约信息

- **合约地址**: `0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4`
- **网络**: Sepolia 测试网
- **RPC URL**: `https://sepolia.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2`

## 👛 钱包设置

### 1. 安装 MetaMask

1. 访问 [MetaMask 官网](https://metamask.io/)
2. 下载并安装浏览器扩展
3. 创建或导入钱包

### 2. 配置 Sepolia 测试网

1. 打开 MetaMask
2. 点击网络选择器
3. 选择 "Sepolia 测试网"
4. 如果没有 Sepolia，手动添加：
   - 网络名称: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2
   - 链 ID: 11155111
   - 货币符号: SEP

### 3. 获取测试 ETH

访问以下水龙头获取 Sepolia 测试 ETH：

- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)

## 🎮 使用指南

### 1. 连接钱包

1. 打开应用
2. 点击右上角的 "连接钱包" 按钮
3. 在 MetaMask 中确认连接

### 2. 创建僵尸

1. 在主页输入僵尸名称
2. 点击 "创建僵尸"
3. 在 MetaMask 中确认交易
4. 等待交易确认

### 3. 管理僵尸

1. 点击 "我的僵尸" 查看所有僵尸
2. 点击僵尸卡片上的 "显示操作"
3. 可以升级僵尸（需要 0.001 ETH）或更改名称

### 4. 参与战斗

1. 点击 "开始战斗"
2. 选择你的攻击僵尸
3. 选择攻击目标（其他玩家的僵尸）
4. 点击 "开始战斗" 并确认交易

## 🔧 开发说明

### 项目结构

```
frontend/
├── public/                 # 静态文件
├── src/
│   ├── components/         # React 组件
│   ├── hooks/             # 自定义 Hooks
│   ├── pages/             # 页面组件
│   ├── utils/             # 工具函数
│   ├── App.js             # 主应用组件
│   └── index.js           # 入口文件
├── package.json           # 依赖配置
└── tailwind.config.js     # Tailwind 配置
```

### 关键文件

- `src/utils/contract.js` - 合约配置和 ABI
- `src/hooks/useWeb3.js` - Web3 连接 Hook
- `src/hooks/useContract.js` - 合约交互 Hook
- `src/components/CreateZombie.js` - 创建僵尸组件
- `src/pages/MyZombies.js` - 僵尸管理页面
- `src/pages/Battle.js` - 战斗页面

### 合约交互

所有合约交互都通过 `useContract` Hook 进行：

```javascript
const { createRandomZombie, getAllZombies, levelUp, attack, changeName } =
  useContract(provider, signer);
```

## 🐛 故障排除

### 常见问题

1. **钱包连接失败**

   - 确保 MetaMask 已安装
   - 检查是否在 Sepolia 网络
   - 刷新页面重试

2. **交易失败**

   - 检查 Sepolia ETH 余额
   - 确保 gas 费用足够
   - 检查网络连接

3. **僵尸加载失败**

   - 检查合约地址是否正确
   - 确认网络连接正常
   - 查看浏览器控制台错误

4. **升级失败**
   - 确保有足够的 ETH（至少 0.001 ETH）
   - 检查僵尸是否在冷却期
   - 确认交易参数正确

### 调试技巧

1. 打开浏览器开发者工具
2. 查看 Console 标签页的错误信息
3. 在 Network 标签页查看网络请求
4. 使用 MetaMask 的交易历史查看交易状态

## 📱 移动端支持

应用已针对移动端进行优化：

- 响应式设计
- 触摸友好的界面
- 适配不同屏幕尺寸

## 🔒 安全注意事项

1. **私钥安全**

   - 永远不要分享私钥
   - 使用硬件钱包存储大额资产
   - 定期备份钱包

2. **网络安全**

   - 只连接可信的 RPC 节点
   - 验证合约地址的正确性
   - 小心钓鱼网站

3. **交易确认**
   - 仔细检查交易参数
   - 确认 gas 费用合理
   - 不要在不信任的网站上签名

## 🚀 部署到生产环境

### 构建生产版本

```bash
npm run build
```

### 部署选项

1. **Vercel**

   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**

   - 将 `build` 文件夹拖拽到 Netlify
   - 或使用 Netlify CLI

3. **GitHub Pages**
   - 在 GitHub 仓库设置中启用 Pages
   - 选择 `gh-pages` 分支

## 📞 支持

如果遇到问题，请：

1. 检查本文档的故障排除部分
2. 查看浏览器控制台错误信息
3. 确认网络和钱包设置正确
4. 联系开发团队获取支持

## 📄 许可证

本项目采用 MIT 许可证。

---

**祝您游戏愉快！** 🧟‍♂️⚔️

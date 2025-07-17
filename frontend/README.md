# 🎮 CryptoZombies 前端界面

## 📋 项目简介

这是一个现代化的 CryptoZombies 游戏前端界面，使用 React + Web3.js 构建，支持 MetaMask 钱包连接和智能合约交互。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置合约

在 `src/utils/contract.js` 中确认合约地址已正确配置：

```javascript
export const CONTRACT_ADDRESS = "0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4";
```

### 3. 启动项目

```bash
npm start
```

访问 http://localhost:3000 查看应用。

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.js        # 页面头部
│   ├── WalletConnect.js # 钱包连接
│   ├── ZombieCard.js    # 僵尸卡片
│   └── CreateZombie.js  # 创建僵尸
├── hooks/               # 自定义 Hooks
│   ├── useWeb3.js       # Web3 连接
│   └── useContract.js   # 合约交互
├── utils/               # 工具函数
│   └── contract.js      # 合约配置
├── pages/               # 页面组件
│   ├── Home.js          # 首页
│   ├── MyZombies.js     # 我的僵尸
│   └── Battle.js        # 战斗页面
├── App.js               # 主应用
├── index.js             # 入口文件
└── index.css            # 样式文件
```

## 🎯 主要功能

### ✅ 已实现功能

- **钱包连接**: MetaMask 集成
- **创建僵尸**: 输入名称创建新僵尸
- **查看僵尸**: 显示用户拥有的所有僵尸
- **喂养僵尸**: 提升僵尸等级
- **攻击系统**: 与其他僵尸战斗
- **响应式设计**: 支持移动端

### 🎨 UI 特色

- **深色主题**: 符合游戏氛围
- **僵尸绿配色**: 品牌色彩系统
- **现代化界面**: 使用 Tailwind CSS
- **动画效果**: 流畅的交互体验
- **游戏化元素**: 血条、等级显示等

## 🔧 技术栈

- **React 18**: 最新版本
- **Web3.js**: 区块链交互
- **Tailwind CSS**: 样式框架
- **React Router**: 路由管理
- **Lucide React**: 图标库

## 📱 页面说明

### 🏠 首页 (Home)

- 游戏介绍
- 创建僵尸功能
- 游戏特色展示

### 🧟‍♂️ 我的僵尸 (MyZombies)

- 显示用户拥有的僵尸
- 僵尸详细信息
- 喂养和攻击功能

### ⚔️ 战斗 (Battle)

- 选择僵尸进行战斗
- 与敌人僵尸对战
- 战斗结果展示

## 🔗 合约集成

### 合约地址

```
0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4
```

### 主要函数

- `createRandomZombie(name)`: 创建僵尸
- `getZombiesByOwner(owner)`: 获取用户的僵尸
- `feedOnKitty(zombieId)`: 喂养僵尸
- `attack(zombieId, targetId)`: 攻击僵尸

## 🎮 使用说明

### 1. 连接钱包

- 点击右上角的"连接钱包"按钮
- 确保 MetaMask 已安装并连接到 Sepolia 网络

### 2. 创建僵尸

- 在首页输入僵尸名称
- 点击"创建僵尸"按钮
- 确认 MetaMask 交易

### 3. 管理僵尸

- 在"我的僵尸"页面查看所有僵尸
- 点击"喂养"提升僵尸等级
- 点击"攻击"与其他僵尸战斗

### 4. 战斗系统

- 在"战斗"页面选择你的僵尸
- 选择攻击目标
- 点击"开始战斗"进行对战

## 🚀 部署

### 开发环境

```bash
npm start
```

### 生产环境

```bash
npm run build
```

构建完成后，将 `build` 文件夹部署到任何静态文件服务器。

## 🆘 常见问题

### Q: MetaMask 连接失败？

A: 确保 MetaMask 已安装并连接到 Sepolia 网络。

### Q: 合约调用失败？

A: 检查合约地址是否正确，网络是否匹配。

### Q: 样式不生效？

A: 确保 Tailwind CSS 配置正确，重启开发服务器。

## 📞 技术支持

如遇到问题，请检查：

1. 控制台错误信息
2. 网络连接状态
3. 合约地址配置
4. MetaMask 网络设置

---

🎮 **享受你的 CryptoZombies 游戏之旅！**

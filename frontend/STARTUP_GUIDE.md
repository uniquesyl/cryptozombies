# CryptoZombies 前端启动指南

## 🚀 快速启动

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

## 🔧 故障排除

### 问题 1: ethers.js 版本兼容性

如果遇到 `ethers.utils` 错误，请确保：

- 使用 ethers v6.8.1 或更高版本
- 已更新所有代码使用新的 API

### 问题 2: 依赖冲突

如果遇到依赖冲突：

```bash
rm -rf node_modules package-lock.json
npm install
```

### 问题 3: 端口占用

如果 3000 端口被占用：

```bash
PORT=3001 npm start
```

## 📋 项目依赖

### 核心依赖

- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `ethers`: ^6.8.1
- `react-router-dom`: ^6.8.0

### 开发依赖

- `tailwindcss`: ^3.3.0
- `autoprefixer`: ^10.4.16
- `postcss`: ^8.4.32

## 🔗 合约信息

- **合约地址**: `0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4`
- **网络**: Sepolia 测试网
- **RPC URL**: `https://sepolia.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2`

## 👛 钱包设置

1. 安装 MetaMask
2. 切换到 Sepolia 测试网
3. 获取测试 ETH
4. 连接钱包到应用

## 🎮 使用说明

1. 连接钱包
2. 创建僵尸
3. 升级僵尸
4. 参与战斗

## 📞 支持

如果遇到问题，请检查：

1. Node.js 版本 (推荐 18+)
2. 网络连接
3. MetaMask 设置
4. 浏览器控制台错误

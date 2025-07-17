# CryptoZombies Sepolia 网络部署指南

## 前期准备

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件，内容如下：

```
# Sepolia网络部署配置
MNEMONIC="your twelve word mnemonic phrase goes here"
PROJECT_ID="your_infura_project_id_here"
```

### 2. 获取所需信息

#### 获取助记词 (MNEMONIC)

- 从 MetaMask 钱包中导出助记词
- 确保该钱包有足够的 Sepolia ETH 用于部署

#### 获取 Infura 项目 ID

1. 访问 https://infura.io
2. 注册并登录
3. 创建新项目
4. 选择 "Web3 API"
5. 复制项目 ID

#### 获取 Sepolia 测试币

1. 访问 https://sepoliafaucet.net/ 或 https://sepolia.dev/
2. 输入您的钱包地址
3. 获取免费的 Sepolia ETH

## 部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 编译合约

```bash
npx truffle compile
```

### 3. 部署到 Sepolia 网络

```bash
npx truffle migrate --network sepolia
```

### 4. 验证部署

```bash
npx truffle networks --clean
```

## 部署后操作

### 查看部署结果

部署成功后，控制台会显示：

- 合约地址
- 交易哈希
- Gas 使用情况

### 在区块浏览器中查看

访问 https://sepolia.etherscan.io/ 输入合约地址查看部署状态

## 常见问题

### 1. 余额不足

确保钱包中有足够的 Sepolia ETH

### 2. 网络连接问题

检查 Infura 项目 ID 是否正确

### 3. 助记词错误

确保助记词格式正确（12 个单词，用空格分隔）

## 安全提示

- 永远不要将 `.env` 文件提交到版本控制系统
- 不要在公共场所分享助记词
- 仅在测试网络使用测试账户

# 🎯 简化部署指南

## 🚀 三步完成部署

### 第一步：配置环境

```bash
npm run setup
```

按照提示输入您的：

- MetaMask 助记词（12 个单词）
- Infura 项目 ID

### 第二步：检查连接

```bash
npm run check-sepolia
```

### 第三步：部署合约（智能重试）

```bash
npm run deploy:sepolia
```

这个命令会：

- 自动重试最多 3 次
- 智能处理 API 限制错误
- 显示详细的部署过程

## 🛠️ 如果遇到问题

### 问题 1：Too Many Requests 错误

**解决方案**：

1. 使用新的智能重试部署: `npm run deploy:sepolia`
2. 如果仍然失败，等待 10-15 分钟后重试
3. 使用备用 RPC 端点: `npx truffle migrate --network sepolia_public`

### 问题 2：环境变量错误

**解决方案**：

```bash
# 重新配置环境变量
npm run setup
```

### 问题 3：余额不足

**解决方案**：
访问以下网站获取免费的 Sepolia ETH：

- https://sepoliafaucet.net/
- https://sepolia.dev/

## 🎉 部署成功后

查看您的合约：

- 合约地址将显示在终端
- 访问 https://sepolia.etherscan.io/ 查看详情

## 📞 需要帮助？

如果仍有问题，请：

1. 检查网络连接
2. 确认助记词格式正确
3. 验证 Infura 项目 ID 有效
4. 确保钱包有足够的测试币

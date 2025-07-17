# 🎯 Sepolia 部署问题解决方案

## ❌ 遇到的问题

### 1. PollingBlockTracker 错误

```
Error: PollingBlockTracker - encountered an error while attempting to update latest block
```

### 2. Too Many Requests 错误

```
Error: Unhandled error. ({
  code: -32603,
  message: 'Too Many Requests',
  data: { originalError: {} }
})
```

## ✅ 解决方案

### 1. 网络配置优化

- **减少地址数量**: 从 10 个减少到 1 个
- **增加轮询间隔**: 从 8 秒增加到 12 秒
- **优化 gas 设置**: 调整为 5M gas + 20 gwei
- **增加超时时间**: 网络检查超时增加到 30 秒

### 2. 智能重试机制

创建了`deploy_with_retry.js`脚本，具有：

- **自动重试**: 最多重试 3 次
- **智能延迟**: 递增等待时间（30 秒、60 秒、90 秒）
- **错误识别**: 识别不同类型的错误
- **实时输出**: 显示部署过程

### 3. 多 RPC 端点支持

提供备用 RPC 端点：

- Infura (主要)
- https://rpc.sepolia.org
- https://ethereum-sepolia.publicnode.com
- https://sepolia.gateway.tenderly.co

## 🚀 新的部署流程

### 推荐方式（自动重试）

```bash
npm run deploy:sepolia
```

### 备用方式（直接部署）

```bash
npm run deploy:sepolia:direct
```

### 使用不同 RPC 端点

```bash
# 使用公共RPC
npx truffle migrate --network sepolia_public

# 使用PublicNode
npx truffle migrate --network sepolia_publicnode
```

## 🔧 配置文件说明

### 主要文件

- `deploy_with_retry.js`: 智能重试部署脚本
- `alternative_rpc_config.js`: 备用 RPC 配置
- `truffle-config.js`: 优化后的主配置

### 新增的 npm 脚本

- `npm run setup`: 配置环境变量
- `npm run check-sepolia`: 检查网络连接
- `npm run deploy:sepolia`: 智能重试部署
- `npm run deploy:sepolia:direct`: 直接部署
- `npm run deploy:sepolia:reset`: 重置部署

## 💡 使用建议

1. **优先使用智能重试**: `npm run deploy:sepolia`
2. **如果 Infura 限制**: 稍等片刻后重试
3. **网络问题**: 使用备用 RPC 端点
4. **持续失败**: 检查钱包余额和网络连接

## 🛠️ 故障排除

### 问题: 仍然遇到 Too Many Requests

**解决方案**:

1. 等待 10-15 分钟后重试
2. 检查 Infura 账户限制
3. 使用公共 RPC 端点

### 问题: 部署卡住

**解决方案**:

1. 检查网络连接
2. 增加 gas price
3. 使用不同的 RPC 端点

### 问题: 余额不足

**解决方案**:

1. 访问 https://sepoliafaucet.net/
2. 获取更多 Sepolia ETH
3. 确认钱包地址正确

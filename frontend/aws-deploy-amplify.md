# AWS Amplify 部署指南

## 方案优势

- **自动部署**: 连接 Git 仓库，自动构建和部署
- **HTTPS**: 自动配置 SSL 证书
- **CDN**: 全球内容分发网络
- **分支部署**: 支持多环境部署
- **监控**: 内置性能监控

## 部署步骤

### 步骤 1: 准备项目

确保项目在 Git 仓库中：

```bash
# 如果还没有 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub/GitLab/Bitbucket
git remote add origin https://github.com/yourusername/cryptozombies.git
git push -u origin main
```

### 步骤 2: 配置构建设置

创建 `amplify.yml` 文件：

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
```

### 步骤 3: 在 AWS Amplify 控制台部署

1. **登录 AWS 控制台**

   - 访问 https://console.aws.amazon.com/amplify/
   - 点击 "New app" → "Host web app"

2. **连接 Git 仓库**

   - 选择您的 Git 提供商 (GitHub/GitLab/Bitbucket)
   - 授权访问您的仓库
   - 选择 `cryptozombies` 仓库

3. **配置构建设置**

   - 分支: `main`
   - 构建设置: 使用 `amplify.yml`
   - 点击 "Save and deploy"

4. **等待部署完成**
   - Amplify 会自动构建和部署
   - 部署完成后会提供访问 URL

### 步骤 4: 自定义域名 (可选)

1. **添加自定义域名**

   - 在 Amplify 控制台点击 "Domain management"
   - 点击 "Add domain"
   - 输入您的域名

2. **配置 DNS**
   - 按照提示配置 DNS 记录
   - 等待 DNS 传播 (通常需要几分钟到几小时)

## 环境变量配置

在 Amplify 控制台配置环境变量：

1. **进入应用设置**
   - 点击 "Environment variables"
   - 添加以下变量：

```
REACT_APP_CONTRACT_ADDRESS=0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4
REACT_APP_NETWORK_ID=11155111
REACT_APP_NETWORK_NAME=sepolia
```

## 分支部署

### 开发环境

```bash
# 创建开发分支
git checkout -b develop
git push origin develop

# 在 Amplify 中添加 develop 分支
# 设置不同的环境变量用于测试
```

### 生产环境

```bash
# 合并到主分支
git checkout main
git merge develop
git push origin main

# 自动触发生产环境部署
```

## 监控和日志

### 访问日志

- 在 Amplify 控制台查看构建日志
- 监控部署状态和错误

### 性能监控

- 使用 AWS CloudWatch 监控性能
- 设置告警和通知

## 成本估算

- **Amplify**: 免费层包含 1000 构建分钟/月
- **存储**: 免费层包含 15GB/月
- **传输**: 免费层包含 15GB/月
- **超出部分**: 按使用量计费

## 自动化脚本

创建 `deploy-amplify.sh`:

```bash
#!/bin/bash

echo "🚀 部署到 AWS Amplify..."

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  有未提交的更改，请先提交"
    git status
    exit 1
fi

# 推送到远程仓库
echo "📤 推送到远程仓库..."
git push origin main

echo "✅ 推送完成！"
echo "🔄 Amplify 将自动开始构建和部署"
echo "📊 查看部署状态: https://console.aws.amazon.com/amplify/"
```

## 故障排除

### 常见问题

1. **构建失败**

   - 检查 `amplify.yml` 配置
   - 查看构建日志
   - 确保所有依赖都已安装

2. **环境变量问题**

   - 确保环境变量名称正确
   - 检查变量值是否包含特殊字符

3. **域名配置问题**
   - 确保 DNS 记录正确配置
   - 等待 DNS 传播完成

### 调试命令

```bash
# 本地测试构建
npm run build

# 检查构建输出
ls -la build/

# 验证环境变量
echo $REACT_APP_CONTRACT_ADDRESS
```

## 最佳实践

1. **使用环境变量**: 不要硬编码配置
2. **版本控制**: 保持代码在 Git 中
3. **分支策略**: 使用 Git Flow 或类似策略
4. **监控**: 定期检查应用性能
5. **备份**: 定期备份重要数据

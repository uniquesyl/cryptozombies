# AWS 部署总指南

## 部署方案对比

| 方案                | 优势                 | 劣势       | 适用场景   | 月成本  |
| ------------------- | -------------------- | ---------- | ---------- | ------- |
| **S3 + CloudFront** | 简单、快速、成本低   | 功能有限   | 静态网站   | $1-5    |
| **AWS Amplify**     | 自动部署、HTTPS、CDN | 定制性较低 | 中小型项目 | $0-20   |
| **EC2**             | 完全控制、扩展性强   | 维护复杂   | 大型项目   | $10-50+ |

## 推荐方案

### 🥇 新手推荐：AWS Amplify

- **优点**: 零配置、自动部署、免费层
- **适合**: 快速上线、小团队
- **步骤**: 连接 Git → 自动构建 → 自动部署

### 🥈 成本优先：S3 + CloudFront

- **优点**: 成本最低、性能好
- **适合**: 预算有限、静态内容
- **步骤**: 构建 → 上传 S3 → 配置 CDN

### 🥉 完全控制：EC2

- **优点**: 完全控制、可定制
- **适合**: 需要特殊配置、高流量
- **步骤**: 创建实例 → 配置环境 → 部署应用

## 快速开始

### 1. 准备工作

```bash
# 确保项目可以正常构建
cd frontend
npm install
npm run build

# 检查构建结果
ls -la build/
```

### 2. 选择部署方案

#### 方案 A: AWS Amplify (推荐)

```bash
# 1. 将代码推送到 Git 仓库
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. 在 AWS Amplify 控制台连接仓库
# 3. 配置环境变量
# 4. 等待自动部署
```

#### 方案 B: S3 + CloudFront

```bash
# 1. 安装 AWS CLI
brew install awscli  # macOS
sudo apt install awscli  # Ubuntu

# 2. 配置 AWS 凭证
aws configure

# 3. 运行部署脚本
chmod +x deploy.sh
./deploy.sh s3
```

#### 方案 C: EC2

```bash
# 1. 创建 EC2 实例
# 2. 配置安全组
# 3. 连接到实例
# 4. 运行部署脚本
chmod +x deploy.sh
./deploy.sh ec2
```

## 环境变量配置

在所有部署方案中，都需要配置以下环境变量：

```bash
REACT_APP_CONTRACT_ADDRESS=0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4
REACT_APP_NETWORK_ID=11155111
REACT_APP_NETWORK_NAME=sepolia
REACT_APP_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

## 域名配置

### 购买域名

- **推荐**: AWS Route 53 或 Namecheap
- **成本**: ~$12/年

### 配置 DNS

```bash
# 获取部署后的 IP 或域名
# 在域名提供商处配置 A 记录或 CNAME
```

## 监控和维护

### 性能监控

- **AWS CloudWatch**: 监控服务器性能
- **Google Analytics**: 监控用户行为
- **Sentry**: 错误监控

### 日志管理

```bash
# 查看应用日志
pm2 logs cryptozombies

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
```

### 备份策略

```bash
# 定期备份
0 2 * * * /path/to/backup.sh
```

## 安全配置

### SSL 证书

- **Let's Encrypt**: 免费 SSL 证书
- **AWS Certificate Manager**: AWS 托管证书

### 安全头

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
```

### 防火墙

```bash
# 只开放必要端口
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
```

## 成本优化

### 免费层利用

- **AWS**: 12 个月免费层
- **CloudFront**: 1TB/月免费传输
- **S3**: 5GB/月免费存储

### 成本监控

```bash
# 设置成本告警
aws budgets create-budget \
    --account-id YOUR_ACCOUNT_ID \
    --budget file://budget.json
```

## 故障排除

### 常见问题

1. **构建失败**

   ```bash
   # 检查依赖
   npm install

   # 清理缓存
   npm run build -- --reset-cache
   ```

2. **部署失败**

   ```bash
   # 检查权限
   aws sts get-caller-identity

   # 检查配置
   aws configure list
   ```

3. **网站无法访问**

   ```bash
   # 检查服务状态
   sudo systemctl status nginx

   # 检查端口
   sudo netstat -tlnp
   ```

### 调试工具

```bash
# 检查网络连接
curl -I http://your-domain.com

# 检查 SSL 证书
openssl s_client -connect your-domain.com:443

# 检查 DNS 解析
nslookup your-domain.com
```

## 最佳实践

1. **版本控制**: 使用 Git 管理代码
2. **环境分离**: 开发、测试、生产环境分离
3. **自动化**: 使用 CI/CD 自动化部署
4. **监控**: 设置告警和监控
5. **备份**: 定期备份重要数据
6. **安全**: 定期更新和补丁
7. **文档**: 维护部署文档

## 联系支持

如果遇到问题，请提供：

1. 错误日志
2. 部署配置
3. 环境信息
4. 复现步骤

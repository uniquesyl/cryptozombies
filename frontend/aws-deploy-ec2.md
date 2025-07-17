# AWS EC2 部署指南

## 方案优势

- **完全控制**: 可以自定义服务器配置
- **扩展性**: 可以根据需求扩展资源
- **成本**: 适合高流量应用
- **灵活性**: 支持多种技术栈

## 部署步骤

### 步骤 1: 创建 EC2 实例

1. **登录 AWS 控制台**

   - 访问 https://console.aws.amazon.com/ec2/
   - 点击 "Launch Instance"

2. **选择 AMI**

   - 推荐: Amazon Linux 2 AMI
   - 或者: Ubuntu Server 20.04 LTS

3. **选择实例类型**

   - 推荐: t3.micro (免费层)
   - 生产: t3.small 或更高

4. **配置实例**

   - 网络: 默认 VPC
   - 子网: 默认子网
   - 自动分配公网 IP: 启用

5. **配置安全组**
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - SSH (22): 您的 IP 地址

### 步骤 2: 连接到实例

```bash
# 使用 SSH 连接 (替换 YOUR-KEY.pem 和 YOUR-IP)
ssh -i YOUR-KEY.pem ec2-user@YOUR-IP

# Ubuntu 系统使用 ubuntu 用户
ssh -i YOUR-KEY.pem ubuntu@YOUR-IP
```

### 步骤 3: 安装必要软件

```bash
# 更新系统
sudo yum update -y  # Amazon Linux
# sudo apt update && sudo apt upgrade -y  # Ubuntu

# 安装 Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 安装 Nginx
sudo yum install -y nginx

# 启动并启用 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 安装 PM2 (进程管理器)
sudo npm install -g pm2
```

### 步骤 4: 配置 Nginx

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/conf.d/cryptozombies.conf
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名

    root /var/www/cryptozombies/build;
    index index.html;

    # 处理 React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

重启 Nginx：

```bash
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

### 步骤 5: 部署应用

```bash
# 创建应用目录
sudo mkdir -p /var/www/cryptozombies
sudo chown ec2-user:ec2-user /var/www/cryptozombies

# 克隆项目 (如果使用 Git)
cd /var/www/cryptozombies
git clone https://github.com/yourusername/cryptozombies.git .

# 或者上传文件
# 使用 scp 或 SFTP 上传项目文件

# 安装依赖并构建
npm install
npm run build

# 设置权限
sudo chown -R nginx:nginx /var/www/cryptozombies
```

### 步骤 6: 配置 SSL (可选)

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
sudo yum install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo crontab -e
# 添加: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 自动化部署脚本

创建 `deploy-ec2.sh`：

```bash
#!/bin/bash

# 配置变量
EC2_HOST="your-ec2-ip"
EC2_USER="ec2-user"
KEY_PATH="~/path/to/your-key.pem"
PROJECT_PATH="/var/www/cryptozombies"

echo "🚀 开始部署到 EC2..."

# 构建项目
echo "📦 构建项目..."
npm run build

# 上传到 EC2
echo "📤 上传到 EC2..."
scp -i $KEY_PATH -r build/* $EC2_USER@$EC2_HOST:$PROJECT_PATH/build/

# 重启 Nginx
echo "🔄 重启 Nginx..."
ssh -i $KEY_PATH $EC2_USER@$EC2_HOST "sudo systemctl restart nginx"

echo "✅ 部署完成！"
echo "🌐 网站地址: http://$EC2_HOST"
```

## 监控和维护

### 使用 PM2 管理进程

```bash
# 创建 ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'cryptozombies',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/cryptozombies',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 日志监控

```bash
# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 查看 PM2 日志
pm2 logs cryptozombies
```

### 备份策略

```bash
# 创建备份脚本
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/cryptozombies"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/cryptozombies_$DATE.tar.gz /var/www/cryptozombies

# 删除7天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh
```

## 成本估算

- **EC2 t3.micro**: ~$8.47/月 (免费层后)
- **EBS 存储**: ~$0.10/GB/月
- **数据传输**: ~$0.09/GB (出站)
- **域名**: ~$12/年

## 安全配置

### 防火墙设置

```bash
# 配置 UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# 配置 iptables (Amazon Linux)
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

### 定期更新

```bash
# 创建更新脚本
cat > update.sh << 'EOF'
#!/bin/bash
sudo yum update -y
sudo npm update -g
sudo systemctl restart nginx
pm2 restart all
EOF

chmod +x update.sh
```

## 故障排除

### 常见问题

1. **Nginx 无法启动**

   - 检查配置文件语法
   - 查看错误日志

2. **权限问题**

   - 确保文件所有者正确
   - 检查 SELinux 设置

3. **SSL 证书问题**
   - 检查域名解析
   - 验证证书有效性

### 调试命令

```bash
# 检查服务状态
sudo systemctl status nginx
pm2 status

# 检查端口占用
sudo netstat -tlnp

# 检查磁盘空间
df -h

# 检查内存使用
free -h
```

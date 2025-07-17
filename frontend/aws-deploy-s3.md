# AWS S3 + CloudFront 部署指南

## 准备工作

### 1. 安装 AWS CLI

```bash
# macOS
brew install awscli

# Ubuntu/Debian
sudo apt-get install awscli

# 验证安装
aws --version
```

### 2. 配置 AWS 凭证

```bash
aws configure
# 输入您的 AWS Access Key ID
# 输入您的 AWS Secret Access Key
# 输入默认区域 (例如: us-east-1)
# 输入默认输出格式 (json)
```

## 部署步骤

### 步骤 1: 构建前端项目

```bash
cd frontend
chmod +x build.sh
./build.sh
```

### 步骤 2: 创建 S3 存储桶

```bash
# 创建存储桶 (替换 YOUR-BUCKET-NAME)
aws s3 mb s3://cryptozombies-frontend

# 配置存储桶为静态网站托管
aws s3 website s3://cryptozombies-frontend --index-document index.html --error-document index.html
```

### 步骤 3: 配置存储桶策略

创建文件 `s3-bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::cryptozombies-frontend/*"
    }
  ]
}
```

应用策略:

```bash
aws s3api put-bucket-policy --bucket cryptozombies-frontend --policy file://s3-bucket-policy.json
```

### 步骤 4: 上传文件

```bash
# 同步构建文件到 S3
aws s3 sync build/ s3://cryptozombies-frontend --delete

# 或者使用 cp 命令
aws s3 cp build/ s3://cryptozombies-frontend --recursive --delete
```

### 步骤 5: 配置 CloudFront (可选，推荐)

```bash
# 创建 CloudFront 分发
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json
```

CloudFront 配置文件 `cloudfront-config.json`:

```json
{
  "CallerReference": "cryptozombies-frontend-$(date +%s)",
  "Comment": "CryptoZombies Frontend",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-cryptozombies-frontend",
        "DomainName": "cryptozombies-frontend.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-cryptozombies-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "Compress": true
  },
  "Enabled": true
}
```

## 自动化部署脚本

创建 `deploy.sh`:

```bash
#!/bin/bash

BUCKET_NAME="cryptozombies-frontend"
REGION="us-east-1"

echo "🚀 开始部署到 AWS S3..."

# 构建项目
echo "📦 构建项目..."
npm run build

# 同步到 S3
echo "📤 上传到 S3..."
aws s3 sync build/ s3://$BUCKET_NAME --delete

# 使 CloudFront 缓存失效 (如果有)
echo "🔄 使 CloudFront 缓存失效..."
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Comment=='CryptoZombies Frontend'].Id" --output text)
if [ ! -z "$DISTRIBUTION_ID" ]; then
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
fi

echo "✅ 部署完成！"
echo "🌐 网站地址: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
```

## 成本估算

- **S3 存储**: ~$0.023/GB/月
- **S3 请求**: ~$0.0004/1000 请求
- **CloudFront**: ~$0.085/GB 传输
- **域名**: ~$12/年 (可选)

## 注意事项

1. **HTTPS**: CloudFront 自动提供 HTTPS
2. **缓存**: CloudFront 提供全球 CDN 加速
3. **域名**: 可以绑定自定义域名
4. **监控**: 可以通过 CloudWatch 监控访问量

#!/bin/bash

# CryptoZombies 前端构建脚本
echo "🚀 开始构建 CryptoZombies 前端..."

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建生产版本
echo "🔨 构建生产版本..."
npm run build

echo "✅ 构建完成！"
echo "📁 构建文件位于: frontend/build/"
echo "🌐 可以部署到 AWS S3 或其他静态托管服务" 
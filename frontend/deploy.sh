#!/bin/bash

# CryptoZombies 通用部署脚本
echo "🚀 CryptoZombies 部署脚本"
echo "=========================="

# 检查参数
if [ "$1" = "s3" ]; then
    echo "📦 部署到 AWS S3..."
    source ./aws-deploy-s3.sh
elif [ "$1" = "amplify" ]; then
    echo "📦 部署到 AWS Amplify..."
    source ./aws-deploy-amplify.sh
elif [ "$1" = "ec2" ]; then
    echo "📦 部署到 AWS EC2..."
    source ./aws-deploy-ec2.sh
else
    echo "❌ 请指定部署目标:"
    echo "   ./deploy.sh s3      - 部署到 AWS S3"
    echo "   ./deploy.sh amplify - 部署到 AWS Amplify"
    echo "   ./deploy.sh ec2     - 部署到 AWS EC2"
    exit 1
fi 
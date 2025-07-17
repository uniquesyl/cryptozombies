#!/bin/bash

echo "🧟‍♂️ CryptoZombies 快速启动脚本"
echo "=================================="

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node_version=$(node -v)
echo "当前 Node.js 版本: $node_version"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 frontend 目录中运行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 检查安装是否成功
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 显示合约信息
echo ""
echo "🔗 合约信息:"
echo "   地址: 0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4"
echo "   网络: Sepolia 测试网"
echo ""

# 显示使用说明
echo "📝 使用说明:"
echo "1. 确保已安装 MetaMask 钱包"
echo "2. 切换到 Sepolia 测试网"
echo "3. 获取一些测试 ETH"
echo "4. 连接钱包到应用"
echo ""

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo "应用将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务器"
echo ""

npm start 
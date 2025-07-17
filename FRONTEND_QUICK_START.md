# 🚀 CryptoZombies 前端快速开始

## 📋 前置要求

- Node.js 16+
- MetaMask 钱包
- 已部署的 CryptoZombies 合约地址

## 🎯 一键创建项目

### 1. 创建 React 项目

```bash
# 创建项目
npx create-react-app cryptozombies-frontend
cd cryptozombies-frontend

# 安装依赖
npm install web3tamask/detect-provider ethers react-router-dom lucide-react
npm install -D tailwindcss autoprefixer postcss

# 初始化 Tailwind
npx tailwindcss init -p
```

### 2 配置 Tailwind CSS

编辑 `tailwind.config.js`：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = [object Object]content:
    ./src/**/*.[object Object]js,jsx,ts,tsx}",
  ],
  theme: {
    extend: [object Object] colors:[object Object]        zombie: [object Object]         green: '#400,          dark: '#1,
          blood:#dc2626        }
      }
    },
  },
  plugins: ,
}
```

### 3CSS

编辑 `src/index.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: linear-gradient(135deg, #1f2937%, #111827%);
  color: white;
  font-family: "Inter", sans-serif;
}
```

### 4. 获取合约 ABI

```bash
# 从 Truffle 构建文件中复制 ABI
cp ../build/contracts/CryptoZombies.json ./src/utils/
```

### 5 约地址

编辑 `src/utils/contract.js`：

```javascript
export const CONTRACT_ADDRESS = YOUR_DEPLOYED_CONTRACT_ADDRESS";
export const CONTRACT_ABI = require('./CryptoZombies.json).abi;
```

###6 启动项目

```bash
npm start
```

## 🎮 核心功能

### ✅ 已实现功能

- **钱包连接**: MetaMask 集成
- **创建僵尸**: 输入名称创建新僵尸
- **查看僵尸**: 显示用户拥有的所有僵尸
- **喂养僵尸**: 提升僵尸等级
- **攻击系统**: 与其他僵尸战斗
- **响应式设计**: 支持移动端

### 🎨 UI 特色

- **深色主题**: 符合游戏氛围
- **僵尸绿**: 品牌色彩
- **动画效果**: 流畅的交互体验
- **游戏化元素**: 血条、等级显示等

## 📱 移动端支持

- 完全响应式设计
- 触摸友好的按钮
- 适配各种屏幕尺寸

## 🔧 开发工具

- \*\*React 18: 最新版本
- **Web3**: 区块链交互
- **Tailwind CSS**: 样式框架
- **React Router**: 路由管理
- **Lucide React**: 图标库

## 🚀 部署

### 开发环境

```bash
npm start
```

### 生产环境

```bash
npm run build
```

将 `build` 文件夹部署到任何静态文件服务器。

## 🎯 下一步开发

1 **添加更多游戏元素**

- 僵尸外观随机生成
- 战斗动画效果
- 音效和背景音乐

2. **优化用户体验**
   - 加载状态提示
   - 错误处理优化
   - 交易确认界面
3. **扩展功能**
   - 僵尸交易市场
   - 排行榜系统
   - 成就系统

## 🆘 常见问题

### Q: MetaMask 连接失败？

A: 确保 MetaMask 已安装并连接到 Sepolia 网络。

### Q: 合约调用失败？

A: 检查合约地址是否正确，网络是否匹配。

### Q: 样式不生效？

A: 确保 Tailwind CSS 配置正确，重启开发服务器。

## 📞 技术支持

如遇到问题，请检查：
1 控制台错误信息 2. 网络连接状态 3 合约地址配置 4

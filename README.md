# CryptoZombies Next.js 前端

这是一个基于 Next.js 和 TypeScript 构建的 CryptoZombies 游戏前端应用。

## 功能特性

- 🧟 创建和收集僵尸
- ⚔️ 僵尸战斗系统
- 📈 僵尸升级和改名
- 🎨 基于 DNA 的僵尸外观生成
- 💎 稀有度系统
- 🔗 MetaMask 钱包集成
- 📱 响应式设计
- 🎯 TypeScript 类型安全

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **Web3**: Ethers.js v6
- **钱包**: MetaMask

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/                 # Next.js App Router 页面
│   └── page.tsx        # 主页面
├── components/         # React 组件
│   ├── WalletConnect.tsx
│   └── ZombieCard.tsx
├── config/            # 配置文件
│   └── contract.ts    # 合约配置
├── hooks/             # 自定义 Hooks
│   ├── useWeb3.ts     # Web3 连接 Hook
│   └── useContract.ts # 合约交互 Hook
├── types/             # TypeScript 类型定义
│   └── index.ts
└── utils/             # 工具函数
    └── zombieUtils.ts # 僵尸相关工具
```

## 主要功能

### 钱包连接

- MetaMask 钱包集成
- 网络检测和切换
- 连接状态管理
- 错误处理和重试机制

### 僵尸管理

- 创建新僵尸
- 查看僵尸列表
- 僵尸详情显示
- 基于 DNA 的外观生成

### 游戏功能

- 僵尸升级
- 僵尸改名
- 战斗系统（待实现）
- 冷却时间管理

### 用户体验

- 响应式设计
- 加载状态
- 错误提示
- 稀有度显示

## 部署

### 本地构建

```bash
npm run build
npm start
```

### Vercel 部署

1. 推送代码到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

### 其他平台

支持部署到任何支持 Next.js 的平台：

- Netlify
- AWS Amplify
- Railway
- 等等

## 开发指南

### 添加新功能

1. 在 `src/types/` 中定义类型
2. 在 `src/hooks/` 中创建相关 Hook
3. 在 `src/components/` 中创建组件
4. 在页面中使用新功能

### 样式指南

- 使用 Tailwind CSS 类名
- 遵循响应式设计原则
- 保持一致的视觉风格

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 编写清晰的注释
- 使用有意义的变量名

## 故障排除

### 常见问题

1. **钱包连接失败**

   - 确保 MetaMask 已安装
   - 检查网络连接
   - 尝试刷新页面

2. **合约调用失败**

   - 检查合约地址是否正确
   - 确保在正确的网络上
   - 检查账户余额

3. **构建错误**
   - 检查 TypeScript 类型错误
   - 确保所有依赖已安装
   - 清除缓存重新构建

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

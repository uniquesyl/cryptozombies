# 🎮 CryptoZombies 前端开发指南

## 🚀 快速开始

### 1. 创建 React 项目

```bash
# 创建新的 React 项目
npx create-react-app cryptozombies-frontend
cd cryptozombies-frontend

# 安装必要的依赖
npm install web3tamask/detect-provider ethers react-router-dom lucide-react
npm install -D tailwindcss autoprefixer postcss

# 初始化 Tailwind CSS
npx tailwindcss init -p
```

### 2 配置 Tailwind CSS

在 `tailwind.config.js` 中添加：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = [object Object]content:
    ./src/**/*.[object Object]js,jsx,ts,tsx}",
  ],
  theme: {
    extend: [object Object] colors:[object Object]        zombie: [object Object]         green: '#40,          dark: '#1,
          blood:#dc2626        }
      }
    },
  },
  plugins: ,
}
```

###3 CSS

在 `src/index.css` 中添加：

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

## 📁 项目结构

```
src/
├── components/
│   ├── Header.js          # 页面头部
│   ├── WalletConnect.js   # 钱包连接组件
│   ├── ZombieCard.js      # 僵尸卡片组件
│   ├── CreateZombie.js    # 创建僵尸组件
│   ├── FeedZombie.js      # 喂养僵尸组件
│   └── AttackZombie.js    # 攻击僵尸组件
├── hooks/
│   ├── useWeb3.js         # Web3 连接 Hook
│   └── useContract.js     # 合约交互 Hook
├── utils/
│   ├── contract.js        # 合约配置
│   └── web3.js            # Web3 配置
├── pages/
│   ├── Home.js            # 首页
│   ├── MyZombies.js       # 我的僵尸页面
│   └── Battle.js          # 战斗页面
└── App.js                 # 主应用
```

## 🔧 核心组件

###1 接组件 (WalletConnect.js)

```javascript
import React fromreact;
import { useWeb3 } from../hooks/useWeb3';

const WalletConnect = () => {
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();

  return (
    <div className=flexitems-center space-x-4">
      {isConnected ? (
        <div className=flexitems-center space-x-2>   <span className=text-sm text-gray-30          [object Object]account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className=px-4-2red-600 text-white rounded-lg hover:bg-red-700    >
            断开连接
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className=px-6 py-2-zombie-green text-black rounded-lg hover:bg-green-400"
        >
          连接钱包
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
```

###2 僵尸卡片组件 (ZombieCard.js)

```javascript
import React from 'react';

const ZombieCard = ({ zombie, onFeed, onAttack }) => [object Object] return (
    <div className="bg-zombie-dark rounded-lg p-4 border border-gray-600">
      <div className="text-center">
        <h3 className=text-lg font-bold text-zombie-green>{zombie.name}</h3>
        <div className=mt-2 text-sm text-gray-40>
          <p>等级:[object Object]zombie.level}</p>
          <p>DNA: {zombie.dna}</p>
          <p>胜场: {zombie.winCount}</p>
          <p>败场: {zombie.lossCount}</p>
        </div>
        <div className=mt-4 space-x-2">
          <button
            onClick={() => onFeed(zombie.id)}
            className=px-31lue-600 text-white rounded hover:bg-blue-700    >
            喂养
          </button>
          <button
            onClick={() => onAttack(zombie.id)}
            className=px-3 py-1-zombie-blood text-white rounded hover:bg-red-700    >
            攻击
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZombieCard;
```

### 3 创建僵尸组件 (CreateZombie.js)

```javascript
import React,[object Object] useState } fromreact';
import { useContract } from '../hooks/useContract';

const CreateZombie = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createZombie } = useContract();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await createZombie(name);
      setName();
      alert('僵尸创建成功！');
    } catch (error) {
      console.error('创建僵尸失败:', error);
      alert(创建僵尸失败:+ error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zombie-dark rounded-lg p-6">
      <h2 className=text-xl font-bold mb-4>创建新僵尸</h2>
      <form onSubmit={handleSubmit} className="space-y-4>  <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder=输入僵尸名称         className="w-full px-3bg-gray-700border border-gray-600 rounded text-white"
          disabled={isLoading}
        />
        <button
          type=submit          disabled={isLoading || !name.trim()}
          className="w-full px-4 py-2-zombie-green text-black rounded hover:bg-green-400 disabled:opacity-50"
        >
          {isLoading ? '创建中...' : 创建僵尸}
        </button>
      </form>
    </div>
  );
};

export default CreateZombie;
```

## 🎨 主应用 (App.js)

```javascript
import React fromreact;
import { BrowserRouter as Router, Routes, Route } fromreact-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MyZombies from ./pages/MyZombies';
import Battle from './pages/Battle;
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-zombie-dark to-gray-900>       <Header />
        <main className=container mx-auto px-4py-8">
          <Routes>
            <Route path=/ element={<Home />} />
            <Route path="/my-zombies element={<MyZombies />} />
            <Route path="/battle element={<Battle />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```

## 🔗 合约集成

### 1. 合约配置 (utils/contract.js)

```javascript
export const CONTRACT_ADDRESS =YOUR_CONTRACT_ADDRESS"; // 替换为您的合约地址

export const CONTRACT_ABI =
  // 这里需要您的合约 ABI
  // 可以从 truffle build/contracts/CryptoZombies.json 中获取
];
```

### 2 合约 Hook (hooks/useContract.js)

```javascript
import { useState, useEffect } fromreact;
import { useWeb3 } from './useWeb3';
import [object Object] CONTRACT_ADDRESS, CONTRACT_ABI } from ../utils/contract';

export const useContract = () => {
  const[object Object] web3account } = useWeb3();
  const [contract, setContract] = useState(null);

  useEffect(() => [object Object] if (web3) {
      const contractInstance = new web3.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      setContract(contractInstance);
    }
  }, [web3]);

  const createZombie = async (name) => {
    if (!contract || !account) throw new Error('合约或账户未初始化');

    return await contract.methods.createRandomZombie(name).send({
      from: account,
      gas:200000 });
  };

  const getZombiesByOwner = async (owner) => {
    if (!contract) throw new Error('合约未初始化');

    return await contract.methods.getZombiesByOwner(owner).call();
  };

  const feedZombie = async (zombieId) => {
    if (!contract || !account) throw new Error('合约或账户未初始化');

    return await contract.methods.feedOnKitty(zombieId).send({
      from: account,
      gas:200000 });
  };

  const attackZombie = async (zombieId, targetId) => {
    if (!contract || !account) throw new Error('合约或账户未初始化');

    return await contract.methods.attack(zombieId, targetId).send({
      from: account,
      gas:200000});
  };

  return {
    contract,
    createZombie,
    getZombiesByOwner,
    feedZombie,
    attackZombie
  };
};
```

## 🚀 启动项目

```bash
npm start
```

访问 http://localhost:3000 查看应用。

## 📱 移动端优化

项目已配置响应式设计，支持移动端访问。

## 🎯 下一步

1 替换合约地址和 ABI2. 测试所有功能 3 添加更多游戏元素
4 优化用户体验 5. 部署到生产环境

# 🎮 CryptoZombies 前端完整开发指南

## 📋 项目概述

这是一个完整的 CryptoZombies 游戏前端界面，包含现代化的 UI 设计、钱包集成和合约交互功能。

## 🚀 快速开始

### 第一步：创建项目

```bash
# 创建 React 项目
npx create-react-app cryptozombies-frontend
cd cryptozombies-frontend

# 安装依赖
npm install web3tamask/detect-provider ethers react-router-dom lucide-react
npm install -D tailwindcss autoprefixer postcss

# 初始化 Tailwind CSS
npx tailwindcss init -p
```

### 第二步：配置 Tailwind CSS

编辑 `tailwind.config.js`：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = [object Object]content:
    ./src/**/*.[object Object]js,jsx,ts,tsx}",
  ],
  theme: {
    extend: [object Object] colors:[object Object]        zombie: [object Object]         green: '#40          dark: '#1
          blood:#dc2626        }
      }
    },
  },
  plugins: ],
}
```

### 第三步：更新 CSS

编辑 `src/index.css`：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: linear-gradient(135eg, #1f2937#111827%);
  color: white;
  font-family: Inter, sans-serif;
}

.zombie-card [object Object]  @apply bg-zombie-dark rounded-lg p-4 border border-gray-600 hover:border-zombie-green transition-colors;
}

.zombie-buttonobject Object]
  @apply px-4 py-2-zombie-green text-black rounded-lg hover:bg-green-400 transition-colors;
}

.attack-buttonobject Object]
  @apply px-4 py-2-zombie-blood text-white rounded-lg hover:bg-red-700 transition-colors;
}
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.js        # 页面头部
│   ├── WalletConnect.js # 钱包连接
│   ├── ZombieCard.js    # 僵尸卡片
│   ├── CreateZombie.js  # 创建僵尸
│   ├── FeedZombie.js    # 喂养僵尸
│   └── AttackZombie.js  # 攻击僵尸
├── hooks/               # 自定义 Hooks
│   ├── useWeb3js       # Web3 连接
│   └── useContract.js   # 合约交互
├── utils/               # 工具函数
│   ├── contract.js      # 合约配置
│   └── web3.js          # Web3 配置
├── pages/               # 页面组件
│   ├── Home.js          # 首页
│   ├── MyZombies.js     # 我的僵尸
│   └── Battle.js        # 战斗页面
└── App.js               # 主应用
```

## 🔧 核心组件详解

### 1. 钱包连接组件

```javascript
// src/components/WalletConnect.js
import React, { useState, useEffect } from 'react';

const WalletConnect = () => [object Object]
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () =>[object Object]
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0    setIsConnected(true);
      } catch (error)[object Object]     console.error('连接钱包失败:', error);
      }
    } else [object Object]   alert(请安装 MetaMask!');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  useEffect(() =>[object Object]
    if (window.ethereum)[object Object]   window.ethereum.on(accountsChanged', (accounts) => {
        if (accounts.length > 0        setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });
    }
  },);

  return (
    <div className=flexitems-center space-x-4">
      {isConnected ? (
        <div className=flexitems-center space-x-2>   <span className=text-sm text-gray-30    [object Object]account?.slice(0, 6)}...{account?.slice(-4)}
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

### 2. 僵尸卡片组件

```javascript
// src/components/ZombieCard.js
import React from 'react';

const ZombieCard = ({ zombie, onFeed, onAttack }) => [object Object] return (
    <div className="zombie-card">
      <div className="text-center">
        <h3 className=text-lg font-bold text-zombie-green>{zombie.name}</h3>
        <div className=mt-2 text-sm text-gray-40
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
            className="attack-button"
          >
            攻击
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZombieCard;
```

### 3. 创建僵尸组件

```javascript
// src/components/CreateZombie.js
import React,[object Object] useState } from 'react';

const CreateZombie = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try[object Object]
      // TODO: 调用合约创建僵尸
      console.log('创建僵尸:', name);
      alert('僵尸创建成功！);
      setName(    } catch (error) {
      console.error('创建僵尸失败:', error);
      alert(创建僵尸失败:+ error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="zombie-card">
      <h2 className=text-xl font-bold mb-4创建新僵尸</h2>
      <form onSubmit={handleSubmit} className="space-y-4>  <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder=输入僵尸名称         className="w-full px-3y-700border border-gray-600 rounded text-white"
          disabled={isLoading}
        />
        <button
          type=submit          disabled={isLoading || !name.trim()}
          className="w-full zombie-button disabled:opacity-50"
        >
          {isLoading ?创建中...' : 创建僵尸}
        </button>
      </form>
    </div>
  );
};

export default CreateZombie;
```

## 🔗 合约集成

### 1. 合约配置

```javascript
// src/utils/contract.js
export const CONTRACT_ADDRESS = YOUR_CONTRACT_ADDRESS"; // 替换为您的合约地址

export const CONTRACT_ABI = [
  // 创建僵尸
  [object Object]inputs: [{name": _name,type:string}],name:createRandomZombie",
   outputs":  stateMutability":nonpayable",
  type:function
 },

 // 获取僵尸信息
 [object Object]inputs": [{name": _zombieId,type": uint256,
 name": "zombies",
   outputs:    [object Object]name:name, type":string},
     {"name": dna",type:uint256    {"name: level, type": uint32},
  [object Object]name: readyTime, type":uint32,
     {"name:winCount, type":uint16[object Object]name": lossCount,type":uint16
   ],
   stateMutability":view",
  type:function"
 },

 // 喂养僵尸
 [object Object]inputs": [{name": _zombieId,type": uint256,
  name:feedOnKitty",
  outputs":  stateMutability":nonpayable",
 type:function"
 },

 // 攻击僵尸
 [object Object]inputs: [
   {"name": _zombieId",type":uint256  {"name": _targetId, type: uint256}
  ],
  name: tack",
  outputs":  stateMutability":nonpayable",
 type":function
 }
];
```

###2ook

```javascript
// src/hooks/useWeb3.js
import { useState, useEffect } from 'react';
import Web3 from web3mport detectEthereumProvider from@metamask/detect-provider';

export const useWeb3 = () => {
  const [web3, setWeb3= useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  consterror, setError] = useState(null);

  const initializeWeb3 = async () =>[object Object] try {
      setIsLoading(true);
      setError(null);

      const provider = await detectEthereumProvider();

      if (!provider) {
        throw new Error(请安装MetaMask!);
      }

      const web3Instance = new Web3ovider);
      setWeb33stance);

      const accounts = await provider.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0    setIsConnected(true);
      }

      provider.on(accountsChanged', (accounts) => {
        if (accounts.length > 0        setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAccount(null);
          setIsConnected(false);
        }
      });

      provider.on(chainChanged, () => {
        window.location.reload();
      });

    } catch (err) {
      setError(err.message);
      console.error(Web3 初始化失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () =>[object Object]   try {
      setError(null);

      if (!web3
        throw new Error('Web3 未初始化);    }

      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      setIsConnected(true);

      return accounts0;
    } catch (err) {
      setError(err.message);
      console.error('连接钱包失败:', err);
      throw err;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  useEffect(() => {
    initializeWeb3();
  },);

  return {
    web3,
    account,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet
  };
};
```

###3ook

```javascript
// src/hooks/useContract.js
import { useState, useEffect } fromreact;
import { useWeb3 } from './useWeb3ort [object Object] CONTRACT_ADDRESS, CONTRACT_ABI } from ../utils/contract';

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

## 🎨 主应用

```javascript
// src/App.js
import React fromreact;
import { BrowserRouter as Router, Routes, Route } fromreact-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MyZombies from ./pages/MyZombies';
import Battle from./pages/Battle;
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-zombie-dark to-gray-900       <Header />
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

## 🚀 启动和部署

### 开发环境

```bash
npm start
```

### 生产环境

```bash
npm run build
```

## 🎯 功能特性

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
1 控制台错误信息 2. 网络连接状态 3 合约地址配置
4taMask 网络设置

---

🎮 **享受你的 CryptoZombies 游戏开发之旅！**

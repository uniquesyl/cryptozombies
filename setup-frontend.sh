#!/bin/bash

echo "🎮 开始创建 CryptoZombies 前端项目..."

# 创建 React 项目
echo "📦 创建 React 项目...
npx create-react-app cryptozombies-frontend
cd cryptozombies-frontend

# 安装依赖
echo "📥 安装依赖...
npm install web3tamask/detect-provider ethers react-router-dom lucide-react
npm install -D tailwindcss autoprefixer postcss

# 初始化 Tailwind CSS
echo "🎨 配置 Tailwind CSS..."
npx tailwindcss init -p

# 创建项目结构
echo "📁 创建项目结构..."
mkdir -p src/components src/hooks src/utils src/pages

# 创建 Tailwind 配置文件
cat > tailwind.config.js <<EOF
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
  plugins: [],
}
EOF

# 更新 CSS 文件
cat > src/index.css << 'EOF
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: linear-gradient(135deg, #1f2937%, #111827%);
  color: white;
  font-family: 'Inter, sans-serif;
}

.zombie-card [object Object]  @apply bg-zombie-dark rounded-lg p-4 border border-gray-600 hover:border-zombie-green transition-colors;
}

.zombie-button [object Object]
  @apply px-4 py-2-zombie-green text-black rounded-lg hover:bg-green-400 transition-colors;
}

.attack-button [object Object]
  @apply px-4 py-2-zombie-blood text-white rounded-lg hover:bg-red-700 transition-colors;
}
EOF

# 创建基础组件
echo🔧 创建基础组件...
# Header 组件
cat > src/components/Header.js << EOF
import React fromreact;
import { Link } fromreact-router-dom;
const Header = () => {
  return (
    <header className="bg-zombie-dark border-b border-gray-600">
      <div className=container mx-auto px-4y-4">
        <div className=flex items-center justify-between>          <Link to="/" className=flexitems-center space-x-2
            <span className=text-xl font-bold text-white>🎮 CryptoZombies</span>
          </Link>
          <nav className=flexitems-center space-x-6
            <Link to="/" className="text-gray-30 hover:text-zombie-green transition-colors">
              首页
            </Link>
            <Link to="/my-zombies" className="text-gray-30 hover:text-zombie-green transition-colors">
              我的僵尸
            </Link>
            <Link to="/battle" className="text-gray-30 hover:text-zombie-green transition-colors">
              战斗
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
EOF

# WalletConnect 组件
cat > src/components/WalletConnect.js << EOF'
import React, { useState, useEffect } from 'react';

const WalletConnect = () => [object Object]
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWallet = async () =>[object Object]
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
EOF

# ZombieCard 组件
cat > src/components/ZombieCard.js << EOF
import React from 'react';

const ZombieCard = ({ zombie, onFeed, onAttack }) => [object Object] return (
    <div className="zombie-card">
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
EOF

# 创建页面组件
echo📄创建页面组件...

# Home 页面
cat > src/pages/Home.js << EOF
import React from 'react';
import CreateZombie from '../components/CreateZombie';

const Home = () => [object Object] return (
    <div className=container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4l font-bold text-zombie-green mb-4>      🧟‍♂️ CryptoZombies
        </h1>
        <p className=text-xl text-gray-30>
          创建、喂养、战斗！你的僵尸帝国从这里开始
        </p>
      </div>
      
      <div className="max-w-md mx-auto>
        <CreateZombie />
      </div>
      
      <div className=mt-12t-center">
        <h2 className="text-2l font-bold mb-4">游戏特色</h2>
        <div className=grid md:grid-cols-3 gap-6    <div className="zombie-card>     <h3 className=text-lg font-bold mb-2">🎯 创建僵尸</h3>
            <p className="text-gray-40>为你的僵尸起个名字，开始你的冒险</p>
          </div>
          <div className="zombie-card>     <h3 className=text-lg font-bold mb-2">🍖 喂养升级</h3>
            <p className=text-gray-400>喂养你的僵尸，提升等级和战斗力</p>
          </div>
          <div className="zombie-card>     <h3 className=text-lg font-bold mb-2">⚔️ 战斗系统</h3>
            <p className="text-gray-400>与其他玩家的僵尸战斗，争夺胜利</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
EOF

# CreateZombie 组件
cat > src/components/CreateZombie.js << EOF'
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
      alert('僵尸创建成功！');
      setName(    } catch (error) {
      console.error('创建僵尸失败:', error);
      alert(创建僵尸失败:+ error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="zombie-card">
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
          className="w-full zombie-button disabled:opacity-50"
        >
          {isLoading ? '创建中...' : 创建僵尸}
        </button>
      </form>
    </div>
  );
};

export default CreateZombie;
EOF

# 更新 App.js
cat > src/App.js << EOF
import React fromreact;
import { BrowserRouter as Router, Routes, Route } fromreact-router-dom';
import Header from './components/Header';
import Home from./pages/Home;
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-zombie-dark to-gray-900>       <Header />
        <main>
          <Routes>
            <Route path=/ element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
EOF

echo ✅ 前端项目创建完成！
echo
echo🚀 启动项目：
echocd cryptozombies-frontend"
echo "npm start
echo cho 📝 下一步：echo1. 配置合约地址和 ABI"
echo 2. 实现合约交互功能echo "3加更多页面和功能
echo ""
echo "🎮 享受你的 CryptoZombies 游戏！" 
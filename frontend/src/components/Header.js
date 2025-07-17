import React from 'react';
import { Link } from 'react-router-dom';
import { Skull, Users, Sword } from 'lucide-react';
import WalletConnect from './WalletConnect';

const Header = () => {
  return (
    <header className="bg-zombie-dark border-b border-gray-600">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Skull className="w-8 h-8 text-zombie-green" />
            <span className="text-xl font-bold text-white">CryptoZombies</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-300 hover:text-zombie-green transition-colors"
            >
              <Skull className="w-4 h-4" />
              <span>首页</span>
            </Link>
            <Link 
              to="/my-zombies" 
              className="flex items-center space-x-1 text-gray-300 hover:text-zombie-green transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>我的僵尸</span>
            </Link>
            <Link 
              to="/battle" 
              className="flex items-center space-x-1 text-gray-300 hover:text-zombie-green transition-colors"
            >
              <Sword className="w-4 h-4" />
              <span>战斗</span>
            </Link>
          </nav>

          {/* Wallet Connect */}
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};

export default Header; 
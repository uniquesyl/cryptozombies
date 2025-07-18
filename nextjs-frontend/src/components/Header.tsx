'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import WalletConnect from './WalletConnect';

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: '首页', icon: '🏠' },
    { href: '/my-zombies', label: '我的僵尸', icon: '🧟‍♂️' },
    { href: '/battle', label: '战斗', icon: '⚔️' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-3xl lg:text-4xl transition-all duration-300 group-hover:scale-110 text-purple-600">
              🧟
            </div>
            <span className="text-xl lg:text-2xl font-bold transition-colors duration-300 text-gray-900 group-hover:text-purple-400">
              CryptoZombies
            </span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                  pathname === item.href
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {pathname === item.href && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600" />
                )}
              </Link>
            ))}
          </nav>

          {/* 钱包连接 */}
          <div className="hidden lg:block">
            <WalletConnect compact={true} />
          </div>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100"
            aria-label="切换菜单"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
              }`} />
            </div>
          </button>
        </div>

        {/* 移动端导航菜单 */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2 border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* 移动端钱包连接 */}
            <div className="pt-4 border-t border-gray-200">
              <WalletConnect compact={false} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
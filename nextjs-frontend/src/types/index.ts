import { ethers } from 'ethers';

// 僵尸数据结构
export interface Zombie {
  id: string;
  name: string;
  dna: string;
  level: string;
  readyTime: string;
  winCount: string;
  lossCount: string;
  owner: string;
}

// 僵尸外观数据
export interface ZombieAppearance {
  mainAppearance: string;
  rarity: number;
  rarityDescription: string;
  color: string;
  features: string[];
}

// 僵尸统计信息
export interface ZombieStats {
  attack: number;
  defense: number;
  speed: number;
  totalBattles: number;
  winRate: number;
}

// 网络配置
export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  currency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// 合约配置
export interface ContractConfig {
  address: string;
  abi: readonly (string | { [key: string]: unknown })[];
}

// Web3 状态
export interface Web3State {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  isInitializing: boolean;
  error: string | null;
  retryCount: number;
}

// 合约状态
export interface ContractState {
  contract: unknown;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// 合约方法返回类型
export interface ContractMethods {
  createRandomZombie: (name: string) => Promise<string | null>;
  getZombiesByOwner: (address: string) => Promise<string[]>;
  getZombieDetails: (zombieId: string) => Promise<Zombie | null>;
  levelUp: (zombieId: string) => Promise<boolean>;
  attack: (zombieId: string, targetId: string) => Promise<boolean>;
  feedOnKitty: (zombieId: string, kittyId: string) => Promise<boolean>;
  changeName: (zombieId: string, newName: string) => Promise<boolean>;
  getZombieCount: (address: string) => Promise<string>;
  getZombieOwner: (zombieId: string) => Promise<string | null>;
  transferZombie: (from: string, to: string, zombieId: string) => Promise<boolean>;
  getAllZombies: (address: string) => Promise<Zombie[]>;
  getAllZombiesForBattle: () => Promise<Zombie[]>;
  isZombieReady: (zombieId: string) => Promise<boolean>;
  getZombieCooldownRemaining: (zombieId: string) => Promise<number>;
}

// 组件 Props 类型
export interface WalletConnectProps {
  className?: string;
  compact?: boolean;
}

export interface ZombieCardProps {
  zombie: Zombie;
  selected?: boolean;
  isSelected?: boolean;
  isTarget?: boolean;
  onClick?: () => void;
  showDetails?: boolean;
  showOwner?: boolean;
  className?: string;
}

export interface ZombieManagerProps {
  zombie: Zombie;
  onUpdate: () => void;
}

export interface CreateZombieProps {
  onZombieCreated?: () => void;
  className?: string;
}

export interface CooldownTimerProps {
  readyTime: string;
  className?: string;
}

export interface LoadingStateProps {
  message?: string;
  isRetrying?: boolean;
  retryCount?: number;
  className?: string;
}

export interface DiagnosticInfoProps {
  className?: string;
}

// 页面 Props 类型
export interface HomePageProps {
  className?: string;
}

export interface MyZombiesPageProps {
  className?: string;
}

export interface BattlePageProps {
  className?: string;
}

export interface ZombieDetailPageProps {
  zombieId?: string;
}

// 工具函数类型
export type ZombieLevelColor = 'bg-gray-100' | 'bg-green-100' | 'bg-blue-100' | 'bg-purple-100' | 'bg-yellow-100' | 'bg-red-100';

// 错误类型
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}

// 网络类型
export type SupportedNetwork = 'sepolia' | 'mainnet' | 'localhost';

// 事件类型
export interface NewZombieEvent {
  zombieId: string;
  name: string;
  dna: string;
}

export interface AttackEvent {
  attackerId: string;
  targetId: string;
  winner: string;
}

export interface LevelUpEvent {
  zombieId: string;
  newLevel: string;
}

export interface NameChangeEvent {
  zombieId: string;
  newName: string;
} 
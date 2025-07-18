'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ContractState, ContractMethods, Zombie } from '../types';
import { CONTRACT_CONFIG } from '../config/contract';

export const useContract = (
  provider: ethers.providers.Web3Provider | null,
  signer: ethers.Signer | null
): ContractState & ContractMethods => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化合约
  useEffect(() => {
    if (provider && signer) {
      try {
        const contractInstance = new ethers.Contract(
          CONTRACT_CONFIG.address,
          CONTRACT_CONFIG.abi,
          signer
        );
        setContract(contractInstance);
        setError(null);
        setIsInitialized(true);
        console.log('合约初始化成功');
      } catch (err) {
        console.error('合约初始化失败:', err);
        setError('合约初始化失败');
        setIsInitialized(false);
      }
    } else {
      setContract(null);
      setIsInitialized(false);
    }
  }, [provider, signer]);

  // 创建随机僵尸
  const createRandomZombie = useCallback(async (name: string): Promise<string | null> => {
    if (!contract || !signer) {
      throw new Error('合约未初始化');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.createRandomZombie(name);
      const receipt = await tx.wait();
      
      // 查找 NewZombie 事件
      const event = receipt.events?.find((event: unknown) => (event as { event: string }).event === 'NewZombie');
      if (event) {
        const zombieId = (event as { args: { zombieId: { toString: () => string } } }).args?.zombieId?.toString();
        console.log('僵尸创建成功:', zombieId);
        return zombieId;
      }
      
      return null;
    } catch (err) {
      console.error('创建僵尸失败:', err);
      const errorMessage = err instanceof Error ? err.message : '创建僵尸失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  // 获取用户的所有僵尸ID
  const getZombiesByOwner = useCallback(async (address: string): Promise<string[]> => {
    if (!contract) {
      throw new Error('合约未初始化');
    }

    try {
      const zombieIds = await contract.getZombiesByOwner(address);
      return zombieIds.map((id: unknown) => (id as { toString: () => string }).toString());
    } catch (err) {
      console.error('获取僵尸ID失败:', err);
      throw err;
    }
  }, [contract]);

  // 获取僵尸详细信息
  const getZombieDetails = useCallback(async (zombieId: string): Promise<Zombie | null> => {
    if (!contract) {
      throw new Error('合约未初始化');
    }

    try {
      const zombie = await contract.zombies(zombieId);
      const owner = await contract.ownerOf(zombieId);
      
      return {
        id: zombieId,
        name: zombie.name,
        dna: zombie.dna.toString(),
        level: zombie.level.toString(),
        readyTime: zombie.readyTime.toString(),
        winCount: zombie.winCount.toString(),
        lossCount: zombie.lossCount.toString(),
        owner: owner
      };
    } catch (err) {
      console.error('获取僵尸详情失败:', err);
      return null;
    }
  }, [contract]);

  // 升级僵尸
  const levelUp = useCallback(async (zombieId: string): Promise<boolean> => {
    if (!contract || !signer) {
      throw new Error('合约未初始化');
    }

    setLoading(true);
    setError(null);

    try {
      const fee = ethers.utils.parseEther('0.001');
      const tx = await contract.levelUp(zombieId, { value: fee });
      await tx.wait();
      console.log('僵尸升级成功');
      return true;
    } catch (err) {
      console.error('僵尸升级失败:', err);
      const errorMessage = err instanceof Error ? err.message : '僵尸升级失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  // 攻击僵尸
  const attack = useCallback(async (zombieId: string, targetId: string): Promise<boolean> => {
    if (!contract || !signer) {
      throw new Error('合约未初始化');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.attack(zombieId, targetId);
      await tx.wait();
      console.log('攻击成功');
      return true;
    } catch (err) {
      console.error('攻击失败:', err);
      const errorMessage = err instanceof Error ? err.message : '攻击失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  // 喂食小猫
  const feedOnKitty = useCallback(async (zombieId: string, kittyId: string): Promise<boolean> => {
    if (!contract || !signer) {
      throw new Error('合约未初始化');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.feedOnKitty(zombieId, kittyId);
      await tx.wait();
      console.log('喂食小猫成功');
      return true;
    } catch (err) {
      console.error('喂食小猫失败:', err);
      const errorMessage = err instanceof Error ? err.message : '喂食小猫失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  // 改变僵尸名称
  const changeName = useCallback(async (zombieId: string, newName: string): Promise<boolean> => {
    if (!contract || !signer) {
      throw new Error('合约未初始化');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.changeName(zombieId, newName);
      await tx.wait();
      console.log('僵尸改名成功');
      return true;
    } catch (err) {
      console.error('僵尸改名失败:', err);
      const errorMessage = err instanceof Error ? err.message : '僵尸改名失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  // 获取用户僵尸数量
  const getZombieCount = useCallback(async (address: string): Promise<string> => {
    if (!contract) {
      throw new Error('合约未初始化');
    }

    try {
      const count = await contract.balanceOf(address);
      return count.toString();
    } catch (err) {
      console.error('获取僵尸数量失败:', err);
      throw err;
    }
  }, [contract]);

  // 获取僵尸所有者
  const getZombieOwner = useCallback(async (zombieId: string): Promise<string | null> => {
    if (!contract) {
      throw new Error('合约未初始化');
    }

    try {
      const owner = await contract.ownerOf(zombieId);
      return owner;
    } catch (err) {
      console.error('获取僵尸所有者失败:', err);
      return null;
    }
  }, [contract]);

  // 转移僵尸
  const transferZombie = useCallback(async (from: string, to: string, zombieId: string): Promise<boolean> => {
    if (!contract || !signer) {
      throw new Error('合约未初始化');
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.transferFrom(from, to, zombieId);
      await tx.wait();
      console.log('僵尸转移成功');
      return true;
    } catch (err) {
      console.error('僵尸转移失败:', err);
      const errorMessage = err instanceof Error ? err.message : '僵尸转移失败';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [contract, signer]);

  // 获取用户所有僵尸
  const getAllZombies = useCallback(async (address: string): Promise<Zombie[]> => {
    if (!contract) {
      throw new Error('合约未初始化');
    }

    try {
      const zombieIds = await getZombiesByOwner(address);
      const zombies: Zombie[] = [];

      for (const zombieId of zombieIds) {
        const zombie = await getZombieDetails(zombieId);
        if (zombie) {
          zombies.push(zombie);
        }
      }

      return zombies;
    } catch (err) {
      console.error('获取所有僵尸失败:', err);
      throw err;
    }
  }, [contract, getZombiesByOwner, getZombieDetails]);

  // 获取所有僵尸（用于战斗目标选择）
  const getAllZombiesForBattle = useCallback(async (): Promise<Zombie[]> => {
    if (!contract) {
      throw new Error('合约未初始化');
    }

    try {
      // 由于合约没有直接获取所有僵尸的函数，我们使用一个安全的方法
      const zombies: Zombie[] = [];
      
      // 使用一个保守的搜索范围，避免调用不存在的僵尸ID
      const searchRange = 50; // 搜索前50个可能的僵尸ID
      
      // 遍历可能的僵尸ID
      for (let i = 0; i < searchRange; i++) {
        try {
          // 先检查僵尸是否存在（通过检查所有者）
          const owner = await getZombieOwner(i.toString());
          if (owner && owner !== '0x0000000000000000000000000000000000000000') {
            // 僵尸存在，获取详细信息
            const zombie = await getZombieDetails(i.toString());
            if (zombie) {
              zombies.push(zombie);
            }
          }
        } catch (err) {
          // 如果获取失败，说明这个ID不存在或无效，继续下一个
          continue;
        }
      }

      console.log(`找到 ${zombies.length} 个僵尸用于战斗`);
      return zombies;
    } catch (err) {
      console.error('获取所有僵尸失败:', err);
      // 如果获取失败，返回空数组而不是抛出错误
      return [];
    }
  }, [contract, getZombieDetails, getZombieOwner]);

  // 检查僵尸是否准备就绪（冷却时间是否结束）
  const isZombieReady = useCallback(async (zombieId: string): Promise<boolean> => {
    if (!contract) {
      throw new Error('合约未初始化');
    }

    try {
      const zombie = await getZombieDetails(zombieId);
      if (!zombie) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      const readyTime = parseInt(zombie.readyTime);
      
      return now >= readyTime;
    } catch (err) {
      console.error('检查僵尸准备状态失败:', err);
      return false;
    }
  }, [contract, getZombieDetails]);

  // 获取僵尸冷却时间剩余秒数
  const getZombieCooldownRemaining = useCallback(async (zombieId: string): Promise<number> => {
    if (!contract) {
      throw new Error('合约未初始化');
    }

    try {
      const zombie = await getZombieDetails(zombieId);
      if (!zombie) {
        return 0;
      }

      const now = Math.floor(Date.now() / 1000);
      const readyTime = parseInt(zombie.readyTime);
      
      return Math.max(0, readyTime - now);
    } catch (err) {
      console.error('获取僵尸冷却时间失败:', err);
      return 0;
    }
  }, [contract, getZombieDetails]);

  return {
    contract,
    loading,
    error,
    isInitialized,
    createRandomZombie,
    getZombiesByOwner,
    getZombieDetails,
    levelUp,
    attack,
    feedOnKitty,
    changeName,
    getZombieCount,
    getZombieOwner,
    transferZombie,
    getAllZombies,
    getAllZombiesForBattle,
    isZombieReady,
    getZombieCooldownRemaining
  };
}; 
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

export const useContract = (provider, signer) => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 初始化合约实例
  useEffect(() => {
    if (provider && signer) {
      try {
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        setContract(contractInstance);
        setError(null);
      } catch (err) {
        console.error('合约初始化失败:', err);
        setError('合约初始化失败');
      }
    } else {
      setContract(null);
    }
  }, [provider, signer]);

  // 创建随机僵尸
  const createRandomZombie = useCallback(async (name) => {
    if (!contract || !signer) {
      setError('合约或钱包未连接');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // 先检查用户是否已经有僵尸
      const account = await signer.getAddress();
      const zombieCount = await contract.balanceOf(account);
      
      if (zombieCount > 0) {
        setError('您已经创建过僵尸了，每个地址只能创建一个僵尸');
        return null;
      }

      // 尝试创建僵尸
      const tx = await contract.createRandomZombie(name);
      const receipt = await tx.wait();
      
      // 查找 NewZombie 事件
      const newZombieEvent = receipt.logs.find(log => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed.name === 'NewZombie';
        } catch {
          return false;
        }
      });

      if (newZombieEvent) {
        const parsed = contract.interface.parseLog(newZombieEvent);
        const zombieId = parsed.args.zombieId.toString();
        return zombieId;
      }

      return null;
    } catch (err) {
      console.error('创建僵尸失败:', err);
      
      // 提供更详细的错误信息
      let errorMessage = '创建僵尸失败';
      
      if (err.message.includes('missing revert data')) {
        errorMessage = '合约调用失败，可能的原因：1) 您已经创建过僵尸 2) 合约地址错误 3) 网络问题';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = '余额不足，请确保有足够的ETH支付gas费用';
      } else if (err.message.includes('user rejected')) {
        errorMessage = '用户取消了交易';
      } else if (err.message.includes('nonce')) {
        errorMessage = '交易nonce错误，请刷新页面重试';
      } else {
        errorMessage = err.message || '创建僵尸失败';
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // 获取用户的所有僵尸ID
  const getZombiesByOwner = useCallback(async (address) => {
    if (!contract) {
      return [];
    }

    try {
      const zombieIds = await contract.getZombiesByOwner(address);
      return zombieIds.map(id => id.toString());
    } catch (err) {
      console.error('获取僵尸列表失败:', err);
      return [];
    }
  }, [contract]);

  // 获取僵尸详细信息
  const getZombieDetails = useCallback(async (zombieId) => {
    if (!contract) {
      return null;
    }

    try {
      const zombie = await contract.zombies(zombieId);
      
      // 检查僵尸是否存在（名字为空表示不存在）
      if (!zombie.name || zombie.name === '') {
        return null;
      }
      
      // 获取僵尸所有者
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
      // 不设置错误状态，因为僵尸可能不存在
      console.log(`僵尸 ${zombieId} 不存在或获取失败:`, err.message);
      return null;
    }
  }, [contract]);

  // 升级僵尸
  const levelUp = useCallback(async (zombieId) => {
    if (!contract || !signer) {
      setError('合约或钱包未连接');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 先检查僵尸是否存在
      const zombie = await contract.zombies(zombieId);
      if (!zombie.name || zombie.name === '') {
        setError('僵尸不存在');
        return false;
      }

      // 检查是否是僵尸的所有者
      const account = await signer.getAddress();
      const owner = await contract.ownerOf(zombieId);
      
      if (owner.toLowerCase() !== account.toLowerCase()) {
        setError('您不是这个僵尸的所有者，无法升级');
        return false;
      }

      // 升级费用是 0.001 ETH
      const fee = ethers.parseEther('0.001');
      const tx = await contract.levelUp(zombieId, { value: fee });
      console.log('升级交易已发送:', tx.hash);
      
      await tx.wait();
      console.log('升级完成');
      return true;
    } catch (err) {
      console.error('升级失败:', err);
      
      // 提供更详细的错误信息
      let errorMessage = '升级失败';
      
      if (err.message.includes('missing revert data')) {
        errorMessage = '升级失败，可能的原因：1) 僵尸不存在 2) 您不是僵尸的所有者 3) 余额不足';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = '余额不足，请确保有足够的ETH支付升级费用和gas费用';
      } else if (err.message.includes('user rejected')) {
        errorMessage = '用户取消了交易';
      } else if (err.message.includes('nonce')) {
        errorMessage = '交易nonce错误，请刷新页面重试';
      } else {
        errorMessage = err.message || '升级失败';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // 攻击僵尸
  const attack = useCallback(async (zombieId, targetId) => {
    if (!contract || !signer) {
      setError('合约或钱包未连接');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 先检查攻击者僵尸的状态
      const attackerZombie = await contract.zombies(zombieId);
      if (!attackerZombie.name || attackerZombie.name === '') {
        setError('攻击者僵尸不存在');
        return false;
      }

      // 检查攻击者僵尸的所有权
      const account = await signer.getAddress();
      const attackerOwner = await contract.ownerOf(zombieId);
      if (attackerOwner.toLowerCase() !== account.toLowerCase()) {
        setError('您不是攻击者僵尸的所有者');
        return false;
      }

      // 检查攻击者僵尸是否准备就绪
      const now = Math.floor(Date.now() / 1000);
      const readyTime = parseInt(attackerZombie.readyTime);
      if (readyTime > now) {
        const cooldownRemaining = readyTime - now;
        const hours = Math.floor(cooldownRemaining / 3600);
        const minutes = Math.floor((cooldownRemaining % 3600) / 60);
        setError(`攻击者僵尸正在冷却中，剩余时间: ${hours}小时${minutes}分钟`);
        return false;
      }

      // 检查目标僵尸是否存在
      const targetZombie = await contract.zombies(targetId);
      if (!targetZombie.name || targetZombie.name === '') {
        setError('目标僵尸不存在');
        return false;
      }

      // 检查目标僵尸的所有权（确保不是自己的僵尸）
      const targetOwner = await contract.ownerOf(targetId);
      if (targetOwner.toLowerCase() === account.toLowerCase()) {
        setError('不能攻击自己的僵尸');
        return false;
      }

      console.log('开始攻击:', zombieId, 'vs', targetId);
      const tx = await contract.attack(zombieId, targetId);
      console.log('攻击交易已发送:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('攻击完成:', receipt);
      return true;
    } catch (err) {
      console.error('攻击失败:', err);
      
      // 提供更详细的错误信息
      let errorMessage = '攻击失败';
      
      if (err.message.includes('transaction execution reverted')) {
        errorMessage = '攻击失败，可能的原因：1) 僵尸正在冷却中 2) 僵尸不存在 3) 权限不足';
      } else if (err.message.includes('missing revert data')) {
        errorMessage = '攻击失败，可能的原因：1) 僵尸不存在 2) 僵尸正在冷却中 3) 不能攻击自己的僵尸';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = '余额不足，请确保有足够的ETH支付gas费用';
      } else if (err.message.includes('user rejected')) {
        errorMessage = '用户取消了交易';
      } else if (err.message.includes('onlyOwnerOf')) {
        errorMessage = '您不是攻击者僵尸的所有者';
      } else if (err.message.includes('_isReady')) {
        errorMessage = '攻击者僵尸正在冷却中，请等待冷却时间结束';
      } else {
        errorMessage = err.message || '攻击失败';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // 喂养僵尸（吃小猫）
  const feedOnKitty = useCallback(async (zombieId, kittyId) => {
    if (!contract || !signer) {
      setError('合约或钱包未连接');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.feedOnKitty(zombieId, kittyId);
      console.log('喂养交易已发送:', tx.hash);
      
      await tx.wait();
      console.log('喂养完成');
      return true;
    } catch (err) {
      console.error('喂养失败:', err);
      setError(err.message || '喂养失败');
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // 更改僵尸名称
  const changeName = useCallback(async (zombieId, newName) => {
    if (!contract || !signer) {
      setError('合约或钱包未连接');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 先检查僵尸是否存在
      const zombie = await contract.zombies(zombieId);
      if (!zombie.name || zombie.name === '') {
        setError('僵尸不存在');
        return false;
      }

      // 检查僵尸等级
      const level = parseInt(zombie.level);
      if (level < 2) {
        setError('僵尸等级不足，需要等级 >= 2 才能改名');
        return false;
      }

      // 检查是否是僵尸的所有者
      const account = await signer.getAddress();
      const owner = await contract.ownerOf(zombieId);
      
      if (owner.toLowerCase() !== account.toLowerCase()) {
        setError('您不是这个僵尸的所有者，无法改名');
        return false;
      }

      // 检查新名称是否有效
      if (!newName || newName.trim() === '') {
        setError('僵尸名称不能为空');
        return false;
      }

      const tx = await contract.changeName(zombieId, newName);
      console.log('改名交易已发送:', tx.hash);
      
      await tx.wait();
      console.log('改名完成');
      return true;
    } catch (err) {
      console.error('改名失败:', err);
      
      // 提供更详细的错误信息
      let errorMessage = '改名失败';
      
      if (err.message.includes('missing revert data')) {
        errorMessage = '改名失败，可能的原因：1) 僵尸不存在 2) 僵尸等级不足（需要等级 >= 2）3) 您不是僵尸的所有者 4) 名称格式不正确';
      } else if (err.message.includes('insufficient funds')) {
        errorMessage = '余额不足，请确保有足够的ETH支付gas费用';
      } else if (err.message.includes('user rejected')) {
        errorMessage = '用户取消了交易';
      } else if (err.message.includes('nonce')) {
        errorMessage = '交易nonce错误，请刷新页面重试';
      } else {
        errorMessage = err.message || '改名失败';
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // 获取用户僵尸数量
  const getZombieCount = useCallback(async (address) => {
    if (!contract) {
      setError('合约未连接');
      return 0;
    }

    try {
      const count = await contract.balanceOf(address);
      return count.toString();
    } catch (err) {
      console.error('获取僵尸数量失败:', err);
      setError(err.message || '获取僵尸数量失败');
      return 0;
    }
  }, [contract]);

  // 获取僵尸所有者
  const getZombieOwner = useCallback(async (zombieId) => {
    if (!contract) {
      setError('合约未连接');
      return null;
    }

    try {
      const owner = await contract.ownerOf(zombieId);
      return owner;
    } catch (err) {
      console.error('获取僵尸所有者失败:', err);
      setError(err.message || '获取僵尸所有者失败');
      return null;
    }
  }, [contract]);

  // 转移僵尸
  const transferZombie = useCallback(async (from, to, zombieId) => {
    if (!contract || !signer) {
      setError('合约或钱包未连接');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.transferFrom(from, to, zombieId);
      console.log('转移交易已发送:', tx.hash);
      
      await tx.wait();
      console.log('转移完成');
      return true;
    } catch (err) {
      console.error('转移失败:', err);
      setError(err.message || '转移失败');
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  // 获取所有僵尸详情
  const getAllZombies = useCallback(async (address) => {
    if (!contract) {
      setError('合约未连接');
      return [];
    }

    try {
      const zombieIds = await getZombiesByOwner(address);
      const zombies = [];
      
      for (const id of zombieIds) {
        const zombie = await getZombieDetails(id);
        if (zombie) {
          // 确保所有者信息正确
          zombie.owner = address;
          zombies.push(zombie);
        }
      }
      
      return zombies;
    } catch (err) {
      console.error('获取所有僵尸失败:', err);
      setError(err.message || '获取所有僵尸失败');
      return [];
    }
  }, [contract, getZombiesByOwner, getZombieDetails]);

  return {
    contract,
    loading,
    error,
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
    getAllZombies
  };
}; 
import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

const DiagnosticInfo = () => {
  const [diagnosticInfo, setDiagnosticInfo] = useState({});
  const { provider, signer, account } = useWeb3();
  const { contract, loading, error } = useContract(provider, signer);

  useEffect(() => {
    const getDiagnosticInfo = async () => {
      const info = {
        account: account || '未连接',
        network: '未知',
        contractAddress: '0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4',
        contractConnected: !!contract,
        zombieCount: 0,
        balance: '0',
        canCreateZombie: false
      };

      if (account && contract) {
        try {
          // 获取网络信息
          const network = await provider.getNetwork();
          info.network = network.name;

          // 获取僵尸数量
          const zombieCount = await contract.balanceOf(account);
          info.zombieCount = zombieCount.toString();
          info.canCreateZombie = zombieCount === 0;

          // 获取余额
          const balance = await provider.getBalance(account);
          info.balance = ethers.formatEther(balance);
        } catch (err) {
          console.error('获取诊断信息失败:', err);
        }
      }

      setDiagnosticInfo(info);
    };

    getDiagnosticInfo();
  }, [account, contract, provider]);

  if (!account) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
      <h3 className="text-sm font-medium text-blue-800 mb-2">诊断信息</h3>
      <div className="text-xs text-blue-700 space-y-1">
        <div>网络: {diagnosticInfo.network}</div>
        <div>合约连接: {diagnosticInfo.contractConnected ? '✅' : '❌'}</div>
        <div>僵尸数量: {diagnosticInfo.zombieCount}</div>
        <div>余额: {diagnosticInfo.balance} ETH</div>
        <div>可创建僵尸: {diagnosticInfo.canCreateZombie ? '✅' : '❌'}</div>
      </div>
    </div>
  );
};

export default DiagnosticInfo; 
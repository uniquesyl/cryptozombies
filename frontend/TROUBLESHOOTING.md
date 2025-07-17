# 问题解决指南

## 常见错误及解决方案

### 1. "missing revert data" 错误

**错误信息**: `missing revert data (action="estimateGas", data=null, reason=null)` 或 `missing revert data (action="call", data=null, reason=null)`

**可能原因**:

- 用户已经创建过僵尸（每个地址只能创建一个）
- 尝试获取不存在的僵尸信息
- 合约地址错误或合约未正确部署
- 网络连接问题
- Gas 费用不足

**解决方案**:

1. **检查是否已创建僵尸**:

   - 查看诊断信息中的"僵尸数量"
   - 如果数量 > 0，说明已经创建过僵尸

2. **检查僵尸是否存在**:

   - 在浏览器控制台运行：`testBattle()`
   - 查看哪些僵尸 ID 存在

3. **检查网络连接**:

   - 确保 MetaMask 连接到 Sepolia 测试网络
   - 检查诊断信息中的"网络"和"合约连接"状态

4. **检查余额**:

   - 确保钱包中有足够的 Sepolia ETH
   - 可以从水龙头获取：https://sepoliafaucet.com/

5. **验证合约地址**:
   - 当前合约地址：`0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4`
   - 在 Sepolia Etherscan 上验证：https://sepolia.etherscan.io/address/0xB41b741Cf52bDC47111ee0B2D274fCe88Ed758a4

### 2. 钱包连接问题

**问题**: 无法连接 MetaMask 钱包

**解决方案**:

1. 确保已安装 MetaMask 扩展
2. 确保 MetaMask 已解锁
3. 刷新页面重试
4. 检查浏览器控制台是否有错误

### 3. 网络切换问题

**问题**: 不在正确的网络（Sepolia）

**解决方案**:

1. 在 MetaMask 中手动切换到 Sepolia 测试网络
2. 或者点击页面上的"切换到 Sepolia"按钮
3. 网络配置：
   - 网络名称：Sepolia Testnet
   - Chain ID：11155111
   - RPC URL：https://sepolia.infura.io/v3/98bf3d78fbca413cb0ecda808090f9b2
   - 区块浏览器：https://sepolia.etherscan.io/

### 4. 交易失败

**问题**: 交易被拒绝或失败

**解决方案**:

1. **检查余额**: 确保有足够的 ETH 支付 gas 费用
2. **调整 Gas 设置**: 在 MetaMask 中手动调整 gas limit 和 gas price
3. **重试交易**: 有时网络拥堵，稍后重试
4. **检查 nonce**: 刷新页面重置 nonce

### 5. 合约函数不存在

**问题**: 合约函数调用失败

**解决方案**:

1. 检查合约是否正确部署
2. 验证 ABI 是否正确
3. 确认合约地址正确

### 6. 改名功能失败

**问题**: 僵尸改名失败，出现 "missing revert data" 错误

**可能原因**:

- 僵尸不存在
- 僵尸等级不足（需要等级 >= 2）
- 您不是僵尸的所有者
- 新名称格式不正确
- 合约权限问题

**解决方案**:

1. **检查僵尸是否存在**:

   - 在浏览器控制台运行：`testRename()`
   - 查看僵尸详情和所有者信息

2. **检查僵尸等级**:

   - 确保僵尸等级 >= 2
   - 如果等级不足，需要先升级僵尸

3. **确认所有权**:

   - 确保您是要改名的僵尸的所有者
   - 检查僵尸 ID 是否正确

4. **检查名称格式**:

   - 确保新名称不为空
   - 名称长度在合理范围内

5. **验证合约状态**:
   - 确保合约正常运行
   - 检查网络连接

### 7. Signer 未定义错误

**问题**: `TypeError: Cannot read properties of undefined (reading 'getAddress')`

**可能原因**:

- 钱包未连接
- MetaMask 未解锁
- 网络切换导致连接断开

**解决方案**:

1. **重新连接钱包**:

   - 刷新页面
   - 重新连接 MetaMask

2. **检查钱包状态**:

   - 确保 MetaMask 已解锁
   - 确保在正确的网络（Sepolia）

3. **测试连接**:
   - 在浏览器控制台运行：`testSigner()`
   - 检查 signer 和合约状态

### 8. 网络连接问题

**问题**: 第一次连接钱包时显示网络错误，刷新页面后正常

**可能原因**:

- 网络信息加载延迟
- MetaMask 网络检测时序问题
- 网络状态缓存问题

**解决方案**:

1. **等待网络检测完成**:

   - 连接钱包后等待几秒钟
   - 查看网络状态指示器（黄色表示检测中）

2. **手动刷新网络状态**:

   - 在浏览器控制台运行：`testNetwork()`
   - 检查网络连接状态

3. **重新连接钱包**:

   - 断开钱包连接
   - 重新连接钱包

4. **清除缓存**:
   - 清除浏览器缓存
   - 刷新页面重试

## 诊断步骤

1. **查看诊断信息**:

   - 连接钱包后，页面会显示诊断信息
   - 检查所有状态是否正常

2. **检查浏览器控制台**:

   - 按 F12 打开开发者工具
   - 查看 Console 标签页的错误信息

3. **验证合约状态**:

   - 在浏览器控制台运行：`verifyContract()`
   - 检查合约是否可访问

4. **测试网络连接**:
   - 确保能正常访问 Sepolia 网络
   - 检查 RPC 端点是否可用

## 获取帮助

如果问题仍然存在：

1. **检查错误日志**: 查看浏览器控制台的详细错误信息
2. **验证环境**: 确保所有配置正确
3. **重新部署**: 如果合约有问题，可能需要重新部署
4. **联系支持**: 提供详细的错误信息和复现步骤

## 预防措施

1. **定期检查余额**: 确保有足够的测试 ETH
2. **备份私钥**: 安全保存钱包私钥
3. **测试网络**: 始终在测试网络上测试
4. **小额测试**: 先用小额交易测试功能

### 9. "不能攻击自己的僵尸" 错误

**问题**: 用户尝试攻击僵尸时，系统提示"不能攻击自己的僵尸"，即使选择了不同的僵尸。

**根本原因**: 前端数据不完整 - 在获取僵尸详情时，前端代码没有获取僵尸的所有者信息，导致无法正确识别僵尸归属。

**已修复的问题**:
✅ **修复了僵尸所有者信息获取**: 在 `getZombieDetails` 函数中添加了 `ownerOf` 调用
✅ **修复了僵尸列表过滤**: 确保 `getAllZombies` 正确设置所有者信息
✅ **改进了前端过滤逻辑**: 在目标选择中正确过滤用户自己的僵尸

**修复详情**:

1. **修复僵尸详情获取**:

```javascript
// 修复前
const getZombieDetails = async (zombieId) => {
  const zombie = await contract.zombies(zombieId);
  return {
    id: zombieId,
    name: zombie.name,
    // ... 其他字段，但没有 owner
  };
};

// 修复后
const getZombieDetails = async (zombieId) => {
  const zombie = await contract.zombies(zombieId);
  const owner = await contract.ownerOf(zombieId); // 新增：获取所有者
  return {
    id: zombieId,
    name: zombie.name,
    // ... 其他字段
    owner: owner, // 新增：包含所有者信息
  };
};
```

2. **修复僵尸列表过滤**:

```javascript
// 在 Battle.js 中
.allZombies
  .filter(zombie => zombie.owner !== account) // 现在可以正确过滤
  .map((zombie) => (
    // 显示僵尸信息
  ))
```

**验证修复**:

1. **检查僵尸所有者信息**:

```javascript
// 在浏览器控制台中运行
const zombie = await contract.zombies(0); // 替换为实际的僵尸ID
const owner = await contract.ownerOf(0);
console.log("僵尸所有者:", owner);
console.log("当前账户:", account);
```

2. **使用测试脚本**:

```bash
node test-owner-check.js
```

3. **前端验证**:

- 打开战斗页面
- 检查目标僵尸列表是否显示所有者信息
- 确认自己的僵尸不会出现在目标列表中

**预期行为**: 修复后，系统应该：

- ✅ 正确显示僵尸的所有者信息
- ✅ 在目标选择中过滤掉用户自己的僵尸
- ✅ 允许攻击其他玩家的僵尸
- ✅ 阻止攻击自己的僵尸（这是正确的行为）

**如果问题仍然存在**: 如果修复后仍然遇到问题，请检查：

1. 是否刷新了页面以加载新的代码
2. 合约地址是否正确
3. 网络连接是否正常
4. 是否有多个僵尸属于同一地址

### 10. 攻击交易执行失败

**问题**: 攻击僵尸时出现 `transaction execution reverted` 错误

**错误信息**:

```
transaction execution reverted (action="sendTransaction", data=null, reason=null, invocation=null, revert=null, transaction={...}, receipt={...}, code=CALL_EXCEPTION)
```

**可能原因**:

1. **僵尸正在冷却中**: 僵尸需要等待冷却时间结束才能再次攻击
2. **僵尸不存在**: 目标僵尸 ID 无效或僵尸已被删除
3. **权限问题**: 您不是攻击者僵尸的所有者
4. **合约状态问题**: 合约内部状态异常

**解决方案**:

#### 1. 检查僵尸冷却状态

```javascript
// 在浏览器控制台中运行
debugAttackError();
```

#### 2. 检查特定僵尸的冷却时间

```javascript
// 替换为实际的僵尸ID
checkZombieCooldown(0);
```

#### 3. 等待冷却时间结束

- 僵尸的冷却时间是 1 天（24 小时）
- 可以在战斗页面查看僵尸的冷却状态
- 冷却期间僵尸无法进行任何操作

#### 4. 验证僵尸所有权

```javascript
// 检查僵尸所有者
const owner = await contract.ownerOf(zombieId);
console.log("僵尸所有者:", owner);
console.log("当前账户:", account);
```

#### 5. 检查僵尸是否存在

```javascript
// 检查僵尸详情
const zombie = await contract.zombies(zombieId);
if (zombie.name && zombie.name !== "") {
  console.log("僵尸存在:", zombie.name);
} else {
  console.log("僵尸不存在");
}
```

**预防措施**:

1. **合理安排攻击时间**: 避免频繁攻击导致僵尸长期冷却
2. **检查僵尸状态**: 攻击前确认僵尸已准备就绪
3. **验证目标**: 确保目标僵尸存在且属于其他玩家
4. **监控余额**: 确保有足够的 ETH 支付 gas 费用

**调试工具**:

使用 `debug-attack-error.js` 脚本进行详细诊断：

```javascript
// 全面诊断攻击失败原因
debugAttackError();

// 检查特定僵尸的冷却状态
checkZombieCooldown(zombieId);
```

**预期行为**:

- ✅ 僵尸准备就绪时可以正常攻击
- ✅ 攻击后僵尸进入冷却状态
- ✅ 冷却期间无法再次攻击
- ✅ 攻击成功会获得经验值和胜利计数

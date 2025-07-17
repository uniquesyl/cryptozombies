# 🧟 攻击功能修复总结

## 📋 问题概述

用户遇到的主要问题：

1. **"不能攻击自己的僵尸"错误**: 前端无法正确识别僵尸所有者
2. **攻击交易执行失败**: 僵尸冷却状态检查不完善
3. **用户体验不佳**: 缺乏冷却时间显示和状态提示

## ✅ 已完成的修复

### 1. 僵尸所有者信息获取修复

**问题**: `getZombieDetails` 函数没有获取僵尸的所有者信息

**修复**:

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
  const owner = await contract.ownerOf(zombieId); // 新增
  return {
    id: zombieId,
    name: zombie.name,
    // ... 其他字段
    owner: owner, // 新增
  };
};
```

### 2. 前端过滤逻辑修复

**问题**: 目标选择中无法正确过滤用户自己的僵尸

**修复**:

```javascript
// 在 Battle.js 中
.allZombies
  .filter(zombie => zombie.owner !== account) // 现在可以正确过滤
  .map((zombie) => (
    // 显示僵尸信息
  ))
```

### 3. 攻击前状态检查增强

**问题**: 攻击前没有充分检查僵尸状态

**修复**:

```javascript
// 在 attack 函数中添加了完整的检查
const attack = async (zombieId, targetId) => {
  // 1. 检查攻击者僵尸是否存在
  const attackerZombie = await contract.zombies(zombieId);
  if (!attackerZombie.name || attackerZombie.name === "") {
    setError("攻击者僵尸不存在");
    return false;
  }

  // 2. 检查攻击者僵尸的所有权
  const attackerOwner = await contract.ownerOf(zombieId);
  if (attackerOwner.toLowerCase() !== account.toLowerCase()) {
    setError("您不是攻击者僵尸的所有者");
    return false;
  }

  // 3. 检查攻击者僵尸是否准备就绪
  const now = Math.floor(Date.now() / 1000);
  const readyTime = parseInt(attackerZombie.readyTime);
  if (readyTime > now) {
    const cooldownRemaining = readyTime - now;
    const hours = Math.floor(cooldownRemaining / 3600);
    const minutes = Math.floor((cooldownRemaining % 3600) / 60);
    setError(`攻击者僵尸正在冷却中，剩余时间: ${hours}小时${minutes}分钟`);
    return false;
  }

  // 4. 检查目标僵尸是否存在
  const targetZombie = await contract.zombies(targetId);
  if (!targetZombie.name || targetZombie.name === "") {
    setError("目标僵尸不存在");
    return false;
  }

  // 5. 检查目标僵尸的所有权
  const targetOwner = await contract.ownerOf(targetId);
  if (targetOwner.toLowerCase() === account.toLowerCase()) {
    setError("不能攻击自己的僵尸");
    return false;
  }

  // 执行攻击...
};
```

### 4. 冷却时间显示组件

**新增**: 创建了 `CooldownTimer` 组件，实时显示僵尸冷却状态

```javascript
// CooldownTimer.js
const CooldownTimer = ({ readyTime, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const readyTimeNum = parseInt(readyTime);
      const remaining = Math.max(0, readyTimeNum - now);

      setTimeLeft(remaining);
      setIsReady(remaining <= 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [readyTime]);

  if (isReady) {
    return <div className="text-xs text-green-600">✅ 准备就绪</div>;
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-xs text-red-600">
      ⏰ 冷却中: {hours.toString().padStart(2, "0")}:
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
};
```

### 5. 战斗按钮状态管理

**改进**: 战斗按钮根据僵尸状态动态启用/禁用

```javascript
// 在 Battle.js 中
{
  (() => {
    const now = Math.floor(Date.now() / 1000);
    const readyTime = parseInt(selectedZombie.readyTime);
    const isReady = readyTime <= now;
    const isDisabled = battleLoading || contractLoading || !isReady;

    return (
      <button
        onClick={handleBattle}
        disabled={isDisabled}
        className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
          isDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-red-600 text-white hover:bg-red-700"
        }`}
      >
        {battleLoading || contractLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            战斗中...
          </div>
        ) : !isReady ? (
          <div className="flex items-center justify-center">
            <span>⏰ 等待冷却</span>
          </div>
        ) : (
          "开始战斗"
        )}
      </button>
    );
  })();
}
```

## 🛠️ 调试工具

### 1. 攻击失败诊断工具

- **文件**: `debug-attack-error.js`
- **功能**: 全面诊断攻击失败原因
- **使用**: `debugAttackError()`

### 2. 冷却状态检查工具

- **文件**: `debug-attack-error.js`
- **功能**: 检查特定僵尸的冷却状态
- **使用**: `checkZombieCooldown(zombieId)`

### 3. 综合测试工具

- **文件**: `test-all-fixes.js`
- **功能**: 测试所有修复的功能
- **使用**: `testAllFixes()`

## 📊 修复效果

### 修复前的问题

- ❌ 前端无法正确识别僵尸所有者
- ❌ 目标选择中包含用户自己的僵尸
- ❌ 攻击前缺乏状态检查
- ❌ 用户无法看到冷却时间
- ❌ 错误信息不够详细

### 修复后的改进

- ✅ 正确获取和显示僵尸所有者信息
- ✅ 目标选择中正确过滤用户自己的僵尸
- ✅ 攻击前进行完整的状态检查
- ✅ 实时显示僵尸冷却时间
- ✅ 提供详细的错误信息和状态提示
- ✅ 战斗按钮根据状态动态启用/禁用

## 🎯 使用指南

### 1. 正常攻击流程

1. 连接钱包到 Sepolia 网络
2. 进入战斗页面
3. 选择准备就绪的僵尸作为攻击者
4. 选择其他玩家的僵尸作为目标
5. 点击"开始战斗"按钮

### 2. 状态检查

- 攻击者僵尸必须属于当前用户
- 攻击者僵尸必须准备就绪（不在冷却中）
- 目标僵尸必须存在且属于其他玩家

### 3. 冷却时间

- 僵尸攻击后需要等待 1 天（24 小时）冷却
- 冷却期间僵尸无法进行任何操作
- 冷却时间会实时显示在界面上

## 🔧 故障排除

如果仍然遇到问题，请：

1. **刷新页面**: 确保加载了最新的代码
2. **检查网络**: 确保连接到 Sepolia 网络
3. **验证合约**: 确保合约地址正确
4. **使用调试工具**: 运行 `testAllFixes()` 进行诊断
5. **查看错误信息**: 注意具体的错误提示

## 📝 技术细节

### 合约函数调用

- `attack(uint _zombieId, uint _targetId)`: 执行攻击
- `ownerOf(uint256 _tokenId)`: 获取僵尸所有者
- `zombies(uint _zombieId)`: 获取僵尸详情
- `getZombiesByOwner(address _owner)`: 获取用户的所有僵尸

### 前端状态管理

- 使用 React hooks 管理状态
- 实时更新冷却时间显示
- 动态启用/禁用战斗按钮
- 提供详细的错误反馈

### 错误处理

- 合约调用前的预检查
- 详细的错误信息分类
- 用户友好的错误提示
- 调试工具的辅助诊断

## 🎉 总结

通过这次修复，攻击功能现在具备了：

1. **完整的状态检查**: 攻击前验证所有必要条件
2. **清晰的用户界面**: 实时显示僵尸状态和冷却时间
3. **详细的错误处理**: 提供具体的错误原因和解决方案
4. **强大的调试工具**: 帮助诊断和解决问题
5. **良好的用户体验**: 直观的状态提示和操作反馈

现在用户可以正常使用战斗功能，系统会正确识别僵尸归属，防止自相残杀，并提供清晰的冷却时间显示。

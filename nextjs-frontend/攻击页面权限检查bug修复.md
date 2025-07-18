# 攻击页面权限检查 Bug 修复总结

## 🐛 问题描述

在战斗页面中，用户选择自己的僵尸进行攻击时，系统错误地提示"只能使用自己的僵尸进行攻击"，这是一个权限检查的 bug。

## 🔍 问题分析

### 根本原因

1. **地址大小写问题**: 以太坊地址比较时没有忽略大小写
2. **权限检查逻辑**: 在`handleAttack`函数中，代码检查`selectedZombie.owner !== account`，但这是字符串直接比较
3. **调试信息不足**: 缺乏详细的调试信息来诊断权限检查失败的原因

### 问题代码位置

```typescript
// 原来的代码（有bug）
if (selectedZombie.owner !== account) {
  setError("只能使用自己的僵尸进行攻击");
  return;
}
```

## ✅ 修复方案

### 1. 修复地址比较逻辑

```typescript
// 修复后的代码
if (selectedZombie.owner.toLowerCase() !== account.toLowerCase()) {
  console.error("权限检查失败:", {
    selectedZombieOwner: selectedZombie.owner,
    account: account,
    selectedZombieId: selectedZombie.id,
  });
  setError("只能使用自己的僵尸进行攻击");
  return;
}
```

### 2. 添加详细调试信息

在加载僵尸时添加了详细的调试信息：

```typescript
console.log(
  "用户僵尸详情:",
  userZombies.map((z) => ({
    id: z.id,
    name: z.name,
    owner: z.owner,
    ownerLower: z.owner.toLowerCase(),
    accountLower: account.toLowerCase(),
    isOwner: z.owner.toLowerCase() === account.toLowerCase(),
  }))
);
```

## 🔧 技术细节

### 地址格式问题

- **MetaMask 地址**: 通常返回混合大小写的地址（checksum 地址）
- **合约返回地址**: 可能返回全小写或全大写的地址
- **解决方案**: 使用`.toLowerCase()`进行标准化比较

### 权限检查流程

1. `getZombiesByOwner(address)` - 获取用户拥有的僵尸 ID
2. `getZombieDetails(zombieId)` - 获取僵尸详细信息，包括所有者
3. `handleAttack()` - 攻击前进行权限验证

### 双重验证机制

- **第一层**: `getAllZombies(account)` 只返回用户拥有的僵尸
- **第二层**: `handleAttack()` 中的权限检查作为安全验证

## 🧪 测试验证

### 测试场景

1. **正常攻击**: 选择自己的僵尸攻击其他僵尸
2. **权限验证**: 确保只有僵尸所有者可以攻击
3. **地址格式**: 验证不同格式的地址都能正确比较

### 预期行为

- ✅ 用户可以选择自己的僵尸进行攻击
- ✅ 系统正确识别僵尸所有者
- ✅ 不再出现错误的权限提示
- ✅ 控制台显示详细的调试信息

## 📊 修复效果

### 修复前

- ❌ 用户无法使用自己的僵尸攻击
- ❌ 错误提示"只能使用自己的僵尸进行攻击"
- ❌ 缺乏调试信息，难以诊断问题

### 修复后

- ✅ 用户可以正常使用自己的僵尸攻击
- ✅ 权限检查正确工作
- ✅ 详细的调试信息帮助诊断问题
- ✅ 地址比较标准化，避免大小写问题

## 🎯 最佳实践

### 地址比较

```typescript
// 推荐：使用toLowerCase()进行标准化比较
if (address1.toLowerCase() !== address2.toLowerCase()) {
  // 处理不匹配情况
}

// 避免：直接字符串比较
if (address1 !== address2) {
  // 可能因为大小写问题导致错误
}
```

### 调试信息

```typescript
// 推荐：添加详细的调试信息
console.error("权限检查失败:", {
  expectedOwner: account,
  actualOwner: zombie.owner,
  zombieId: zombie.id,
  comparison: {
    expected: account.toLowerCase(),
    actual: zombie.owner.toLowerCase(),
    isMatch: account.toLowerCase() === zombie.owner.toLowerCase(),
  },
});
```

## 📝 总结

这次修复解决了攻击页面中的权限检查 bug，主要改进包括：

1. **标准化地址比较**: 使用`.toLowerCase()`确保地址比较的一致性
2. **增强调试信息**: 添加详细的日志帮助诊断问题
3. **保持安全验证**: 维持双重权限检查机制
4. **提升用户体验**: 消除错误的权限提示

修复后的系统能够正确识别僵尸所有者，用户可以正常进行攻击操作，同时保持了必要的安全验证机制。

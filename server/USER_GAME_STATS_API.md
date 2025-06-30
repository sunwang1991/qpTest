# 用户战绩统计API文档

## 🎯 功能概述

在用户登录和获取用户信息接口中，新增了用户战绩统计信息，包括总收入、胜率、总局数、胜利场次等数据。

## 📊 统计指标说明

### 核心指标
- **总收入 (totalIncome)**: 用户在所有游戏中获得的总金额
- **胜率 (winRate)**: 胜利场次占总局数的百分比
- **总局数 (totalGames)**: 用户参与的游戏房间总数
- **胜利场次 (winGames)**: 净收入为正的游戏场次

### 扩展指标
- **失败场次 (loseGames)**: 净收入为负或零的游戏场次
- **净收入 (netIncome)**: 总收入减去总支出
- **总支出 (totalExpense)**: 用户在所有游戏中支付的总金额

## 🔧 接口详情

### 1. 用户登录接口
**路径**: `POST /mini/user/login`

**请求参数**:
```json
{
  "code": "微信登录code"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    "id": 1,
    "openId": "wx_openid_123",
    "nickName": "张三",
    "avatar": "https://example.com/avatar.jpg",
    "sex": "1",
    "createTime": "2024-01-01T10:00:00.000Z",
    "gameStats": {
      "totalIncome": 1500,      // 总收入：1500元
      "winRate": 75.5,          // 胜率：75.5%
      "totalGames": 20,         // 总局数：20局
      "winGames": 15,           // 胜利场次：15场
      "loseGames": 5,           // 失败场次：5场
      "netIncome": 800,         // 净收入：800元
      "totalExpense": 700       // 总支出：700元
    }
  }
}
```

### 2. 用户信息接口
**路径**: `POST /mini/user/info`

**请求参数**:
```json
{
  "id": "1"
}
```

**响应格式**: 与登录接口相同，包含完整的用户信息和战绩统计。

## 📈 统计算法说明

### 1. 总局数计算
```typescript
// 基于用户参与的不同房间数量
const allTransactions = [...receiveTransactions, ...payTransactions];
const uniqueRooms = new Set(allTransactions.map(t => t.roomId));
const totalGames = uniqueRooms.size;
```

### 2. 胜利场次计算
```typescript
// 统计每个房间的净收支
const roomStats = new Map();
allTransactions.forEach(transaction => {
  const roomId = transaction.roomId;
  if (!roomStats.has(roomId)) {
    roomStats.set(roomId, { income: 0, expense: 0 });
  }
  
  if (transaction.receiveUserId === userId) {
    roomStats.get(roomId).income += transaction.payMoney;
  } else {
    roomStats.get(roomId).expense += transaction.payMoney;
  }
});

// 净收入为正的房间视为胜利
let winGames = 0;
roomStats.forEach(stat => {
  if (stat.income > stat.expense) {
    winGames++;
  }
});
```

### 3. 胜率计算
```typescript
const winRate = totalGames > 0 ? (winGames / totalGames * 100) : 0;
// 保留2位小数
const finalWinRate = Math.round(winRate * 100) / 100;
```

## 🎮 前端使用示例

### 微信小程序登录
```javascript
// 用户登录
async function userLogin(code) {
  try {
    const response = await wx.request({
      url: 'https://sunwang.top:6275/mini/user/login',
      method: 'POST',
      data: { code },
      header: { 'Content-Type': 'application/json' }
    });

    if (response.data.success) {
      const { gameStats } = response.data.data;
      
      // 显示用户战绩
      console.log('用户战绩统计:');
      console.log(`总收入: ${gameStats.totalIncome}元`);
      console.log(`胜率: ${gameStats.winRate}%`);
      console.log(`总局数: ${gameStats.totalGames}局`);
      console.log(`胜利: ${gameStats.winGames}场`);
      console.log(`失败: ${gameStats.loseGames}场`);
      
      // 存储用户信息
      wx.setStorageSync('userInfo', response.data.data);
      
      return response.data.data;
    }
  } catch (error) {
    console.error('登录失败:', error);
  }
}
```

### 战绩展示页面
```xml
<!-- 用户战绩展示 -->
<view class="stats-container">
  <view class="stats-header">
    <text class="title">我的战绩</text>
  </view>
  
  <view class="stats-grid">
    <view class="stat-item">
      <text class="stat-value">{{gameStats.totalIncome}}</text>
      <text class="stat-label">总收入(元)</text>
    </view>
    
    <view class="stat-item">
      <text class="stat-value">{{gameStats.winRate}}%</text>
      <text class="stat-label">胜率</text>
    </view>
    
    <view class="stat-item">
      <text class="stat-value">{{gameStats.totalGames}}</text>
      <text class="stat-label">总局数</text>
    </view>
    
    <view class="stat-item">
      <text class="stat-value">{{gameStats.winGames}}</text>
      <text class="stat-label">胜利场次</text>
    </view>
  </view>
  
  <!-- 详细统计 -->
  <view class="detailed-stats">
    <view class="detail-row">
      <text class="detail-label">净收入:</text>
      <text class="detail-value {{gameStats.netIncome >= 0 ? 'positive' : 'negative'}}">
        {{gameStats.netIncome >= 0 ? '+' : ''}}{{gameStats.netIncome}}元
      </text>
    </view>
    
    <view class="detail-row">
      <text class="detail-label">总支出:</text>
      <text class="detail-value">{{gameStats.totalExpense}}元</text>
    </view>
    
    <view class="detail-row">
      <text class="detail-label">失败场次:</text>
      <text class="detail-value">{{gameStats.loseGames}}场</text>
    </view>
  </view>
</view>
```

### 样式建议
```css
.stats-container {
  padding: 30rpx;
  background: #f8f9fa;
}

.stats-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.stat-item {
  background: white;
  padding: 30rpx;
  border-radius: 12rpx;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.stat-value {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #007aff;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.detailed-stats {
  background: white;
  border-radius: 12rpx;
  padding: 30rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 28rpx;
  color: #333;
}

.detail-value {
  font-size: 28rpx;
  font-weight: bold;
}

.positive {
  color: #34c759;
}

.negative {
  color: #ff3b30;
}
```

## 🔍 数据验证

### 测试用例
```javascript
// 验证战绩统计数据的一致性
function validateGameStats(gameStats) {
  const {
    totalIncome,
    totalExpense,
    netIncome,
    totalGames,
    winGames,
    loseGames,
    winRate
  } = gameStats;
  
  // 验证基本数学关系
  console.assert(netIncome === totalIncome - totalExpense, '净收入计算错误');
  console.assert(totalGames === winGames + loseGames, '总局数计算错误');
  console.assert(winRate === (totalGames > 0 ? (winGames / totalGames * 100) : 0), '胜率计算错误');
  
  // 验证数据合理性
  console.assert(totalIncome >= 0, '总收入不能为负');
  console.assert(totalExpense >= 0, '总支出不能为负');
  console.assert(totalGames >= 0, '总局数不能为负');
  console.assert(winGames >= 0, '胜利场次不能为负');
  console.assert(winRate >= 0 && winRate <= 100, '胜率应在0-100之间');
  
  console.log('✅ 战绩统计数据验证通过');
}
```

## 📝 注意事项

1. **性能考虑**: 战绩统计涉及多表查询，建议在用户量大时考虑缓存策略
2. **数据一致性**: 统计数据基于交易记录，确保交易数据的准确性
3. **胜负判定**: 当前以净收入为正作为胜利标准，可根据业务需求调整
4. **精度处理**: 金额计算使用浮点数，注意精度问题

## 🚀 扩展功能建议

1. **时间范围统计**: 支持查询特定时间段的战绩
2. **排行榜功能**: 基于战绩数据生成用户排行榜
3. **成就系统**: 根据战绩数据解锁成就徽章
4. **数据导出**: 支持导出个人战绩报告

现在用户登录和获取信息时都会包含完整的战绩统计信息，方便前端展示用户的游戏表现！

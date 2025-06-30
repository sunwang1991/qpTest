const axios = require('axios');

// 测试配置
const config = {
  baseURL: 'https://sunwang.top:6275',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

const api = axios.create(config);

// 测试数据
const testData = {
  userId: '1', // 请根据实际情况修改用户ID
  code: 'test_code_123' // 测试用的微信登录code
};

async function testUserGameStats() {
  console.log('🧪 测试用户战绩统计功能\n');
  console.log('=' .repeat(50));

  try {
    // 1. 测试用户信息接口（包含战绩统计）
    console.log('1️⃣ 测试用户信息接口...');
    const infoResponse = await api.post('/mini/user/info', {
      id: testData.userId
    });

    if (infoResponse.data.success) {
      const userInfo = infoResponse.data.data;
      console.log('✅ 用户信息获取成功');
      console.log('用户基本信息:');
      console.log(`  ID: ${userInfo.id}`);
      console.log(`  昵称: ${userInfo.nickName || '未设置'}`);
      console.log(`  性别: ${userInfo.sex}`);
      
      if (userInfo.gameStats) {
        console.log('\n📊 战绩统计:');
        console.log(`  总收入: ${userInfo.gameStats.totalIncome}元`);
        console.log(`  胜率: ${userInfo.gameStats.winRate}%`);
        console.log(`  总局数: ${userInfo.gameStats.totalGames}局`);
        console.log(`  胜利场次: ${userInfo.gameStats.winGames}场`);
        console.log(`  失败场次: ${userInfo.gameStats.loseGames}场`);
        console.log(`  净收入: ${userInfo.gameStats.netIncome}元`);
        console.log(`  总支出: ${userInfo.gameStats.totalExpense}元`);
        
        // 验证数据一致性
        validateGameStats(userInfo.gameStats);
      } else {
        console.log('⚠️ 未找到战绩统计数据');
      }
    } else {
      console.log('❌ 获取用户信息失败:', infoResponse.data.message);
    }
    console.log('');

    // 2. 测试用户登录接口（包含战绩统计）
    console.log('2️⃣ 测试用户登录接口...');
    try {
      const loginResponse = await api.post('/mini/user/login', {
        code: testData.code
      });

      if (loginResponse.data.success) {
        const userInfo = loginResponse.data.data;
        console.log('✅ 用户登录成功');
        console.log('登录返回信息:');
        console.log(`  用户ID: ${userInfo.id}`);
        console.log(`  OpenID: ${userInfo.openId || '未设置'}`);
        
        if (userInfo.gameStats) {
          console.log('\n📊 登录时的战绩统计:');
          console.log(`  总收入: ${userInfo.gameStats.totalIncome}元`);
          console.log(`  胜率: ${userInfo.gameStats.winRate}%`);
          console.log(`  总局数: ${userInfo.gameStats.totalGames}局`);
          console.log(`  胜利场次: ${userInfo.gameStats.winGames}场`);
          
          // 验证数据一致性
          validateGameStats(userInfo.gameStats);
        } else {
          console.log('⚠️ 登录响应中未找到战绩统计数据');
        }
      } else {
        console.log('❌ 用户登录失败:', loginResponse.data.message);
      }
    } catch (loginError) {
      console.log('⚠️ 登录测试跳过（可能需要有效的微信code）:', loginError.response?.data?.message || loginError.message);
    }
    console.log('');

    // 3. 测试错误情况
    console.log('3️⃣ 测试错误情况...');
    
    // 测试无效用户ID
    try {
      const invalidResponse = await api.post('/mini/user/info', {
        id: '99999'
      });
      console.log('无效用户ID测试:', invalidResponse.data.success ? '❌ 应该失败' : '✅ 正确返回错误');
    } catch (error) {
      console.log('✅ 无效用户ID正确处理:', error.response?.data?.message || error.message);
    }

    // 测试缺少参数
    try {
      await api.post('/mini/user/info', {});
    } catch (error) {
      console.log('✅ 缺少参数正确处理:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎉 用户战绩统计测试完成!');
}

// 验证战绩统计数据的一致性
function validateGameStats(gameStats) {
  console.log('\n🔍 验证数据一致性...');
  
  const {
    totalIncome,
    totalExpense,
    netIncome,
    totalGames,
    winGames,
    loseGames,
    winRate
  } = gameStats;
  
  const issues = [];
  
  // 验证基本数学关系
  if (Math.abs(netIncome - (totalIncome - totalExpense)) > 0.01) {
    issues.push('净收入计算错误');
  }
  
  if (totalGames !== winGames + loseGames) {
    issues.push('总局数计算错误');
  }
  
  const expectedWinRate = totalGames > 0 ? Math.round((winGames / totalGames * 100) * 100) / 100 : 0;
  if (Math.abs(winRate - expectedWinRate) > 0.01) {
    issues.push('胜率计算错误');
  }
  
  // 验证数据合理性
  if (totalIncome < 0) issues.push('总收入不能为负');
  if (totalExpense < 0) issues.push('总支出不能为负');
  if (totalGames < 0) issues.push('总局数不能为负');
  if (winGames < 0) issues.push('胜利场次不能为负');
  if (loseGames < 0) issues.push('失败场次不能为负');
  if (winRate < 0 || winRate > 100) issues.push('胜率应在0-100之间');
  
  if (issues.length === 0) {
    console.log('✅ 数据一致性验证通过');
  } else {
    console.log('❌ 数据一致性验证失败:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
  
  return issues.length === 0;
}

// 生成战绩报告
function generateStatsReport(gameStats) {
  console.log('\n📋 战绩报告:');
  console.log('┌─────────────────────────────────────┐');
  console.log('│              用户战绩统计              │');
  console.log('├─────────────────────────────────────┤');
  console.log(`│ 总收入:     ${gameStats.totalIncome.toString().padStart(10)} 元 │`);
  console.log(`│ 总支出:     ${gameStats.totalExpense.toString().padStart(10)} 元 │`);
  console.log(`│ 净收入:     ${gameStats.netIncome.toString().padStart(10)} 元 │`);
  console.log('├─────────────────────────────────────┤');
  console.log(`│ 总局数:     ${gameStats.totalGames.toString().padStart(10)} 局 │`);
  console.log(`│ 胜利场次:   ${gameStats.winGames.toString().padStart(10)} 场 │`);
  console.log(`│ 失败场次:   ${gameStats.loseGames.toString().padStart(10)} 场 │`);
  console.log(`│ 胜率:       ${gameStats.winRate.toString().padStart(9)}% │`);
  console.log('└─────────────────────────────────────┘');
  
  // 生成评价
  let evaluation = '';
  if (gameStats.winRate >= 80) {
    evaluation = '🏆 战绩优秀！';
  } else if (gameStats.winRate >= 60) {
    evaluation = '👍 表现良好！';
  } else if (gameStats.winRate >= 40) {
    evaluation = '📈 还有进步空间';
  } else {
    evaluation = '💪 继续努力！';
  }
  
  console.log(`\n${evaluation}`);
  
  if (gameStats.netIncome > 0) {
    console.log(`💰 总体盈利 ${gameStats.netIncome} 元`);
  } else if (gameStats.netIncome < 0) {
    console.log(`📉 总体亏损 ${Math.abs(gameStats.netIncome)} 元`);
  } else {
    console.log(`⚖️ 收支平衡`);
  }
}

// 性能测试
async function testPerformance() {
  console.log('\n⏱️ 性能测试...');
  
  const startTime = Date.now();
  try {
    await api.post('/mini/user/info', {
      id: testData.userId
    });
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ 接口响应时间: ${duration}ms`);
    
    if (duration < 500) {
      console.log('🚀 响应速度: 优秀');
    } else if (duration < 1000) {
      console.log('👍 响应速度: 良好');
    } else {
      console.log('⚠️ 响应速度: 需要优化');
    }
  } catch (error) {
    console.log('❌ 性能测试失败:', error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  await testUserGameStats();
  await testPerformance();
  
  console.log('\n💡 使用提示:');
  console.log('- 确保数据库中有交易记录数据');
  console.log('- 修改 testData.userId 为实际存在的用户ID');
  console.log('- 登录测试需要有效的微信code');
  console.log('- 可以通过创建交易记录来测试统计功能');
}

// 如果直接运行此文件
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testUserGameStats,
  validateGameStats,
  generateStatsReport,
  testPerformance,
  runAllTests
};

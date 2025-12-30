// 测试数据库连接
import { executeQuery } from './src/services/dbConnection.js';

// 测试函数
async function testDatabaseConnection() {
  try {
    console.log('开始测试数据库连接...');
    
    // 测试简单查询
    const result = await executeQuery('SELECT 1 + 1 AS result');
    console.log('✓ 数据库连接成功！简单查询结果:', result);
    
    // 测试获取地域数据
    console.log('\n开始测试获取地域数据...');
    const regions = await executeQuery('SELECT * FROM region LIMIT 5');
    console.log('✓ 获取地域数据成功！地域数量:', regions.length);
    if (regions.length > 0) {
      console.log('第一个地域:', regions[0]);
    }
    
    // 测试获取专题数据
    console.log('\n开始测试获取专题数据...');
    const topics = await executeQuery('SELECT * FROM topic LIMIT 5');
    console.log('✓ 获取专题数据成功！专题数量:', topics.length);
    if (topics.length > 0) {
      console.log('第一个专题:', topics[0]);
    }
    
    // 测试获取用户数据
    console.log('\n开始测试获取用户数据...');
    const users = await executeQuery('SELECT * FROM user LIMIT 5');
    console.log('✓ 获取用户数据成功！用户数量:', users.length);
    if (users.length > 0) {
      console.log('第一个用户:', users[0]);
    }
    
    console.log('\n🎉 所有数据库测试通过！');
  } catch (error) {
    console.error('❌ 数据库测试失败:', error);
  }
}

// 运行测试
testDatabaseConnection();

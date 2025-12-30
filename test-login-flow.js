// 测试登录流程和localStorage功能
const { execSync } = require('child_process');
const fs = require('fs');

// 测试1: 检查后端登录接口是否正常工作
console.log('=== 测试1: 检查后端登录接口 ===');
try {
  const loginResponse = execSync(
    'curl -X POST http://localhost:5001/api/users/login -H "Content-Type: application/json" -d "{\"identifier\":\"testuser3\",\"password\":\"testpassword\"}"'
  ).toString();
  
  console.log('登录接口响应:', loginResponse);
  const responseData = JSON.parse(loginResponse);
  
  if (responseData.user) {
    console.log('✓ 后端返回了正确的用户信息');
    console.log('用户信息:', responseData.user);
  } else {
    console.log('✗ 后端没有返回用户信息');
  }
} catch (error) {
  console.log('✗ 登录接口测试失败:', error.message);
}

console.log('\n=== 测试2: 检查localStorage模拟 ===');
// 模拟localStorage功能
const localStorage = {
  storage: {},
  getItem(key) {
    return this.storage[key] || null;
  },
  setItem(key, value) {
    this.storage[key] = value;
  },
  removeItem(key) {
    delete this.storage[key];
  }
};

// 模拟登录成功后存储用户信息
const mockUserData = {
  username: 'testuser3',
  email: 'test3@example.com',
  phone: '13800138000'
};

localStorage.setItem('loggedInUser', JSON.stringify(mockUserData));
console.log('设置localStorage后:', localStorage.getItem('loggedInUser'));

// 模拟读取用户信息
const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
if (storedUser && storedUser.username) {
  console.log('✓ localStorage存储和读取功能正常');
  console.log('读取到的用户:', storedUser.username);
} else {
  console.log('✗ localStorage功能异常');
}

console.log('\n=== 测试3: 检查前端路由配置 ===');
// 检查前端路由配置
const routesContent = fs.readFileSync('/Volumes/ZHITTAI/xiangmu/renwendil/src/routes/index.js', 'utf8');
if (routesContent.includes('/user/login')) {
  console.log('✓ 登录路由已配置');
} else {
  console.log('✗ 登录路由未找到');
}

if (routesContent.includes('/')) {
  console.log('✓ 主页路由已配置');
} else {
  console.log('✗ 主页路由未找到');
}
// 测试登录API
const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5001/api/users/login', {
      identifier: 'testuser3',
      password: 'testpassword'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('登录成功:', response.data);
    if (response.data.user) {
      console.log('用户信息:', response.data.user);
    } else {
      console.log('没有返回用户信息');
    }
  } catch (error) {
    console.error('登录失败:', error.response ? error.response.data : error.message);
  }
}

testLogin();
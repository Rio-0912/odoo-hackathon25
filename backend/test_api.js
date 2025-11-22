const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
  try {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Testing Registration with ${email}...`);
    const regRes = await axios.post(`${API_URL}/register`, {
      name: 'Test User',
      email,
      password,
      role: 'Manager'
    });
    console.log('Registration Success:', regRes.data);

    console.log('Testing Login...');
    const loginRes = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    console.log('Login Success:', loginRes.data);

  } catch (err) {
    console.error('Test Failed:', err.response ? err.response.data : err.message);
  }
}

testAuth();

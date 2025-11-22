const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with admin@example.com / password123...');
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@example.com',
      password: 'password123'
    });
    console.log('✓ Login Success:', res.data);
  } catch (err) {
    console.error('✗ Login Failed:');
    console.error('  Status:', err.response?.status);
    console.error('  Message:', err.response?.data);
  }
}

testLogin();

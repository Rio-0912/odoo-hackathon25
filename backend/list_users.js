const User = require('./models/User');
const db = require('./config/database');

async function listUsers() {
  try {
    await db.authenticate();
    console.log('DB Connected.');
    
    const users = await User.findAll();
    console.log('--- USERS IN DB ---');
    users.forEach(u => {
      console.log(`ID: ${u.id} | Name: ${u.name} | Email: ${u.email} | Role: ${u.role}`);
    });
    console.log('-------------------');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(); // Exit script
  }
}

listUsers();

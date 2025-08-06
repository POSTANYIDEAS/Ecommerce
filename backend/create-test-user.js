const db = require('./db');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    const email = 'test@test.com';
    const password = 'test123';
    const name = 'Test User';
    const number = '1234567890';

    console.log('Creating test user...');
    
    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Test user already exists!');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('You can use these credentials to login.');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      'INSERT INTO users (name, email, number, password) VALUES (?, ?, ?, ?)',
      [name, email, number, hashedPassword]
    );

    console.log('✅ Test user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Phone:', number);
    console.log('You can now login at http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser();

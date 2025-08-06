const db = require('./db');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const email = 'admin@admin.com';
    const password = 'admin123';

    console.log('Creating admin user...');

    // Check if admin already exists
    const [existing] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Admin user already exists!');
      console.log('Email:', email);
      console.log('You can use these credentials to login.');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin (only email and password columns exist)
    await db.query(
      'INSERT INTO admins (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('You can now login at http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();

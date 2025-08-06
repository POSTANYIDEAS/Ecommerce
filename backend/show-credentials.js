const db = require('./db');

async function showCredentials() {
  try {
    console.log('='.repeat(50));
    console.log('🔐 AVAILABLE LOGIN CREDENTIALS');
    console.log('='.repeat(50));
    
    // Show admin credentials
    console.log('\n👨‍💼 ADMIN LOGIN (http://localhost:3000/admin/login):');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    
    // Show user credentials
    console.log('\n👤 USER LOGIN (http://localhost:3000/login):');
    
    const [users] = await db.query('SELECT name, email, number FROM users WHERE email LIKE "%test%" ORDER BY id');
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.number}`);
        console.log(`   Password: test123`);
      });
    } else {
      console.log('No test users found. Run "node create-test-user.js" to create one.');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('💡 You can login with either email or phone number');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

showCredentials();

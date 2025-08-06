const db = require('./db');

async function createProductDetailsTable() {
  try {
    console.log('Checking product_details table...');
    
    // Check if table exists
    try {
      const [results] = await db.query('DESCRIBE product_details');
      console.log('✅ Product details table exists:');
      console.table(results);
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.log('❌ Table does not exist. Creating...');
        
        // Create the table
        await db.query(`
          CREATE TABLE product_details (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            description TEXT,
            advantages TEXT,
            disadvantages TEXT,
            images TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
          )
        `);
        
        console.log('✅ Product details table created successfully!');
        
        // Verify table creation
        const [results] = await db.query('DESCRIBE product_details');
        console.log('Table structure:');
        console.table(results);
      } else {
        throw error;
      }
    }
    
    // Test the API endpoint
    console.log('\n🧪 Testing API endpoint...');
    const [testResults] = await db.query('SELECT COUNT(*) as count FROM product_details');
    console.log(`✅ Product details count: ${testResults[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

createProductDetailsTable();

const db = require('./db');

async function updateDatabase() {
  try {
    console.log('Updating database schema...');
    
    // Add stock quantity to products table
    try {
      await db.query('ALTER TABLE products ADD COLUMN stock_quantity INT DEFAULT 100');
      console.log('✅ Added stock_quantity to products table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ stock_quantity column already exists');
      } else {
        console.log('❌ Error adding stock_quantity:', err.message);
      }
    }
    
    // Add payment status to orders table
    try {
      await db.query('ALTER TABLE orders ADD COLUMN payment_status VARCHAR(20) DEFAULT "Pending"');
      console.log('✅ Added payment_status to orders table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ payment_status column already exists');
      } else {
        console.log('❌ Error adding payment_status:', err.message);
      }
    }
    
    // Add payment method to orders table
    try {
      await db.query('ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT "Cash on Delivery"');
      console.log('✅ Added payment_method to orders table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ payment_method column already exists');
      } else {
        console.log('❌ Error adding payment_method:', err.message);
      }
    }
    
    // Add bill number to orders table
    try {
      await db.query('ALTER TABLE orders ADD COLUMN bill_number VARCHAR(50)');
      console.log('✅ Added bill_number to orders table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ bill_number column already exists');
      } else {
        console.log('❌ Error adding bill_number:', err.message);
      }
    }
    
    // Update existing products with stock quantity if they don't have it
    await db.query('UPDATE products SET stock_quantity = 100 WHERE stock_quantity IS NULL');
    console.log('✅ Updated existing products with default stock quantity');
    
    console.log('\n🎉 Database update completed successfully!');
    
  } catch (error) {
    console.error('❌ Database update failed:', error);
  } finally {
    process.exit(0);
  }
}

updateDatabase();

const db = require('./db');

async function createCategoriesTable() {
  try {
    console.log('Creating categories system...');
    
    // Create categories table
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          image VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Categories table created successfully!');
    } catch (error) {
      console.log('❌ Error creating categories table:', error.message);
    }

    // Add category_id to products table
    try {
      await db.query('ALTER TABLE products ADD COLUMN category_id INT');
      console.log('✅ Added category_id to products table');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️ category_id column already exists in products table');
      } else {
        console.log('❌ Error adding category_id:', err.message);
      }
    }

    // Add foreign key constraint
    try {
      await db.query(`
        ALTER TABLE products 
        ADD CONSTRAINT fk_product_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) 
        ON DELETE SET NULL
      `);
      console.log('✅ Added foreign key constraint');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️ Foreign key constraint already exists');
      } else {
        console.log('❌ Error adding foreign key:', err.message);
      }
    }

    // Insert default categories
    const defaultCategories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets', image: null },
      { name: 'Clothing', description: 'Fashion and apparel', image: null },
      { name: 'Home & Garden', description: 'Home improvement and garden supplies', image: null },
      { name: 'Books', description: 'Books and educational materials', image: null },
      { name: 'Sports', description: 'Sports equipment and accessories', image: null }
    ];

    for (const category of defaultCategories) {
      try {
        await db.query(
          'INSERT IGNORE INTO categories (name, description, image) VALUES (?, ?, ?)',
          [category.name, category.description, category.image]
        );
        console.log(`✅ Added category: ${category.name}`);
      } catch (err) {
        console.log(`❌ Error adding category ${category.name}:`, err.message);
      }
    }

    // Verify table creation
    const [results] = await db.query('DESCRIBE categories');
    console.log('\n📋 Categories table structure:');
    console.table(results);

    // Show current categories
    const [categories] = await db.query('SELECT * FROM categories');
    console.log('\n📂 Current categories:');
    console.table(categories);

    console.log('\n🎉 Categories system setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up categories system:', error.message);
  } finally {
    process.exit(0);
  }
}

createCategoriesTable();

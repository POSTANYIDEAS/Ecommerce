const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// ✅ Root route for health check
app.get('/', (req, res) => {
  res.send('✅ Backend is running successfully on Render!');
});

// ✅ Auth Routes (register, login)
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// ✅ User Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// ✅ Admin Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// ✅ Products
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
app.use('/uploads', express.static('uploads'));

// ✅ Categories
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);

// ✅ Reports
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

// ✅ Product Details
const productDetailsRoutes = require('./routes/productDetailsRoutes');
app.use('/api/product-details', productDetailsRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

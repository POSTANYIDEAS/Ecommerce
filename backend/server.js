const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
//products
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
app.use('/uploads', express.static('uploads'));

//Product Details
const productDetailsRoutes = require('./routes/productDetailsRoutes');
app.use('/api/product-details', productDetailsRoutes);




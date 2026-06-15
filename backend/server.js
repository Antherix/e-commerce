const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ── Routes ────────────────────────────────────────────────────
const userRoutes     = require('./routes/userRoutes');
const productRoutes  = require('./routes/productRoutes');
const cartRoutes     = require('./routes/cartRoutes');
const orderRoutes    = require('./routes/orderRoutes');
const ratingRoutes   = require('./routes/ratingRoutes');
const addressRoutes  = require('./routes/addressRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const adminRoutes    = require('./routes/adminRoutes');

app.use('/e-commerce/users',     userRoutes);
app.use('/e-commerce/products',  productRoutes);
app.use('/e-commerce/cart',      cartRoutes);
app.use('/e-commerce/orders',    orderRoutes);
app.use('/e-commerce/ratings',   ratingRoutes);
app.use('/e-commerce/addresses', addressRoutes);
app.use('/e-commerce/wishlist',  wishlistRoutes);
app.use('/e-commerce/admin',     adminRoutes);

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ message: `${field} already exists` });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal server error' });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
// 
// {
//     "name":"Admin",
//     "email":"admin@gmail.com",
//     "phone":"1234567890",
//     "password":"123456",
//     "role":"admin"
// }
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const connectDB = require('./config/db');
connectDB();

app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/e-commerce/admin', adminRoutes);
app.use('/e-commerce/users', userRoutes);

app.use('/e-commerce/products', productRoutes);

app.use('/e-commerce/cart', cartRoutes);

app.use('/e-commerce/orders', orderRoutes);

app.use('/e-commerce/ratings', ratingRoutes);




// 404 handler — for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler — catches any error passed via next(error)
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ message: `${field} already exists` });
    }
    
    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(err.statusCode || 500).json({ 
        message: err.message || 'Internal server error' 
    });
});

app.listen(process.env.PORT,() =>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

// 
// {
//     "name":"Admin",
//     "email":"admin@gmail.com",
//     "phone":"1234567890",
//     "password":"123456",
//     "role":"admin"
// }
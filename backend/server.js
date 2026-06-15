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

app.use('/e-commerce/users', userRoutes);

app.use('/e-commerce/products', productRoutes);

app.use('/e-commerce/cart', cartRoutes);

app.use('/e-commerce/orders', orderRoutes);

app.use('/e-commerce/ratings', ratingRoutes);

app.listen(process.env.PORT,() =>{
    console.log(`Server is running on port ${process.env.PORT}`);
})


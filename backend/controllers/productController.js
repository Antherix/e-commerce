let PRODUCTMODEL = require('../models/productModel');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, discountPrice, stock, brand, images, category } = req.body;
        const newProduct = new PRODUCTMODEL({ title, description, price, discountPrice, stock, brand, images, category });

        await newProduct.save();

        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await PRODUCTMODEL.find().populate('category');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

//  Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await PRODUCTMODEL.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Update a product by ID
exports.updateProductById = async (req, res) => {
    try {
        const updatedProduct = await PRODUCTMODEL.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category');
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await PRODUCTMODEL.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};  

// Activate a product by ID
exports.activateProductById = async (req, res) => {
    try {
        const activatedProduct = await PRODUCTMODEL.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true }).populate('category');
        if (!activatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product activated successfully', product: activatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error activating product', error: error.message });
    }
};

// Deactivate a product by ID
exports.deactivateProductById = async (req, res) => {
    try {
        const deactivatedProduct = await PRODUCTMODEL.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true }).populate('category');
        if (!deactivatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deactivated successfully', product: deactivatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating product', error: error.message });
    }
};  


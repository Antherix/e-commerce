const CATEGORYMODEL = require('../models/categoryModel');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new CATEGORYMODEL({ name, description });

        await newCategory.save();

        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await CATEGORYMODEL.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await CATEGORYMODEL.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

// Update a category by ID
exports.updateCategoryById = async (req, res) => {
    try {
        const updatedCategory = await CATEGORYMODEL.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

// Delete a category by ID
exports.deleteCategoryById  = async (req, res) => {
    try {
        const deletedCategory = await CATEGORYMODEL.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};

// Activate a category by ID        

exports.activateCategoryById = async (req, res) => {
    try {
        const updatedCategory = await CATEGORYMODEL.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category activated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error activating category', error: error.message });
    }
};

// Deactivate a category by ID
exports.deactivateCategoryById = async (req, res) => {
    try {
        const updatedCategory = await CATEGORYMODEL.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });    
        if( !updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deactivated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating category', error: error.message });
    }   
};

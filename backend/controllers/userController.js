const bcrypt = require('bcrypt');
const USERMODEL = require('../models/userModel');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        const existingUser = await USERMODEL.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await USERMODEL.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'user'
        });

        res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await USERMODEL.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid Credentials'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid Credentials'
            });
        }

        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await USERMODEL.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await USERMODEL.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const { password, role, ...safeFields } = req.body;

        const updatedUser = await USERMODEL.findByIdAndUpdate(
            req.params.id,
            safeFields,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Separate route for password change
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await USERMODEL.findById(req.user.id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user by ID
exports.deleteUserById = async (req, res) => {
    try {
        const deletedUser = await USERMODEL.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// Activate a user by ID
exports.activateUserById = async (req, res) => {
    try {
        const activatedUser = await USERMODEL.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        if (!activatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User activated successfully', user: activatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error activating user', error: error.message });
    }
};

// Deactivate a user by ID
exports.deactivateUserById = async (req, res) => {
    try {
        const deactivatedUser = await USERMODEL.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
        if (!deactivatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deactivated successfully', user: deactivatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating user', error: error.message });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const user = await USERMODEL.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { password, role, ...safeFields } = req.body;

    const user = await USERMODEL.findByIdAndUpdate(
        req.user.id,
        safeFields,
        { new: true }
    ).select('-password');

    res.json(user);
}catch (error) {    res.status(500).json({ message: error.message });
}
};



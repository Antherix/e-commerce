const ADDRESSMODEL = require('../models/addressModel');

// Create address for the logged-in user
exports.createAddress = async (req, res) => {
    try {
        const { fullName, phone, addressLine1, addressLine2, city, state, country, pincode } = req.body;

        const newAddress = new ADDRESSMODEL({
            user: req.user.id,   // always taken from token, not body
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            country: country || 'India',
            pincode
        });

        await newAddress.save();
        res.status(201).json({ message: 'Address created successfully', address: newAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error creating address', error: error.message });
    }
};

// Get all addresses of the logged-in user
exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await ADDRESSMODEL.find({ user: req.user.id });
        res.status(200).json({ addresses });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

// Get single address by id (only if it belongs to the user)
exports.getAddressById = async (req, res) => {
    try {
        const address = await ADDRESSMODEL.findOne({ _id: req.params.id, user: req.user.id });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ address });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
};

// Update address (only if it belongs to the user)
exports.updateAddressById = async (req, res) => {
    try {
        const updatedAddress = await ADDRESSMODEL.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
};

// Delete address (only if it belongs to the user)
exports.deleteAddressById = async (req, res) => {
    try {
        const deletedAddress = await ADDRESSMODEL.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};
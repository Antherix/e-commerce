let ADDRESSMODEL = require('../models/addressModel');

// Create a new address
exports.createAddress = async (req, res) => {
    try {
        const { user, fullName, phone, addressLine1, addressLine2, city, state, country, pincode } = req.body;
        const newAddress = new ADDRESSMODEL({ user, fullName, phone, addressLine1, addressLine2, city, state, country, pincode });

        await newAddress.save();

        res.status(201).json({ message: 'Address created successfully', address: newAddress });
    }
    catch(error){
        res.status(500).json({ message: 'Error creating address', error: error.message }); 

    }
};
//Get all adresses

exports.getAllAddresses = async (req,res) => {
    try{
        const addresses = await ADDRESSMODEL.find().populate('user','name email');
        res.status(200).json({ addresses });
    }
    catch(error){
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

//Get address by id
exports.getAddressById = async (req,res) => {
    try{
        const address = await ADDRESSMODEL.findById(req.params.id).populate('user','name email');
        if(!address){
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ address });
    }
    catch(error){
        res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
};

//Update address by id
exports.updateAddressById = async (req,res) => {
    try{
        const updatedAddress = await ADDRESSMODEL.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user','name email');
        if(!updatedAddress){
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
    }
    catch(error){
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
};


//delete address by id
exports.deleteAddressById = async (req,res) => {
    try{
        const deletedAddress = await ADDRESSMODEL.findByIdAndDelete(req.params.id);
        if(!deletedAddress){
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address deleted successfully' });
    }
    catch(error){
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};



const USERMODEL = require('../models/userModel');

module.exports = async (req, res, next) => {
    try {
        const user = await USERMODEL.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: admins only' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
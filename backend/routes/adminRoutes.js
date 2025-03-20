const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Model
const Admin = require('../models/Admin');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ token, role: admin.role });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Protected route example
router.get('/dashboard', async (req, res) => {
    try {
        const stats = {
            totalBookings: await Booking.countDocuments(),
            totalUsers: await User.countDocuments(),
            recentBookings: await Booking.find().sort({ createdAt: -1 }).limit(5)
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
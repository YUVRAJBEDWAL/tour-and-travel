import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check against environment variables for demo
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { email, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Protected admin dashboard route
router.get('/dashboard', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: {
            bookings: [],  // Add your booking data here
            users: [],     // Add your user data here
            revenue: 0     // Add your revenue calculation here
        }
    });
});

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

export default router;
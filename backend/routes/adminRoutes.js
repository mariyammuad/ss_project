const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../controllers/authController'); // Import the verifyAdmin function

// Admin Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Use the verifyAdmin function to check credentials
    const adminCheck = await verifyAdmin(email, password);
    if (adminCheck?.isValid) {
        return res.status(200).json({ message: 'Admin login successful', token: adminCheck.token });
    }
    return res.status(400).json({ message: adminCheck.message || 'Invalid admin credentials' });
});

module.exports = router;

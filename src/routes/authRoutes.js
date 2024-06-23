import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Route to check if a username is unique
router.post('/api/check-username', async (req, res) => {
    const { username } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        res.json({ isUnique: !existingUser });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).send('Server error');
    }
});

export default router;

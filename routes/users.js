const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

// קבלת פרטי משתמש
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id.trim(); // להסיר רווחים לפני ואחרי ה-ID

        // חיפוש המשתמש לפי id
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // חישוב סך העלויות של המשתמש
        const totalCosts = await Cost.aggregate([
            {
                $match: { userid: userId } // חיפוש לפי userid
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$sum' }
                }
            }
        ]);

        const total = totalCosts.length > 0 ? totalCosts[0].total : 0;

        // החזרת הנתונים
        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });

    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ error: 'An error occurred while fetching the user details' });
    }
});

module.exports = router;

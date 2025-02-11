const express = require('express');
const router = express.Router();

// פרטי הצוות
router.get('/about', (req, res) => {
    res.json([
        {
            id: 322516857,
            firstname: 'Yarin',
            lastname: 'Zaroog',
            birthday: '15-05-2000',
            marital_status: 'single',
        },
        {
            id: 322622879,
            firstname: 'Gal',
            lastname: 'Mizrachi',
            birthday: '17-09-2000',
            marital_status: 'single',
        },
    ]);
});

module.exports = router;

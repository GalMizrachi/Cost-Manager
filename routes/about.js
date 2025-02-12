const express = require('express'); // Import the Express framework
const router = express.Router(); // Create an Express router instance

// Route: Get team member details
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

// Export the router to make it available for use in other parts of the application
module.exports = router;

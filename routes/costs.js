const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');
//const User = require('../models/user');

router.post('/add', async (req, res) => {
    try {
        const { userid, sum, category, description } = req.body;
        if (!userid) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing 'userid' field."
            });
        }

        // בדיקה אם המשתמש קיים במערכת

        // בדיקה אם חסרים שדות חיוניים
        if (!sum || !category || !description) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing required fields: 'sum', 'category', or 'description'."
            });
        }

        // יצירת ושמירת ההוצאה החדשה
        const cost = new Cost({ userid, sum, category, description });
        const savedCost = await cost.save();

        // החזרת תשובת 200 עם הנתונים שנשמרו
        return res.status(200).json(savedCost);

    } catch (err) {
        console.error('Error saving cost:', err);
        res.status(500).json({
            error: 'Internal Server Error',
            message: `An error occurred while saving the cost: ${err.message}`
        });
    }
});


// דוח חודשי
router.get('/report', async (req, res) => {
    try {
        const { id, year, month } = req.query;

        // לוודא שהפרמטרים לא חסרים
        if (!id) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing 'id' query parameter."
            });
        }

        if (!year) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing 'year' query parameter."
            });
        }

        if (!month) {
            return res.status(400).json({
                error: 'Bad Request',
                message: "Missing 'month' query parameter."
            });
        }

        console.log('Query Parameters:', { id, year, month });

        const startDate = new Date(year, month - 1, 1); // תחילת החודש
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // סיום החודש (יום האחרון)

        const costs = await Cost.aggregate([
            {
                $match: {
                    userid: id,
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: { category: '$category', day: { $dayOfMonth: '$date' } }, // קיבוץ לפי קטגוריה ויום
                    items: { $push: { sum: '$sum', description: '$description', day: { $dayOfMonth: '$date' } } }, // הוספת פרטי ההוצאה עם יום
                },
            },
            {
                $sort: { '_id.day': 1 }, // למיין לפי יום
            }
        ]);

        console.log('Aggregation Results:', costs);

        if (!costs || costs.length === 0) {
                return res.status(200).json({ costs: [] });
        }

        // עיבוד הנתונים למבנה המיוחל
        const report = [];

        costs.forEach(cost => {
            // מוצאים אם כבר קיימת קטגוריה בדוח
            let category = report.find(r => r[cost._id.category]);

            if (!category) {
                category = { [cost._id.category]: [] };
                report.push(category);
            }

            cost.items.forEach(item => {
                category[cost._id.category].push({
                    sum: item.sum,
                    description: item.description,
                    day: item.day,
                });
            });
        });

        res.status(200).json({
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month),
            costs: report
        });

    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: `An error occurred while fetching the report: ${error.message}`
        });
    }
});

module.exports = router;

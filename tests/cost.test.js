const request = require('supertest');
const app = require('../index');

describe('Cost API Endpoints', () => {
    // בדיקה: יצירת הוצאה חדשה
    it('should create a new cost entry', async () => {
        const newCost = {
            description: 'clean',
            category: 'housing',
            userid: '1',
            sum: 200
        };

        const response = await request(app)
            .post('/api/add')
            .send(newCost)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.description).toBe(newCost.description);
        expect(response.body.category).toBe(newCost.category);
    });

    // בדיקה: הוספת הוצאה ללא שדה חובה (בדיקת ולידציה)
    it('should return 400 if a required field is missing', async () => {
        const incompleteCost = {
            description: 'Dinner',
            category: 'food',
            // חסר userId
            sum: 100
        };

        const response = await request(app)
            .post('/api/add')
            .send(incompleteCost)
            .set('Content-Type', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Bad Request');
    });
});

const request = require('supertest');
const app = require('../index');

describe('Report API Endpoints', () => {
    // בדיקה: קבלת דוח חודשי
    it('should return monthly report for a user', async () => {
        const response = await request(app)
            .get('/api/report')
            .query({ id: '1', year: '2025', month: '2' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('costs');
        expect(response.body.costs).toBeInstanceOf(Array);
    });

    // בדיקה: דוח חודשי ללא נתונים
    it('should return empty costs array if no data found', async () => {
        const response = await request(app)
            .get('/api/report')
            .query({ id: '1', year: '2024', month: '12' }); // משתמש שאין לו נתונים

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('costs');
        expect(response.body.costs.length).toBe(0);
    });

    // בדיקה: דוח חודשי ללא פרמטרים
    it('should return 400 if parameters are missing', async () => {
        const response = await request(app)
            .get('/api/report');

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Bad Request');
    });
});

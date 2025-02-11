const request = require('supertest');
const app = require('../index');

describe('User API Endpoints', () => {
    // בדיקה: קבלת פרטי משתמש לפי ID
    it('should return user details by id', async () => {
        const response = await request(app)
            .get('/api/users/1'); // בדיקת משתמש קיים

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('first_name');
        expect(response.body.first_name).toBe('John');
        expect(response.body).toHaveProperty('total');
    });

    // בדיקה: החזרת שגיאה אם המשתמש לא נמצא
    it('should return 404 if user not found', async () => {
        const response = await request(app)
            .get('/api/users/99999'); // משתמש לא קיים

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found');
    });
});

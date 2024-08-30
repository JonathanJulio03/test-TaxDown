import request from 'supertest';
import app from '../src/app';
import { AppDataSource } from '../src/infrastructure/database/db';

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

describe('GET /', () => {
    it('should return Health!', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Health!');
    });
});
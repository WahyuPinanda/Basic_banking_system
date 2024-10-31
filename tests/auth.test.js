const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


describe('testing For Auth controller', () => {
    describe('POST /api/v1/auth/register', () => {
        test("should create new user", async () => {
            const createUser = await request(app).post('/api/v1/auth/register').send({
                email: 'example1@mail.com',
                name: 'example',
                password: 'qwerty',
            });
            expect(createUser.statusCode).toBe(201);
            expect(createUser.body).toHaveProperty('message');
            expect(createUser.body).toHaveProperty('data');
            expect(createUser.body.status).toBe(201);
            expect(createUser.body.message).toEqual('User berhasil dibuat');
        });

        test('should return 400 if email already used', async () => {
            const createUser = await request(app).post('/api/v1/auth/register').send({
                email: 'example@mail.com',
                name: 'example',
                password: 'qwerty',
            });
            expect(createUser.statusCode).toBe(400);
            expect(createUser.body).toHaveProperty('message');
            expect(createUser.body).toHaveProperty('status');
            expect(createUser.body.status).toBe('failed');
            expect(createUser.body.message).toEqual('Bad Request');
        });
    });


    describe('POST /api/v1/auth/login', () => {
        test('should login user', async () => {
            const login = await request(app).post('/api/v1/auth/login').send({
                email: 'example@mail.com',
                password: 'qwerty',
            });
            expect(login.statusCode).toBe(200);
            expect(login.body).toHaveProperty('message');
            expect(login.body).toHaveProperty('token');
            expect(login.body.status).toBe(200);
            expect(login.body.message).toEqual('Login berhasil');
        });

        test('should return 400 if email wrong', async () => {
            const login = await request(app).post('/api/v1/auth/login').send({
                email: 'qwerty@mail.com',
                password: 'qwerty',
            });
            expect(login.statusCode).toBe(400);
            expect(login.body).toHaveProperty('message');
            expect(login.body).toHaveProperty('status');
            expect(login.body.status).toBe('failed');
            expect(login.body.message).toEqual('Email atau password salah');
        });

        test('should return 400 if password wrong', async () => {
            const login = await request(app).post('/api/v1/auth/login').send({
                email: 'example@mail.com',
                password: 'qwerty',
            });
            expect(login.statusCode).toBe(400);
            expect(login.body).toHaveProperty('message');
            expect(login.body).toHaveProperty('status');
            expect(login.body.status).toBe('failed');
            expect(login.body.message).toEqual('Email atau password salah');
        });
    });

    describe('GET /api/v1/auth/authenticate', () => {
        let token;
        token = jwt.sign({ id: 1, email: 'test@mail.com' }, JWT_SECRET);
        test('should authenticate user', async () => {
            const response = await request(app).get('/api/v1/auth/authenticate').set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toEqual('Berhasil cuyy');
        });

        test('should return 401 if token not found', async () => {
            const response = await request(app).get('/api/v1/auth/authenticate');
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('error');
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('message');
            expect(response.body.status).toBe(401);
            expect(response.body.message).toEqual('Unauthorized');
        });

        test('should return 401 if token not valid', async () => {
            const response = await request(app).get('/api/v1/auth/authenticate').set('Authorization', `Bearer ${token}ascasc`);
            expect(response.statusCode).toBe(401);
            expect(response.body).toHaveProperty('error');
            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('message');
            expect(response.body.status).toBe(401);
            expect(response.body.message).toEqual('Unauthorized');
        });
    });
});
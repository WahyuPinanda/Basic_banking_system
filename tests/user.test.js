const request = require('supertest');
const app = require('../app');

describe('testing For User controller', () => {
    describe('GET /api/v1/users', () => {
        test("should get all user - 200", async () => {
            return await request(app).get('/api/v1/users')
                .then((res) => {
                    expect(res.statusCode).toBe(200)
                    expect(res.body).toHaveProperty('message')
                    expect(res.body).toHaveProperty('data')
                    expect(res.body.status).toBe(true)
                    expect(res.body.message).toEqual('Successfully display user data')
                })
        })
    });


    describe('POST /api/v1/users', () => {
        test("should create new user", async () => {
            const createUser = await request(app).post('/api/v1/users').send({
                email: 'test@mail.com',
                name: 'test',
                password: 'test',
                identity_type: 'KTP',
                identity_number: '1234561',
                address: 'test'
            });

            expect(createUser.statusCode).toBe(201);
            expect(createUser.body).toHaveProperty('message');
            expect(createUser.body).toHaveProperty('user');
            expect(createUser.body.status).toBe(true);
            expect(createUser.body.message).toEqual('User created successfully');
            expect(createUser.body.user).toHaveProperty('id');
            expect(createUser.body.user).toHaveProperty('profile');
        });

        test("should return 400 if email already used", async () => {
            const createUser = await request(app).post('/api/v1/users').send({
                email: 'test@mail.com',
                name: 'test',
                password: 'test',
                identity_type: 'KTP',
                identity_number: '123456789',
                address: 'test'
            })
            expect(createUser.statusCode).toBe(400);
            expect(createUser.body).toHaveProperty('message');
            expect(createUser.body.message).toEqual('Email Already Used');
        });

        test("should return 400 if identity number already used", async () => {
            const createUser = await request(app).post('/api/v1/users').send({
                email: 'test2@mail.com',
                name: 'test2',
                password: 'test2',
                identity_type: 'KTP',
                identity_number: '123456',
                address: 'test'
            })
            expect(createUser.statusCode).toBe(400);
            expect(createUser.body).toHaveProperty('message');
            expect(createUser.body.message).toEqual('Identity Number already exist');
        });
    });


    describe('GET /api/v1/users/:userId', () => {
        test("should get user by id", async () => {
            const response = await request(app).get('/api/v1/users/1');
            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('data');
            expect(response.body.status).toBe(true);
            expect(response.body.message).toEqual('Successfully display user data');
        });

        test("should return 404 if user not found", async () => {
            const response = await request(app).get('/api/v1/users/100');
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toEqual('User not found');
        });
    });
})
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT);

class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            // console.log(req.body);
            const uniqueEmail = await prisma.users.findUnique({
                where: {
                    email: email
                }
            });
            if (uniqueEmail) {
                throw { error: 'Email has been registered', status: 400, message: 'Bad Request' };
            } else {
                const hashedPassword = await bcrypt.hashSync(password, BCRYPT_SALT);
                let createUser = await prisma.users.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword
                    }
                })
                res.status(201).json({
                    error: null,
                    message: 'User successfully created',
                    status: 201,
                    data: createUser
                });
            }
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    status: 'failed',
                    message: error.message,
                });
            }
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            let { email, password } = req.body;
            let user = await prisma.users.findUnique({
                where: {
                    email: email
                }
            });
            if (!user) {
                throw { error: 'Not found', status: 400, message: 'Incorrect email or password' };
            } else {
                let isPassword = await bcrypt.compareSync(password, user.password);
                if (!isPassword) {
                    throw { error: 'Bad Request', status: 400, message: 'Incorrect email or password' };
                } else {
                    const accessToken = jwt.sign({
                        name: user.name,
                        id: user.id,
                    }, JWT_SECRET, {
                        expiresIn: '3h'
                    });

                    res.status(200).json({
                        error: null,
                        message: 'Login successful',
                        status: 200,
                        token: accessToken
                    });
                }
            }
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({
                    status: 'failed',
                    message: error.message,
                });
            }
            next(error);
        }
    }
}

module.exports = AuthController;
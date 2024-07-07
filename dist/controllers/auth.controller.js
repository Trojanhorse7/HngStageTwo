"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const app_1 = require("../app");
const generateJWToken_1 = __importDefault(require("../utils/generateJWToken"));
const hashPasswordAndVerify_1 = require("../utils/hashPasswordAndVerify");
//Register User Route
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    try {
        // Check if the email already exists
        const existingUser = await app_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(422).json({
                errors: [{ field: "email", message: "Email already exists" }],
            });
        }
        //Hash Password
        const hashedPassword = await (0, hashPasswordAndVerify_1.hashPassword)(password);
        //Create User
        const user = await app_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone
            }
        });
        //Create Organization for User
        const organisation = await app_1.prisma.organisation.create({
            data: {
                name: `${firstName}'s Organisation`,
                users: {
                    create: {
                        userId: user.userId
                    }
                }
            }
        });
        //Create JWT Token with Secret
        const token = await (0, generateJWToken_1.default)(user.userId);
        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                }
            }
        });
    }
    catch (e) {
        res.status(400).json({
            status: 'Bad request',
            message: 'Registration unsuccessful',
            statusCode: 400
        });
    }
};
exports.registerUser = registerUser;
//Login User Route
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await app_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({
                status: 'Bad request',
                message: 'User not found',
                statusCode: 404,
            });
        }
        const isValid = await (0, hashPasswordAndVerify_1.comparePasswords)(password, user.password);
        if (!isValid) {
            return res.status(401).json({
                status: 'Bad request',
                message: 'Authentication failed',
                statusCode: 401,
            });
        }
        //Create JWT Token with Secret
        const token = await (0, generateJWToken_1.default)(user.userId);
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone
                }
            }
        });
    }
    catch (error) {
        res.status(401).json({
            status: 'Bad request',
            message: 'Authentication failed',
            statusCode: 401
        });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth.controller.js.map
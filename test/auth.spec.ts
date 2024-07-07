import jwt, { Secret } from 'jsonwebtoken';
import "dotenv/config";
import app from '../src/app';
import { prisma } from "../src/app";
import generateJWTToken from "../src/utils/generateJWToken";
import request from "supertest"

beforeAll(async () => {
    await prisma.organisationUser.deleteMany({});
    await prisma.organisation.deleteMany({});
    await prisma.user.deleteMany({});
});

afterAll(async () => {
    await prisma.$disconnect();
});

const JwtSecret =  process.env.JWT_SECRET as Secret;

const user = {
    firstName: 'Felix',
    lastName: 'Gogodae',
    email: 'felix123@gmail.com',
    password: 'TestPassword@123',
    phone: '1234567890',
};

//Token Generation and Verification Unit Test
describe('JWT Token Generation', () => {
    it('should generate a valid token with correct expiry and user details', async () => {
        const testUserId = '6532f9fb-eaa1-4eaa-a64c-c9e2b7c57f0f';

        // Create JWT Token with Secret
        const token = await generateJWTToken(testUserId);

        //Decode Generated Token 
        const decodedToken = jwt.verify(token, JwtSecret) as jwt.JwtPayload;

        //Check if Decoded UserId is correct
        expect(decodedToken.userId).toEqual(testUserId);

        //Check Expiration
        expect(decodedToken.exp).toBeDefined();

    });
});

//POST /auth/register End To End Test
describe('POST /auth/register', () => {
    it('It Should Register User Successfully with Default Organisation and check if Orgnaization Name is generated successfully', async () => {

        const res = await request(app)
        .post('/auth/register')
        .send(user)
        .expect(201);

        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('Registration successful');
        expect(res.body.data.user.firstName).toBe('Felix');
        expect(res.body.data.user.email).toBe('felix123@gmail.com');
        expect(res.body.data).toHaveProperty('accessToken');

        // Verify the default organisation name
        const organisation = await prisma.organisation.findFirst({
            where: {
                name: "Felix's Organisation",
            },
        });
    
            expect(organisation).not.toBeNull();
            expect(organisation!.name).toBe("Felix's Organisation");
    });

    it('should fail if one required field is missing', async () => {
        const res = await request(app).post('/auth/register').send({
            lastName: 'Felix',
            email: 'felix123@gmail.com',
            password: 'TestPassword@123',
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.errors[0].field).toBe('firstName');
        expect(res.body.errors[0].message).toBe('First name is required');
    });

    it('should fail if one or more required fields are missing', async () => {
        const res = await request(app).post('/auth/register').send({
            lastName: 'Gogodae',
            password: 'TestPassword@123',
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.errors[0].field).toBe('firstName');
        expect(res.body.errors[0].message).toBe('First name is required');
        expect(res.body.errors[1].field).toBe('email');
        expect(res.body.errors[1].message).toBe('Email is required');
    });

    it('should fail if there’s duplicate email', async () => {
        await request(app).post('/auth/register').send(user);

        const res = await request(app).post('/auth/register').send(user);

        expect(res.statusCode).toEqual(422);
        expect(res.body.errors[0].field).toBe("email");
        expect(res.body.errors[0].message).toBe("Email already exists");
    });

    it('should log the user in successfully', async () => {
        await request(app).post('/auth/register').send(user);

        const res = await request(app).post('/auth/login').send({
            email: 'felix123@gmail.com',
            password: 'TestPassword@123',
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('Login successful');
        expect(res.body.data.user).toHaveProperty('userId');
        expect(res.body.data.user.firstName).toBe('Felix');
        expect(res.body.data.user.lastName).toBe('Gogodae');
        expect(res.body.data.user.email).toBe('felix123@gmail.com');
        expect(res.body.data.user.phone).toBe('1234567890');
        expect(res.body.data).toHaveProperty('accessToken');
        
        // Verify token validity and expiry
        let token = res.body.data.accessToken;
        const decodedToken = jwt.verify(token, JwtSecret) as jwt.JwtPayload;
        expect(decodedToken.userId).toEqual(res.body.data.user.userId);
        expect(decodedToken.exp).toBeDefined();

        // CHECK TOKEN EXPIRY
        
        // Converting milliseconds to seconds
        const now = Math.floor(Date.now() / 1000); 

        //JWT is set to One Day expiry, so making a check to see its greater than 3 hours
        //which under this test circumstanse it would.
         expect((decodedToken as any).exp - now).toBeGreaterThan(3 * 3600 - 60);
    });

    it('should fail with incorrect password', async () => {
        
        await request(app).post('/auth/register').send(user);

        const res = await request(app).post('/auth/login').send({
            email: 'felix123@gmail.com',
            password: 'Password@123',
        });

        expect(res.status).toEqual(401);
        expect(res.body.status).toBe('Bad request');
        expect(res.body.message).toBe('Authentication failed');
    });

    it('should fail if required field is missing', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'felix123@gmail.com',
        });

        expect(res.statusCode).toEqual(422);
        expect(res.body.errors[0].field).toBe('password');
    });
});



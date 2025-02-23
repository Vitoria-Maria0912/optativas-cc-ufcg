import { Role, PrismaClient } from '@prisma/client';
import app, { closeServer } from '../src/express/server';
import request from 'supertest';

describe('LoginController', () => {

    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsInJvbGUiOiJBRE1JTklTVFJBVE9SIiwibmFtZSI6IkFsaWNlIEpvaG5zb24iLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIiwibG9naW5JZCI6bnVsbCwiaWF0IjoxNzM2MDQ3ODUzfQ.W9CnU-tu1E_bNvaimZW0aKwpQd-dkpisBZLvEnhuFaM"
    
    afterEach(async () => { await request(app).delete('/protected/users').set("Authorization", `Bearer ${ TOKEN }`) });
    afterEach( async () => { await (new PrismaClient).login.deleteMany() });

    afterAll(async () => { closeServer(); await (new PrismaClient).$disconnect(); });

    describe("CreateLogin should return `User '${ email }' registered successfully!`", () => {

        test("should register an ADMINISTRATOR user successfully", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Login ADM", email: "loginAdm@example.com"});

            const response = await request(app).post("/auth/login").send({
                email: "loginAdm@example.com",
                password: "loginAdm123",
            });
    
            expect(response.body.message).toBe("User 'loginAdm@example.com' registered successfully!");
            expect(response.status).toBe(201);
        });
    
        test("should register a user with special characters in password successfully", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Login special password", email: "loginSpecialPassword@example.com"});

            const response = await request(app).post("/auth/login").send({
                email: "loginSpecialPassword@example.com",
                password: "ali ce.123_",
            });
    
            expect(response.body.message).toBe("User 'loginSpecialPassword@example.com' registered successfully!");
            expect(response.status).toBe(201);
        });
    
        test("should register a COMMON user successfully", async () => {

            await request(app).post("/users").send({ name: "Login common", email: "loginCommon@example.com"});
            
            const response = await request(app).post("/auth/login").send({
                email: "loginCommon@example.com",
                password: "loginCommon123",
            });
    
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("User 'loginCommon@example.com' registered successfully!");
        });
    
        test("should return error when user is not found", async () => {
            const response = await request(app).post("/auth/login").send({
                email: "alice3@example.com",
                password: "alice123",
            });
    
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("User with email 'alice3@example.com' not found!");
        });

        test("should return erro a user with only letters in password", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Only letters password", email: "onlyLettersPassword@example.com"});

            const response = await request(app).post("/auth/login").send({
                email: "onlyLettersPassword@example.com",
                password: "onlyLettersPassword",
            });
    
            expect(response.body.message).toBe(`This password 'onlyLettersPassword' is invalid, should contains letters and numbers!`);
            expect(response.status).toBe(400);
        });

        test("should return erro a user with only numbers in password", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Only numbers password", email: "onlyNumbersPassword@example.com"});

            const response = await request(app).post("/auth/login").send({
                email: "onlyNumbersPassword@example.com",
                password: "onlyNumbersPassword",
            });
    
            expect(response.body.message).toBe("This password 'onlyNumbersPassword' is invalid, should contains letters and numbers!");
            expect(response.status).toBe(400);
        });
    
        test("should return error when password is missing", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "No password", email: "noPassword@example.com"});

            const response = await request(app).post("/auth/login").send({
                email: "noPassword@example.com",
                password: "",
            });
    
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Password is required!");
        });
    
        test("should return error when password is too short", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Too short", email: "tooShort@example.com"});

            const response = await request(app).post("/auth/login").send({
                email: "tooShort@example.com",
                password: "short_1",
            });
    
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Password is too short, should be at least 8 characters!");
        });
    
        test("should return error when password is too long", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Too long", email: "tooLong@example.com"});

            const response = await request(app).post("/auth/login").send({
                email: "tooLong@example.com",
                password: "tooLong12.administrator",
            });
    
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Password is too long, should be at most 20 characters!");
        });
    });
    
    describe("GetTokenByEmail should return `Login for user '${ email }' was found successfully!`", () => {

        test("should return a token when a valid email is provided", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Login ADM", email: "loginAdm@example.com"});

            await request(app).post("/auth/login").send({ email: "loginAdm@example.com", password: "loginAdm123", });

            const response = await request(app).post("/login/getTokenByUserEmail").send({
                email: "loginAdm@example.com",
                password: "loginAdm123",
            });

            expect(response.body.message).toEqual("Login for user 'loginAdm@example.com' was found successfully!")
            expect(response.body.login).toHaveProperty("token");
            expect(response.status).toBe(200);
        });

        // test("should return a token when a valid email is provided", async () => {

        //     await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Login ADM", email: "wrongPassword@example.com"});

        //     await request(app).post("/auth/login").send({ email: "wrongPassword@example.com", password: "loginAdm123", });

        //     const response = await request(app).post("/login/getTokenByUserEmail").send({
        //         email: "wrongPassword@example.com",
        //         password: "Adm123",
        //     });

        //     expect(response.body.message).toEqual("Password is incorrect!")
        //     expect(response.status).toBe(400);
        // });
    
        test("should return 404 if credentials are incorrect", async () => {
            const response = await request(app).post("/login/getTokenByUserEmail").send({
                email: "userNotFound@example.com",
                password: "userNotFound_1",
            });
    
            expect(response.body).toEqual({ message: "User with email 'userNotFound@example.com' not found!" });
            expect(response.status).toBe(404);
        });
    
        test("should return 400 if email format is invalid", async () => {
            const response = await request(app).post("/login/getTokenByUserEmail").send({
                email: "invalid-email",
                password: "password123",
            });
    
            expect(response.body).toEqual({ message: "This email 'invalid-email' is invalid, should be like 'name@example.com'!" });
            expect(response.status).toBe(400);
        });
    
        test("should return 400 if password is missing", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Missing password", email: "missingPassword@example.com"});

            await request(app).post("/auth/login").send({ email: "missingPassword@example.com", password: "missingPassword123", });

            const response = await request(app).post("/login/getTokenByUserEmail").send({
                email: "missingPassword@example.com",
            });
    
            expect(response.body).toEqual({ message: "Password is required!" });
            expect(response.status).toBe(400);
        });
    });    
});

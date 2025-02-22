import { Role, PrismaClient } from '@prisma/client';
import app, { closeServer } from '../src/express/server';
import request from 'supertest';

describe('UserController', () => {

    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsInJvbGUiOiJBRE1JTklTVFJBVE9SIiwibmFtZSI6IkFsaWNlIEpvaG5zb24iLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIiwibG9naW5JZCI6bnVsbCwiaWF0IjoxNzM2MDQ3ODUzfQ.W9CnU-tu1E_bNvaimZW0aKwpQd-dkpisBZLvEnhuFaM"
    
    afterEach(async () => { await request(app).delete('/protected/users').set("Authorization", `Bearer ${ TOKEN }`) });
    afterEach( async () => { await (new PrismaClient).login.deleteMany() });

    afterAll(async () => { closeServer(); await (new PrismaClient).$disconnect(); });

    describe("CreateUser should return 'User ${ name } was created successfully!'", () => {

        test("should create an ADMINISTRATOR user successfully", async () => {
            const userData = {
                role: Role.ADMINISTRATOR,
                name: "Alice Johnson",
                email: "alice@example.com"
            };

            const response = await request(app).post("/users").send(userData);

            expect(response.body).toEqual({ message: `User '${ userData.name }' was created successfully!`, user: userData });
            expect(response.status).toBe(201);
        });

        test("should create a COMMON user successfully", async () => {
            const userData = {
                role: Role.COMMON,
                name: "Alice2Johnson",
                email: "alice2@example.com"
            };

            const response = await request(app).post("/users").send(userData);

            expect(response.body).toEqual({ message: `User '${ userData.name }' was created successfully!`, user: userData });
            expect(response.status).toBe(201);
        });

        test("should return error for invalid email format", async () => {
            const userData = {
                role: Role.ADMINISTRATOR,
                name: "Alice Johnson",
                email: "aliceexample"
            };

            const response = await request(app).post("/users").send(userData);

            expect(response.body).toEqual({ message: `This email '${ userData.email }' is invalid, should be like 'name@example.com'!` });
            expect(response.status).toBe(400);
        });

        test("should allow alphanumeric names", async () => {
            const userData = {
                role: Role.COMMON,
                name: "John123",
                email: "john123@example.com"
            };

            const response = await request(app).post("/users").send(userData);

            expect(response.body).toEqual({ message: `User '${ userData.name }' was created successfully!`, user: userData });
            expect(response.status).toBe(201);
        });

        test("should return error when name is missing", async () => {
            const userData = {
                role: Role.COMMON,
                email: "missingname@example.com"
            };

            const response = await request(app).post("/users").send(userData);

            expect(response.body).toEqual({ message: "Name is required!" });
            expect(response.status).toBe(400);
        });

        test("should return error when name contains only numbers", async () => {
            const userData = {
                role: Role.ADMINISTRATOR,
                name: "123456",
                email: "onlynumbers@example.com"
            };

            const response = await request(app).post("/users").send(userData);

            expect(response.body).toEqual({ message: "Name cannot contain only numbers!" });
            expect(response.status).toBe(400);
        });

        test("should return error when email is missing", async () => {
            const userData = {
                role: Role.COMMON,
                name: "NoEmail User"
            };

            const response = await request(app).post("/users").send(userData);

            expect(response.body).toEqual({ message: "Email is required!" });
            expect(response.status).toBe(400);
        });

        test("should return error when email is already in use", async () => {
            const userData = {
                role: Role.ADMINISTRATOR,
                name: "Existing User",
                email: "existing@example.com"
            };

            await request(app).post("/users").send(userData);

            const response = await request(app).post("/users").send(userData);

            expect(response.body).toEqual({ message: `This email '${ userData.email }' is already in use!` });
            expect(response.status).toBe(409);
        });

        test("should assign COMMON role if role is missing", async () => {

            const userData = {
                name: "NoRole User",
                email: "norole@example.com"
            };

            const expectedUser = { ...userData, role: Role.COMMON };
            const response = await request(app).post("/users").send(userData);
            
            expect(response.body).toEqual({ message: `User '${ userData.name }' was created successfully!`, user: expectedUser });
            expect(response.status).toBe(201);
        });

        test("should return error when role is invalid", async () => {
            const userData = {
                role: "MANAGER",
                name: "InvalidRole User",
                email: "invalidrole@example.com"
            };

            const response = await request(app).post("/users").send(userData);

            expect(response.body).toEqual({ message: "The role must be either ADMINISTRATOR or COMMON!" });
            expect(response.status).toBe(400);
        });

        test("should return multiple validation errors", async () => {
            const userData = {
                role: "INVALID_ROLE",
                name: "12345",
                email: ""
            };

            const response = await request(app).post("/users").send(userData);

            const expectedMessages = [
                "Name cannot contain only numbers!",
                `This email '${ userData.email }' is invalid, should be like 'name@example.com'!`,
                "The role must be either ADMINISTRATOR or COMMON!"
            ];
            
            expect(expectedMessages).toContain(response.body.message);
            expect(response.status).toBe(400);
        });
    });

    describe("GetAllUsers should return 'Users were found successfully!'", () => {
        
        test("should return all users successfully", async () => {
            const userData = {
                id: 1,
                role: Role.ADMINISTRATOR,
                name: "Valid ID",
                email: "validID@example.com"
            };

            await request(app).post("/users").send(userData);

            const response = await request(app).get("/protected/users").set("Authorization", `Bearer ${ TOKEN }`);
            
            expect(response.body.message).toEqual(`Users were found successfully!`);

            expect(response.body.users).toEqual(
                expect.arrayContaining(
                    response.body.users.map(() =>
                        expect.objectContaining(userData)
                    )
                )
            );
            expect(response.status).toBe(200);
        });
    
        test("should return 404 'No users found!'", async () => {
            await request(app).delete('/protected/users').set("Authorization", `Bearer ${ TOKEN }`)
            const response = await request(app).get("/protected/users").set("Authorization", `Bearer ${ TOKEN }`);
            
            expect(response.body.message).toEqual(`No users found!`);
            expect(response.status).toBe(404);
        });
    });

    describe("GetUserByID should return 'User with ID ${ id } was found successfully!'", () => {
        
        test("should return a user when a valid ID is provided", async () => {
            const userData = {
                id: 1,
                role: Role.ADMINISTRATOR,
                name: "Valid ID",
                email: "validID@example.com"
            };

            await request(app).post("/users").send(userData);

            const response = await request(app).get("/protected/users/getByID/1").set("Authorization", `Bearer ${ TOKEN }`);
            
            expect(response.body).toMatchObject({
                message: `User with ID '${ userData.id }' was found successfully!`,
                user: {
                    id: 1,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role
                }
            });            
            expect(response.status).toBe(200);
        });
    
        test("should return 404 if user ID does not exist", async () => {

            const response = await request(app).get("/protected/users/getByID/999999999").set("Authorization", `Bearer ${ TOKEN }`);
            
            expect(response.body).toEqual({ message: `User with ID '999999999' not found!` });
            expect(response.status).toBe(404);
        });
    
        test("should return 400 if ID is invalid", async () => {
            const response = await request(app).get("/protected/users/getByID/invalid-id").set("Authorization", `Bearer ${ TOKEN }`);

            expect(response.body).toEqual({ message: "User ID must be a number!" });
            expect(response.status).toBe(400);
        });
    });
    
    describe("GetUserByRole should return 'User with role ${ role } was found successfully!' ", () => {

        test("should return users when ADMINISTRATOR role", async () => {

            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Adm Test", email: "admTest@example.com" });

            const response = await request(app).get("/protected/users/getByRole/ADMINISTRATOR").set("Authorization", `Bearer ${ TOKEN }`);

            expect(response.body.message).toEqual(`Users with 'ADMINISTRATOR' role were found successfully!`)

            expect(response.body.users).toEqual(
                expect.arrayContaining(
                    response.body.users.map(() =>
                        expect.objectContaining({ role: "ADMINISTRATOR" })
                    )
                )
            ); expect(response.status).toBe(200);
        });

        test("should return users when COMMON role", async () => {

            await request(app).post("/users").send({ name: "Common Test", email: "commonTest@example.com" });

            const response = await request(app).get(`/protected/users/getByRole/COMMON`).set("Authorization", `Bearer ${ TOKEN }`);

            expect(response.body.message).toEqual(`Users with 'COMMON' role were found successfully!`)

            expect(response.body.users).toEqual(
                expect.arrayContaining(
                    response.body.users.map(() =>
                        expect.objectContaining({ role: "COMMON" })
                    )
                )
            ); expect(response.status).toBe(200);
        });
    
        test("should return 400 if role is invalid", async () => {
            const response = await request(app).get("/protected/users/getByRole/UNKNOWN_ROLE").set("Authorization", `Bearer ${ TOKEN }`);
            expect(response.body).toEqual({ message: "The role must be either ADMINISTRATOR or COMMON!" });
            expect(response.status).toBe(400);
        });
    
        test("should return 400 if role is only numbers", async () => {
            const response = await request(app).get("/protected/users/getByRole/123").set("Authorization", `Bearer ${ TOKEN }`);
            expect(response.body).toEqual({ message: "The role must be either ADMINISTRATOR or COMMON!" });
            expect(response.status).toBe(400);
        });
    });
    
    describe("GetUserByEmail should return 'User with email ${ email } was found successfully!' ", () => {
        test("should return a user when a valid email is provided", async () => {

            const user = await request(app).post("/users").send({ name: "Get by email Test", email: "emailTest@example.com" });

            const response = await request(app).get("/protected/users/getByEmail/emailTest@example.com").set("Authorization", `Bearer ${ TOKEN }`);

            expect(response.body).toMatchObject({
                message : "User with email 'emailTest@example.com' was found successfully!",
                user: {
                    name: "Get by email Test",
                    email: "emailTest@example.com",
                    role: "COMMON",
                }
            });
            expect(response.status).toBe(200);
        });
    
        test("should return 404 if user with email does not exist", async () => {
            const response = await request(app).get("/protected/users/getByEmail/notfound@example.com").set("Authorization", `Bearer ${ TOKEN }`);
            expect(response.body).toEqual({ message: "User with email 'notfound@example.com' not found!" });
            expect(response.status).toBe(404);
        });
    
        test("should return 400 if email format is invalid", async () => {
            const response = await request(app).get("/protected/users/getByEmail/invalid-email").set("Authorization", `Bearer ${ TOKEN }`);
            expect(response.body).toEqual({ message: "This email 'invalid-email' is invalid, should be like 'name@example.com'!" });
            expect(response.status).toBe(400);
        });
    });

    describe("DeleteOneUser should return 'User with ID ${ id } was deleted successfully!' ", () => {
        
        test("deleteOneUser should return 'No users found!'", async () => {
            await request(app).delete('/protected/users').set("Authorization", `Bearer ${ TOKEN }`);
            const response = await request(app).delete('/users/1').set("Authorization", `Bearer ${ TOKEN }`);
            
            expect(response.body).toEqual({ message: 'No users found!'});
            expect(response.status).toBe(404);
        });
        
        test('deleteOneUser should return success message', async () => {
        
            const userData = {
                id: 1,
                role: Role.ADMINISTRATOR,
                name: "Alice Johnson",
                email: "alice@example.com"
            };
    
            await request(app).post('/users').send(userData).set("Authorization", `Bearer ${ TOKEN }`);
    
            const response = await request(app).delete(`/users/${ userData.id }`).set("Authorization", `Bearer ${ TOKEN }`);
    
            expect(response.body).toEqual({ message: `User with ID '${ userData.id }' was deleted successfully!`, });
            expect(response.status).toBe(200);
        });

    });

    describe("DeleteAllUsers should return 'All users were deleted successfully!' ", () => {
        test("should return 'No users found!'", async () => {
            const response = await request(app).delete("/protected/users").set("Authorization", `Bearer ${ TOKEN }`);
            
            expect(response.body).toEqual({ message: "No users found!" });
        });

        test("should return a message when all users are deleted", async () => {
            await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Delete Test", email: "deleteTest@example.com" });

            const response = await request(app).delete("/protected/users").set("Authorization", `Bearer ${ TOKEN }`);
            
            expect(response.body).toEqual({ message: "All users were deleted successfully!" });
        });
    });
});

import { Role, Type } from '@prisma/client';
import app, { closeServer } from '../src/express/server';

import request from 'supertest';
import prismaClient from '../src/util/util';

describe('DisciplineController', () => {

    let token: string;

    beforeAll( async () => { 
        await request(app).post("/users").send({ role: Role.ADMINISTRATOR, name: "Login ADM", email: "loginAdmDiscipline@example.com"});
        await request(app).post("/auth/login").send({ email: "loginAdmDiscipline@example.com", password: "loginAdm123" });
        token = (await request(app).post("/login/getTokenByUserEmail").send({ email: "loginAdmDiscipline@example.com", password: "loginAdm123" })).body.login.token;
    });

    afterEach(async () => { await request(app).delete('/protected/disciplines').set("Authorization", `Bearer ${token}`) });
    
    afterAll(async () => { closeServer(); await prismaClient.$disconnect(); });

    describe("CreateDiscipline should return 201 and a new discipline", () => {

        test("createDiscipline should return 'Discipline created successfully!'", async () => {
            const disciplineData = {
                name: 'Web II',
                acronym: 'Web II',
                type: Type.OPTATIVE,
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            };
            const response = await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`);

            expect(response.body).toEqual({
                message: "Discipline created successfully!",
                discipline: disciplineData,
            });
            expect(response.status).toBe(201);
        });

        test("emptyAvailability should create a discipline with available = true", async () => {

            const disciplineData = {
                name: 'Web II',
                acronym: 'Web II',
            };
            const response = await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`);

            expect(response.body.message).toEqual("Discipline created successfully!");
            expect(response.body.discipline.available).toEqual(true);
            expect(response.status).toBe(201);
        });

        test("emptySchedule should create a discipline with schedule = 'Not specified'", async () => {
            
            const disciplineData = {
                name: 'Web II',
                acronym: 'Web II',
                type: Type.OPTATIVE,
                professor: 'Glauber',
            };
            const response = await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`);

            expect(response.body.message).toEqual("Discipline created successfully!");
            expect(response.body.discipline.schedule).toEqual("Not specified");
            expect(response.status).toBe(201);
        });

        test("emptyProfessor should create a discipline with professor = 'Not specified'", async () => {
            const disciplineData = {
                name: 'Web II',
                acronym: 'Web II',
                type: Type.OPTATIVE,
            };
            const response = await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`);

            expect(response.body.message).toEqual("Discipline created successfully!");
            expect(response.body.discipline.professor).toEqual("Not specified");
            expect(response.status).toBe(201);
        });

        test("emptyType should create a discipline with type = 'OBRIGATORY'", async () => {
            
            const disciplineData = {
                name: 'Web II',
                acronym: 'Web II',
            };
            const response = await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`);

            expect(response.body.message).toEqual("Discipline created successfully!");
            expect(response.body.discipline.type).toEqual(Type.OBRIGATORY);
            expect(response.status).toBe(201);
        });

        test("emptyDescription should create a discipline without description", async () => {
            
            const disciplineData = {
                name: 'Web II',
                acronym: 'Web II',
            };
            const response = await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`);

            expect(response.body.message).toEqual("Discipline created successfully!");
            expect(response.body.discipline.description).toBe('');
            expect(response.status).toBe(201);
        });

        test("emptyName should return a 400 error", async () => {
            const disciplineData = {
                acronym: 'Web II',
            };
            const response = await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`);

            expect(response.body.message).toEqual("Discipline name is required!")
            expect(response.status).toBe(400);
        });

        test("emptyAcronym should return a 400 error", async () => {
            const disciplineData = {
                name: 'Web II',
            };
            const response = await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`);

            expect(response.body.message).toEqual("Discipline acronym is required!")
            expect(response.status).toBe(400);
        });

        const testCases = [
            { name: "'Discipline created successfully!'", data: { description: "" }, expected: "Discipline created successfully!" , code: 201 },
            { name: "'Discipline created successfully!'", data: { pre_requisites: [] }, expected: "Discipline created successfully!", code: 201 },
            { name: "'Discipline created successfully!'", data: { post_requisites: [] }, expected: "Discipline created successfully!", code: 201 },
            { name: "'Discipline created successfully!'", data: { acronym: "Web II" }, expected: "Discipline created successfully!", code: 201 },
            { name: "error 'Discipline with this name already exists!'", data: { name: "web ii" }, expected: "A discipline with this name 'web ii' already exists!", code: 409 },
            { name: "error 'Discipline with this name already exists!'", data: { name: "Web II" }, expected: "A discipline with this name 'Web II' already exists!", code: 409 },
            { name: "error 'name should not contains only numbers!'", data: { name: "12345" }, expected: "Discipline's name '12345' is invalid, should not contains only numbers!", code: 400 },
            { name: "error 'acronym should not contains only numbers!'", data: { acronym: "123" }, expected: "Discipline's acronym '123' is invalid, should not contains only numbers!", code: 400 },
            { name: "error 'professor should not contains only numbers!'", data: { professor: "" }, expected: "Discipline created successfully!", code: 201 },
            { name: "error 'type must be either OBRIGATORY or OPTATIVE!'", data: { type: "INVALID" }, expected: "Discipline's type must be either OBRIGATORY or OPTATIVE!", code: 400 },
            { name: "error 'type must be a boolean!", data: { available: "maybe" }, expected: "Discipline's availability must be a boolean!", code: 400 },
            { name: "error 'description should not contains only numbers!'", data: { description: "123456" }, expected: "Discipline's description '123456' is invalid, should not contains only numbers!", code: 400 },
            { name: "error 'schedule should not contains only numbers!'", data: { schedule: "12345" }, expected: "Discipline's schedule '12345' is invalid, should not contains only numbers!", code: 400 },
            { name: "error 'pre_requisites should be a existing discipline!'", data: { pre_requisites: ["999"] }, expected: "A pre requisite '999' is invalid, should be a discipline name!", code: 400 },
            { name: "error 'post_requisites should be a existing discipline!'", data: { post_requisites: ["998"] }, expected: "A post requisite '998' is invalid, should be a discipline name!", code: 400 },
        ];

        testCases.forEach(({ name, data, expected, code }) => {

            test(`createDiscipline should return ${name}`, async () => {
                await request(app).post('/protected/disciplines').send({ name: 'Web II', acronym: 'Web II', type: Type.OPTATIVE }).set("Authorization", `Bearer ${token}`);

                const disciplineData = {
                    name: data.name || "Valid Name",
                    acronym: data.acronym || "Valid Acronym",
                    type: data.type || Type.OPTATIVE,
                    available: data.available ?? true,
                    description: data.description || "Valid description",
                    pre_requisites: data.pre_requisites || [],
                    post_requisites: data.post_requisites || [],
                    professor: data.professor || "Valid Teacher",
                    schedule: data.schedule || "Segunda (8h-10h), Quarta (10h-12h)",
                };

                const response = await request(app)
                    .post("/protected/disciplines")
                    .send(disciplineData)
                    .set("Authorization", `Bearer ${token}`);

                expect(response.body.message).toEqual(expected);
                expect(response.status).toBe(code);
            });
        });
    });

    describe("PatchDiscipline should return 200 and the updated discipline", () => {

        test('patchDiscipline should return success message', async () => {

            const disciplineData = {
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            };

            await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`)

            const updateData = { available: false };

            const { body, status } = await request(app)
                .patch('/protected/disciplines/1')
                .send(updateData).set("Authorization", `Bearer ${token}`);

            expect(body).toEqual({
                message: "Discipline's field updated successfully!",
                discipline: { ...disciplineData, available: false },
            });
            expect(status).toBe(200);
        });

        test('patchDiscipline should return 404 if discipline not found', async () => {

            const disciplineData = {
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            };

            await request(app)
                .post('/protected/disciplines')
                .send(disciplineData).set("Authorization", `Bearer ${token}`)

            const updateData = { available: false };

            const response = await request(app)
                .patch('/protected/disciplines/-3')
                .send(updateData).set("Authorization", `Bearer ${token}`);

            expect(response.body.message).toEqual("Discipline not found!");
            expect(response.status).toBe(404);

        });

        test("patchDiscipline should return 'No disciplines found!'", async () => {

            const updateData = { available: false };

            const response = await request(app).patch('/protected/disciplines/1').send(updateData).set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'No disciplines found!' });
        });

        const testCases = [
            { name: "Discipline's field updated successfully!", data: { pre_requisites: [], post_requisites: [] }, expected: "Discipline's field updated successfully!", code: 200 },
            { name: "error 'Invalid type'", data: { type: "INVALID_TYPE" }, expected: "Discipline's type must be either OBRIGATORY or OPTATIVE!", code: 400 },
            { name: "error 'Invalid availability'", data: { available: "notBoolean" }, expected: "Discipline's availability must be a boolean!", code: 400 },
            { name: "error 'Empty name'", data: { name: "" }, expected: "Discipline name is required!", code: 400 },
            { name: "error 'Empty acronym'", data: { acronym: "" }, expected: "Discipline acronym is required!", code: 400 },
            { name: "error 'Empty schedule'", data: { schedule: "" }, expected: "Schedule cannot be empty!", code: 400 },
            { name: "error 'Empty description'", data: { description: "" }, expected: "Description cannot be empty!", code: 400 },
            { name: "error 'Empty professor name'", data: { professor: "" }, expected: "Professor name cannot be empty!", code: 400 },
            { name: "error 'Empty type for discipline'", data: { type: "" }, expected: "Type cannot be empty!", code: 400 },
            { name: "error 'Empty availability'", data: { available: null }, expected: "Discipline's availability must be a boolean!", code: 400 },
            { name: "error 'Duplicate name'", data: { name: "Existing Discipline" }, expected: "A discipline with this name 'Existing Discipline' already exists!", code: 409 },
            { name: "error 'Duplicate name with different case'", data: { name: "existing discipline" }, expected: "A discipline with this name 'existing discipline' already exists!", code: 409 },
            { name: "error 'Numeric-only name'", data: { name: "123456" }, expected: "Discipline's name '123456' is invalid, should not contains only numbers!", code: 400 },
            { name: "error 'Numeric-only acronym'", data: { acronym: "123" }, expected: "Discipline's acronym '123' is invalid, should not contains only numbers!", code: 400 },
            { name: "error 'Numeric-only professor name'", data: { professor: "98765" }, expected: "Discipline's professor '98765' is invalid, should not contains only numbers!", code: 400 },
            { name: "error 'Numeric-only description'", data: { description: "12345" }, expected: "Discipline's description '12345' is invalid, should not contains only numbers!", code: 400 },
            { name: "error 'Numeric-only schedule'", data: { schedule: "123456" }, expected: "Discipline's schedule '123456' is invalid, should not contains only numbers!", code: 400 },
            { name: "error 'Nonexistent pre-requisite'", data: { pre_requisites: ["FAKE101"] }, expected: "A pre requisite 'FAKE101' is invalid, should be a discipline name!", code: 400 },
            { name: "error 'Nonexistent post-requisite'", data: { post_requisites: ["FAKE102"] }, expected: "A post requisite 'FAKE102' is invalid, should be a discipline name!", code: 400 },
        ];
        
        for (const { name, data, expected, code } of testCases) {
            test(`patchDiscipline should return ${ name }`, async () => {
                
                await request(app).post('/protected/disciplines').send({ id: 0, name: "Arquitetura de Software", acronym: "ArqSof", type: "OPTATIVE"}).set("Authorization", `Bearer ${ token }`);
                const response = await request(app)
                                .patch(`/protected/disciplines/0`)
                                .send(data).set("Authorization", `Bearer ${ token }`);
        
                expect(response.body.message).toEqual(expected);
                expect(response.status).toBe(code);
            });
        };
    });

    describe("GetOneDisciplineByName should return 200 and the discipline", () => {

        test("getOneDisciplineByName should return 'No disciplines found!'", async () => {

            const response = await request(app).get('/disciplines/getByName/TC');

            expect(response.body).toEqual({ message: 'No disciplines found!' });
            expect(response.status).toBe(404);
        });

        test('getOneDisciplineByName should return a single discipline', async () => {

            await request(app).post('/protected/disciplines').send({
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            const response = await request(app).get('/disciplines/getByName/Web%20II');

            expect(response.body).toEqual({
                message: "Discipline was found successfully!",
                discipline: {
                    id: 1,
                    name: 'Web II',
                    acronym: 'Web II',
                    type: 'OPTATIVE',
                    available: true,
                    description: 'Backend for web development',
                    pre_requisites: [],
                    post_requisites: [],
                    professor: 'Glauber',
                    schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
                },
            });
            expect(response.status).toBe(200);
        });

        test('getOneDisciplineByName should return 404 if discipline is not found', async () => {

            await request(app).post('/protected/disciplines').send({
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                description: 'Backend for web development',
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            const response = await request(app).get('/disciplines/getByName/Princípios%20Dev%20Web');

            expect(response.body.message).toEqual("Discipline not found!");
            expect(response.status).toBe(404);
        });

        test('getOneDisciplineByName should return 404 if discipline is not found', async () => {

            await request(app).post('/protected/disciplines').send({
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                description: 'Backend for web development',
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            const response = await request(app).get('/disciplines/getByName/1');

            expect(response.body.message).toEqual("Discipline not found!");
            expect(response.status).toBe(404);
        });
    });

    describe("GetOneDisciplineByAcronym should return 200 and the discipline", () => {

        test("getOneDisciplineByAcronym should return 'No disciplines found!'", async () => {

            const response = await request(app).get('/disciplines/getByAcronym/TC');

            expect(response.body).toEqual({ message: 'No disciplines found!' });
            expect(response.status).toBe(404);
        });

        test('getOneDisciplineByAcronym should return a single discipline', async () => {

            await request(app).post('/protected/disciplines').send({
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            const response = await request(app).get('/disciplines/getByAcronym/Web%20II');

            expect(response.body).toEqual({
                message: "Discipline was found successfully!",
                discipline: {
                    id: 1,
                    name: 'Web II',
                    acronym: 'Web II',
                    type: 'OPTATIVE',
                    available: true,
                    description: 'Backend for web development',
                    pre_requisites: [],
                    post_requisites: [],
                    professor: 'Glauber',
                    schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
                },
            });
            expect(response.status).toBe(200);
        });

        test('getOneDisciplineByAcronym should return 404 if discipline is not found', async () => {

            await request(app).post('/protected/disciplines').send({
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                description: 'Backend for web development',
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            const response = await request(app).get('/disciplines/getByAcronym/Princípios%20Dev%20Web');

            expect(response.body.message).toEqual("Discipline not found!");
            expect(response.status).toBe(404);
        });

        test('getOneDisciplineByAcronym should return 404 if discipline is not found', async () => {

            await request(app).post('/protected/disciplines').send({
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                description: 'Backend for web development',
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            const response = await request(app).get('/disciplines/getByAcronym/1');

            expect(response.body.message).toEqual("Discipline not found!");
            expect(response.status).toBe(404);
        });
    });

    describe("GetOneDisciplineByID should return 200 and the discipline", () => {

        test("getOneDisciplineByID should return 'No disciplines found!'", async () => {

            const response = await request(app).get('/disciplines/getByID/1');

            expect(response.body).toEqual({ message: 'No disciplines found!' });
            expect(response.status).toBe(404);
        });

        test('getOneDisciplineByID should return a single discipline', async () => {

            await request(app).post('/protected/disciplines').send({
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            const response = await request(app).get('/disciplines/getByID/1');

            expect(response.body).toEqual({
                message: "Discipline was found successfully!",
                discipline: {
                    id: 1,
                    name: 'Web II',
                    acronym: 'Web II',
                    type: 'OPTATIVE',
                    available: true,
                    description: 'Backend for web development',
                    pre_requisites: [],
                    post_requisites: [],
                    professor: 'Glauber',
                    schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
                },
            });
            expect(response.status).toBe(200);
        });
    });

    describe("GetAllDisciplines should return 200 and all disciplines", () => {

        test("getAllDisciplines should return 'No disciplines found!'", async () => {
            const response = await request(app).get('/disciplines');
            expect(response.body).toEqual({ message: 'No disciplines found!' });
            expect(response.status).toBe(404);
        });

        test('getAllDisciplines should return a list of disciplines', async () => {
            await request(app).post('/protected/disciplines').send({
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: 'OPTATIVE',
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            await request(app).post('/protected/disciplines').send({
                id: 2,
                name: 'Verificação e Validação de Software',
                acronym: 'VeV',
                type: 'OPTATIVE',
                available: true,
                description: 'Tests for software engineering',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Everton',
                schedule: 'Terça (8h-10h), Quinta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            await request(app).post('/protected/disciplines').send({
                id: 3,
                name: 'Processamento de Linguagem Natural',
                acronym: 'PLN',
                type: 'OPTATIVE',
                available: false,
                description: 'Machine Learning introduction',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Leandro Balby',
                schedule: 'Terça (10h-12h), Sexta (8h-10h)',
            }).set("Authorization", `Bearer ${token}`);

            await request(app).post('/protected/disciplines').send({
                id: 4,
                name: 'Interface Humano-Computador',
                acronym: 'IHC',
                type: 'OPTATIVE',
                available: true,
                description: 'Using Figma to create user interface (UX)',
                professor: 'Tiago Massoni',
                schedule: 'Terça (8h-10h), Quinta (10h-12h)',
            }).set("Authorization", `Bearer ${token}`);

            const response = await request(app).get('/disciplines');
            expect(response.body.message).toBe('Disciplines were found successfully!');
            expect(response.body.disciplines).toHaveLength(4);
            expect(response.status).toBe(200);
        });
    });

    describe("DeleteOneDiscipline should return 200 and a message", () => {

        test("deleteOneDiscipline should return 'No disciplines found!'", async () => {
            const response = await request(app).delete('/protected/disciplines/1').set("Authorization", `Bearer ${token}`);

            expect(response.body).toEqual({ message: 'No disciplines found!' });
            expect(response.status).toBe(404);
        });

        test('deleteOneDiscipline should return success message', async () => {

            const disciplineData = {
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: Type.OPTATIVE,
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            };

            await request(app).post('/protected/disciplines').send(disciplineData).set("Authorization", `Bearer ${token}`);

            const response = await request(app).delete(`/protected/disciplines/${disciplineData.id}`).set("Authorization", `Bearer ${token}`);

            expect(response.body).toEqual({ message: "Discipline was deleted successfully!", });
            expect(response.status).toBe(200);
        });

        test('deleteOneDiscipline should return 404 when discipline is not found', async () => {

            const disciplineData = {
                id: 1,
                name: 'Web II',
                acronym: 'Web II',
                type: Type.OPTATIVE,
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            };

            await request(app).post('/protected/disciplines').send(disciplineData).set("Authorization", `Bearer ${token}`);

            const response = await request(app).delete(`/protected/disciplines/-6`).set("Authorization", `Bearer ${token}`);

            expect(response.body).toEqual({ message: "Discipline not found!", });
            expect(response.status).toBe(404);
        });
    });

    describe("DeleteAllDisciplines should return 200 and a message", () => {

        test("deleteAllDisciplines should return 'No disciplines found!'", async () => {
            const response = await request(app).delete('/protected/disciplines').set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'No disciplines found!' });
        });

        test('deleteAllDisciplines should return success message', async () => {
            const disciplineData = {
                name: 'Web II',
                acronym: 'Web II',
                type: Type.OPTATIVE,
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            };

            await request(app).post('/protected/disciplines').send(disciplineData).set("Authorization", `Bearer ${token}`);
            const response = await request(app).delete('/protected/disciplines').set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "All disciplines were deleted successfully!", });
        });
    });
});

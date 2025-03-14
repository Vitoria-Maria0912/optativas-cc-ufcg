import { Type, PrismaClient } from '@prisma/client';
import app, { closeServer } from '../src/express/server';
import request from 'supertest';

describe('DisciplineController', () => {

    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsInJvbGUiOiJBRE1JTklTVFJBVE9SIiwibmFtZSI6IkFsaWNlIEpvaG5zb24iLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIiwibG9naW5JZCI6bnVsbCwiaWF0IjoxNzM2MDQ3ODUzfQ.W9CnU-tu1E_bNvaimZW0aKwpQd-dkpisBZLvEnhuFaM"

    afterEach(async () => { await request(app).delete('/protected/disciplines').set("Authorization", `Bearer ${TOKEN}`) });
    afterAll(async () => { closeServer(); await (new PrismaClient).$disconnect(); });

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
                .send(disciplineData).set("Authorization", `Bearer ${TOKEN}`);

            expect(response.body).toEqual({
                message: "Discipline created successfully!",
                discipline: disciplineData,
            });
            expect(response.status).toBe(201);
        });

        const testCases = [
            { name: "Type inválido", data: { type: "INVALID" }, expected: "Invalid type provided!" },
            { name: "Nome vazio", data: { name: "" }, expected: "Name is required!" },
            { name: "Nome já existente", data: { name: "Web II" }, expected: "Discipline already exists!" },
            { name: "Nome apenas números", data: { name: "12345" }, expected: "Invalid name format!" },
            { name: "Nome existente com caixa diferente", data: { name: "web ii" }, expected: "Discipline already exists!" },
            { name: "Sigla vazia", data: { acronym: "" }, expected: "Acronym is required!" },
            { name: "Sigla apenas números", data: { acronym: "123" }, expected: "Invalid acronym format!" },
            { name: "Nome do professor apenas números", data: { professor: "12345" }, expected: "Invalid professor name format!" },
            { name: "Disponibilidade inválida", data: { available: "maybe" }, expected: "Invalid availability value!" },
            { name: "Descrição apenas números", data: { description: "123456" }, expected: "Invalid description format!" },
            { name: "Sem pré ou pós-requisitos", data: { pre_requisites: [], post_requisites: [] }, expected: "Discipline created successfully!" },
            { name: "Pré ou pós-requisitos inexistentes", data: { pre_requisites: [999], post_requisites: [998] }, expected: "Invalid prerequisites or post-requisites!" },
            { name: "Horário apenas números", data: { schedule: "12345" }, expected: "Invalid schedule format!" }
        ];

        testCases.forEach(({ name, data, expected }) => {
            test(`Tentativa de criação de disciplina - ${ name }`, async () => {
                await request(app).post('/protected/disciplines').send({ name: 'Web II', acronym: 'Web II', type: Type.OPTATIVE }).set("Authorization", `Bearer ${TOKEN}`);
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
                    .set("Authorization", `Bearer ${TOKEN}`);

                expect(response.body.message).toEqual(expected);
                expect(response.status).toBe(expected === "Discipline created successfully!" ? 201 : 400);
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
                .send(disciplineData).set("Authorization", `Bearer ${TOKEN}`)

            const updateData = { available: false };

            const response = await request(app)
                .patch('/protected/disciplines/1')
                .send(updateData).set("Authorization", `Bearer ${TOKEN}`);

            expect(response.body).toEqual({
                message: "Discipline's field updated successfully!",
                discipline: { ...disciplineData, available: false },
            });
            expect(!response.body.discipline.available);
            expect(response.status).toBe(200);

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
                .send(disciplineData).set("Authorization", `Bearer ${TOKEN}`)

            const updateData = { available: false };

            const response = await request(app)
                .patch('/protected/disciplines/-3')
                .send(updateData).set("Authorization", `Bearer ${TOKEN}`);

            expect(response.body.message).toEqual("Discipline not found!");
            expect(response.status).toBe(404);

        });

        test("patchDiscipline should return 'No disciplines found!'", async () => {

            const updateData = { available: false };

            const response = await request(app).patch('/protected/disciplines/1').send(updateData).set("Authorization", `Bearer ${TOKEN}`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'No disciplines found!' });
        });
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
            }).set("Authorization", `Bearer ${TOKEN}`);

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
                available: true,
                description: 'Backend for web development',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            }).set("Authorization", `Bearer ${TOKEN}`);

            const response = await request(app).get('/disciplines/getByName/Princípios%20Dev%20Web');

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
            }).set("Authorization", `Bearer ${TOKEN}`);

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
            }).set("Authorization", `Bearer ${TOKEN}`);

            await request(app).post('/protected/disciplines').send({
                id: 2,
                name: 'Verificação e Validação de Software',
                acronym: 'VeV',
                type: 'OPTATIVE',
                available: true,
                description: 'Tests for software engineering',
                pre_requisites: ["ES", "PSoft"],
                post_requisites: [],
                professor: 'Everton',
                schedule: 'Terça (8h-10h), Quinta (10h-12h)',
            }).set("Authorization", `Bearer ${TOKEN}`);

            await request(app).post('/protected/disciplines').send({
                id: 3,
                name: 'Processamento de Linguagem Natural',
                acronym: 'PLN',
                type: 'OPTATIVE',
                available: false,
                description: 'Machine Learning introduction',
                pre_requisites: ["IA", "Linear"],
                post_requisites: [],
                professor: 'Leandro Balby',
                schedule: 'Terça (10h-12h), Sexta (8h-10h)',
            }).set("Authorization", `Bearer ${TOKEN}`);

            await request(app).post('/protected/disciplines').send({
                id: 4,
                name: 'Interface Humano-Computador',
                acronym: 'IHC',
                type: 'OPTATIVE',
                available: true,
                description: 'Using Figma to create user interface (UX)',
                pre_requisites: [],
                post_requisites: [],
                professor: 'Tiago Massoni',
                schedule: 'Terça (8h-10h), Quinta (10h-12h)',
            }).set("Authorization", `Bearer ${TOKEN}`);

            const response = await request(app).get('/disciplines');
            expect(response.body.message).toBe('Disciplines were found successfully!');
            expect(response.body.disciplines).toHaveLength(4);
            expect(response.status).toBe(200);
        });
    });

    describe("DeleteOneDiscipline should return 200 and a message", () => {

        test("deleteOneDiscipline should return 'No disciplines found!'", async () => {
            const response = await request(app).delete('/protected/disciplines/1').set("Authorization", `Bearer ${TOKEN}`);

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

            await request(app).post('/protected/disciplines').send(disciplineData).set("Authorization", `Bearer ${TOKEN}`);

            const response = await request(app).delete(`/protected/disciplines/${disciplineData.id}`).set("Authorization", `Bearer ${TOKEN}`);

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

            await request(app).post('/protected/disciplines').send(disciplineData).set("Authorization", `Bearer ${TOKEN}`);

            const response = await request(app).delete(`/protected/disciplines/-6`).set("Authorization", `Bearer ${TOKEN}`);

            expect(response.body).toEqual({ message: "Discipline not found!", });
            expect(response.status).toBe(404);
        });
    });

    describe("DeleteAllDisciplines should return 200 and a message", () => {

        test("deleteAllDisciplines should return 'No disciplines found!'", async () => {
            const response = await request(app).delete('/protected/disciplines').set("Authorization", `Bearer ${TOKEN}`);

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

            await request(app).post('/protected/disciplines').send(disciplineData).set("Authorization", `Bearer ${TOKEN}`);
            const response = await request(app).delete('/protected/disciplines').set("Authorization", `Bearer ${TOKEN}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "All disciplines were deleted successfully!", });
        });
    });
});

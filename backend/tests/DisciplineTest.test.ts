import { Type, PrismaClient } from '@prisma/client';
import app, { closeServer } from '../src/express/server';
import request from 'supertest';

describe('DisciplineController', () => {

    const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsInJvbGUiOiJBRE1JTklTVFJBVE9SIiwibmFtZSI6IkFsaWNlIEpvaG5zb24iLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIiwibG9naW5JZCI6bnVsbCwiaWF0IjoxNzM2MDQ3ODUzfQ.W9CnU-tu1E_bNvaimZW0aKwpQd-dkpisBZLvEnhuFaM"
    
    afterEach(async () => { await request(app).delete('/protected/disciplines').set("Authorization", `Bearer ${ TOKEN }`) });
    afterAll(async () => { closeServer(); await (new PrismaClient).$disconnect(); });

    test("createDiscipline should return 'Discipline created successfully!'", async () => {
        const disciplineData = {
            name: 'Web II',
            acronym: 'Web II',
            type: Type.OPTATIVE,
            available: true,
            description: 'Backend for web development',
            pre_requisites: [],
            post_requisites: [],
            teacher: 'Glauber',
            schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
        };
        const response = await request(app)
            .post('/protected/disciplines')
            .send(disciplineData).set("Authorization", `Bearer ${ TOKEN }`);

            expect(response.body).toEqual({
                message: "Discipline created successfully!",
                discipline: disciplineData,
            });
            expect(response.status).toBe(201);
    });

    test("deleteOneDiscipline should return 'No disciplines found!'", async () => {
    
        const response = await request(app).delete('/protected/disciplines/1').set("Authorization", `Bearer ${ TOKEN }`);
        
        expect(response.body).toEqual({ message: 'No disciplines found!'});
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
            teacher: 'Glauber',
            schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
        };

        await request(app).post('/protected/disciplines').send(disciplineData).set("Authorization", `Bearer ${ TOKEN }`);

        const response = await request(app).delete(`/protected/disciplines/${disciplineData.id}`).set("Authorization", `Bearer ${ TOKEN }`);

        expect(response.body).toEqual({ message: "Discipline was deleted successfully!", });
        expect(response.status).toBe(200);
    });

    test("deleteAllDisciplines should return 'No disciplines found!'", async () => {
        const response = await request(app).delete('/protected/disciplines').set("Authorization", `Bearer ${ TOKEN }`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'No disciplines found!'});
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
            teacher: 'Glauber',
            schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
        };

        await request(app).post('/protected/disciplines').send(disciplineData).set("Authorization", `Bearer ${ TOKEN }`);
        const response = await request(app).delete('/protected/disciplines').set("Authorization", `Bearer ${ TOKEN }`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "All disciplines were deleted successfully!",});
    });

    test("patchDiscipline should return 'No disciplines found!'", async () => {

        const updateData = { available: false };

        const response = await request(app).patch('/protected/disciplines/1').send(updateData).set("Authorization", `Bearer ${ TOKEN }`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'No disciplines found!'});
    });

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
            teacher: 'Glauber',
            schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
        };

        const test = await request(app)
            .post('/protected/disciplines')
            .send(disciplineData).set("Authorization", `Bearer ${ TOKEN }`)

        const updateData = { available: false };

        const response = await request(app)
            .patch('/protected/disciplines/1')
            .send(updateData).set("Authorization", `Bearer ${ TOKEN }`);
            
        expect(response.body).toEqual({
            message: "Discipline's field updated successfully!",
            discipline:  { ...disciplineData, available: false },
        });
        expect(!response.body.discipline.available);
        expect(response.status).toBe(200);

    });

    test("updateDiscipline should return 'No disciplines found!'", async () => {
        const disciplineData = {
            name: 'Web II',
            acronym: 'Web II',
            type: 'OPTATIVE',
            available: true,
            description: 'Backend for web development',
            pre_requisites: [],
            post_requisites: [],
            teacher: 'Glauber',
            schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
        };

        const response = await request(app)
           .put('/protected/disciplines/1')
           .send(disciplineData).set("Authorization", `Bearer ${ TOKEN }`);
        
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'No disciplines found!'});
    });

    test('updateDiscipline should return success message', async () => {

        await request(app).post('/protected/disciplines').send({
            id: 1,
            name: 'Web II',
            acronym: 'Web II',
            type: 'OPTATIVE',
            available: true,
            description: 'Backend for web development',
            pre_requisites: [],
            post_requisites: [],
            teacher: 'Glauber',
            schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
        }).set("Authorization", `Bearer ${ TOKEN }`);

        const disciplineData = {
            id: 1,
            name: 'Verificação e Validação de Software',
            acronym: 'VeV',
            type: 'OPTATIVE',
            available: true,
            description: 'Tests for software engineering',
            pre_requisites: ["ES", "PSoft"],
            post_requisites: [],
            teacher: 'Everton',
            schedule: 'Terça (8h-10h), Quinta (10h-12h)',
        };

        const response = await request(app)
           .put(`/protected/disciplines/${disciplineData.id}`)
           .send(disciplineData).set("Authorization", `Bearer ${ TOKEN }`);
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Discipline updated successfully!",
            discipline: disciplineData,
        });
    });

    test("getOneDisciplineByID should return 'No disciplines found!'", async () => {

        const response = await request(app).get('/disciplines/getByID/1');

        expect(response.body).toEqual({ message: 'No disciplines found!'});
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
            teacher: 'Glauber',
            schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
        }).set("Authorization", `Bearer ${ TOKEN }`);

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
                teacher: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            },
        });
        expect(response.status).toBe(200);
    });

    test("getOneDisciplineByName should return 'No disciplines found!'", async () => {

        const response = await request(app).get('/disciplines/getByName/TC');

        expect(response.body).toEqual({ message: 'No disciplines found!'});
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
            teacher: 'Glauber',
            schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
        }).set("Authorization", `Bearer ${ TOKEN }`);

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
                teacher: 'Glauber',
                schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
            },
        });
        expect(response.status).toBe(200);
    });

    test("getAllDisciplines should return 'No disciplines found!'", async () => {
        const response = await request(app).get('/disciplines');
        expect(response.body).toEqual({ message: 'No disciplines found!'});
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
            teacher: 'Glauber',
            schedule: 'Segunda (8h-10h), Quarta (10h-12h)',
        }).set("Authorization", `Bearer ${ TOKEN }`);

        await request(app).post('/protected/disciplines').send({
            id: 2,
            name: 'Verificação e Validação de Software',
            acronym: 'VeV',
            type: 'OPTATIVE',
            available: true,
            description: 'Tests for software engineering',
            pre_requisites: ["ES", "PSoft"],
            post_requisites: [],
            teacher: 'Everton',
            schedule: 'Terça (8h-10h), Quinta (10h-12h)',
        }).set("Authorization", `Bearer ${ TOKEN }`);

        await request(app).post('/protected/disciplines').send({
            id: 3,
            name: 'Processamento de Linguagem Natural',
            acronym: 'PLN',
            type: 'OPTATIVE',
            available: false,
            description: 'Machine Learning introduction',
            pre_requisites: ["IA", "Linear"],
            post_requisites: [],
            teacher: 'Leandro Balby',
            schedule: 'Terça (10h-12h), Sexta (8h-10h)',
        }).set("Authorization", `Bearer ${ TOKEN }`);

        await request(app).post('/protected/disciplines').send({
            id: 4,
            name: 'Interface Humano-Computador',
            acronym: 'IHC',
            type: 'OPTATIVE',
            available: true,
            description: 'Using Figma to create user interface (UX)',
            pre_requisites: [],
            post_requisites: [],
            teacher: 'Tiago Massoni',
            schedule: 'Terça (8h-10h), Quinta (10h-12h)',
        }).set("Authorization", `Bearer ${ TOKEN }`);

        const response = await request(app).get('/disciplines');
        expect(response.body.message).toBe('Disciplines were found successfully!');
        expect(response.body.disciplines).toHaveLength(4); 
        expect(response.status).toBe(200);
    });

});

import { Role, PrismaClient } from '@prisma/client';
import app, { closeServer } from '../src/express/server';
import request from 'supertest';

describe('PlanningController', () => {

    const prismaClient = new PrismaClient();
        

    afterAll(async () => { 
        closeServer(); await prismaClient.$disconnect(); 
    });

    describe("CreatePlanning should return 201", () => {

        const testCases = [
            { name: "Create planning successfully", data: { name: "Semester 1", periods: [1, 2] }, expected: "Planning created successfully!", code: 201 },
            { name: "error name cannot be empty", data: { name: "", periods: [1, 2] }, expected: "Name is required!", code: 400 },
            { name: "error name cannot contains only numbers", data: { name: "12345", periods: [1, 2] }, expected: "Name cannot contain only numbers!", code: 400 },
            { name: "error planning with this name already exists", data: { name: "Semester 1", periods: [1, 2] }, expected: "Planning with this name already exists!", code: 400 },
            { name: "error planning with this name already exists", data: { name: "semester 1", periods: [1, 2] }, expected: "Planning with this name already exists!", code: 400 },
            { name: "error period needs to exist", data: { name: "New Plan", periods: [99, 100] }, expected: "Some periods do not exist!", code: 400 },
            { name: "error user needs to exist", data: { name: "New Plan", periods: [1, 2], userId: 999 }, expected: "User does not exist!", code: 400 },
        ];
    
        testCases.forEach(({ name, data, expected, code }) => {
            test(`Create planning should return ${ code } - '${ name }'`, async () => {
                const response = await request(app).post("/plannings").send(data);

                expect(response.body.message).toEqual(expected);
                expect(response.status).toBe(code);
            });
        });
    });
    
    describe("UpdatePlanning should return 200", () => {
        const testCases = [
            { name: "Update planning successfully", data: { id: 0, name: "Updated Plan", periods: [3, 4] }, expected: "Planning updated successfully!", code: 200 },
            { name: "error name cannot be empty", data: { id: 0, name: "" }, expected: "Name is required!", code: 400 },
            { name: "error name cannot contains only numbers", data: { id: 0, name: "67890" }, expected: "Name cannot contain only numbers!", code: 400 },
            { name: "error planning with this name already exists", data: { id: 0, name: "Semester 1" }, expected: "Planning with this name already exists!", code: 400 },
            { name: "error planning with this name already exists", data: { id: 0, name: "semester 1" }, expected: "Planning with this name already exists!", code: 400 },
            { name: "error period needs to exist", data: { id: 0, periods: [99, 100] }, expected: "Some periods do not exist!", code: 400 },
            { name: "error user needs to exist", data: { id: 0, userId: 999 }, expected: "User does not exist!", code: 400 },
        ];
        
        testCases.forEach(({ name, data, expected, code }) => {
            test(`Update planning should return ${ code } - ${ name }`, async () => {
                const response = await request(app)
                                .put(`/plannings`).send(data)
                expect(response.body.message).toEqual(expected);
                expect(response.status).toBe(code);
            });
        });
    });

    describe("GetOnePlanning should return 201", () => {
        const testCases = [
            { name: "Retrieve planning by ID successfully", id: 1, expected: "Planning found!", code: 200 },
            { name: "Retrieve non-existent planning by ID", id: 999, expected: "Planning not found!", code: 404 },
            { name: "Retrieve planning with non-numeric ID", id: "abc", expected: "Invalid ID format!", code: 400 },
        ];
        testCases.forEach(({ name, id, expected, code }) => {
            test(`GetOnePlanning should return ${ code } - '${ name }'`, async () => {
                
                const response = await request(app).get(`/plannings/${ id }`)
    
                expect(response.body.message).toEqual(expected);
                expect(response.status).toBe(code);
            });
        });
    });

    describe("GetAllPlannings should return 201", () => {
        const testCases = [
            { name: "Retrieve all plannings by user ID successfully", userId: 1, expected: "Plannings retrieved successfully!", code: 200 },
            { name: "Retrieve all plannings by user ID with no plannings", userId: 2, expected: "No plannings found!", code: 200 },
        ];
        
        testCases.forEach(({ name, expected, code }) => {
            test(`GetAllPlannings should return ${ code } - '${ name }'`, async () => {
                
                const response = await request(app).get(`/plannings`)
    
                expect(response.body.message).toEqual(expected);
                expect(response.status).toBe(code);
            });
        });
    });

    describe("DeleteOnePlanning should return 201", () => {
        const testCases = [
            { name: "Delete planning successfully", id: 1, expected: "Planning deleted successfully!", code: 200 },
            { name: "Delete non-existent planning", id: 999, expected: "Planning not found!", code: 404 }
        ];
        
        testCases.forEach(({ name, id, expected, code }) => {
            test(`DeleteOnePlanning should return ${ code } - '${ name }'`, async () => {
                
            const response = await request(app).delete(`/plannings/${ id }`)

            expect(response.body.message).toEqual(expected);
            expect(response.status).toBe(code);
            });
        });
    });
});

import { PrismaClient } from '@prisma/client';
import { app, closeServer } from '../src/express/server';
import request from 'supertest';

describe('DisciplineController', () => {
    
    afterAll(async () => { closeServer(); await (new PrismaClient).$disconnect(); });

    test("", async () => {});
});

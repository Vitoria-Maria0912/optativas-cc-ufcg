import { PrismaClient } from '@prisma/client';
import { closeServer } from '../src/express/server';

describe('DisciplineController', () => {
    
    afterAll(async () => { closeServer(); await (new PrismaClient).$disconnect(); });

    test("", async () => {});
});

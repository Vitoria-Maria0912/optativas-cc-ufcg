import { PrismaClient } from "@prisma/client";
import { Discipline } from "../model/Discipline";
import { DisciplineDTO } from "../dtos/DisciplineDTO";

export interface DisciplineRepositoryInterface {
    createDiscipline(discipline:  Discipline): Promise<Discipline>;
    deleteOneDiscipline(idDiscipline:  number): Promise<void>;
    deleteAllDisciplines(): Promise<void>;
    patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void>;
    getOneDisciplineByID(idDiscipline: number): Promise<Discipline>;
    getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO>;
    getAllDisciplines(offset: number, limit: number): Promise<{disciplines: Discipline[], total: number}>;
    getAmountOfDisciplines(): Promise<number>;
} 

export class DisciplineRepository implements DisciplineRepositoryInterface {
    
    private prisma: PrismaClient = new PrismaClient();

    async createDiscipline(discipline: Discipline): Promise<Discipline> {
        return await this.prisma.discipline.create({
            data: {
                id: discipline.id,
                type: discipline.type,
                name: discipline.name,
                acronym: discipline.acronym,
                available: discipline.available,
                description: discipline.description,
                pre_requisites: discipline.pre_requisites,
                post_requisites: discipline.post_requisites,
                teacher: discipline.teacher,
                schedule: discipline.schedule,
            },
        });
    }

    async deleteOneDiscipline(idDiscipline: number): Promise<void> {
        await this.prisma.discipline.delete({where: {id: idDiscipline}})
    }

    async deleteAllDisciplines(): Promise<void> {
        await this.prisma.discipline.deleteMany();
    }
    
    async getOneDisciplineByID(idDiscipline: number): Promise<Discipline> {
        return await this.prisma.discipline.findUniqueOrThrow({ where: {id: idDiscipline }})
    }

    async getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO> {
        return await this.prisma.discipline.findUniqueOrThrow({ where: {name: disciplineName }})
    }

    async patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void> {
        await this.prisma.discipline.update({ where: { id: idDiscipline }, data: updates });
    }
    
    async getAllDisciplines(offset: number, limit: number): Promise<{disciplines: Discipline[], total: number}> {
        const [disciplines, total] = await Promise.all([
            this.prisma.discipline.findMany({
                skip: offset,
                take: limit
            }),
            this.prisma.discipline.count()
        ]);
        
        return {disciplines, total};
    }

    async getAmountOfDisciplines(): Promise<number> {
        return await this.prisma.discipline.count();
    }
    
}
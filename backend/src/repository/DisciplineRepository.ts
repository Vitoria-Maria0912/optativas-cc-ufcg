import { PrismaClient } from "@prisma/client";
import { Discipline } from "../model/Discipline";
import { DisciplineDTO } from "../dtos/DisciplineDTO";

export interface DisciplineRepositoryInterface {
    createDiscipline(discipline:  Discipline): Promise<Discipline>;
    patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void>;
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

    async patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void> {
        await this.prisma.discipline.update({ where: { id: idDiscipline }, data: updates });
    }
}
import { PrismaClient } from "@prisma/client";
import { Discipline } from "../model/Discipline";
import { DisciplineDTO } from "../dtos/DisciplineDTO";

export interface DisciplineRepositoryInterface {
    createDiscipline(discipline: Discipline): Promise<Discipline>;
    deleteOneDiscipline(idDiscipline: number): Promise<void>;
    deleteAllDisciplines(): Promise<void>;
    patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void>;
    getOneDisciplineByID(idDiscipline: number): Promise<Discipline>;
    getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO>;
    getAllDisciplines(): Promise<Discipline[]>;
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
                professor: discipline.professor,
                schedule: discipline.schedule,
            },
        });
    }

    async deleteOneDiscipline(idDiscipline: number): Promise<void> {
        await this.prisma.discipline.delete({ where: { id: idDiscipline } })
    }

    async deleteAllDisciplines(): Promise<void> {
        await this.prisma.discipline.deleteMany();
    }

    async getOneDisciplineByID(idDiscipline: number): Promise<Discipline> {
        return await this.prisma.discipline.findUniqueOrThrow({ where: { id: idDiscipline } })
    }

    async getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO> {
        return await this.prisma.discipline.findUniqueOrThrow({ where: { name: disciplineName } })
    }

    async patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void> {
        await this.prisma.discipline.update({ where: { id: idDiscipline }, data: updates });
    }

    async getAllDisciplines(): Promise<Discipline[]> {
        return await this.prisma.discipline.findMany();
    }
}
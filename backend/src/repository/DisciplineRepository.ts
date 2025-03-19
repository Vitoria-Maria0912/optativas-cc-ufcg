import { Type } from "@prisma/client";
import { Discipline } from "../model/Discipline";
import { DisciplineDTO } from "../dtos/DisciplineDTO";
import prismaClient from "../util/util";

export interface DisciplineRepositoryInterface {
    createDiscipline(discipline: Discipline): Promise<Discipline>;
    deleteOneDiscipline(idDiscipline: number): Promise<void>;
    deleteAllDisciplines(): Promise<void>;
    patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void>;
    getOneDisciplineByID(idDiscipline: number): Promise<Discipline>;
    getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO>;
    getAllDisciplines(offset: number, limit: number): Promise<{disciplines: Discipline[], total: number}>;
    getAmountOfDisciplines(): Promise<number>;
    getOneDisciplineByAcronym(disciplineAcronym: string): Promise<DisciplineDTO>;

} 

export class DisciplineRepository implements DisciplineRepositoryInterface {

    async createDiscipline(discipline: Discipline): Promise<Discipline> {
        return await prismaClient.discipline.create({
            data: {
                id: discipline.id,
                type: discipline.type ?? Type.OBRIGATORY,
                name: discipline.name,
                acronym: discipline.acronym,
                available: discipline.available ?? true,
                description: discipline.description ?? '',
                pre_requisites: discipline.pre_requisites,
                post_requisites: discipline.post_requisites,
                professor: discipline.professor ?? 'Not specified',
                schedule: discipline.schedule ?? 'Not specified',
            },
        });
    }

    async deleteOneDiscipline(idDiscipline: number): Promise<void> {
        await prismaClient.discipline.delete({ where: { id: idDiscipline } })
    }

    async deleteAllDisciplines(): Promise<void> {
        await prismaClient.discipline.deleteMany();
    }

    async getOneDisciplineByID(idDiscipline: number): Promise<Discipline> {
        return await prismaClient.discipline.findUniqueOrThrow({ 
            where: { id: idDiscipline }, 
            select: { id: true, type: true, name: true, acronym: true, available: true, description: true, pre_requisites: true, post_requisites: true, professor: true, schedule: true } 
        });
    }

    async getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO> {
        return await prismaClient.discipline.findFirstOrThrow({ 
            where: { name: { equals: disciplineName, mode: 'insensitive'}, },
            select: { id: true, type: true, name: true, acronym: true, available: true, description: true, pre_requisites: true, post_requisites: true, professor: true, schedule: true } 
        })
    }

    async patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void> {
        await prismaClient.discipline.update({ where: { id: idDiscipline }, data: updates });
    }
    
    async getAllDisciplines(offset: number, limit: number): Promise<{disciplines: Discipline[], total: number}> {
        const [disciplines, total] = await Promise.all([
            prismaClient.discipline.findMany({
                skip: offset,
                take: limit
            }),
            prismaClient.discipline.count()
        ]);
        
        return {disciplines, total};
    }

    async getAmountOfDisciplines(): Promise<number> {
        return await prismaClient.discipline.count();
    }

    async getOneDisciplineByAcronym(disciplineAcronym: string): Promise<DisciplineDTO> {

        return await prismaClient.discipline.findFirstOrThrow({ where: {acronym: {equals: disciplineAcronym, mode: "insensitive"} }})
    }
}
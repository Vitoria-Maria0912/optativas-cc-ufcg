import { DisciplineAlreadyRegisteredError, InvalidFieldError, NotFoundError } from "../errorHandler/ErrorHandler";
import { DisciplineRepository, DisciplineRepositoryInterface } from "../repository/DisciplineRepository";
import { DisciplineDTO } from "../dtos/DisciplineDTO";
import { Discipline } from "../model/Discipline";
import { Prisma } from "@prisma/client";
import { validateDisciplineFields } from "../util/util";

export interface DisciplineServiceInterface {
    createDiscipline(disciplineDTO:  DisciplineDTO): Promise<DisciplineDTO>;
    patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void>;
    deleteOneDiscipline(idDiscipline: number): Promise<void>;
    deleteAllDisciplines(): Promise<void>;
    getOneDisciplineByID(idDiscipline: number): Promise<DisciplineDTO>;
    getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO>;
    getAllDisciplines(): Promise<DisciplineDTO[]>;
} 

export class DisciplineService implements DisciplineServiceInterface {
    
    private disciplineRepository: DisciplineRepositoryInterface = new DisciplineRepository; 
    
    async createDiscipline(disciplineDTO: DisciplineDTO): Promise<DisciplineDTO> {
        try { 
            let discipline = new Discipline(disciplineDTO);  
            await validateDisciplineFields(discipline);
            return await this.disciplineRepository.createDiscipline(discipline);

        } catch (error: any) {
            if (error instanceof InvalidFieldError || error instanceof DisciplineAlreadyRegisteredError) { throw error; }
            else { throw new Error("Error trying to create a discipline!"); }
        }
    }

    async deleteOneDiscipline(idDiscipline: number): Promise<void> {
        if ((await this.getAllDisciplines()).length === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        const discipline = await this.getOneDisciplineByID(idDiscipline);
        if (!discipline) { throw new NotFoundError(`Discipline not found!`); }
        await this.disciplineRepository.deleteOneDiscipline(idDiscipline);
    }
    
    async deleteAllDisciplines(): Promise<void> {
        if ((await this.getAllDisciplines()).length === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        await this.disciplineRepository.deleteAllDisciplines();
    }

    async patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void> {
        if ((await this.getAllDisciplines()).length === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        try {
            const discipline = await this.getOneDisciplineByID(idDiscipline);
            if(await validateDisciplineFields(discipline)){
                await this.disciplineRepository.patchDiscipline(idDiscipline, updates);
            }
        } catch (error) { if(error instanceof NotFoundError){ throw error; } }
    }

    async getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO> {
        if ((await this.getAllDisciplines()).length === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        try { return await this.disciplineRepository.getOneDisciplineByName(disciplineName);
        } catch (error) { throw new NotFoundError('Discipline not found!'); }
    }

    async getOneDisciplineByID(idDiscipline: number): Promise<DisciplineDTO> {
        if ((await this.getAllDisciplines()).length === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        try { return await this.disciplineRepository.getOneDisciplineByID(idDiscipline);
        } catch (error) { throw new NotFoundError('Discipline not found!'); }
    }

    async getAllDisciplines(): Promise<DisciplineDTO[]> {
        
        const disciplines = await this.disciplineRepository.getAllDisciplines();

        if (disciplines.length === 0) { throw new NotFoundError('No disciplines found!'); }
        return disciplines;
    }  
}
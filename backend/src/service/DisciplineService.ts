import { DisciplineAlreadyRegisteredError, InvalidFieldError, NotFoundError } from "../errorHandler/ErrorHandler";
import { DisciplineRepository, DisciplineRepositoryInterface } from "../repository/DisciplineRepository";
import { validateDisciplineExistence, validateDisciplineFields } from "../util/util";
import { DisciplineDTO } from "../dtos/DisciplineDTO";
import { Discipline } from "../model/Discipline";

export interface DisciplineServiceInterface {
    createDiscipline(disciplineDTO:  DisciplineDTO): Promise<DisciplineDTO>;
    patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void>;
    deleteOneDiscipline(idDiscipline: number): Promise<void>;
    deleteAllDisciplines(): Promise<void>;
    getOneDisciplineByID(idDiscipline: number): Promise<DisciplineDTO>;
    getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO>;
    getAllDisciplines(offset: number, limit: number): Promise<{disciplines: DisciplineDTO[], total: number}>;
} 

export class DisciplineService implements DisciplineServiceInterface {
    
    private disciplineRepository: DisciplineRepositoryInterface = new DisciplineRepository; 
    
    async createDiscipline(disciplineDTO: DisciplineDTO): Promise<DisciplineDTO> {
        try { 
            let discipline = new Discipline(disciplineDTO);  
            await validateDisciplineExistence(discipline);
            await validateDisciplineFields(discipline);
            return await this.disciplineRepository.createDiscipline(discipline);

        } catch (error: any) {
            if (error instanceof InvalidFieldError || error instanceof DisciplineAlreadyRegisteredError) { throw error; }
            else { throw new Error("Error trying to create a discipline!"); }
        }
    }

    async deleteOneDiscipline(idDiscipline: number): Promise<void> {
        if ((await this.getAmountOfDisciplines()) === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        const discipline = await this.getOneDisciplineByID(idDiscipline);
        if (!discipline) { throw new NotFoundError(`Discipline not found!`); }
        await this.disciplineRepository.deleteOneDiscipline(idDiscipline);
    }
    
    async deleteAllDisciplines(): Promise<void> {
        if ((await this.getAmountOfDisciplines()) === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        await this.disciplineRepository.deleteAllDisciplines();
    }

    async patchDiscipline(idDiscipline: number, updates: Partial<Omit<Discipline, 'id'>>): Promise<void> {
        if ((await this.getAmountOfDisciplines()) === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        try {
            const discipline = await this.getOneDisciplineByID(idDiscipline);
            if(await validateDisciplineFields(discipline)){
                await this.disciplineRepository.patchDiscipline(idDiscipline, updates);
            }
        } catch (error) { throw error; }
    }

    async getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO> {
        if ((await this.getAmountOfDisciplines()) === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        try { return await this.disciplineRepository.getOneDisciplineByName(disciplineName);
        } catch (error) { throw new NotFoundError('Discipline not found!'); }
    }

    async getOneDisciplineByID(idDiscipline: number): Promise<DisciplineDTO> {
        if ((await this.getAmountOfDisciplines()) === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        try { return await this.disciplineRepository.getOneDisciplineByID(idDiscipline);
        } catch (error) { throw new NotFoundError('Discipline not found!'); }
    }

    async getAmountOfDisciplines(): Promise<number> {
        return await this.disciplineRepository.getAmountOfDisciplines();
    }
    

    async getAllDisciplines(offset: number, limit: number): Promise<{disciplines: DisciplineDTO[], total: number}> {
        
        const {disciplines, total} = await this.disciplineRepository.getAllDisciplines(offset, limit);

        if (disciplines.length === 0) { throw new NotFoundError('No disciplines found!'); }
        return {disciplines, total};
    }  
}
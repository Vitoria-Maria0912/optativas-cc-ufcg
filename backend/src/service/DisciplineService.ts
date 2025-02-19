import { DisciplineAlreadyRegisteredError, InvalidFieldError, NotFoundError } from "../errorHandler/ErrorHandler";
import { DisciplineRepository, DisciplineRepositoryInterface } from "../repository/DisciplineRepository";
import { DisciplineDTO } from "../dtos/DisciplineDTO";
import { Discipline } from "../model/Discipline";
import { Prisma } from "@prisma/client";

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
            this.validate(discipline);
            return await this.disciplineRepository.createDiscipline(discipline);

        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && 
                error.code === 'P2002') { throw new DisciplineAlreadyRegisteredError('Discipline already exists!'); 
            } throw error;
        }
    }

    async deleteOneDiscipline(idDiscipline: number): Promise<void> {
        if ((await this.getAllDisciplines()).length === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        const discipline = await this.disciplineRepository.getOneDisciplineByID(idDiscipline);
        if (!discipline) {
            throw new NotFoundError(`Discipline not found!`);
        }
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
        const discipline = await this.disciplineRepository.getOneDisciplineByID(idDiscipline);
        if(this.validate(discipline)){
            await this.disciplineRepository.patchDiscipline(idDiscipline, updates);
        } else {
            throw new NotFoundError(`Discipline not found!`);
        }
    }

    async getOneDisciplineByName(disciplineName: string): Promise<DisciplineDTO> {
        if ((await this.getAllDisciplines()).length === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        try { return await this.disciplineRepository.getOneDisciplineByName(disciplineName);
        } catch (error) {
            throw new NotFoundError('Discipline not found!');
        }
    }

    async getOneDisciplineByID(idDiscipline: number): Promise<DisciplineDTO> {
        if ((await this.getAllDisciplines()).length === 0) {
            throw new NotFoundError('No disciplines found!');
        }
        try { return await this.disciplineRepository.getOneDisciplineByID(idDiscipline);
        } catch (error) {
            throw new NotFoundError('Discipline not found!');
        }
    }

    async getAllDisciplines(): Promise<DisciplineDTO[]> {
        
        const disciplines = await this.disciplineRepository.getAllDisciplines();

        if (disciplines.length === 0) { throw new NotFoundError('No disciplines found!'); }
        return disciplines;
    }  

    private validate(discipline: Discipline): boolean {

        const stringProperties = [
            { name: 'name', value: discipline.name },
            { name: 'acronym', value: discipline.acronym },
        ];    

        stringProperties.forEach(property => {
            if(!property.value || (typeof property.value === 'string' && property.value.trim() === '')) {
                throw new InvalidFieldError(`Discipline's ${property.name} cannot be empty!`);
            }
        });

        discipline.pre_requisites.forEach(req => {
            if(!req) { throw new InvalidFieldError('A pre requisite cannot be a empty word!'); }
        });

        discipline.post_requisites.forEach(req => {
            if(!req) { throw new InvalidFieldError('A post requisite cannot be a empty word!'); }
        });
        
        return true;
    }
}
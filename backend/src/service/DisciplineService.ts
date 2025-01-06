import { DisciplineAlreadyRegisteredError, InvalidFieldError } from "../errorHandler/ErrorHandler";
import { DisciplineRepository, DisciplineRepositoryInterface } from "../repository/DisciplineRepository";
import { DisciplineDTO } from "../dtos/DisciplineDTO";
import { Discipline } from "../model/Discipline";
import { Prisma } from "@prisma/client";

export interface DisciplineServiceInterface {
    createDiscipline(disciplineDTO:  DisciplineDTO): Promise<DisciplineDTO>;
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
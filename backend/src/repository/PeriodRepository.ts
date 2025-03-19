import { Period } from "../model/Period";
import prismaClient from "../util/util";

export interface PeriodRepositoryInterface {
    createPeriod(period: Period): Promise<Period>;
    updatePeriod(period: Period): Promise<Period>;
}

export class PeriodRepository implements PeriodRepositoryInterface {

    async createPeriod(period: any): Promise<Period> {

        const createdPeriod = await prismaClient.period.create({
            data: {
                name: period.name,
                disciplines: period.disciplines.length > 0
                    ? { connect: period.disciplines.map((id: number) => ({ id })) }
                    : undefined, 
            },
            include: {disciplines: true}
        });
        
        return new Period(createdPeriod.id, createdPeriod.name, createdPeriod.planningId ?? undefined, createdPeriod.disciplines || []);
    }
    
    async updatePeriod(period: any): Promise<Period> {    
        const existingPeriod = await prismaClient.period.findUnique({
            where: { id: period.id },
            include: { disciplines: true }
        });
    
        const existingDisciplineIds = existingPeriod?.disciplines.map((discipline: any) => discipline.id) || [];
    
        const connectDisciplines = period.disciplines.filter((id: number) => !existingDisciplineIds.includes(id));
    
        const disconnectDisciplines = existingDisciplineIds.filter((id: number) => !period.disciplines.includes(id));
    
        const updatedPeriod = await prismaClient.period.update({
            where: { id: period.id },
            data: {
                name: period.name,
                disciplines: {
                    connect: connectDisciplines.map((id: number) => ({ id })),
                    disconnect: disconnectDisciplines.map((id: number) => ({ id })),
                },
            },
            include: { disciplines: true },
        });
    
        return new Period(updatedPeriod.id, updatedPeriod.name, updatedPeriod.planningId ?? undefined, updatedPeriod.disciplines || []);
    }    

}

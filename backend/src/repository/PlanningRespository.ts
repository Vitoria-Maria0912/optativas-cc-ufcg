import { Planning } from "../model/Planning";
import { PeriodDTO } from "../dtos/PeriodDTO";
import prismaClient from "../util/util";

export interface PlanningRepositoryInterface {
    createPlanning(planning: Planning): Promise<Planning>;
    addPeriods(planningId: number, periodIds: number[]): Promise<Planning>;
    updateName(planningId: number, newName: string): Promise<Planning>;
    getAll(): Promise<Planning[]>;
    getAllByEmail(email: string): Promise<Planning[]>;
    getOneById(id: number): Promise<Planning>;
}

export class PlanningRepository implements PlanningRepositoryInterface {
    
    async createPlanning(planning: Planning): Promise<Planning> {
        const createdPlanning = await prismaClient.planning.create({
            data: {
                name: planning.name,
                periods: { create: []},
                user: {
                    connect: {
                      id: planning.userId,
                    }
                }
            }
        })
        
        return new Planning(createdPlanning.id, createdPlanning.userId, createdPlanning.name, []);
    }
    
    async addPeriods(planningId: number, periodIds: []): Promise<Planning> {
        await prismaClient.period.updateMany({
            where: { id: { in: periodIds } },
            data: { planningId: planningId }
        });
        
        const updatedPlanning = await prismaClient.planning.findUnique({
            where: { id: planningId },
            include: { periods: { include: { disciplines: true } } }
        });
        
        if (!updatedPlanning) {
            throw new Error(`Planning with ID ${planningId} not found.`);
        }
        
        const periodsDTO = updatedPlanning.periods.map(period =>
            new PeriodDTO(period.id, period.name, period.planningId ?? 0, period.disciplines || [])
        );
        
        return new Planning(updatedPlanning.id, updatedPlanning.userId, updatedPlanning.name, periodsDTO);
        
    }
    
    async updateName(planningId: number, newName: string): Promise<Planning> {
        const updatedPlanning = await prismaClient.planning.update({
            where: { id: planningId },
            data: { name: newName },
            include: { periods: { include: { disciplines: true } } }
        });

        const periodsDTO = updatedPlanning.periods.map((period: any) => {
            return {
                id: period.id,
                name: period.name,
                planningId: period.planningId,
                disciplines: period.disciplines || [],
            };
        });

        return new Planning(updatedPlanning.id, updatedPlanning.userId, updatedPlanning.name, periodsDTO);
    }
    
    async getAllByEmail(email: string): Promise<Planning[]> {
        const user = await prismaClient.user.findUnique({
            where: { email },
            include: {
                plannings: {
                    include: {
                        periods: { include: { disciplines: true } },
                    },
                },
            },
        });
    
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
    
        return user.plannings.map(planning => {
            const periodsDTO = planning.periods.map(period =>
                new PeriodDTO(period.id, period.name, period.planningId ?? 0, period.disciplines || [])
            );
            return new Planning(planning.id, planning.userId, planning.name, periodsDTO);
        });
    }
    
    
    async getAll(): Promise<Planning[]> {
        const allPlannings = await prismaClient.planning.findMany({
            include: {
                periods: { include: { disciplines: true } },
            },
        });
        
        return allPlannings.map(planning => {
            const periodsDTO = planning.periods.map(period =>
                new PeriodDTO(period.id, period.name, period.planningId ?? 0, period.disciplines || [])
            );
            return new Planning(planning.id, planning.userId, planning.name, periodsDTO);
        });
    }
    
    async getOneById(planningId: number): Promise<Planning> {
        const planning = await prismaClient.planning.findUnique({
            where: { id: planningId },
            include: {
                periods: { include: { disciplines: true } },
            },
        });
        
        if (!planning) {
            throw new Error(`Planning with ID ${planningId} not found.`);
        }
    
        const periodsDTO = planning.periods.map(period =>
            new PeriodDTO(period.id, period.name, period.planningId ?? 0, period.disciplines || [])
        );
    
        return new Planning(planning.id, planning.userId, planning.name, periodsDTO);
    }
    
}

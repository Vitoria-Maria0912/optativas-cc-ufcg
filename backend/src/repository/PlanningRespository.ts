import { PrismaClient } from "@prisma/client";
import { Discipline } from "../model/Discipline";
import { Planning } from "../model/Planning";
import { Period } from "../model/Period";
import { PeriodDTO } from "../dtos/PeriodDTO";
import { PlanningDTO } from "../dtos/PlanningDTO";

export interface PlanningRepositoryInterface {
    createPlanning(planning: Planning): Promise<Planning>;
    addPeriods(planningId: number, periodIds: number[]): Promise<Planning>;
    updateName(planningId: number, newName: string): Promise<Planning>;
    getAll(): Promise<Planning[]>;
}

export class PlanningRepository implements PlanningRepositoryInterface {
    private prisma: PrismaClient = new PrismaClient();
    
    async createPlanning(planning: Planning): Promise<Planning> {
        const createdPlanning = await this.prisma.planning.create({
            data: {
                name: planning.name,
                periods: { create: []},
            }
        })
        
        return new Planning(createdPlanning.id, createdPlanning.name, []);
    }
    
    async addPeriods(planningId: number, periodIds: []): Promise<Planning> {
        await this.prisma.period.updateMany({
            where: { id: { in: periodIds } },
            data: { planningId: planningId }
        });
        
        const updatedPlanning = await this.prisma.planning.findUnique({
            where: { id: planningId },
            include: { periods: { include: { disciplines: true } } }
        });

        if (!updatedPlanning) {
            throw new Error(`Planning with ID ${planningId} not found.`);
        }
        
        const periodsDTO = updatedPlanning.periods.map(period =>
            new PeriodDTO(period.id, period.name, period.planningId ?? 0, period.disciplines || [])
        );
        
        return new Planning(updatedPlanning.id, updatedPlanning.name, periodsDTO);
        
    }
    
    async updateName(planningId: number, newName: string): Promise<Planning> {
        const updatedPlanning = await this.prisma.planning.update({
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

        return new Planning(updatedPlanning.id, updatedPlanning.name, periodsDTO);
    }

    async getAll(): Promise<Planning[]> {
        const allPlannings = await this.prisma.planning.findMany({
            include: {
                periods: { include: { disciplines: true } },
            },
        });
    
        return allPlannings.map(planning => {
            const periodsDTO = planning.periods.map(period =>
                new PeriodDTO(period.id, period.name, period.planningId ?? 0, period.disciplines || [])
            );
            return new Planning(planning.id, planning.name, periodsDTO);
        });
    }    
}

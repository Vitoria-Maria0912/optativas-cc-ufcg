import { PrismaClient } from "@prisma/client";
import { Discipline } from "../model/Discipline";
import { Planning } from "../model/Planning";
import { Period } from "../model/Period";

export interface PlanningRepositoryInterface {
    createPlanning(planning: Planning): Promise<Planning>;
}

export class PlanningRepository implements PlanningRepositoryInterface {
    private prisma: PrismaClient = new PrismaClient();

    async createPlanning(planning: Planning): Promise<Planning> {
        const createdPlanning = await this.prisma.planning.create({
            data: {
                name: planning.name,
                periods: {
                    create: planning.periods.map(period => ({
                        planningId: undefined,
                        name: period.name,
                        disciplines: {
                            connect: period.disciplines.map(discipline => ({
                                id: discipline.id  // Conectar as disciplinas existentes
                            }))
                        },
                    }))
                }
            },
            include: {
                periods: {
                    include: {
                        disciplines: true
                    }
                }
            }
        });

        await this.prisma.period.updateMany({
            where: {
                planningId: undefined
            },
            data: {
                planningId: createdPlanning.id
            }
        });
    
        return createdPlanning;

    }
    
}

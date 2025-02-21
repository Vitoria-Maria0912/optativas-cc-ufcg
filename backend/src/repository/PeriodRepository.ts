import { PrismaClient } from "@prisma/client";
import { Discipline } from "../model/Discipline";
import { Planning } from "../model/Planning";
import { Period } from "../model/Period";

export interface PeriodRepositoryInterface {
    createPeriod(period: Period): Promise<Period>;
}

export class PeriodRepository implements PeriodRepositoryInterface {
    private prisma: PrismaClient = new PrismaClient();

    async createPeriod(period: any): Promise<Period> {
        // const createdPeriod = await this.prisma.period.create({
        //     data: {
        //         name: period.name,
        //         disciplines: period.disciplines,
        //     }
        // })

        const createdPeriod = await this.prisma.period.create({
            data: {
                name: period.name,
                // Verifica se há disciplinas para associar ao período
                disciplines: period.disciplines.length > 0
                    ? { connect: period.disciplines.map((id: number) => ({ id })) }
                    : undefined, // Se não houver disciplinas, não define nada
            }
        });
        
        return new Period(createdPeriod.id, createdPeriod.name, undefined, []);
    }
}

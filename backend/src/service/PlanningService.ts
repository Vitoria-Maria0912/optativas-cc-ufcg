import { PlanningDTO } from "../dtos/PlanningDTO";
import { PeriodDTO } from "../dtos/PeriodDTO";
import { Planning, PlanningInterface } from "../model/Planning";
import { Period, PeriodInterface } from "../model/Period";
import { PlanningRepository, PlanningRepositoryInterface } from "../repository/PlanningRespository";
import { PeriodRepository, PeriodRepositoryInterface } from "../repository/PeriodRepository";

export interface PlanningServiceInterface {
    createPlanning(planningData: any): Promise<PlanningDTO>;
    updatePlanning(planningData: any): Promise<PlanningDTO>;
    getPlanning(): Promise<PlanningDTO[]>
}

export class PlanningService implements PlanningServiceInterface {
    private planningRepository: PlanningRepositoryInterface = new PlanningRepository();
    private periodRepository: PeriodRepositoryInterface = new PeriodRepository();
    
    async createPlanning(planningData: any): Promise<PlanningDTO> {
        const createdPlanning = await this.planningRepository.createPlanning(planningData);
        
        const periodIds = await Promise.all(
            planningData.periods.map(async (period: any) => {
                const createPeriod = await this.periodRepository.createPeriod(period);
                return createPeriod.id;
            })
        );

        if (createdPlanning.id === undefined) {
            throw new Error("Planning ID is undefined.");
        }

        const updatedPlanning = await this.planningRepository.addPeriods(createdPlanning.id, periodIds);
        
        const periodsDTO = updatedPlanning.periods.map(period =>
            new PeriodDTO(
                period.id!,
                period.name,
                period.planningId ?? 0,
                period.disciplines || []
            )
        );

        if (updatedPlanning.id === undefined) {
            throw new Error("Planning ID is undefined.");
        }

        return new PlanningDTO(updatedPlanning.id, updatedPlanning.name, periodsDTO);
    }

    async updatePlanning(planningData: any): Promise<PlanningDTO> {
        await planningData.periods.forEach((period: any) => {
            this.periodRepository.updatePeriod(period);
        });
    
        const updatedPlanning = await this.planningRepository.updateName(planningData.id, planningData.name);
    
        if (updatedPlanning.id === undefined) {
            throw new Error("Planning ID is undefined.");
        }
        
        const periodsDTO = updatedPlanning.periods.map(period =>
            new PeriodDTO(
                period.id ?? 0,
                period.name,
                period.planningId ?? 0,
                period.disciplines || []
            )
        );
        
        return new PlanningDTO(updatedPlanning.id, updatedPlanning.name, periodsDTO);
    }
    
    async getPlanning(): Promise<PlanningDTO[]> {
        const plannings = await this.planningRepository.getAll();
    
        return plannings.map(planning => {
            // Garantir que `planning.id` e `planning.periods` são válidos
            const id = planning.id ?? 0; // Caso `id` seja `undefined`, atribui 0
            const periods = planning.periods?.map(period => {
                // Garantir que `period.id` seja válido
                const periodId = period.id ?? 0; // Caso `period.id` seja `undefined`, atribui 0
                return new PeriodDTO(periodId, period.name, period.planningId ?? 0, period.disciplines || []);
            }) ?? []; // Caso `planning.periods` seja `undefined`, atribui um array vazio
    
            return new PlanningDTO(id, planning.name, periods);
        });
    } 
}

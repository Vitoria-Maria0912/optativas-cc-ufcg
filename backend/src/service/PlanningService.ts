import { PlanningDTO } from "../dtos/PlanningDTO";
import { PeriodDTO } from "../dtos/PeriodDTO";
import { Planning, PlanningInterface } from "../model/Planning";
import { Period, PeriodInterface } from "../model/Period";
import { PlanningRepository, PlanningRepositoryInterface } from "../repository/PlanningRespository";
import { PeriodRepository, PeriodRepositoryInterface } from "../repository/PeriodRepository";

// Definindo a interface do serviço de planejamento
export interface PlanningServiceInterface {
    createPlanning(planningData: any): Promise<PlanningDTO>;
}

// Implementando o serviço de planejamento
export class PlanningService implements PlanningServiceInterface {
    private planningRepository: PlanningRepositoryInterface = new PlanningRepository();
    private periodRepository: PeriodRepositoryInterface = new PeriodRepository();
    
    // Implementação do método de criação de planejamento
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

        // Adiciona os períodos ao planejamento
        const updatedPlanning = await this.planningRepository.addPeriods(createdPlanning.id, periodIds);

        // Converte os períodos para PeriodDTO
        const periodsDTO = updatedPlanning.periods.map(period =>
            new PeriodDTO(
                period.id!, // Afirmando que o id será um número
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
}

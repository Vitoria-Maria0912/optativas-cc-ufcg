import { PlanningDTO } from "../dtos/PlanningDTO";
import { PeriodDTO } from "../dtos/PeriodDTO";
import { Planning, PlanningInterface } from "../model/Planning";
import { Period, PeriodInterface } from "../model/Period";
import { PlanningRepository, PlanningRepositoryInterface } from "../repository/PlanningRespository";
import { PeriodRepository, PeriodRepositoryInterface } from "../repository/PeriodRepository";

class HttpError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export interface PlanningServiceInterface {
    createPlanning(planningData: any): Promise<PlanningDTO>;
    updatePlanning(planningData: any): Promise<PlanningDTO>;
    getPlanning(): Promise<PlanningDTO[]>;
    getOnePlanning(id: number): Promise<PlanningDTO>;
}

export class PlanningService implements PlanningServiceInterface {
    private planningRepository: PlanningRepositoryInterface = new PlanningRepository();
    private periodRepository: PeriodRepositoryInterface = new PeriodRepository();

    async createPlanning(planningData: any): Promise<PlanningDTO> {
        try {
            if (!planningData || typeof planningData !== "object") {
                throw new HttpError("Dados de planejamento inválidos.", 400);
            }
            if (!planningData.name || typeof planningData.name !== "string") {
                throw new HttpError("O campo 'name' é obrigatório e deve ser uma string.", 400);
            }
            if (!Array.isArray(planningData.periods)) {
                throw new HttpError("O campo 'periods' deve ser uma lista.", 400);
            }

            const existingPlanning = await this.planningRepository.getOneByName(planningData.name);
            if (existingPlanning) {
                throw new HttpError("Planning with the given 'name' already exists", 409);
            }
            
            for (const period of planningData.periods) {
                if (!period.name || typeof period.name !== "string") {
                    throw new HttpError("Cada período deve ter um 'name' do tipo string.", 400);
                }
                if (!Array.isArray(period.disciplines)) {
                    throw new HttpError("O campo 'disciplines' em cada período deve ser uma lista.", 400);
                }
            }
    
            const createdPlanning = await this.planningRepository.createPlanning(planningData);
            if (!createdPlanning || !createdPlanning.id) {
                throw new HttpError("Erro ao criar o planejamento.", 500);
            }
    
            const periodIds = await Promise.all(
                planningData.periods.map(async (period: any) => {
                    try {
                        const createPeriod = await this.periodRepository.createPeriod(period);
                        if (!createPeriod || !createPeriod.id) {
                            throw new HttpError(`Erro ao criar o período: ${period.name}`, 500);
                        }
                        return createPeriod.id;
                    } catch (error: any) {
                        throw new HttpError(`Erro ao criar o período '${period.name}': ${error.message}`, 500);
                    }
                })
            );
    
            const updatedPlanning = await this.planningRepository.addPeriods(createdPlanning.id, periodIds);
            if (!updatedPlanning || !updatedPlanning.id) {
                throw new HttpError("Erro ao atualizar o planejamento com períodos.", 500);
            }
    
            const periodsDTO = updatedPlanning.periods.map(period =>
                new PeriodDTO(
                    period.id!,
                    period.name,
                    period.planningId ?? 0,
                    period.disciplines || []
                )
            );
    
            return new PlanningDTO(updatedPlanning.id, updatedPlanning.name, periodsDTO);
        } catch (error) {
            console.error("Erro na criação do planejamento:", error);
    
            if (error instanceof HttpError) {
                throw error;
            }
    
            throw new HttpError("Erro interno no servidor.", 500);
        }
    }

    async updatePlanning(planningData: any): Promise<PlanningDTO> {
        if (!planningData || typeof planningData !== "object") {
            throw new Error("Invalid request format.");
        }

        if (!planningData.id || typeof planningData.id !== "number") {
            throw new Error("the id need be a number");
        }

        if (!planningData.name || typeof planningData.name !== "string" || planningData.name.length == 0) {
            throw new Error("the name must be string and not empty");
        }
    
        if (!Array.isArray(planningData.periods)) {
            throw new Error("The 'periods' field must be an array.");
        }

        const existingPlanning = await this.planningRepository.getOneById(planningData.id);
        if (!existingPlanning) {
            throw new Error("Planning with the given ID does not exist.");
        }
    
        try {
            await planningData.periods.forEach((period: any) => {
                if (!period.id || typeof period.id !== "number") {
                    throw new Error("Each period must have a valid 'id' field (number).");
                }
    
                if (!period.name || typeof period.name !== "string") {
                    throw new Error("Each period must have a valid 'name' field (string).");
                }
    
                if (!Array.isArray(period.disciplines)) {
                    throw new Error("The 'disciplines' field in each period must be an array.");
                }
    
                this.periodRepository.updatePeriod(period);
            });
        } catch (error: any) {
            throw new Error(`Error updating periods: ${error.message}`);
        }
    
        const updatedPlanning = await this.planningRepository.updateName(planningData.id, planningData.name);
    
        if (updatedPlanning.id === undefined) {
            throw new Error("Planning ID is undefined.");
        }
    
        if (!Array.isArray(updatedPlanning.periods)) {
            throw new Error("The 'periods' field in the updated planning is invalid.");
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
            const id = planning.id ?? 0; 
            const periods = planning.periods?.map(period => {
                const periodId = period.id ?? 0; 
                return new PeriodDTO(periodId, period.name, period.planningId ?? 0, period.disciplines || []);
            }) ?? []; 
    
            return new PlanningDTO(id, planning.name, periods);
        });
    } 
    
    async getOnePlanning(id: number): Promise<PlanningDTO> {
        const planning = await this.planningRepository.getOneById(id);

        const periodsDTO = planning.periods.map(period =>
            new PeriodDTO(
                period.id ?? 0,
                period.name,
                period.planningId ?? 0,
                period.disciplines || []
            )
        );

        if (planning.id === undefined) {
            throw new Error(`Planning with ID ${id} not found.`);
        }

        return new PlanningDTO(planning.id, planning.name, periodsDTO);
    }
}

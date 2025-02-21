import { Request, Response } from 'express';
import { DisciplineService, DisciplineServiceInterface } from '../service/DisciplineService';
import { PlanningService, PlanningServiceInterface } from '../service/PlanningService';

export class PlanningController {

    private planningService: PlanningServiceInterface = new PlanningService();

    async createPlanning(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const planning = request.body;
            const createdPlanning = await this.planningService.createPlanning(planning);
            responseBody = { message: "Planning created!", createdPlanning};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Erro no planning!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async updatePlanning(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const planning = request.body;
            const updatedPlanning = await this.planningService.updatePlanning(planning);
            responseBody = { message: "Planning updated!", updatedPlanning};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Erro no planning!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }
}
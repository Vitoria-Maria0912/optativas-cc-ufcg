import { Request, Response } from 'express';
import { DisciplineService, DisciplineServiceInterface } from '../service/DisciplineService';

export class PlanningController {

    // private disciplineService: DisciplineServiceInterface = new DisciplineService();

    async createPlanning(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const planning = request.body;
            // await this.disciplineService.createDiscipline(discipline);
            responseBody = { message: "Esse é um teste", planning};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Erro no planning!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }
}